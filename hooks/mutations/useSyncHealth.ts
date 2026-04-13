import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import { readHealthData } from "../../lib/health/healthConnect";

export function useSyncHealthData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { userId: string; date: Date }) => {
      const healthData = await readHealthData(input.date);
      const synced = [];

      // Sync external workouts as workout_sessions
      for (const workout of healthData.workouts) {
        const { data, error } = await supabase
          .from("workout_sessions")
          .insert({
            user_id: input.userId,
            started_at: workout.date,
            finished_at: workout.date,
            duration_seconds: workout.duration * 60,
            source: "apple_health",
            notes: workout.name,
          })
          .select()
          .single();

        if (!error && data) synced.push(data);
      }

      return { synced: synced.length, steps: healthData.steps, calories: healthData.calories };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts", "sessions"] });
      queryClient.invalidateQueries({ queryKey: ["health"] });
    },
  });
}
