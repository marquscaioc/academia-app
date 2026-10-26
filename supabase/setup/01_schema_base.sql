-- =============================================================================
-- ACADEMIA APP - PARTE 1/12: Schema base + RLS Fase 1+2
-- =============================================================================
-- Cole no SQL Editor do Supabase e clique em RUN.
-- Idempotente (use IF NOT EXISTS / ON CONFLICT).
-- =============================================================================



-- ========================================================================
-- 00001_initial_schema.sql
-- ========================================================================

-- =============================================
-- ACADEMIA APP - Migration Inicial
-- Fase 1: Auth, Treinos, Progresso, Check-ins
-- =============================================

-- =============================================
-- 1. PROFILES (extends auth.users)
-- =============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'trainer', 'nutritionist', 'admin')),
  full_name TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_say')),
  push_token TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    'student'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- 2. TRAINER PROFILES
-- =============================================

CREATE TABLE public.trainer_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  cref TEXT,
  specializations TEXT[],
  brand_name TEXT,
  brand_logo_url TEXT,
  brand_primary_color TEXT DEFAULT '#6366F1',
  brand_secondary_color TEXT DEFAULT '#EC4899',
  max_students INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. TRAINER-STUDENT RELATIONSHIP
-- =============================================

CREATE TABLE public.trainer_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'paused', 'cancelled')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE(trainer_id, student_id)
);

CREATE INDEX idx_trainer_students_trainer ON public.trainer_students(trainer_id) WHERE status = 'active';
CREATE INDEX idx_trainer_students_student ON public.trainer_students(student_id) WHERE status = 'active';

-- =============================================
-- 4. EXERCISE LIBRARY
-- =============================================

CREATE TABLE public.muscle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_url TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_url TEXT
);

CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  primary_muscle_group_id UUID REFERENCES public.muscle_groups(id),
  equipment_id UUID REFERENCES public.equipment(id),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  exercise_type TEXT CHECK (exercise_type IN ('strength', 'cardio', 'flexibility', 'calisthenics')),
  is_global BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_exercises_muscle_group ON public.exercises(primary_muscle_group_id);
CREATE INDEX idx_exercises_created_by ON public.exercises(created_by);

CREATE TABLE public.exercise_muscle_groups (
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE,
  muscle_group_id UUID REFERENCES public.muscle_groups(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (exercise_id, muscle_group_id)
);

-- =============================================
-- 5. WORKOUT PLANS & EXECUTION
-- =============================================

CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at DATE,
  ends_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER workout_plans_updated_at
  BEFORE UPDATE ON public.workout_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_workout_plans_student ON public.workout_plans(student_id) WHERE is_active = TRUE;

CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  day_of_week INTEGER[],
  sort_order INTEGER DEFAULT 0,
  estimated_duration_minutes INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id),
  sort_order INTEGER DEFAULT 0,
  superset_group INTEGER,
  target_sets INTEGER DEFAULT 3,
  target_reps TEXT DEFAULT '10-12',
  target_weight_kg NUMERIC(6,2),
  target_rpe INTEGER CHECK (target_rpe BETWEEN 1 AND 10),
  rest_seconds INTEGER DEFAULT 60,
  tempo TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  overall_rpe INTEGER CHECK (overall_rpe BETWEEN 1 AND 10),
  notes TEXT,
  mood TEXT CHECK (mood IN ('great', 'good', 'ok', 'bad', 'terrible')),
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workout_sessions_user ON public.workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_date ON public.workout_sessions(user_id, started_at DESC);

CREATE TABLE public.workout_session_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  workout_exercise_id UUID REFERENCES public.workout_exercises(id) ON DELETE SET NULL,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id),
  set_number INTEGER NOT NULL,
  reps INTEGER,
  weight_kg NUMERIC(6,2),
  duration_seconds INTEGER,
  distance_meters NUMERIC(10,2),
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  is_warmup BOOLEAN DEFAULT FALSE,
  is_drop_set BOOLEAN DEFAULT FALSE,
  is_failure BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_session_sets_session ON public.workout_session_sets(session_id);

-- =============================================
-- 6. PROGRESS TRACKING
-- =============================================

CREATE TABLE public.body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  measured_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(5,2),
  body_fat_pct NUMERIC(4,1),
  chest_cm NUMERIC(5,1),
  waist_cm NUMERIC(5,1),
  hips_cm NUMERIC(5,1),
  bicep_left_cm NUMERIC(5,1),
  bicep_right_cm NUMERIC(5,1),
  thigh_left_cm NUMERIC(5,1),
  thigh_right_cm NUMERIC(5,1),
  calf_left_cm NUMERIC(5,1),
  calf_right_cm NUMERIC(5,1),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_measurements_user_date ON public.body_measurements(user_id, measured_at DESC);

