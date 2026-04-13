import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface PointRule {
  id: string;
  challenge_id: string;
  activity_type: string;
  label: string;
  points: number;
  max_per_day: number | null;
  sort_order: number;
}

export function useChallengePointRules(challengeId?: string) {
  return useQuery({
    queryKey: ["challenges", "pointRules", challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("challenge_point_rules")
        .select("*")
        .eq("challenge_id", challengeId!)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as PointRule[];
    },
    enabled: !!challengeId,
  });
}
