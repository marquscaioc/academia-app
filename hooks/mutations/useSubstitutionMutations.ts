import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface CreateSubstitutionInput {
  original_item_id: string;
  substitute_food_name: string;
  substitute_quantity?: number;
  substitute_unit?: string;
  substitute_calories?: number;
  substitute_protein_g?: number;
  substitute_carbs_g?: number;
  substitute_fat_g?: number;
  notes?: string;
  created_by: string;
}

export function useCreateSubstitution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSubstitutionInput) => {
      const { data, error } = await supabase
        .from("food_substitutions")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diet", "substitutions"] });
    },
  });
}

export function useDeleteSubstitution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("food_substitutions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diet", "substitutions"] });
    },
  });
}
