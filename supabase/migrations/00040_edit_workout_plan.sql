-- Atomic prescription editing. Retain IDs for unchanged workouts/exercises and
-- detach removed prescriptions using existing ON DELETE SET NULL history FKs.
-- Optimistic version check prevents two editors silently overwriting each other.
CREATE OR REPLACE FUNCTION public.update_workout_plan(
  p_plan_id uuid, p_expected_updated_at timestamptz,
  p_name text, p_description text, p_workouts jsonb
)
RETURNS uuid
LANGUAGE plpgsql SECURITY INVOKER SET search_path = public
AS $$
DECLARE
  v_plan public.workout_plans%ROWTYPE;
  v_workout uuid;
  v_exercise uuid;
  v_workouts uuid[] := '{}';
  v_exercises uuid[];
  w jsonb;
  e jsonb;
  wi int := 0;
  ei int;
BEGIN
  PERFORM public.assert_trainer_caller();
  SELECT * INTO v_plan FROM public.workout_plans
    WHERE id = p_plan_id AND trainer_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'plan not found or not owned' USING ERRCODE = '42501';
  END IF;
  IF p_expected_updated_at IS NULL OR v_plan.updated_at IS DISTINCT FROM p_expected_updated_at THEN
    RAISE EXCEPTION 'plan changed; reopen it before editing' USING ERRCODE = '40001';
  END IF;
  IF EXISTS (
    SELECT 1 FROM public.workout_sessions s JOIN public.workouts w ON w.id = s.workout_id
    WHERE w.plan_id = p_plan_id AND s.finished_at IS NULL AND s.started_at > now() - interval '24 hours'
  ) THEN
    RAISE EXCEPTION 'student has a workout in progress; finish it before editing' USING ERRCODE = '55000';
  END IF;
  IF coalesce(btrim(p_name), '') = '' OR length(p_name) > 200 THEN
    RAISE EXCEPTION 'plan name is required (max 200 characters)' USING ERRCODE = '22023';
  END IF;
  IF jsonb_typeof(p_workouts) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'workouts must be an array' USING ERRCODE = '22023';
  END IF;
  IF jsonb_array_length(p_workouts) NOT BETWEEN 1 AND 50 THEN
    RAISE EXCEPTION 'provide 1 to 50 workouts' USING ERRCODE = '22023';
  END IF;
  UPDATE public.workout_plans SET name = btrim(p_name), description = nullif(btrim(coalesce(p_description, '')), '')
    WHERE id = p_plan_id;

  FOR w IN SELECT value FROM jsonb_array_elements(p_workouts) LOOP
    IF coalesce(btrim(w->>'name'), '') = '' THEN
      RAISE EXCEPTION 'workout name is required' USING ERRCODE = '22023';
    END IF;
    IF jsonb_typeof(w->'exercises') IS DISTINCT FROM 'array' THEN
      RAISE EXCEPTION 'exercises must be an array' USING ERRCODE = '22023';
    END IF;
    IF jsonb_array_length(w->'exercises') NOT BETWEEN 1 AND 200 THEN
      RAISE EXCEPTION 'provide 1 to 200 exercises per workout' USING ERRCODE = '22023';
    END IF;
    v_workout := (w->>'id')::uuid;
    IF v_workout IS NOT NULL THEN
      IF v_workout = ANY(v_workouts) OR NOT EXISTS (
        SELECT 1 FROM public.workouts WHERE id = v_workout AND plan_id = p_plan_id
      ) THEN
        RAISE EXCEPTION 'invalid or duplicate workout id' USING ERRCODE = '22023';
      END IF;
    ELSE
      INSERT INTO public.workouts (plan_id, name) VALUES (p_plan_id, btrim(w->>'name')) RETURNING id INTO v_workout;
    END IF;
    v_workouts := array_append(v_workouts, v_workout);
    UPDATE public.workouts SET name = btrim(w->>'name'), sort_order = wi,
      day_of_week = CASE WHEN jsonb_typeof(w->'day_of_week') = 'array' THEN
        ARRAY(SELECT DISTINCT d::int FROM jsonb_array_elements_text(w->'day_of_week') d WHERE d::int BETWEEN 0 AND 6 ORDER BY 1) END,
      notes = nullif(btrim(coalesce(w->>'notes', '')), ''),
      estimated_duration_minutes = (w->>'estimated_duration_minutes')::int
      WHERE id = v_workout;

    v_exercises := '{}';
    ei := 0;
    FOR e IN SELECT value FROM jsonb_array_elements(w->'exercises') LOOP
      IF NOT EXISTS (SELECT 1 FROM public.exercises WHERE id = (e->>'exercise_id')::uuid) THEN
        RAISE EXCEPTION 'exercise not visible' USING ERRCODE = '23503';
      END IF;
      IF (e->>'target_sets')::int IS NULL OR (e->>'target_sets')::int NOT BETWEEN 1 AND 20
        OR coalesce(btrim(e->>'target_reps'), '') = ''
        OR (e->>'rest_seconds')::int IS NULL OR (e->>'rest_seconds')::int NOT BETWEEN 0 AND 900
        OR (e->>'target_weight_kg')::numeric NOT BETWEEN 0 AND 1000
        OR (e->>'target_rpe')::int NOT BETWEEN 1 AND 10
        OR (e->>'superset_group')::int < 1 THEN
        RAISE EXCEPTION 'invalid prescription values' USING ERRCODE = '22023';
      END IF;
      v_exercise := (e->>'id')::uuid;
      IF v_exercise IS NOT NULL THEN
        IF v_exercise = ANY(v_exercises) OR NOT EXISTS (
          SELECT 1 FROM public.workout_exercises
          WHERE id = v_exercise AND workout_id = v_workout AND exercise_id = (e->>'exercise_id')::uuid
        ) THEN
          RAISE EXCEPTION 'invalid or duplicate prescription id' USING ERRCODE = '22023';
        END IF;
      ELSE
        INSERT INTO public.workout_exercises (workout_id, exercise_id)
          VALUES (v_workout, (e->>'exercise_id')::uuid) RETURNING id INTO v_exercise;
      END IF;
      v_exercises := array_append(v_exercises, v_exercise);
      UPDATE public.workout_exercises SET sort_order = ei,
        target_sets = (e->>'target_sets')::int, target_reps = btrim(e->>'target_reps'),
        target_weight_kg = (e->>'target_weight_kg')::numeric, target_rpe = (e->>'target_rpe')::int,
        rest_seconds = (e->>'rest_seconds')::int, superset_group = (e->>'superset_group')::int,
        tempo = nullif(btrim(coalesce(e->>'tempo', '')), ''), notes = nullif(btrim(coalesce(e->>'notes', '')), '')
        WHERE id = v_exercise;
      ei := ei + 1;
    END LOOP;
    DELETE FROM public.workout_exercises WHERE workout_id = v_workout AND NOT (id = ANY(v_exercises));
    wi := wi + 1;
  END LOOP;
  DELETE FROM public.workouts WHERE plan_id = p_plan_id AND NOT (id = ANY(v_workouts));
  RETURN p_plan_id;
END;
$$;

REVOKE ALL ON FUNCTION public.update_workout_plan(uuid, timestamptz, text, text, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_workout_plan(uuid, timestamptz, text, text, jsonb) TO authenticated;
