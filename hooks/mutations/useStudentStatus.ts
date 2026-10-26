import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

type StudentStatus = "active" | "paused" | "cancelled";

export function useUpdateStudentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { trainer_id: string; student_id: string; status: StudentStatus }) => {
      const update: { status: StudentStatus; ended_at?: string | null } = { status: input.status };
      if (input.status === "active") update.ended_at = null;
      else if (input.status === "cancelled") update.ended_at = new Date().toISOString();

      const { error } = await supabase
        .from("trainer_students")
        .update(update)
        .eq("trainer_id", input.trainer_id)
        .eq("student_id", input.student_id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trainer", "students"] });
    },
  });
}
