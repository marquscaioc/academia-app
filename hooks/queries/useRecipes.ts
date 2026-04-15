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

export function useRecipes(opts: {
  tags?: string[];
  search?: string;
  userId?: string;
  role?: "student" | "trainer" | "admin" | null;
}) {
  const { tags, search, userId, role } = opts;
  return useQuery({
    queryKey: ["recipes", tags, search, userId, role],
    queryFn: async () => {
      // Resolve trainer scope
      let trainerScopeIds: string[] = [];
      if (role === "student" && userId) {
        const { data: links, error: linkErr } = await supabase
          .from("trainer_students")
          .select("trainer_id")
          .eq("student_id", userId)
          .eq("status", "active");
        if (linkErr) throw linkErr;
        trainerScopeIds = (links ?? []).map((l) => l.trainer_id as string);
      } else if (role === "trainer" && userId) {
        trainerScopeIds = [userId];
      }

      let query = supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      // Tenant filter: global OR scoped
      if (role === "trainer" && userId) {
        query = query.or(`trainer_id.is.null,trainer_id.eq.${userId},created_by.eq.${userId}`);
      } else if (role === "student" && userId) {
        const trainerInList = trainerScopeIds.length
          ? `,trainer_id.in.(${trainerScopeIds.join(",")})`
          : "";
        query = query.or(`trainer_id.is.null${trainerInList}`).eq("is_public", true);
      } else {
        query = query.is("trainer_id", null).eq("is_public", true);
      }

      if (tags?.length) {
        query = query.overlaps("tags", tags);
      }
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Recipe[];
    },
    enabled: role === undefined || !!userId,
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
