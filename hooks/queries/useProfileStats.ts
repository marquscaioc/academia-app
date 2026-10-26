import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface ProfileStats {
  workoutsThisMonth: number;
  currentStreak: number;
  totalPRs: number;
  activeChallenges: number;
}

export function useProfileStats(userId?: string) {
  return useQuery({
    queryKey: ["profiles", "stats", userId],
    queryFn: async () => {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { count: workoutsThisMonth } = await supabase
        .from("workout_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!)
        .not("finished_at", "is", null)
        .gte("started_at", monthStart.toISOString());

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak")
        .eq("id", userId!)
        .single();

      const { data: prs } = await supabase.rpc("get_user_prs", { p_user_id: userId! });

      const { count: activeChallenges } = await supabase
        .from("challenge_participants")
        .select("*, challenge:challenges!inner(status)", { count: "exact", head: true })
        .eq("user_id", userId!)
        .eq("challenge.status", "active");

      return {
        workoutsThisMonth: workoutsThisMonth ?? 0,
        currentStreak: profile?.current_streak ?? 0,
        totalPRs: prs?.length ?? 0,
        activeChallenges: activeChallenges ?? 0,
      } as ProfileStats;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}
