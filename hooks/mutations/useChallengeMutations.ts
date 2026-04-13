import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface CreateChallengeInput {
  created_by: string;
  title: string;
  description?: string;
  scoring_mode: string;
  starts_at: string;
  ends_at: string;
  is_public?: boolean;
  require_photo_proof?: boolean;
  team_mode?: boolean;
  pose_verification?: boolean;
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateChallengeInput) => {
      const { data, error } = await supabase.from("challenges").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["challenges"] }),
  });
}

export function useJoinChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { challenge_id: string; user_id: string }) => {
      const { data, error } = await supabase.from("challenge_participants").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "my-participation", vars.challenge_id] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "leaderboard", vars.challenge_id] });
    },
  });
}

export function useLeaveChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { challenge_id: string; user_id: string }) => {
      const { error } = await supabase
        .from("challenge_participants")
        .delete()
        .eq("challenge_id", input.challenge_id)
        .eq("user_id", input.user_id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["challenges"] }),
  });
}

export function useSubmitChallengeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      challenge_id: string;
      user_id: string;
      photo_url?: string;
      caption?: string;
      points?: number;
    }) => {
      const { data, error } = await supabase
        .from("challenge_entries")
        .insert({ ...input, points: input.points ?? 1 })
        .select()
        .single();
      if (error) throw error;

      // Update participant score
      await supabase.rpc("increment_challenge_score", {
        p_challenge_id: input.challenge_id,
        p_user_id: input.user_id,
        p_points: input.points ?? 1,
      }).then(() => {});

      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["challenges", "entries", vars.challenge_id] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "leaderboard", vars.challenge_id] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "my-participation", vars.challenge_id] });
    },
  });
}
