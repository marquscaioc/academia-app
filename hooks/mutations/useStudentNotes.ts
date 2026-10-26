import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export function useAddStudentNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      trainer_id: string;
      student_id: string;
      note_type?: string;
      content: string;
    }) => {
      const { data, error } = await supabase
        .from("student_notes")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["trainer", "timeline", vars.student_id] });
    },
  });
}
