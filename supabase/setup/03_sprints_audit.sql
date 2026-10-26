-- =============================================================================
-- ACADEMIA APP - PARTE 3/12: Sprints adicionais + auditoria
-- =============================================================================
-- Cole no SQL Editor do Supabase e clique em RUN.
-- Idempotente (use IF NOT EXISTS / ON CONFLICT).
-- =============================================================================



-- ========================================================================
-- 00009_sprint41_training_progress.sql
-- ========================================================================

-- =============================================
-- Sprint 4.1: Treinos & Progresso
-- =============================================

-- Storage policies for exercise-videos bucket
CREATE POLICY "Trainers upload exercise videos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'exercise-videos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Anyone can view exercise videos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'exercise-videos');

-- Function to get personal records for a user
CREATE OR REPLACE FUNCTION public.get_user_prs(p_user_id UUID)
RETURNS TABLE(exercise_id UUID, exercise_name TEXT, max_weight NUMERIC, max_reps INT, achieved_at TIMESTAMPTZ)
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (s.exercise_id)
    s.exercise_id,
    e.name,
    s.weight_kg,
    s.reps,
    ws.started_at
  FROM public.workout_session_sets s
  JOIN public.workout_sessions ws ON ws.id = s.session_id
  JOIN public.exercises e ON e.id = s.exercise_id
  WHERE ws.user_id = p_user_id
    AND s.weight_kg IS NOT NULL
  ORDER BY s.exercise_id, s.weight_kg DESC, s.reps DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Food substitution equivalences
CREATE TABLE IF NOT EXISTS public.food_substitutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_item_id UUID NOT NULL REFERENCES public.meal_items(id) ON DELETE CASCADE,
  substitute_food_name TEXT NOT NULL,
  substitute_quantity NUMERIC(8,2),
  substitute_unit TEXT DEFAULT 'g',
  substitute_calories NUMERIC(6,1),
  substitute_protein_g NUMERIC(6,1),
  substitute_carbs_g NUMERIC(6,1),
  substitute_fat_g NUMERIC(6,1),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_food_subs_original ON public.food_substitutions(original_item_id);

-- Track which substitution a student chose
ALTER TABLE public.meal_logs ADD COLUMN IF NOT EXISTS substitution_id UUID REFERENCES public.food_substitutions(id);

-- RLS for food substitutions
ALTER TABLE public.food_substitutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage substitutions" ON public.food_substitutions FOR ALL
  USING (created_by = auth.uid());

CREATE POLICY "Students view substitutions for their plans" ON public.food_substitutions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.meal_items mi
    JOIN public.meals m ON m.id = mi.meal_id
    JOIN public.diet_plans dp ON dp.id = m.diet_plan_id
    WHERE mi.id = original_item_id AND dp.student_id = auth.uid()
  ));

-- Personalized hydration goal (set by trainer, default 2500ml)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS water_goal_ml INTEGER DEFAULT 2500;



-- ========================================================================
-- 00010_sprint42_checkin_scoring.sql
-- ========================================================================

-- =============================================
-- Sprint 4.2: Check-ins Inteligentes (LiveClin parity)
-- =============================================

-- Add weight to questions for weighted scoring
ALTER TABLE public.questionnaire_questions ADD COLUMN IF NOT EXISTS weight INTEGER DEFAULT 1 CHECK (weight BETWEEN 1 AND 5);

-- Add weighted score to check-ins
ALTER TABLE public.check_ins ADD COLUMN IF NOT EXISTS weighted_score NUMERIC(5,2);

-- Add score per answer
ALTER TABLE public.check_in_answers ADD COLUMN IF NOT EXISTS score NUMERIC(5,2);

-- Add justification for negative answers
ALTER TABLE public.check_in_answers ADD COLUMN IF NOT EXISTS justification TEXT;

-- Brand tagline for trainer portal
ALTER TABLE public.trainer_profiles ADD COLUMN IF NOT EXISTS brand_tagline TEXT;

