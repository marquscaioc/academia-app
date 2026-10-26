import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import { checkAndAwardAchievements } from "./useCheckAndAwardAchievements";
import { createAutoShoutout } from "../../lib/utils/autoShoutout";

interface LogSetInput {
  workout_exercise_id?: string;
  exercise_id: string;
  set_number: number;
  reps?: number;
  weight_kg?: number;
  duration_seconds?: number;
  rpe?: number;
  is_warmup?: boolean;
  is_drop_set?: boolean;
  is_failure?: boolean;
  notes?: string;
}

interface StartSessionInput {
  user_id: string;
  workout_id?: string;
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
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts", "sessions"] });
    },
  });
}

export function useLogSet() {
  return useMutation({
    mutationFn: async (input: LogSetInput & { session_id: string }) => {
      const { session_id, ...setData } = input;
      const { data, error } = await supabase
        .from("workout_session_sets")
        .insert({ session_id, ...setData })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  });
}

export function useFinishSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: FinishSessionInput) => {
      const { session_id, ...updateData } = input;
      const { data, error } = await supabase
        .from("workout_sessions")
        .update({
          ...updateData,
          finished_at: new Date().toISOString(),
        })
        .eq("id", session_id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ["workouts", "sessions"] });

      const userId = data?.user_id;
      if (userId) {
        // Check and award achievements
        checkAndAwardAchievements(userId).catch(() => {});

        // Check for streak milestones and auto shoutout
        const { data: profile } = await supabase
          .from("profiles")
          .select("current_streak, full_name")
          .eq("id", userId)
          .single();

        if (profile?.current_streak && [7, 30, 60, 100].includes(profile.current_streak)) {
          createAutoShoutout(userId, "streak_milestone", { days: profile.current_streak }).catch(() => {});
        }

        // Social notification for followers
        supabase.functions.invoke("social-notification", {
          body: { user_id: userId, user_name: profile?.full_name ?? "Alguem" },
        }).catch(() => {});
      }
    },
  });
}
