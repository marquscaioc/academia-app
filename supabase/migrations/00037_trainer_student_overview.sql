-- =============================================
-- 00037: trainer_student_overview() — one query for the trainer dashboard
-- Replaces the client-side N+1 (2 sequential queries per student) in useStudentAdherenceList.
-- SECURITY INVOKER: every subquery is filtered by the caller's own RLS, so a trainer only
-- ever sees their own active students (is_trainer_of) and their own subscriptions.
-- Returns raw facts; adherence percentages are derived in the client only when the plan
-- defines training days (lib/trainer/adherence.ts), never from an invented target.
-- =============================================

CREATE OR REPLACE FUNCTION public.trainer_student_overview()
RETURNS TABLE (
  student_id uuid,
  full_name text,
  avatar_url text,
  linked_since timestamptz,
  sessions_7d integer,
  sessions_30d integer,
  last_session_at timestamptz,
  plan_name text,
  plan_ends_at date,
  planned_days_per_week integer,
  pending_checkins integer,
  last_checkin_score numeric,
  subscription_status text,
  subscription_period_end timestamptz
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    ts.student_id,
    p.full_name,
    p.avatar_url,
    ts.started_at AS linked_since,
    (SELECT count(*)::int FROM public.workout_sessions s
      WHERE s.user_id = ts.student_id AND s.finished_at IS NOT NULL
        AND s.started_at >= now() - interval '7 days') AS sessions_7d,
    (SELECT count(*)::int FROM public.workout_sessions s
      WHERE s.user_id = ts.student_id AND s.finished_at IS NOT NULL
        AND s.started_at >= now() - interval '30 days') AS sessions_30d,
    (SELECT max(s.started_at) FROM public.workout_sessions s
      WHERE s.user_id = ts.student_id AND s.finished_at IS NOT NULL) AS last_session_at,
    plan.name AS plan_name,
    plan.ends_at AS plan_ends_at,
    plan.planned_days AS planned_days_per_week,
    (SELECT count(*)::int FROM public.check_ins c
      WHERE c.user_id = ts.student_id AND c.trainer_id = ts.trainer_id AND c.status = 'pending') AS pending_checkins,
    (SELECT c.weighted_score FROM public.check_ins c
      WHERE c.user_id = ts.student_id AND c.trainer_id = ts.trainer_id
        AND c.status IN ('submitted', 'reviewed') AND c.weighted_score IS NOT NULL
      ORDER BY c.submitted_at DESC NULLS LAST LIMIT 1) AS last_checkin_score,
    sub.status AS subscription_status,
    sub.current_period_end AS subscription_period_end
  FROM public.trainer_students ts
  JOIN public.profiles p ON p.id = ts.student_id
  LEFT JOIN LATERAL (
    SELECT wp.name, wp.ends_at,
           -- distinct weekdays scheduled across the plan's workouts; NULL when none are scheduled
           (SELECT NULLIF(count(DISTINCT d), 0)::int
              FROM public.workouts w, unnest(w.day_of_week) AS d
             WHERE w.plan_id = wp.id) AS planned_days
      FROM public.workout_plans wp
     WHERE wp.student_id = ts.student_id AND wp.trainer_id = ts.trainer_id AND wp.is_active
     ORDER BY wp.created_at DESC
     LIMIT 1
  ) plan ON true
  LEFT JOIN LATERAL (
    SELECT su.status, su.current_period_end
      FROM public.subscriptions su
     WHERE su.student_id = ts.student_id AND su.trainer_id = ts.trainer_id
     ORDER BY su.created_at DESC
     LIMIT 1
  ) sub ON true
  WHERE ts.trainer_id = (SELECT auth.uid())
    AND ts.status = 'active';
$$;

REVOKE ALL ON FUNCTION public.trainer_student_overview() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.trainer_student_overview() TO authenticated;
