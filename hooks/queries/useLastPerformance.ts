import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface LastPerformance {
  lastWeight: number | null;
  lastReps: number | null;
  suggestedWeight: number | null;
  targetRepsHit: boolean;
}

export function useLastPerformance(exerciseId?: string, userId?: string) {
  return useQuery({
    queryKey: ["workouts", "lastPerformance", { exerciseId, userId }],
    queryFn: async (): Promise<LastPerformance> => {
      // Get the most recent session that has sets for this exercise
      const { data: sets } = await supabase
        .from("workout_session_sets")
        .select("weight_kg, reps, session_id, workout_sessions!inner(user_id, finished_at)")
        .eq("exercise_id", exerciseId!)
        .eq("workout_sessions.user_id", userId!)
        .not("workout_sessions.finished_at", "is", null)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!sets || sets.length === 0) {
        return { lastWeight: null, lastReps: null, suggestedWeight: null, targetRepsHit: false };
      }

      // Get the most recent session's sets
      const lastSessionId = sets[0].session_id;
      const lastSessionSets = sets.filter((s) => s.session_id === lastSessionId);

      // Find the heaviest set from the last session
      const heaviest = lastSessionSets.reduce((best, s) =>
        (s.weight_kg ?? 0) > (best.weight_kg ?? 0) ? s : best
      , lastSessionSets[0]);

      const lastWeight = heaviest.weight_kg ?? null;
      const lastReps = heaviest.reps ?? null;

      // Suggest +2.5kg if all sets had the target reps met (>=target)
      const allCompleted = lastSessionSets.every((s) => (s.reps ?? 0) >= (lastReps ?? 0));
      const suggestedWeight = lastWeight && allCompleted ? lastWeight + 2.5 : lastWeight;

      return {
        lastWeight,
        lastReps,
        suggestedWeight,
        targetRepsHit: allCompleted,
      };
    },
    enabled: !!exerciseId && !!userId,
    staleTime: 1000 * 60 * 10, // 10 min
  });
}
