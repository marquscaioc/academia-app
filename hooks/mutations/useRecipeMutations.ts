import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface CreateRecipeIngredientInput {
  food_id?: string | null;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  sort_order: number;
}

export interface CreateRecipeInput {
  name: string;
  description?: string | null;
  instructions?: string | null;
  tags?: string[];
  servings?: number;
  prep_time_minutes?: number | null;
  cook_time_minutes?: number | null;
  created_by: string;
  trainer_id: string;
  is_public?: boolean;
  calories_per_serving?: number | null;
  protein_per_serving?: number | null;
  carbs_per_serving?: number | null;
  fat_per_serving?: number | null;
  ingredients: CreateRecipeIngredientInput[];
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateRecipeInput) => {
      const { ingredients, ...recipeFields } = input;

      // Sum macros from ingredients to store denormalised per-serving values
      const totalCalories = ingredients.reduce((s, i) => s + i.calories, 0);
      const totalProtein = ingredients.reduce((s, i) => s + i.protein_g, 0);
      const totalCarbs = ingredients.reduce((s, i) => s + i.carbs_g, 0);
      const totalFat = ingredients.reduce((s, i) => s + i.fat_g, 0);
      const servings = recipeFields.servings ?? 1;

      const { data: recipe, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          name: recipeFields.name,
          description: recipeFields.description ?? null,
          instructions: recipeFields.instructions ?? null,
          tags: recipeFields.tags ?? [],
          servings,
          prep_time_minutes: recipeFields.prep_time_minutes ?? null,
          cook_time_minutes: recipeFields.cook_time_minutes ?? null,
          created_by: recipeFields.created_by,
          trainer_id: recipeFields.trainer_id,
          is_public: recipeFields.is_public ?? false,
          calories_per_serving: servings > 0 ? totalCalories / servings : null,
          protein_per_serving: servings > 0 ? totalProtein / servings : null,
          carbs_per_serving: servings > 0 ? totalCarbs / servings : null,
          fat_per_serving: servings > 0 ? totalFat / servings : null,
        })
        .select()
        .single();
      if (recipeError) throw recipeError;

      if (ingredients.length > 0) {
        const rows = ingredients.map((ing) => ({
          recipe_id: recipe.id,
          food_id: ing.food_id ?? null,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          calories: ing.calories,
          protein_g: ing.protein_g,
          carbs_g: ing.carbs_g,
          fat_g: ing.fat_g,
          sort_order: ing.sort_order,
        }));
        const { error: ingError } = await supabase.from("recipe_ingredients").insert(rows);
        if (ingError) throw ingError;
      }

      return recipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
  });
}

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
