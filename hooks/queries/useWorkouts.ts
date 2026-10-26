import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import type { HistorySet } from "../../lib/workout/compare";

export interface WorkoutPlan {
  id: string;
  trainer_id: string | null;
  student_id: string | null;
  name: string;
  description: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
  workouts?: Workout[];
}

export interface Workout {
  id: string;
  plan_id: string;
  name: string;
  day_of_week: number[] | null;
  sort_order: number;
  estimated_duration_minutes: number | null;
  notes: string | null;
  exercises?: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  sort_order: number;
  superset_group: number | null;
  target_sets: number;
  target_reps: string;
  target_weight_kg: number | null;
  target_rpe: number | null;
  rest_seconds: number;
  tempo: string | null;
  notes: string | null;
  exercise?: {
    id: string;
    name: string;
    description?: string | null;
    instructions?: string | null;
    video_url: string | null;
    thumbnail_url: string | null;
    muscle_group?: { name: string } | null;
  };
}

export function useWorkoutPlans(studentId?: string) {
  return useQuery({
    queryKey: ["workouts", "plans", { studentId }],
    queryFn: async () => {
      let query = supabase
        .from("workout_plans")
        .select("*, workouts(*, exercises:workout_exercises(*, exercise:exercises(id, name, video_url, thumbnail_url, muscle_group:muscle_groups!primary_muscle_group_id(name))))")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (studentId) {
        query = query.eq("student_id", studentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as WorkoutPlan[];
    },
    enabled: !!studentId,
  });
}

export interface TrainerPlanSummary {
  id: string;
  name: string;
  student_id: string | null;
  created_at: string;
  student: { full_name: string | null } | null;
  workouts: { id: string; name: string; exercises: { count: number }[] }[];
}

/** The trainer's active plans and templates (student_id null), newest first — sources for "duplicar". */
export function useTrainerPlans(trainerId?: string) {
  return useQuery({
    queryKey: ["workouts", "plans", "trainer", { trainerId }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workout_plans")
        .select("id, name, student_id, created_at, student:profiles!student_id(full_name), workouts(id, name, exercises:workout_exercises(count))")
        .eq("trainer_id", trainerId!)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      // Untyped client infers to-one embeds as arrays; PostgREST returns an object for student_id → profiles.
      return data as unknown as TrainerPlanSummary[];
    },
    enabled: !!trainerId,
  });
}

/** Scoped to the owner even when another trainer knows a plan UUID. */
export function useTrainerPlanDetail(planId?: string, trainerId?: string) {
  return useQuery({
    queryKey: ["workouts", "planDetail", { planId, trainerId }],
    queryFn: async () => {
      const { data, error } = await supabase.from("workout_plans")
        .select("*, workouts(*, exercises:workout_exercises(*, exercise:exercises(name)))")
        .eq("id", planId!).eq("trainer_id", trainerId!).single();
      if (error) throw error;
      return data as WorkoutPlan;
    },
    enabled: !!planId && !!trainerId,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

export function useWorkoutDetail(workoutId: string) {
  return useQuery({
    queryKey: ["workouts", "detail", workoutId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workouts")
        .select(
          "*, exercises:workout_exercises(*, exercise:exercises(id, name, description, instructions, video_url, thumbnail_url, muscle_group:muscle_groups!primary_muscle_group_id(name)))",
        )
        .eq("id", workoutId)
        .single();
      if (error) throw error;

      if (data.exercises) {
        data.exercises.sort(
          (a: WorkoutExercise, b: WorkoutExercise) =>
            a.sort_order - b.sort_order,
        );
      }

      return data as Workout;
    },
    enabled: !!workoutId,
  });
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_id: string | null;
  started_at: string;
  finished_at: string | null;
  duration_seconds: number | null;
  overall_rpe: number | null;
  notes: string | null;
  mood: string | null;
  workout?: { name: string; plan: { name: string } } | null;
}

export interface OpenSession {
  id: string;
  started_at: string;
  sets: {
    id: string;
    workout_exercise_id: string | null;
    exercise_id: string;
    set_number: number;
    reps: number | null;
    weight_kg: number | null;
    is_warmup: boolean | null;
  }[];
}

/**
 * Most recent unfinished session of this workout started in the last 24h — lets the
 * student resume after reinstalling, switching device or clearing local storage.
 */
export function useOpenSession(workoutId?: string, userId?: string) {
  return useQuery({
    queryKey: ["workouts", "openSession", { workoutId, userId }],
    queryFn: async () => {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("workout_sessions")
        .select("id, started_at, sets:workout_session_sets(id, workout_exercise_id, exercise_id, set_number, reps, weight_kg, is_warmup)")
        .eq("user_id", userId!)
        .eq("workout_id", workoutId!)
        .is("finished_at", null)
        .gte("started_at", since)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return (data as OpenSession | null) ?? null;
    },
    enabled: !!workoutId && !!userId,
    staleTime: 0,
  });
}

export function useWorkoutSessions(userId?: string) {
  return useQuery({
    queryKey: ["workouts", "sessions", { userId }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workout_sessions")
        .select("*, workout:workouts(name, plan:workout_plans(name))")
        .eq("user_id", userId!)
        .order("started_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as WorkoutSession[];
    },
    enabled: !!userId,
  });
}

interface SessionSetRow {
  exercise_id: string;
  set_number: number;
  reps: number | null;
  weight_kg: number | string | null;
  is_warmup: boolean | null;
  exercise: { name: string } | null;
}

export interface SessionDetail {
  session: WorkoutSession;
  sets: HistorySet[];
  /** Previous finished session of the same workout, used as the comparison baseline. */
  previous: { id: string; started_at: string; sets: HistorySet[] } | null;
}

function toHistorySets(rows: SessionSetRow[] | null): HistorySet[] {
  return (rows ?? []).map((r) => ({
    exerciseId: r.exercise_id,
    exerciseName: r.exercise?.name ?? "Exercício",
    setNumber: r.set_number,
    reps: r.reps,
    weightKg: r.weight_kg === null ? null : Number(r.weight_kg),
    isWarmup: !!r.is_warmup,
  }));
}

const SET_COLUMNS = "exercise_id, set_number, reps, weight_kg, is_warmup, exercise:exercises(name)";

export function useSessionDetail(sessionId?: string) {
  return useQuery({
    queryKey: ["workouts", "sessionDetail", sessionId],
    queryFn: async (): Promise<SessionDetail> => {
      const { data, error } = await supabase
        .from("workout_sessions")
        .select(`*, workout:workouts(name, plan:workout_plans(name)), sets:workout_session_sets(${SET_COLUMNS})`)
        .eq("id", sessionId!)
        .single();
      if (error) throw error;
      const { sets, ...session } = data as WorkoutSession & { sets: SessionSetRow[] };

      let previous: SessionDetail["previous"] = null;
      if (session.workout_id) {
        const { data: prev, error: prevError } = await supabase
          .from("workout_sessions")
          .select(`id, started_at, sets:workout_session_sets(${SET_COLUMNS})`)
          .eq("user_id", session.user_id)
          .eq("workout_id", session.workout_id)
          .not("finished_at", "is", null)
          .lt("started_at", session.started_at)
          .order("started_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (prevError) throw prevError;
        if (prev) {
          // exercise is many-to-one (an object at runtime); the generated select type models it as an array.
          const p = prev as unknown as { id: string; started_at: string; sets: SessionSetRow[] };
          previous = { id: p.id, started_at: p.started_at, sets: toHistorySets(p.sets) };
        }
      }
      return { session, sets: toHistorySets(sets), previous };
    },
    enabled: !!sessionId,
  });
}