-- Function to calculate weighted check-in score (0-100)
CREATE OR REPLACE FUNCTION public.calculate_checkin_score(p_check_in_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_weighted_score NUMERIC := 0;
  total_weight NUMERIC := 0;
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT a.answer_number, a.answer_text, q.question_type, q.weight
    FROM public.check_in_answers a
    JOIN public.questionnaire_questions q ON q.id = a.question_id
    WHERE a.check_in_id = p_check_in_id
  LOOP
    IF rec.question_type = 'scale' AND rec.answer_number IS NOT NULL THEN
      -- Scale 1-10: normalize to 0-10
      total_weighted_score := total_weighted_score + (rec.answer_number * rec.weight);
      total_weight := total_weight + (10 * rec.weight);
    ELSIF rec.question_type = 'boolean' THEN
      -- Boolean: sim=10, nao=0
      total_weighted_score := total_weighted_score + (
        CASE WHEN LOWER(rec.answer_text) IN ('sim', 'yes', 'true', 's') THEN 10 ELSE 0 END * rec.weight
      );
      total_weight := total_weight + (10 * rec.weight);
    ELSIF rec.question_type = 'number' AND rec.answer_number IS NOT NULL THEN
      -- Number: cap at 10 for scoring
      total_weighted_score := total_weighted_score + (LEAST(rec.answer_number, 10) * rec.weight);
      total_weight := total_weight + (10 * rec.weight);
    END IF;
    -- text and choice types don't contribute to score
  END LOOP;

  IF total_weight = 0 THEN RETURN NULL; END IF;

  RETURN ROUND((total_weighted_score / total_weight) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-calculate score when check-in is submitted
CREATE OR REPLACE FUNCTION public.auto_score_checkin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'submitted' AND (OLD.status IS NULL OR OLD.status = 'pending') THEN
    NEW.weighted_score := public.calculate_checkin_score(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS checkin_auto_score ON public.check_ins;
CREATE TRIGGER checkin_auto_score
  BEFORE UPDATE ON public.check_ins
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_score_checkin();



-- ========================================================================
-- 00011_sprint43_challenges_advanced.sql
-- ========================================================================

-- =============================================
-- Sprint 4.3: Desafios Competitivos (Gym Rats parity)
-- =============================================

-- Expand scoring modes
ALTER TABLE public.challenges DROP CONSTRAINT IF EXISTS challenges_scoring_mode_check;
ALTER TABLE public.challenges ADD CONSTRAINT challenges_scoring_mode_check
  CHECK (scoring_mode IN ('days_active', 'check_in_count', 'total_volume', 'custom_points', 'workouts_completed', 'active_minutes'));

-- Hustle Points: custom point rules per challenge
CREATE TABLE IF NOT EXISTS public.challenge_point_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('workout', 'cardio', 'photo', 'checkin', 'steps', 'custom')),
  label TEXT NOT NULL,
  points NUMERIC(6,2) NOT NULL DEFAULT 1,
  max_per_day INTEGER,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_challenge_point_rules ON public.challenge_point_rules(challenge_id);

ALTER TABLE public.challenge_point_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View challenge point rules" ON public.challenge_point_rules FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Manage challenge point rules" ON public.challenge_point_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.challenges WHERE id = challenge_id AND created_by = auth.uid())
);

-- Track activity type and point rule on entries
ALTER TABLE public.challenge_entries ADD COLUMN IF NOT EXISTS activity_type TEXT DEFAULT 'checkin';
ALTER TABLE public.challenge_entries ADD COLUMN IF NOT EXISTS point_rule_id UUID REFERENCES public.challenge_point_rules(id);

-- Anti-cheat columns
ALTER TABLE public.challenge_entries ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT TRUE;
ALTER TABLE public.challenge_entries ADD COLUMN IF NOT EXISTS flagged_reason TEXT;

-- Team score function
CREATE OR REPLACE FUNCTION public.increment_team_score(p_team_id UUID, p_points NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE public.challenge_teams
  SET total_score = total_score + p_points
  WHERE id = p_team_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed more daily poses (30 days)
INSERT INTO public.daily_poses (pose_emoji, pose_description, active_date)
SELECT
  (ARRAY['💪','🙌','🤙','✌️','👊','🫡','🤘','👆','🖐️','🤟'])[1 + (n % 10)],
  (ARRAY['Faca uma pose de biceps','Levante as duas maos','Faca sinal de hang loose','Faca sinal de paz','Mostre o punho cerrado','Faca uma continencia','Faca sinal de rock','Aponte para cima','Mao aberta bem alto','Sinal de eu te amo'])[1 + (n % 10)],
  CURRENT_DATE + n
FROM generate_series(7, 30) AS n
ON CONFLICT (active_date) DO NOTHING;



-- ========================================================================
-- 00012_sprint44_community.sql
-- ========================================================================

-- =============================================
-- Sprint 4.4: Comunidade & Engajamento
-- =============================================

-- Streaks
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_workout_date DATE;

-- Function to update streak after workout session finishes
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  prev_date DATE;
  streak INT;
BEGIN
  IF NEW.finished_at IS NOT NULL AND (OLD.finished_at IS NULL) THEN
    SELECT last_workout_date, current_streak INTO prev_date, streak
    FROM public.profiles WHERE id = NEW.user_id;

    IF prev_date = CURRENT_DATE THEN
      -- Already trained today, no change
      NULL;
    ELSIF prev_date = CURRENT_DATE - 1 THEN
      -- Consecutive day
      streak := COALESCE(streak, 0) + 1;
      UPDATE public.profiles
      SET current_streak = streak,
          longest_streak = GREATEST(COALESCE(longest_streak, 0), streak),
          last_workout_date = CURRENT_DATE
      WHERE id = NEW.user_id;
    ELSE
      -- Streak broken, restart at 1
      UPDATE public.profiles
      SET current_streak = 1,
          last_workout_date = CURRENT_DATE,
          longest_streak = GREATEST(COALESCE(longest_streak, 0), 1)
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS workout_streak_update ON public.workout_sessions;
CREATE TRIGGER workout_streak_update
  AFTER UPDATE ON public.workout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_streak();

-- Social notification preference
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notify_follower_workouts BOOLEAN DEFAULT FALSE;



-- ========================================================================
-- 00013_sprint45_integrations.sql
-- ========================================================================

-- =============================================
-- Sprint 4.5: Integracoes & Polish
-- =============================================

-- Recipes
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  image_url TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER DEFAULT 1,
  calories_per_serving NUMERIC(6,1),
  protein_per_serving NUMERIC(6,1),
  carbs_per_serving NUMERIC(6,1),
  fat_per_serving NUMERIC(6,1),
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipes_tags ON public.recipes USING GIN(tags);

CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC(8,2),
  unit TEXT DEFAULT 'g',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.recipe_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View public recipes" ON public.recipes FOR SELECT TO authenticated USING (is_public = TRUE OR created_by = auth.uid());
CREATE POLICY "Create recipes" ON public.recipes FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Manage own recipes" ON public.recipes FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Delete own recipes" ON public.recipes FOR DELETE USING (created_by = auth.uid());
CREATE POLICY "View recipe ingredients" ON public.recipe_ingredients FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Manage recipe ingredients" ON public.recipe_ingredients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.recipes WHERE id = recipe_id AND created_by = auth.uid())
);
CREATE POLICY "Manage own favorites" ON public.recipe_favorites FOR ALL USING (user_id = auth.uid());