CREATE TABLE public.progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  pose TEXT CHECK (pose IN ('front', 'back', 'side_left', 'side_right', 'custom')),
  taken_at DATE NOT NULL DEFAULT CURRENT_DATE,
  is_private BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_user_date ON public.progress_photos(user_id, taken_at DESC);

-- =============================================
-- 7. QUESTIONNAIRES & CHECK-INS
-- =============================================

CREATE TABLE public.questionnaire_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'custom')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.questionnaire_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.questionnaire_templates(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('text', 'number', 'scale', 'choice', 'multiple_choice', 'photo', 'boolean')),
  options JSONB,
  is_required BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  metadata JSONB
);

CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.questionnaire_templates(id),
  trainer_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'reviewed')),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  trainer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_check_ins_user ON public.check_ins(user_id, created_at DESC);

CREATE TABLE public.check_in_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_in_id UUID NOT NULL REFERENCES public.check_ins(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.questionnaire_questions(id),
  answer_text TEXT,
  answer_number NUMERIC(10,2),
  answer_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 8. NOTIFICATIONS
-- =============================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  is_pushed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id) WHERE is_read = FALSE;



-- ========================================================================
-- 00002_rls_policies.sql
-- ========================================================================

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muscle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_muscle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_session_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_in_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =============================================
-- HELPER FUNCTION: Check if user is trainer of student
-- =============================================

CREATE OR REPLACE FUNCTION public.is_trainer_of(student UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.trainer_students
    WHERE trainer_id = auth.uid()
      AND student_id = student
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =============================================
-- PROFILES
-- =============================================

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Trainers can view their students profiles"
  ON public.profiles FOR SELECT
  USING (public.is_trainer_of(id));

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

-- =============================================
-- TRAINER PROFILES
-- =============================================

CREATE POLICY "Trainer can manage own trainer profile"
  ON public.trainer_profiles FOR ALL
  USING (id = auth.uid());

CREATE POLICY "Students can view their trainer profile"
  ON public.trainer_profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.trainer_students
    WHERE trainer_id = public.trainer_profiles.id
      AND student_id = auth.uid()
      AND status = 'active'
  ));

-- =============================================
-- TRAINER-STUDENTS
-- =============================================

CREATE POLICY "Trainers can manage their relationships"
  ON public.trainer_students FOR ALL
  USING (trainer_id = auth.uid());

CREATE POLICY "Students can view their relationships"
  ON public.trainer_students FOR SELECT
  USING (student_id = auth.uid());

-- =============================================
-- EXERCISE LIBRARY (lookups are public to authenticated)
-- =============================================

CREATE POLICY "Authenticated users can view muscle groups"
  ON public.muscle_groups FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Authenticated users can view equipment"
  ON public.equipment FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Users can view global exercises and own exercises"
  ON public.exercises FOR SELECT
  TO authenticated
  USING (is_global = TRUE OR created_by = auth.uid());

CREATE POLICY "Trainers can view exercises shared with their students"
  ON public.exercises FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.trainer_students ts
    WHERE ts.student_id = auth.uid()
      AND ts.trainer_id = public.exercises.created_by
      AND ts.status = 'active'
  ));

CREATE POLICY "Trainers can create exercises"
  ON public.exercises FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Trainers can update own exercises"
  ON public.exercises FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Trainers can delete own exercises"
  ON public.exercises FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "View exercise muscle groups"
  ON public.exercise_muscle_groups FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Manage exercise muscle groups"
  ON public.exercise_muscle_groups FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.exercises WHERE id = exercise_id AND created_by = auth.uid()
  ));

-- =============================================
-- WORKOUT PLANS
-- =============================================

CREATE POLICY "Students can view own workout plans"
  ON public.workout_plans FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Trainers can manage plans for their students"
  ON public.workout_plans FOR ALL
  USING (trainer_id = auth.uid());

-- WORKOUTS
CREATE POLICY "Students can view own workouts"
  ON public.workouts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.workout_plans WHERE id = plan_id AND student_id = auth.uid()
  ));

CREATE POLICY "Trainers can manage workouts"
  ON public.workouts FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.workout_plans WHERE id = plan_id AND trainer_id = auth.uid()
  ));

