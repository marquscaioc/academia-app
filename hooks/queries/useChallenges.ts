import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface Challenge {
  id: string;
  created_by: string;
  title: string;
  description: string | null;
  image_url: string | null;
  scoring_mode: string;
  scoring_config: Record<string, unknown>;
  starts_at: string;
  ends_at: string;
  is_public: boolean;
  max_participants: number | null;
  require_photo_proof: boolean;
  team_mode: boolean;
  pose_verification: boolean;
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

export function useChallenges(opts: {
  filter?: "active" | "upcoming" | "ended" | "mine";
  userId?: string;
  role?: "student" | "trainer" | "admin" | null;
}) {
  const { filter, userId, role } = opts;
  return useQuery({
    queryKey: ["challenges", "list", filter, userId, role],
    queryFn: async () => {
      // Resolve tenant scope
      let trainerScopeIds: string[] = [];
      if (role === "student" && userId) {
        const { data: links, error: linkErr } = await supabase
          .from("trainer_students")
          .select("trainer_id")
          .eq("student_id", userId)
          .eq("status", "active");
        if (linkErr) throw linkErr;
        trainerScopeIds = (links ?? []).map((l) => l.trainer_id as string);
      } else if (role === "trainer" && userId) {
        trainerScopeIds = [userId];
      }

      let query = supabase
        .from("challenges")
        .select("*, creator:profiles!created_by(full_name, avatar_url)")
        .order("starts_at", { ascending: false });

      if (filter === "active") query = query.eq("status", "active");
      else if (filter === "upcoming") query = query.eq("status", "upcoming");
      else if (filter === "ended") query = query.eq("status", "ended");

      // Tenant filter: global (trainer_id is null) OR scoped to linked trainers OR own
      if (role === "trainer" && userId) {
        query = query.or(`trainer_id.is.null,trainer_id.eq.${userId},created_by.eq.${userId}`);
      } else if (role === "student" && userId) {
        const trainerInList = trainerScopeIds.length
          ? `,trainer_id.in.(${trainerScopeIds.join(",")})`
          : "";
        query = query.or(`trainer_id.is.null${trainerInList}`);
      } else {
        query = query.is("trainer_id", null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Challenge[];
    },
    enabled: role === undefined || !!userId,
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
