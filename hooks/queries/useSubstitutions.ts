import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface Substitution {
  id: string;
  original_item_id: string;
  substitute_food_name: string;
  substitute_quantity: number | null;
  substitute_unit: string;
  substitute_calories: number | null;
  substitute_protein_g: number | null;
  substitute_carbs_g: number | null;
  substitute_fat_g: number | null;
  notes: string | null;
}

export function useSubstitutions(mealItemId?: string) {
  return useQuery({
    queryKey: ["diet", "substitutions", { mealItemId }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("food_substitutions")
        .select("*")
        .eq("original_item_id", mealItemId!);
      if (error) throw error;
      return (data ?? []) as Substitution[];
    },
    enabled: !!mealItemId,
  });
}