-- WORKOUT EXERCISES
CREATE POLICY "Students can view own workout exercises"
  ON public.workout_exercises FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.workouts w
    JOIN public.workout_plans wp ON wp.id = w.plan_id
    WHERE w.id = workout_id AND wp.student_id = auth.uid()
  ));

CREATE POLICY "Trainers can manage workout exercises"
  ON public.workout_exercises FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.workouts w
    JOIN public.workout_plans wp ON wp.id = w.plan_id
    WHERE w.id = workout_id AND wp.trainer_id = auth.uid()
  ));

-- =============================================
-- WORKOUT SESSIONS
-- =============================================

CREATE POLICY "Users can manage own sessions"
  ON public.workout_sessions FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Trainers can view student sessions"
  ON public.workout_sessions FOR SELECT
  USING (public.is_trainer_of(user_id));

-- SESSION SETS
CREATE POLICY "Users can manage own session sets"
  ON public.workout_session_sets FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.workout_sessions WHERE id = session_id AND user_id = auth.uid()
  ));

CREATE POLICY "Trainers can view student session sets"
  ON public.workout_session_sets FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.workout_sessions ws
    WHERE ws.id = session_id AND public.is_trainer_of(ws.user_id)
  ));

-- =============================================
-- PROGRESS
-- =============================================

CREATE POLICY "Users can manage own measurements"
  ON public.body_measurements FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Trainers can view student measurements"
  ON public.body_measurements FOR SELECT
  USING (public.is_trainer_of(user_id));

CREATE POLICY "Users can manage own photos"
  ON public.progress_photos FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Trainers can view student photos"
  ON public.progress_photos FOR SELECT
  USING (public.is_trainer_of(user_id));

-- =============================================
-- QUESTIONNAIRES & CHECK-INS
-- =============================================

CREATE POLICY "Trainers can manage own templates"
  ON public.questionnaire_templates FOR ALL
  USING (created_by = auth.uid());

CREATE POLICY "Students can view templates sent to them"
  ON public.questionnaire_templates FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.check_ins WHERE template_id = public.questionnaire_templates.id AND user_id = auth.uid()
  ));

CREATE POLICY "View questions of accessible templates"
  ON public.questionnaire_questions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.questionnaire_templates qt
    WHERE qt.id = template_id
      AND (qt.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.check_ins WHERE template_id = qt.id AND user_id = auth.uid()
      ))
  ));

CREATE POLICY "Trainers can manage questions"
  ON public.questionnaire_questions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.questionnaire_templates WHERE id = template_id AND created_by = auth.uid()
  ));

CREATE POLICY "Users can view own check-ins"
  ON public.check_ins FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Trainers can manage check-ins for their students"
  ON public.check_ins FOR ALL
  USING (trainer_id = auth.uid());

CREATE POLICY "Users can submit check-in answers"
  ON public.check_in_answers FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.check_ins WHERE id = check_in_id AND user_id = auth.uid()
  ));

CREATE POLICY "Trainers can view check-in answers"
  ON public.check_in_answers FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.check_ins WHERE id = check_in_id AND trainer_id = auth.uid()
  ));

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid());



-- ========================================================================
-- 00003_phase2_diet_challenges_social.sql
-- ========================================================================

-- =============================================
-- FASE 2: Dieta, Desafios, Social, Achievements
-- =============================================

-- =============================================
-- 1. DIET / NUTRITION
-- =============================================

CREATE TABLE public.diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_calories INTEGER,
  target_protein_g NUMERIC(6,1),
  target_carbs_g NUMERIC(6,1),
  target_fat_g NUMERIC(6,1),
  target_fiber_g NUMERIC(6,1),
  is_active BOOLEAN DEFAULT TRUE,
  starts_at DATE,
  ends_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER diet_plans_updated_at
  BEFORE UPDATE ON public.diet_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_diet_plans_student ON public.diet_plans(student_id) WHERE is_active = TRUE;

CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diet_plan_id UUID NOT NULL REFERENCES public.diet_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  target_time TIME,
  notes TEXT
);

CREATE TABLE public.meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  quantity NUMERIC(8,2),
  unit TEXT DEFAULT 'g',
  calories NUMERIC(6,1),
  protein_g NUMERIC(6,1),
  carbs_g NUMERIC(6,1),
  fat_g NUMERIC(6,1),
  notes TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT TRUE,
  notes TEXT
);

CREATE INDEX idx_meal_logs_user_date ON public.meal_logs(user_id, logged_at DESC);

CREATE TABLE public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL DEFAULT 250,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_water_logs_user_date ON public.water_logs(user_id, logged_at DESC);

