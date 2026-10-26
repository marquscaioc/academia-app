import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface StudentAdherence {
  studentId: string;
  name: string;
  avatarUrl: string | null;
  workoutAdherence: number;
  checkinAdherence: number;
  overallAdherence: number;
}

export function useStudentAdherenceList(trainerId?: string) {
  return useQuery({
    queryKey: ["trainer", "adherence", { trainerId }],
    queryFn: async () => {
      // Get active students
      const { data: relations } = await supabase
        .from("trainer_students")
        .select("student_id, student:profiles!student_id(full_name, avatar_url)")
        .eq("trainer_id", trainerId!)
        .eq("status", "active");

      if (!relations) return [];

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const results: StudentAdherence[] = [];

      for (const rel of relations) {
        const student = rel.student as unknown as { full_name: string; avatar_url: string | null } | null;

        // Workout count in last 30 days
        const { count: workoutCount } = await supabase
          .from("workout_sessions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", rel.student_id)
          .not("finished_at", "is", null)
          .gte("started_at", thirtyDaysAgo);

        // Check-in scores
        const { data: checkIns } = await supabase
          .from("check_ins")
          .select("weighted_score")
          .eq("user_id", rel.student_id)
          .eq("status", "submitted")
          .gte("created_at", thirtyDaysAgo);

        const avgScore = checkIns?.length
          ? checkIns.reduce((sum, c) => sum + (c.weighted_score ?? 0), 0) / checkIns.length
          : 0;

        // Simple adherence: workouts/month out of expected ~12 (3x/week)
        const workoutAdherence = Math.min(Math.round(((workoutCount ?? 0) / 12) * 100), 100);
        const checkinAdherence = Math.round(avgScore);
        const overallAdherence = Math.round((workoutAdherence + checkinAdherence) / 2);

        results.push({
          studentId: rel.student_id,
          name: student?.full_name ?? "Aluno",
          avatarUrl: student?.avatar_url ?? null,
          workoutAdherence,
          checkinAdherence,
          overallAdherence,
        });
      }

      return results.sort((a, b) => a.overallAdherence - b.overallAdherence);
    },
    enabled: !!trainerId,
    staleTime: 1000 * 60 * 5,
  });
}
