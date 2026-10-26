-- Coordinate session starts with update_workout_plan's parent row lock. Without
-- it a session could start between the editor's active-session check and save.
CREATE OR REPLACE FUNCTION public.lock_session_prescription()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.workout_id IS NOT NULL THEN
    PERFORM p.id FROM public.workout_plans p
      JOIN public.workouts w ON w.plan_id = p.id
      WHERE w.id = NEW.workout_id AND p.student_id = NEW.user_id
      FOR SHARE OF p;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.lock_session_prescription() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER lock_session_prescription
  BEFORE INSERT OR UPDATE OF workout_id ON public.workout_sessions
  FOR EACH ROW EXECUTE FUNCTION public.lock_session_prescription();
