-- =============================================
-- 00038: atomic workout plan creation and plan copy / templates
-- The builder used to insert plan → workout → each exercise in separate requests: a failure halfway left a
-- partial plan behind, and the student was notified before any exercise existed.
--   create_workout_plan(...)  plan + workouts + exercises in one transaction.
--   copy_workout_plan(...)    duplicates one of the caller's plans to a linked student, or to a template
--                             (student_id IS NULL, already allowed by the workout_plans policy from 00034).
-- SECURITY INVOKER: every insert goes through the caller's RLS (trainer_id = auth.uid(), has_trainer_link).
-- Exercise ids are checked against the caller's visible exercises, because FK checks bypass RLS and would
-- otherwise accept another trainer's private exercise.
-- =============================================

CREATE OR REPLACE FUNCTION public.assert_trainer_caller()
RETURNS void
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'trainer'
  ) THEN
    RAISE EXCEPTION 'only trainers can manage workout plans' USING ERRCODE = '42501';
  END IF;
END;
$$;

-- p_workouts: [{ "name": text, "day_of_week": int[]?, "notes": text?, "estimated_duration_minutes": int?,
--               "exercises": [{ "exercise_id": uuid, "target_sets": int?, "target_reps": text?,
--                               "target_weight_kg": numeric?, "target_rpe": int?, "rest_seconds": int?,
--                               "tempo": text?, "notes": text?, "superset_group": int? }] }]
CREATE OR REPLACE FUNCTION public.create_workout_plan(
  p_student_id uuid,
  p_name text,
  p_description text,
  p_workouts jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_plan uuid;
  v_workout uuid;
  w jsonb;
  e jsonb;
  w_idx int := 0;
  e_idx int;
BEGIN
  PERFORM public.assert_trainer_caller();
  IF coalesce(btrim(p_name), '') = '' THEN
    RAISE EXCEPTION 'plan name is required' USING ERRCODE = '22023';
  END IF;
  IF jsonb_typeof(p_workouts) IS DISTINCT FROM 'array' OR jsonb_array_length(p_workouts) = 0 THEN
    RAISE EXCEPTION 'at least one workout is required' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.workout_plans (trainer_id, student_id, name, description)
  VALUES (auth.uid(), p_student_id, btrim(p_name), nullif(btrim(coalesce(p_description, '')), ''))
  RETURNING id INTO v_plan;

  FOR w IN SELECT value FROM jsonb_array_elements(p_workouts) LOOP
    IF coalesce(btrim(w->>'name'), '') = '' THEN
      RAISE EXCEPTION 'workout name is required' USING ERRCODE = '22023';
    END IF;
    IF jsonb_typeof(w->'exercises') IS DISTINCT FROM 'array' OR jsonb_array_length(w->'exercises') = 0 THEN
      RAISE EXCEPTION 'workout "%" has no exercises', w->>'name' USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.workouts (plan_id, name, day_of_week, sort_order, estimated_duration_minutes, notes)
    VALUES (
      v_plan,
      btrim(w->>'name'),
      CASE WHEN jsonb_typeof(w->'day_of_week') = 'array'
           THEN ARRAY(SELECT DISTINCT d::int FROM jsonb_array_elements_text(w->'day_of_week') d WHERE d::int BETWEEN 0 AND 6 ORDER BY 1)
      END,
      w_idx,
      (w->>'estimated_duration_minutes')::int,
      nullif(btrim(coalesce(w->>'notes', '')), '')
    )
    RETURNING id INTO v_workout;

    e_idx := 0;
    FOR e IN SELECT value FROM jsonb_array_elements(w->'exercises') LOOP
      IF NOT EXISTS (SELECT 1 FROM public.exercises WHERE id = (e->>'exercise_id')::uuid) THEN
        RAISE EXCEPTION 'exercise % not found', e->>'exercise_id' USING ERRCODE = '23503';
      END IF;
      INSERT INTO public.workout_exercises (
        workout_id, exercise_id, sort_order, superset_group, target_sets, target_reps,
        target_weight_kg, target_rpe, rest_seconds, tempo, notes
      ) VALUES (
        v_workout,
        (e->>'exercise_id')::uuid,
        e_idx,
        (e->>'superset_group')::int,
        coalesce((e->>'target_sets')::int, 3),
        coalesce(nullif(btrim(coalesce(e->>'target_reps', '')), ''), '10-12'),
        (e->>'target_weight_kg')::numeric,
        (e->>'target_rpe')::int,
        coalesce((e->>'rest_seconds')::int, 60),
        nullif(btrim(coalesce(e->>'tempo', '')), ''),
        nullif(btrim(coalesce(e->>'notes', '')), '')
      );
      e_idx := e_idx + 1;
    END LOOP;
    w_idx := w_idx + 1;
  END LOOP;

  RETURN v_plan;
END;
$$;

CREATE OR REPLACE FUNCTION public.copy_workout_plan(
  p_source_plan_id uuid,
  p_student_id uuid,
  p_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_src public.workout_plans%ROWTYPE;
  v_plan uuid;
  v_workout uuid;
  w public.workouts%ROWTYPE;
BEGIN
  PERFORM public.assert_trainer_caller();
  -- Only the caller's own plans (the policy's USING would hide others anyway; be explicit).
  SELECT * INTO v_src FROM public.workout_plans WHERE id = p_source_plan_id AND trainer_id = auth.uid();
  IF NOT FOUND THEN
    RAISE EXCEPTION 'plan not found' USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.workout_plans (trainer_id, student_id, name, description)
  VALUES (auth.uid(), p_student_id, coalesce(nullif(btrim(coalesce(p_name, '')), ''), v_src.name), v_src.description)
  RETURNING id INTO v_plan;

  FOR w IN SELECT * FROM public.workouts WHERE plan_id = v_src.id ORDER BY sort_order, created_at LOOP
    INSERT INTO public.workouts (plan_id, name, day_of_week, sort_order, estimated_duration_minutes, notes)
    VALUES (v_plan, w.name, w.day_of_week, w.sort_order, w.estimated_duration_minutes, w.notes)
    RETURNING id INTO v_workout;

    INSERT INTO public.workout_exercises (
      workout_id, exercise_id, sort_order, superset_group, target_sets, target_reps,
      target_weight_kg, target_rpe, rest_seconds, tempo, notes
    )
    SELECT v_workout, we.exercise_id, we.sort_order, we.superset_group, we.target_sets, we.target_reps,
           we.target_weight_kg, we.target_rpe, we.rest_seconds, we.tempo, we.notes
      FROM public.workout_exercises we
     WHERE we.workout_id = w.id
     ORDER BY we.sort_order, we.created_at;
  END LOOP;

  RETURN v_plan;
END;
$$;

REVOKE ALL ON FUNCTION public.assert_trainer_caller() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.create_workout_plan(uuid, text, text, jsonb) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.copy_workout_plan(uuid, uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.assert_trainer_caller() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_workout_plan(uuid, text, text, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.copy_workout_plan(uuid, uuid, text) TO authenticated;
