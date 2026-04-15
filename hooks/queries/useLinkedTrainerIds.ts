import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

/**
 * Returns the trainer_ids a student is actively linked to via trainer_students.
 * Cached for the session — used to tenant-scope queries like recipes, challenges, exercises.
 *
 * Returns `undefined` while loading, empty array when student has no trainers yet.
 */
export function useLinkedTrainerIds(studentId: string | undefined) {
  return useQuery({
    queryKey: ["trainer-students", "links", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_students")
        .select("trainer_id")
        .eq("student_id", studentId!)
        .eq("status", "active");
      if (error) throw error;
      return (data ?? []).map((d) => d.trainer_id as string);
    },
    enabled: !!studentId,
    staleTime: 1000 * 60 * 5,
  });
}
