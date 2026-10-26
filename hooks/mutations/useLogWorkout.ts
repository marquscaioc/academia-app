import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import { checkAndAwardAchievements } from "./useCheckAndAwardAchievements";
import { createAutoShoutout } from "../../lib/utils/autoShoutout";

export interface SyncSetInput {
  /** Client-generated UUID → upsert makes retries idempotent. */
  id: string;
  session_id: string;
  workout_exercise_id: string | null;
  exercise_id: string;
  set_number: number;
  reps: number | null;
  weight_kg: number | null;
  is_warmup: boolean;
}

interface StartSessionInput {
  user_id: string;
  workout_id: string;
}

interface FinishSessionInput {
  session_id: string;
  duration_seconds: number;
  overall_rpe?: number;
  mood?: string;
  notes?: string;
}

export function useStartSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: StartSessionInput) => {
      const { data, error } = await supabase
        .from("workout_sessions")
        .insert({
          user_id: input.user_id,
          workout_id: input.workout_id,
          started_at: new Date().toISOString(),
        })
        .select("id, started_at")
        .single();
      if (error) throw error;
      return data as { id: string; started_at: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts", "sessions"] });
      queryClient.invalidateQueries({ queryKey: ["workouts", "openSession"] });
    },
  });
}

/** Creates or updates one logged set. Safe to call repeatedly with the same id. */
export function useSyncSet() {
  return useMutation({
    mutationFn: async (input: SyncSetInput) => {
      const { error } = await supabase
        .from("workout_session_sets")
        .upsert(input, { onConflict: "id" });
      if (error) throw error;
      return input.id;
    },
  });
}

export function useDeleteSet() {
  return useMutation({
    mutationFn: async (setId: string) => {
      const { error } = await supabase.from("workout_session_sets").delete().eq("id", setId);
      if (error) throw error;
      return setId;
    },
  });
}

export function useFinishSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: FinishSessionInput) => {
      const { session_id, ...updateData } = input;
      // Only an open session can be finished → a double tap / retry never overwrites
      // the original finish time nor re-fires the streak trigger.
      const { data, error } = await supabase
        .from("workout_sessions")
        .update({ ...updateData, finished_at: new Date().toISOString() })
        .eq("id", session_id)
        .is("finished_at", null)
        .select()
        .maybeSingle();
      if (error) throw error;
      if (data) return { session: data, alreadyFinished: false };

      const { data: existing, error: readError } = await supabase
        .from("workout_sessions")
        .select()
        .eq("id", session_id)
        .single();
      if (readError) throw readError;
      return { session: existing, alreadyFinished: true };
    },
    onSuccess: async ({ session, alreadyFinished }) => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
      if (alreadyFinished) return;

      const userId = session?.user_id as string | undefined;
      if (!userId) return;

      checkAndAwardAchievements(userId).catch(() => {});

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, full_name")
        .eq("id", userId)
        .single();

      if (profile?.current_streak && [7, 30, 60, 100].includes(profile.current_streak)) {
        createAutoShoutout(userId, "streak_milestone", { days: profile.current_streak }).catch(() => {});
      }

      supabase.functions
        .invoke("social-notification", {
          body: { user_id: userId, user_name: profile?.full_name ?? "Alguem" },
        })
        .catch(() => {});
    },
  });
}
