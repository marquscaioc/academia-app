import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface MostImprovedEntry {
  userId: string;
  name: string;
  avatarUrl: string | null;
  firstWeekScore: number;
  lastWeekScore: number;
  improvementPct: number;
}

export function useMostImproved(challengeId?: string) {
  return useQuery({
    queryKey: ["challenges", "mostImproved", challengeId],
    queryFn: async () => {
      // Get all entries for this challenge
      const { data: entries } = await supabase
        .from("challenge_entries")
        .select("user_id, points, created_at, profile:profiles!user_id(full_name, avatar_url)")
        .eq("challenge_id", challengeId!)
        .order("created_at");

      if (!entries?.length) return [];

      // Group by user
      const userEntries = new Map<string, { points: number; date: string; profile: unknown }[]>();
      for (const e of entries) {
        const existing = userEntries.get(e.user_id) ?? [];
        existing.push({ points: e.points, date: e.created_at, profile: e.profile });
        userEntries.set(e.user_id, existing);
      }

      const results: MostImprovedEntry[] = [];

      for (const [userId, uEntries] of userEntries) {
        if (uEntries.length < 2) continue;

        // First week entries vs last week entries
        const sorted = uEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const totalDays = (new Date(sorted[sorted.length - 1].date).getTime() - new Date(sorted[0].date).getTime()) / (1000 * 60 * 60 * 24);
        if (totalDays < 7) continue;

        const midpoint = new Date(sorted[0].date).getTime() + (totalDays / 2) * 1000 * 60 * 60 * 24;
        const firstHalf = sorted.filter((e) => new Date(e.date).getTime() < midpoint);
        const secondHalf = sorted.filter((e) => new Date(e.date).getTime() >= midpoint);

        const firstScore = firstHalf.reduce((sum, e) => sum + e.points, 0) / Math.max(firstHalf.length, 1);
        const lastScore = secondHalf.reduce((sum, e) => sum + e.points, 0) / Math.max(secondHalf.length, 1);

        const improvement = firstScore > 0 ? ((lastScore - firstScore) / firstScore) * 100 : 0;

        const profile = uEntries[0].profile as unknown as { full_name: string; avatar_url: string | null } | null;

        results.push({
          userId,
          name: profile?.full_name ?? "Usuario",
          avatarUrl: profile?.avatar_url ?? null,
          firstWeekScore: Math.round(firstScore * 10) / 10,
          lastWeekScore: Math.round(lastScore * 10) / 10,
          improvementPct: Math.round(improvement),
        });
      }

      return results.sort((a, b) => b.improvementPct - a.improvementPct);
    },
    enabled: !!challengeId,
  });
}