-- =============================================
-- 2. CHALLENGES & COMPETITIONS
-- =============================================

CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  scoring_mode TEXT NOT NULL DEFAULT 'days_active'
    CHECK (scoring_mode IN ('days_active', 'check_in_count', 'total_volume', 'custom_points')),
  scoring_config JSONB DEFAULT '{}',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  max_participants INTEGER,
  require_photo_proof BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'active', 'ended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_challenges_status ON public.challenges(status, starts_at);

CREATE TABLE public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_score NUMERIC(10,2) DEFAULT 0,
  check_in_count INTEGER DEFAULT 0,
  last_check_in_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX idx_challenge_participants_leaderboard
  ON public.challenge_participants(challenge_id, total_score DESC);

CREATE TABLE public.challenge_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_session_id UUID REFERENCES public.workout_sessions(id),
  photo_url TEXT,
  caption TEXT,
  points NUMERIC(10,2) NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_challenge_entries_challenge ON public.challenge_entries(challenge_id, created_at DESC);
CREATE INDEX idx_challenge_entries_user ON public.challenge_entries(user_id, created_at DESC);

-- =============================================
-- 3. SOCIAL FEED
-- =============================================

CREATE TABLE public.feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_type TEXT NOT NULL DEFAULT 'text'
    CHECK (post_type IN ('text', 'workout_completed', 'progress_photo', 'challenge_entry', 'achievement', 'milestone')),
  content TEXT,
  media_urls TEXT[],
  workout_session_id UUID REFERENCES public.workout_sessions(id),
  challenge_id UUID REFERENCES public.challenges(id),
  visibility TEXT DEFAULT 'public'
    CHECK (visibility IN ('public', 'followers', 'trainers_only', 'private')),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feed_posts_author ON public.feed_posts(author_id, created_at DESC);
CREATE INDEX idx_feed_posts_feed ON public.feed_posts(created_at DESC) WHERE visibility = 'public';

CREATE TABLE public.feed_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL DEFAULT 'like'
    CHECK (reaction_type IN ('like', 'fire', 'strong', 'clap')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- Update likes_count on reaction insert/delete
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feed_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feed_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER feed_reactions_count
  AFTER INSERT OR DELETE ON public.feed_reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_likes_count();

CREATE TABLE public.feed_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.feed_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feed_comments_post ON public.feed_comments(post_id, created_at);

-- Update comments_count on comment insert/delete
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feed_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feed_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER feed_comments_count
  AFTER INSERT OR DELETE ON public.feed_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_comments_count();

-- =============================================
-- 4. FOLLOW SYSTEM
-- =============================================

CREATE TABLE public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON public.user_follows(follower_id);
CREATE INDEX idx_follows_following ON public.user_follows(following_id);

-- Add follower counts to profiles
ALTER TABLE public.profiles
  ADD COLUMN followers_count INTEGER DEFAULT 0,
  ADD COLUMN following_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET following_count = following_count - 1 WHERE id = OLD.follower_id;
    UPDATE public.profiles SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER follow_counts
  AFTER INSERT OR DELETE ON public.user_follows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_follow_counts();

-- =============================================
-- 5. ACHIEVEMENTS / BADGES
-- =============================================

CREATE TABLE public.achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT '🏆',
  criteria_type TEXT NOT NULL
    CHECK (criteria_type IN ('workout_count', 'streak_days', 'challenge_won', 'weight_pr', 'social_posts', 'check_in_streak')),
  criteria_threshold INTEGER NOT NULL DEFAULT 1,
  points INTEGER DEFAULT 10,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements ON public.user_achievements(user_id);

-- =============================================
-- SEED: Achievements
-- =============================================

INSERT INTO public.achievement_definitions (name, description, icon, criteria_type, criteria_threshold, points, sort_order) VALUES
  ('Primeiro Treino', 'Complete seu primeiro treino', '💪', 'workout_count', 1, 10, 1),
  ('Semana Consistente', 'Treine 3x na mesma semana', '📅', 'workout_count', 3, 20, 2),
  ('Dedicação Total', 'Complete 10 treinos', '🔥', 'workout_count', 10, 50, 3),
  ('Máquina de Treinar', 'Complete 50 treinos', '⚡', 'workout_count', 50, 100, 4),
  ('Lenda da Academia', 'Complete 100 treinos', '👑', 'workout_count', 100, 200, 5),
  ('Streak de 7 dias', 'Treine 7 dias seguidos', '🔥', 'streak_days', 7, 50, 6),
  ('Streak de 30 dias', 'Treine 30 dias seguidos', '💎', 'streak_days', 30, 200, 7),
  ('Campeão', 'Vença um desafio', '🏆', 'challenge_won', 1, 100, 8),
  ('Influencer Fitness', 'Publique 10 posts no feed', '📱', 'social_posts', 10, 30, 9),
  ('Check-in Master', 'Complete 10 check-ins seguidos', '✅', 'check_in_streak', 10, 50, 10);



-- ========================================================================
-- 00004_phase2_rls_policies.sql
-- ========================================================================

-- =============================================
-- FASE 2: RLS POLICIES
-- =============================================

-- DIET
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students view own diet plans" ON public.diet_plans FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Trainers manage student diet plans" ON public.diet_plans FOR ALL USING (trainer_id = auth.uid());

CREATE POLICY "View meals of accessible diet plans" ON public.meals FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.diet_plans WHERE id = diet_plan_id AND (student_id = auth.uid() OR trainer_id = auth.uid()))
);
CREATE POLICY "Trainers manage meals" ON public.meals FOR ALL USING (
  EXISTS (SELECT 1 FROM public.diet_plans WHERE id = diet_plan_id AND trainer_id = auth.uid())
);

