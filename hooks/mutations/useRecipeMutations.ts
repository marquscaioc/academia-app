import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { user_id: string; recipe_id: string }) => {
      // Check if already favorited
      const { data: existing } = await supabase
        .from("recipe_favorites")
        .select("id")
        .eq("user_id", input.user_id)
        .eq("recipe_id", input.recipe_id)
        .maybeSingle();

      if (existing) {
        await supabase.from("recipe_favorites").delete().eq("id", existing.id);
        return { favorited: false };
      } else {
        await supabase.from("recipe_favorites").insert(input);
        return { favorited: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes", "favorites"] });
    },
  });
}