-- Student notes (trainer prontuario)
CREATE TABLE IF NOT EXISTS public.student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'injury', 'goal', 'observation')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_notes ON public.student_notes(student_id, created_at DESC);

ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trainers manage own notes" ON public.student_notes FOR ALL USING (trainer_id = auth.uid());
CREATE POLICY "Students view own notes" ON public.student_notes FOR SELECT USING (student_id = auth.uid());

-- WhatsApp
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN DEFAULT FALSE;

-- Health sync
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS health_sync_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE public.workout_sessions ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';



-- ========================================================================
-- 00014_audit_fixes_indexes.sql
-- ========================================================================

-- =============================================
-- AUDIT FIXES: Missing indexes + constraints
-- =============================================

-- Indexes on is_active columns (frequently filtered in RLS)
CREATE INDEX IF NOT EXISTS idx_workout_plans_active ON public.workout_plans(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_diet_plans_active ON public.diet_plans(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_exercises_active ON public.exercises(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON public.subscription_plans(is_active) WHERE is_active = TRUE;

-- Chat: conversations.last_message_at (ordered queries)
CREATE INDEX IF NOT EXISTS idx_conversations_last_msg_at ON public.conversations(last_message_at DESC NULLS LAST);

-- Feed: author + visibility combined (home feed queries)
CREATE INDEX IF NOT EXISTS idx_feed_posts_public_created ON public.feed_posts(created_at DESC) WHERE visibility = 'public';

-- Achievement tracking
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);

-- Check-ins by status for trainer dashboard
CREATE INDEX IF NOT EXISTS idx_check_ins_trainer_status ON public.check_ins(trainer_id, status, created_at DESC);

-- Payment records pending (for MRR calculations)
CREATE INDEX IF NOT EXISTS idx_payments_pending ON public.payment_records(trainer_id, status) WHERE status = 'pending';

-- Diet macro sanity constraints
DO $$ BEGIN
  -- Only add if not exists
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diet_plans_target_cal_positive') THEN
    ALTER TABLE public.diet_plans ADD CONSTRAINT diet_plans_target_cal_positive CHECK (target_calories IS NULL OR target_calories > 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diet_plans_target_prot_positive') THEN
    ALTER TABLE public.diet_plans ADD CONSTRAINT diet_plans_target_prot_positive CHECK (target_protein_g IS NULL OR target_protein_g >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diet_plans_target_carb_positive') THEN
    ALTER TABLE public.diet_plans ADD CONSTRAINT diet_plans_target_carb_positive CHECK (target_carbs_g IS NULL OR target_carbs_g >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diet_plans_target_fat_positive') THEN
    ALTER TABLE public.diet_plans ADD CONSTRAINT diet_plans_target_fat_positive CHECK (target_fat_g IS NULL OR target_fat_g >= 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'meal_items_cal_nonnegative') THEN
    ALTER TABLE public.meal_items ADD CONSTRAINT meal_items_cal_nonnegative CHECK (calories IS NULL OR calories >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'body_measurements_weight_positive') THEN
    ALTER TABLE public.body_measurements ADD CONSTRAINT body_measurements_weight_positive CHECK (weight_kg IS NULL OR (weight_kg > 0 AND weight_kg < 500));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'body_measurements_bf_range') THEN
    ALTER TABLE public.body_measurements ADD CONSTRAINT body_measurements_bf_range CHECK (body_fat_pct IS NULL OR (body_fat_pct >= 0 AND body_fat_pct <= 100));
  END IF;
END $$;

-- Set updated_at automatically on subscription_plans (missing)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscription_plans_updated_at ON public.subscription_plans;
CREATE TRIGGER subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