CREATE POLICY "View meal items" ON public.meal_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.meals m JOIN public.diet_plans dp ON dp.id = m.diet_plan_id
    WHERE m.id = meal_id AND (dp.student_id = auth.uid() OR dp.trainer_id = auth.uid()))
);
CREATE POLICY "Trainers manage meal items" ON public.meal_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.meals m JOIN public.diet_plans dp ON dp.id = m.diet_plan_id
    WHERE m.id = meal_id AND dp.trainer_id = auth.uid())
);

CREATE POLICY "Users manage own meal logs" ON public.meal_logs FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Trainers view student meal logs" ON public.meal_logs FOR SELECT USING (public.is_trainer_of(user_id));

CREATE POLICY "Users manage own water logs" ON public.water_logs FOR ALL USING (user_id = auth.uid());

-- CHALLENGES
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View public challenges" ON public.challenges FOR SELECT TO authenticated USING (
  is_public = TRUE OR created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM public.challenge_participants WHERE challenge_id = id AND user_id = auth.uid()
  )
);
CREATE POLICY "Create challenges" ON public.challenges FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Manage own challenges" ON public.challenges FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Delete own challenges" ON public.challenges FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "View participants" ON public.challenge_participants FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.challenges WHERE id = challenge_id AND (is_public = TRUE OR created_by = auth.uid()))
  OR user_id = auth.uid()
);
CREATE POLICY "Join challenges" ON public.challenge_participants FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Leave challenges" ON public.challenge_participants FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "View entries" ON public.challenge_entries FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.challenge_participants WHERE challenge_id = challenge_entries.challenge_id AND user_id = auth.uid())
  OR EXISTS (SELECT 1 FROM public.challenges WHERE id = challenge_id AND created_by = auth.uid())
);
CREATE POLICY "Create entries" ON public.challenge_entries FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- SOCIAL FEED
ALTER TABLE public.feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View public posts" ON public.feed_posts FOR SELECT TO authenticated USING (
  visibility = 'public'
  OR author_id = auth.uid()
  OR (visibility = 'followers' AND EXISTS (
    SELECT 1 FROM public.user_follows WHERE follower_id = auth.uid() AND following_id = author_id
  ))
  OR (visibility = 'trainers_only' AND public.is_trainer_of(author_id))
);
CREATE POLICY "Create posts" ON public.feed_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Update own posts" ON public.feed_posts FOR UPDATE USING (author_id = auth.uid());
CREATE POLICY "Delete own posts" ON public.feed_posts FOR DELETE USING (author_id = auth.uid());

CREATE POLICY "View reactions" ON public.feed_reactions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Manage own reactions" ON public.feed_reactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Remove own reactions" ON public.feed_reactions FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "View comments" ON public.feed_comments FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Create comments" ON public.feed_comments FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Delete own comments" ON public.feed_comments FOR DELETE USING (author_id = auth.uid());

-- FOLLOWS
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View follows" ON public.user_follows FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Follow users" ON public.user_follows FOR INSERT TO authenticated WITH CHECK (follower_id = auth.uid());
CREATE POLICY "Unfollow users" ON public.user_follows FOR DELETE USING (follower_id = auth.uid());

-- ACHIEVEMENTS
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View achievements" ON public.achievement_definitions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "View user achievements" ON public.user_achievements FOR SELECT TO authenticated USING (TRUE);

