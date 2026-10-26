-- 00035_workout_integrity_indexes.sql
-- Integridade do historico de treinos, RPC de recordes e indices de FK.
-- Idempotente e NAO destrutivo.

-- ============================================================
-- Recordes pessoais por exercicio (criterios explicitos, espelham
-- lib/workout/metrics.ts):
--   * apenas series validas (nao aquecimento), reps >= 1 e carga > 0
--   * apenas sessoes finalizadas do PROPRIO usuario (SECURITY INVOKER + RLS)
--   * 1RM estimado por Epley, so para 1..12 repeticoes
--   * p_exclude_session permite comparar a sessao atual com o historico
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_exercise_bests(
  p_exercise_ids UUID[],
  p_exclude_session UUID DEFAULT NULL
)
RETURNS TABLE (
  exercise_id UUID,
  max_weight_kg NUMERIC,
  best_e1rm_kg NUMERIC,
  best_set_volume NUMERIC
)
LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT
    s.exercise_id,
    MAX(s.weight_kg) AS max_weight_kg,
    MAX(
      CASE
        WHEN s.reps = 1 THEN s.weight_kg
        WHEN s.reps BETWEEN 2 AND 12 THEN ROUND(s.weight_kg * (1 + s.reps / 30.0), 1)
      END
    ) AS best_e1rm_kg,
    MAX(s.weight_kg * s.reps) AS best_set_volume
  FROM public.workout_session_sets s
  JOIN public.workout_sessions ws ON ws.id = s.session_id
  WHERE ws.user_id = auth.uid()
    AND ws.finished_at IS NOT NULL
    AND (p_exclude_session IS NULL OR ws.id <> p_exclude_session)
    AND s.exercise_id = ANY (p_exercise_ids)
    AND COALESCE(s.is_warmup, FALSE) = FALSE
    AND s.reps >= 1
    AND s.weight_kg > 0
  GROUP BY s.exercise_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_exercise_bests(UUID[], UUID) TO authenticated;

-- ============================================================
-- Sessoes finalizadas ficam imutaveis apos 24h (janela para correcoes).
-- Protege o historico usado por treinador, recordes e desafios.
-- service_role (auth.uid() IS NULL) continua livre para manutencao.
-- ============================================================
CREATE OR REPLACE FUNCTION public.lock_finished_session_sets()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_finished TIMESTAMPTZ;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  -- ON DELETE SET NULL de workout_exercises (treinador editando a prescricao)
  -- chega aqui como UPDATE; o historico continua integro (exercise_id e mantido).
  IF TG_OP = 'UPDATE' AND NEW.workout_exercise_id IS NULL
     AND (to_jsonb(NEW) - 'workout_exercise_id') = (to_jsonb(OLD) - 'workout_exercise_id') THEN
    RETURN NEW;
  END IF;
  SELECT finished_at INTO v_finished
    FROM public.workout_sessions
   WHERE id = COALESCE(NEW.session_id, OLD.session_id);
  IF v_finished IS NOT NULL AND v_finished < NOW() - INTERVAL '24 hours' THEN
    RAISE EXCEPTION 'Sessao finalizada ha mais de 24h nao pode ser alterada.';
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS trg_lock_finished_session_sets ON public.workout_session_sets;
CREATE TRIGGER trg_lock_finished_session_sets
  BEFORE INSERT OR UPDATE OR DELETE ON public.workout_session_sets
  FOR EACH ROW EXECUTE FUNCTION public.lock_finished_session_sets();

CREATE OR REPLACE FUNCTION public.lock_finished_sessions()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;
  -- ON DELETE SET NULL de workouts (treinador removendo um treino/plano).
  IF TG_OP = 'UPDATE' AND NEW.workout_id IS NULL
     AND (to_jsonb(NEW) - 'workout_id') = (to_jsonb(OLD) - 'workout_id') THEN
    RETURN NEW;
  END IF;
  IF OLD.finished_at IS NOT NULL AND OLD.finished_at < NOW() - INTERVAL '24 hours' THEN
    RAISE EXCEPTION 'Sessao finalizada ha mais de 24h nao pode ser alterada.';
  END IF;
  -- Um treino finalizado nao pode ser "reaberto" nem ter a data de conclusao reescrita.
  IF TG_OP = 'UPDATE' AND OLD.finished_at IS NOT NULL
     AND NEW.finished_at IS DISTINCT FROM OLD.finished_at THEN
    RAISE EXCEPTION 'Data de conclusao nao pode ser alterada.';
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$;

DROP TRIGGER IF EXISTS trg_lock_finished_sessions ON public.workout_sessions;
CREATE TRIGGER trg_lock_finished_sessions
  BEFORE UPDATE OR DELETE ON public.workout_sessions
  FOR EACH ROW EXECUTE FUNCTION public.lock_finished_sessions();

-- Aluno so registra sessao de treino que lhe foi prescrito (ou avulsa, sem workout).
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.workout_sessions;
CREATE POLICY "Users can manage own sessions" ON public.workout_sessions
  FOR ALL TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND (
      workout_id IS NULL OR EXISTS (
        SELECT 1 FROM public.workouts w
        JOIN public.workout_plans p ON p.id = w.plan_id
        WHERE w.id = workout_id AND p.student_id = (SELECT auth.uid())
      )
    )
  );

-- ============================================================
-- Indices de FK / filtros usados pelo app (ausentes ate aqui).
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_session_sets_exercise       ON public.workout_session_sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_session_sets_wex            ON public.workout_session_sets(workout_exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout   ON public.workout_exercises(workout_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise  ON public.workout_exercises(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workouts_plan               ON public.workouts(plan_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_workout_plans_trainer       ON public.workout_plans(trainer_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_workout    ON public.workout_sessions(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_open       ON public.workout_sessions(user_id, workout_id, started_at DESC) WHERE finished_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_diet_plans_trainer          ON public.diet_plans(trainer_id);
CREATE INDEX IF NOT EXISTS idx_meals_diet_plan             ON public.meals(diet_plan_id);
CREATE INDEX IF NOT EXISTS idx_meal_items_meal             ON public.meal_items(meal_id);
CREATE INDEX IF NOT EXISTS idx_meal_logs_meal              ON public.meal_logs(meal_id);
CREATE INDEX IF NOT EXISTS idx_checkin_answers_checkin     ON public.check_in_answers(check_in_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_template          ON public.check_ins(template_id);
CREATE INDEX IF NOT EXISTS idx_q_questions_template        ON public.questionnaire_questions(template_id);
CREATE INDEX IF NOT EXISTS idx_payments_student            ON public.payment_records(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_subscription       ON public.payment_records(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan          ON public.subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_student_notes_trainer       ON public.student_notes(trainer_id);
CREATE INDEX IF NOT EXISTS idx_feed_posts_session          ON public.feed_posts(workout_session_id);
CREATE INDEX IF NOT EXISTS idx_challenge_entries_session   ON public.challenge_entries(workout_session_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON public.challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_trainer_students_student    ON public.trainer_students(student_id);
