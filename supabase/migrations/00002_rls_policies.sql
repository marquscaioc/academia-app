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
