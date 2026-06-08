import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface LastPerformance {
  lastWeight: number | null;
  lastReps: number | null;
  suggestedWeight: number | null;
  targetRepsHit: boolean;
}

export function useLastPerformance(
  exerciseId?: string,
  userId?: string,
  targetReps?: string | null,
) {
  return useQuery({
    queryKey: ["workouts", "lastPerformance", { exerciseId, userId, targetReps }],
    queryFn: async (): Promise<LastPerformance> => {
      // Get the most recent session that has sets for this exercise
      const { data: sets } = await supabase
        .from("workout_session_sets")
        .select("weight_kg, reps, is_warmup, session_id, workout_sessions!inner(user_id, finished_at)")
        .eq("exercise_id", exerciseId!)
        .eq("workout_sessions.user_id", userId!)
        .not("workout_sessions.finished_at", "is", null)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!sets || sets.length === 0) {
        return { lastWeight: null, lastReps: null, suggestedWeight: null, targetRepsHit: false };
      }

      // Get the most recent session's sets; use only working sets (exclude warmups)
      const lastSessionId = sets[0].session_id;
      const lastSessionSets = sets.filter((s) => s.session_id === lastSessionId);
      const workingSets = lastSessionSets.filter((s) => !s.is_warmup);
      const effectiveSets = workingSets.length ? workingSets : lastSessionSets;

      // Find the heaviest working set from the last session
      const heaviest = effectiveSets.reduce((best, s) =>
        (s.weight_kg ?? 0) > (best.weight_kg ?? 0) ? s : best
      , effectiveSets[0]);

      const lastWeight = heaviest.weight_kg ?? null;
      const lastReps = heaviest.reps ?? null;

      // Suggest +2.5kg only if the prescribed target reps was hit on every working set.
      // target_reps may be a single value ("10") or a range ("10-12"); parse the lower bound.
      const targetRepsNum = targetReps ? parseInt(String(targetReps), 10) : NaN;
      const targetRepsHit =
        !Number.isNaN(targetRepsNum) &&
        effectiveSets.every((s) => (s.reps ?? 0) >= targetRepsNum);
      const suggestedWeight = lastWeight && targetRepsHit ? lastWeight + 2.5 : lastWeight;

      return {
        lastWeight,
        lastReps,
        suggestedWeight,
        targetRepsHit,
      };
    },
    enabled: !!exerciseId && !!userId,
    staleTime: 1000 * 60 * 10, // 10 min
  });
}
