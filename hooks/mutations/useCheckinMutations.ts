import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface CreateTemplateInput {
  created_by: string;
  title: string;
  description?: string;
  frequency?: string;
}

interface AddQuestionInput {
  template_id: string;
  question_text: string;
  question_type: string;
  options?: string[];
  is_required?: boolean;
  sort_order: number;
  weight?: number;
}

interface SubmitCheckInInput {
  check_in_id: string;
  answers: {
    question_id: string;
    answer_text?: string;
    answer_number?: number;
    answer_json?: unknown;
    justification?: string;
  }[];
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTemplateInput) => {
      const { data, error } = await supabase.from("questionnaire_templates").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questionnaires"] }),
  });
}

export function useAddQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddQuestionInput) => {
      const { data, error } = await supabase.from("questionnaire_questions").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["questionnaires"] }),
  });
}

export function useSendCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { user_id: string; template_id: string; trainer_id: string }) => {
      const { data, error } = await supabase.from("check_ins").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checkins"] }),
  });
}

export function useSubmitCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SubmitCheckInInput) => {
      // Insert answers
      const { error: ansError } = await supabase
        .from("check_in_answers")
        .insert(input.answers.map((a) => ({ check_in_id: input.check_in_id, ...a })));
      if (ansError) throw ansError;

      // Update check-in status
      const { error: updateError } = await supabase
        .from("check_ins")
        .update({ status: "submitted", submitted_at: new Date().toISOString() })
        .eq("id", input.check_in_id);
      if (updateError) throw updateError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["checkins"] }),
  });
}
