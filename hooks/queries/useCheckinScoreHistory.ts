import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface WeeklyScore {
  weekLabel: string;
  avgScore: number;
}

export function useCheckinScoreHistory(userId?: string, weeks: number = 8) {
  return useQuery({
    queryKey: ["checkins", "scoreHistory", { userId, weeks }],
    queryFn: async () => {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - weeks * 7);

      const { data, error } = await supabase
        .from("check_ins")
        .select("weighted_score, submitted_at")
        .eq("user_id", userId!)
        .eq("status", "submitted")
        .not("weighted_score", "is", null)
        .gte("submitted_at", cutoff.toISOString())
        .order("submitted_at", { ascending: true });

      if (error) throw error;
      if (!data?.length) return [];

      // Group by week
      const weekMap = new Map<string, number[]>();
      for (const ci of data) {
        const d = new Date(ci.submitted_at!);
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        const label = weekStart.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
        const existing = weekMap.get(label) ?? [];
        existing.push(ci.weighted_score!);
        weekMap.set(label, existing);
      }

      const result: WeeklyScore[] = [];
      for (const [label, scores] of weekMap) {
        result.push({
          weekLabel: label,
          avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        });
      }

      return result;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}
