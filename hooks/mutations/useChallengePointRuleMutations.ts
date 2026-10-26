import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface CreatePointRuleInput {
  challenge_id: string;
  activity_type: string;
  label: string;
  points: number;
  max_per_day?: number;
  sort_order?: number;
}

export function useCreatePointRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePointRuleInput) => {
      const { data, error } = await supabase
        .from("challenge_point_rules")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["challenges", "pointRules", vars.challenge_id] });
    },
  });
}

export function useDeletePointRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("challenge_point_rules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges", "pointRules"] });
    },
  });
}
