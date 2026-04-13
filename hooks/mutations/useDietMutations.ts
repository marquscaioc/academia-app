import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

interface CreateDietPlanInput {
  trainer_id: string;
  student_id: string;
  name: string;
  description?: string;
  target_calories?: number;
  target_protein_g?: number;
  target_carbs_g?: number;
  target_fat_g?: number;
}

interface AddMealInput {
  diet_plan_id: string;
  name: string;
  sort_order: number;
  target_time?: string;
  notes?: string;
}

interface AddMealItemInput {
  meal_id: string;
  food_name: string;
  quantity?: number;
  unit?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  notes?: string;
  sort_order: number;
}

export function useCreateDietPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateDietPlanInput) => {
      const { data, error } = await supabase.from("diet_plans").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diet", "plans"] }),
  });
}

export function useAddMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddMealInput) => {
      const { data, error } = await supabase.from("meals").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diet"] }),
  });
}

export function useAddMealItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddMealItemInput) => {
      const { data, error } = await supabase.from("meal_items").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diet"] }),
  });
}

export function useLogMeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { user_id: string; meal_id: string }) => {
      const { data, error } = await supabase.from("meal_logs").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diet", "meal-logs"] }),
  });
}

export function useLogWater() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { user_id: string; amount_ml: number }) => {
      const { data, error } = await supabase.from("water_logs").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["diet", "water-logs"] }),
  });
}
