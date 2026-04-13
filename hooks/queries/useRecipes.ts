import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  prep_time_minutes: number | null;
  cook_time_minutes: number | null;
  servings: number;
  calories_per_serving: number | null;
  protein_per_serving: number | null;
  carbs_per_serving: number | null;
  fat_per_serving: number | null;
  tags: string[];
  is_public: boolean;
  created_by: string;
  created_at: string;
  ingredients?: RecipeIngredient[];
  instructions: string | null;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number | null;
  unit: string;
  sort_order: number;
}

export function useRecipes(filters?: { tags?: string[]; search?: string }) {
  return useQuery({
    queryKey: ["recipes", filters],
    queryFn: async () => {
      let query = supabase
        .from("recipes")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(50);

      if (filters?.tags?.length) {
        query = query.overlaps("tags", filters.tags);
      }
      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Recipe[];
    },
  });
}

export function useRecipeDetail(recipeId?: string) {
  return useQuery({
    queryKey: ["recipes", "detail", recipeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*, ingredients:recipe_ingredients(*)")
        .eq("id", recipeId!)
        .single();
      if (error) throw error;
      if (data?.ingredients) {
        (data.ingredients as RecipeIngredient[]).sort((a, b) => a.sort_order - b.sort_order);
      }
      return data as Recipe;
    },
    enabled: !!recipeId,
  });
}

export function useRecipeFavorites(userId?: string) {
  return useQuery({
    queryKey: ["recipes", "favorites", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipe_favorites")
        .select("recipe_id")
        .eq("user_id", userId!);
      if (error) throw error;
      return new Set((data ?? []).map((f) => f.recipe_id));
    },
    enabled: !!userId,
  });
}
