import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface ChallengeTeam {
  id: string;
  challenge_id: string;
  name: string;
  total_score: number;
  member_count: number;
  members?: { user_id: string; profile: { full_name: string; avatar_url: string | null } | null }[];
}

export function useChallengeTeams(challengeId?: string) {
  return useQuery({
    queryKey: ["challenges", "teams", challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenge_teams")
        .select("*, members:challenge_participants(user_id, profile:profiles!user_id(full_name, avatar_url))")
        .eq("challenge_id", challengeId!)
        .order("total_score", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ChallengeTeam[];
    },
    enabled: !!challengeId,
  });
}
