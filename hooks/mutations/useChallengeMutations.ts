import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Crypto from "expo-crypto";
import { toast } from "../../stores/useToastStore";
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
  instagram_url?: string | null;
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateChallengeInput) => {
      // Define o status inicial coerente com as datas (sem cron para transicionar).
      const now = Date.now();
      const status =
        new Date(input.starts_at).getTime() > now
          ? "upcoming"
          : new Date(input.ends_at).getTime() < now
            ? "ended"
            : "active";
      const { data, error } = await supabase
        .from("challenges")
        .insert({ ...input, status })
        .select()
        .single();
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
    onError: (error) => toast.error("Não foi possível participar", error.message),
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
      point_rule_id?: string;
      workout_session_id?: string;
      id?: string;
    }) => {
      // Preserve the request ID if TanStack retries after an uncertain response.
      input.id ??= Crypto.randomUUID();
      const { data: existing, error: lookupError } = await supabase
        .from("challenge_entries").select("*").eq("id", input.id).maybeSingle();
      if (lookupError) throw lookupError;
      if (existing) return existing;
      const { data, error } = await supabase
        .from("challenge_entries")
        .insert(input)
        .select()
        .single();
      if (error) throw error;

      return data;
    },
    onError: (error) => toast.error("Não foi possível registrar", error.message),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["challenges", "entries", vars.challenge_id] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "leaderboard", vars.challenge_id] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "my-participation", vars.challenge_id] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "teams", vars.challenge_id] });
      queryClient.invalidateQueries({ queryKey: ["challenges", "sessions", vars.challenge_id] });
    },
  });
}
