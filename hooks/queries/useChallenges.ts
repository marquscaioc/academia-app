import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface Challenge {
  id: string;
  created_by: string;
  title: string;
  description: string | null;
  image_url: string | null;
  scoring_mode: "days_active" | "check_in_count" | "total_volume" | "custom_points";
  scoring_config: Record<string, unknown>;
  starts_at: string;
  ends_at: string;
  is_public: boolean;
  max_participants: number | null;
  require_photo_proof: boolean;
  status: "upcoming" | "active" | "ended";
  created_at: string;
  participant_count?: number;
  is_joined?: boolean;
  my_score?: number;
  my_rank?: number;
  creator?: { full_name: string; avatar_url: string | null };
}

export interface LeaderboardEntry {
  user_id: string;
  total_score: number;
  check_in_count: number;
  last_check_in_at: string | null;
  profile?: { full_name: string; avatar_url: string | null };
}

export interface ChallengeEntry {
  id: string;
  user_id: string;
  photo_url: string | null;
  caption: string | null;
  points: number;
  created_at: string;
  profile?: { full_name: string; avatar_url: string | null };
}

export function useChallenges(filter?: "active" | "upcoming" | "ended" | "mine") {
  return useQuery({
    queryKey: ["challenges", "list", filter],
    queryFn: async () => {
      let query = supabase
        .from("challenges")
        .select("*, creator:profiles!created_by(full_name, avatar_url)")
        .order("starts_at", { ascending: false });

      if (filter === "active") query = query.eq("status", "active");
      else if (filter === "upcoming") query = query.eq("status", "upcoming");
      else if (filter === "ended") query = query.eq("status", "ended");

      const { data, error } = await query;
      if (error) throw error;
      return data as Challenge[];
    },
  });
}

export function useChallengeDetail(challengeId: string) {
  return useQuery({
    queryKey: ["challenges", "detail", challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenges")
        .select("*, creator:profiles!created_by(full_name, avatar_url)")
        .eq("id", challengeId)
        .single();
      if (error) throw error;
      return data as Challenge;
    },
    enabled: !!challengeId,
  });
}

export function useLeaderboard(challengeId: string) {
  return useQuery({
    queryKey: ["challenges", "leaderboard", challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenge_participants")
        .select("*, profile:profiles!user_id(full_name, avatar_url)")
        .eq("challenge_id", challengeId)
        .order("total_score", { ascending: false });
      if (error) throw error;
      return data as LeaderboardEntry[];
    },
    enabled: !!challengeId,
  });
}

export function useChallengeEntries(challengeId: string) {
  return useQuery({
    queryKey: ["challenges", "entries", challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenge_entries")
        .select("*, profile:profiles!user_id(full_name, avatar_url)")
        .eq("challenge_id", challengeId)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as ChallengeEntry[];
    },
    enabled: !!challengeId,
  });
}

export function useMyParticipation(challengeId: string, userId?: string) {
  return useQuery({
    queryKey: ["challenges", "my-participation", challengeId, userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenge_participants")
        .select("*")
        .eq("challenge_id", challengeId)
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!challengeId && !!userId,
  });
}
