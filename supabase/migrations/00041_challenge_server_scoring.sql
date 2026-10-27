-- Challenge entries are the score ledger. Daily limits use UTC, consistently
-- across devices. Existing entries retain their recorded points; new entries
-- are scored by this trigger, never by a caller-supplied points value.
REVOKE EXECUTE ON FUNCTION public.increment_challenge_score(UUID, UUID, NUMERIC) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_team_score(UUID, NUMERIC) FROM PUBLIC, anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_challenge_entries_daily_rule
  ON public.challenge_entries(challenge_id, user_id, point_rule_id, created_at);

CREATE OR REPLACE FUNCTION public.score_challenge_entry()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  c public.challenges%ROWTYPE;
  r public.challenge_point_rules%ROWTYPE;
  s public.workout_sessions%ROWTYPE;
  v_day timestamptz := date_trunc('day', clock_timestamp() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC';
  v_count integer;
BEGIN
  IF auth.uid() IS NOT NULL AND NEW.user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Nao autorizado.';
  END IF;
  SELECT * INTO c FROM public.challenges WHERE id = NEW.challenge_id FOR SHARE;
  IF NOT FOUND OR clock_timestamp() < c.starts_at OR clock_timestamp() > c.ends_at THEN
    RAISE EXCEPTION 'Desafio fora do periodo de atividades.';
  END IF;
  -- Serialize this participant's inserts, including concurrent daily-limit
  -- checks. The score update in the same transaction holds the lock to commit.
  PERFORM 1 FROM public.challenge_participants
    WHERE challenge_id = NEW.challenge_id AND user_id = NEW.user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Inscreva-se no desafio primeiro.'; END IF;
  IF c.require_photo_proof AND NULLIF(btrim(NEW.photo_url), '') IS NULL THEN
    RAISE EXCEPTION 'Este desafio exige uma foto.';
  END IF;
  IF NEW.photo_url IS NOT NULL AND split_part(NEW.photo_url, '/', 1) <> NEW.user_id::text THEN
    RAISE EXCEPTION 'Foto deve pertencer ao participante.';
  END IF;
  NEW.created_at := clock_timestamp();
  NEW.verified := FALSE; -- A submitted photo is not an automated pose verification.
  NEW.flagged_reason := NULL;
  NEW.activity_type := 'checkin';

  IF c.scoring_mode = 'custom_points' THEN
    SELECT * INTO r FROM public.challenge_point_rules
      WHERE id = NEW.point_rule_id AND challenge_id = NEW.challenge_id FOR SHARE;
    IF NOT FOUND OR r.points < 0 OR r.points > 100000 OR r.points = 'NaN'::numeric
       OR (r.max_per_day IS NOT NULL AND r.max_per_day < 1) THEN
      RAISE EXCEPTION 'Regra de pontuacao invalida para este desafio.';
    END IF;
    SELECT count(*) INTO v_count FROM public.challenge_entries
      WHERE challenge_id = NEW.challenge_id AND user_id = NEW.user_id
        AND point_rule_id = r.id AND created_at >= v_day AND created_at < v_day + interval '1 day';
    IF r.max_per_day IS NOT NULL AND v_count >= r.max_per_day THEN
      RAISE EXCEPTION 'Limite diario desta atividade atingido (UTC).';
    END IF;
    NEW.points := r.points;
    NEW.activity_type := r.activity_type;
  ELSE
    NEW.point_rule_id := NULL;
    IF c.scoring_mode = 'days_active' THEN
      IF EXISTS (SELECT 1 FROM public.challenge_entries
        WHERE challenge_id = NEW.challenge_id AND user_id = NEW.user_id AND created_at >= v_day AND created_at < v_day + interval '1 day') THEN
        RAISE EXCEPTION 'Check-in de hoje ja registrado (UTC).';
      END IF;
      NEW.points := 1;
    ELSIF c.scoring_mode = 'check_in_count' THEN
      NEW.points := 1;
    ELSIF c.scoring_mode IN ('workouts_completed', 'total_volume', 'active_minutes') THEN
      SELECT * INTO s FROM public.workout_sessions
        WHERE id = NEW.workout_session_id AND user_id = NEW.user_id FOR SHARE;
      IF NOT FOUND OR s.finished_at IS NULL OR s.finished_at < c.starts_at
        OR s.finished_at > c.ends_at OR s.finished_at > clock_timestamp()
        OR s.finished_at < s.started_at THEN
        RAISE EXCEPTION 'Selecione uma sessao sua concluida durante o desafio.';
      END IF;
      IF EXISTS (SELECT 1 FROM public.challenge_entries
        WHERE challenge_id = NEW.challenge_id AND user_id = NEW.user_id AND workout_session_id = s.id) THEN
        RAISE EXCEPTION 'Sessao ja registrada neste desafio.';
      END IF;
      NEW.activity_type := 'workout';
      IF c.scoring_mode = 'workouts_completed' THEN NEW.points := 1;
      ELSIF c.scoring_mode = 'active_minutes' THEN
        NEW.points := round(EXTRACT(EPOCH FROM (s.finished_at - s.started_at)) / 60, 2);
      ELSE
        SELECT COALESCE(sum(weight_kg * reps), 0) INTO NEW.points
          FROM public.workout_session_sets
          WHERE session_id = s.id AND NOT COALESCE(is_warmup, FALSE) AND reps > 0 AND weight_kg > 0;
      END IF;
      IF NEW.points <= 0 OR NEW.points > 100000 OR NEW.points = 'NaN'::numeric THEN
        RAISE EXCEPTION 'A sessao nao possui uma metrica valida (maximo 100000).';
      END IF;
    ELSE RAISE EXCEPTION 'Modo de pontuacao nao suportado.';
    END IF;
  END IF;
  IF c.scoring_mode NOT IN ('workouts_completed', 'total_volume', 'active_minutes') THEN
    NEW.workout_session_id := NULL;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER trg_score_challenge_entry BEFORE INSERT ON public.challenge_entries
  FOR EACH ROW EXECUTE FUNCTION public.score_challenge_entry();

CREATE OR REPLACE FUNCTION public.apply_challenge_entry_score()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.challenge_participants
    SET total_score = COALESCE(total_score, 0) + NEW.points,
        check_in_count = COALESCE(check_in_count, 0) + 1,
        last_check_in_at = NEW.created_at
    WHERE challenge_id = NEW.challenge_id AND user_id = NEW.user_id;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_apply_challenge_entry_score AFTER INSERT ON public.challenge_entries
  FOR EACH ROW EXECUTE FUNCTION public.apply_challenge_entry_score();

-- Team changes move the participant's entire score once. Client updates are
-- limited to team_id: score/count/timestamp and identity are server-owned.
REVOKE UPDATE ON public.challenge_participants FROM authenticated;
GRANT UPDATE (team_id) ON public.challenge_participants TO authenticated;
CREATE POLICY "Choose own challenge team" ON public.challenge_participants
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (
    user_id = auth.uid() AND (team_id IS NULL OR EXISTS (
      SELECT 1 FROM public.challenge_teams t WHERE t.id = team_id AND t.challenge_id = challenge_participants.challenge_id
    ))
  );
REVOKE UPDATE ON public.challenge_teams FROM authenticated;
GRANT UPDATE (name) ON public.challenge_teams TO authenticated;
CREATE OR REPLACE FUNCTION public.guard_new_challenge_team()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.total_score := 0;
  NEW.member_count := 0;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_guard_new_challenge_team BEFORE INSERT ON public.challenge_teams
  FOR EACH ROW EXECUTE FUNCTION public.guard_new_challenge_team();

CREATE OR REPLACE FUNCTION public.sync_challenge_team_score()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Deterministic team locking avoids deadlocks when participants swap teams.
  PERFORM 1 FROM public.challenge_teams
    WHERE id IN (CASE WHEN TG_OP <> 'INSERT' THEN OLD.team_id END,
                 CASE WHEN TG_OP <> 'DELETE' THEN NEW.team_id END)
    ORDER BY id FOR UPDATE;
  IF TG_OP <> 'INSERT' AND OLD.team_id IS NOT NULL THEN
    UPDATE public.challenge_teams SET total_score = COALESCE(total_score, 0) - COALESCE(OLD.total_score, 0),
      member_count = GREATEST(0, COALESCE(member_count, 0) - 1) WHERE id = OLD.team_id;
  END IF;
  IF TG_OP <> 'DELETE' AND NEW.team_id IS NOT NULL THEN
    UPDATE public.challenge_teams SET total_score = COALESCE(total_score, 0) + COALESCE(NEW.total_score, 0),
      member_count = COALESCE(member_count, 0) + 1 WHERE id = NEW.team_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$;
CREATE TRIGGER trg_sync_challenge_team_score AFTER INSERT OR UPDATE OR DELETE ON public.challenge_participants
  FOR EACH ROW EXECUTE FUNCTION public.sync_challenge_team_score();

-- Rejoining restores the ledger, so leaving never lets a user reset daily or
-- session limits. Existing scores are not silently rewritten by this migration.
CREATE OR REPLACE FUNCTION public.restore_challenge_participant_score()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.challenge_participants p SET
    total_score = (SELECT COALESCE(sum(points), 0) FROM public.challenge_entries e WHERE e.challenge_id = NEW.challenge_id AND e.user_id = NEW.user_id),
    check_in_count = (SELECT count(*) FROM public.challenge_entries e WHERE e.challenge_id = NEW.challenge_id AND e.user_id = NEW.user_id),
    last_check_in_at = (SELECT max(created_at) FROM public.challenge_entries e WHERE e.challenge_id = NEW.challenge_id AND e.user_id = NEW.user_id)
    WHERE p.id = NEW.id;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_restore_challenge_participant_score AFTER INSERT ON public.challenge_participants
  FOR EACH ROW EXECUTE FUNCTION public.restore_challenge_participant_score();

DROP POLICY "View challenge point rules" ON public.challenge_point_rules;
CREATE POLICY "View challenge point rules" ON public.challenge_point_rules FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.challenges c WHERE c.id = challenge_id));
DROP POLICY "View challenge teams" ON public.challenge_teams;
CREATE POLICY "View challenge teams" ON public.challenge_teams FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.challenges c WHERE c.id = challenge_id));
