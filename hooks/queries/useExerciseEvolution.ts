import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import { translateExerciseName } from "../../lib/utils/exerciseTranslations";
import { exerciseEvolution, trainedExercises, type EvolutionSetRow } from "../../lib/workout/evolution";

/** Most recent logged sets considered for evolution charts. */
const SET_LIMIT = 2000;

interface SetRow {
  session_id: string;
  exercise_id: string;
  weight_kg: number | null;
  reps: number | null;
  is_warmup: boolean | null;
  exercise: { name: string } | null;
  workout_sessions: { started_at: string };
}

/**
 * Finished-session sets of one user (own data, or a linked student's for a trainer — RLS decides).
 * One cached fetch shared by the exercise list and the per-exercise chart.
 */
function useEvolutionRows(userId?: string) {
  return useQuery({
    queryKey: ["workouts", "evolution", { userId }],
    queryFn: async (): Promise<EvolutionSetRow[]> => {
      const { data, error } = await supabase
        .from("workout_session_sets")
        .select("session_id, exercise_id, weight_kg, reps, is_warmup, exercise:exercises(name), workout_sessions!inner(user_id, started_at, finished_at)")
        .eq("workout_sessions.user_id", userId!)
        .not("workout_sessions.finished_at", "is", null)
        .order("created_at", { ascending: false })
        .limit(SET_LIMIT);
      if (error) throw error;
      // Untyped client infers to-one embeds as arrays; PostgREST returns objects here.
      return ((data ?? []) as unknown as SetRow[]).map((r) => ({
        sessionId: r.session_id,
        startedAt: r.workout_sessions.started_at,
        exerciseId: r.exercise_id,
        exerciseName: translateExerciseName(r.exercise?.name ?? "Exercício"),
        weightKg: r.weight_kg === null ? null : Number(r.weight_kg),
        reps: r.reps,
        isWarmup: !!r.is_warmup,
      }));
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTrainedExercises(userId?: string) {
  const q = useEvolutionRows(userId);
  return { ...q, data: q.data ? trainedExercises(q.data) : undefined };
}

export function useExerciseEvolution(userId?: string, exerciseId?: string) {
  const q = useEvolutionRows(userId);
  const rows = q.data?.filter((r) => r.exerciseId === exerciseId) ?? [];
  return {
    ...q,
    name: rows[0]?.exerciseName ?? null,
    data: q.data ? exerciseEvolution(rows) : undefined,
  };
}
