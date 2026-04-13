import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface MealItem {
  id: string;
  meal_id: string;
  food_name: string;
  quantity: number | null;
  unit: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  notes: string | null;
  sort_order: number;
}

export interface Meal {
  id: string;
  diet_plan_id: string;
  name: string;
  sort_order: number;
  target_time: string | null;
  notes: string | null;
  items?: MealItem[];
}

export interface DietPlan {
  id: string;
  trainer_id: string | null;
  student_id: string;
  name: string;
  description: string | null;
  target_calories: number | null;
  target_protein_g: number | null;
  target_carbs_g: number | null;
  target_fat_g: number | null;
  target_fiber_g: number | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  meals?: Meal[];
}

export interface MealLog {
  id: string;
  user_id: string;
  meal_id: string;
  logged_at: string;
  completed: boolean;
}

export function useDietPlans(studentId?: string) {
  return useQuery({
    queryKey: ["diet", "plans", { studentId }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diet_plans")
        .select("*, meals(*, items:meal_items(*))")
        .eq("student_id", studentId!)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;

      for (const plan of data ?? []) {
        if (plan.meals) {
          plan.meals.sort((a: Meal, b: Meal) => a.sort_order - b.sort_order);
          for (const meal of plan.meals) {
            if (meal.items) {
              meal.items.sort((a: MealItem, b: MealItem) => a.sort_order - b.sort_order);
            }
          }
        }
      }

      return data as DietPlan[];
    },
    enabled: !!studentId,
  });
}

export function useMealLogs(userId?: string, date?: string) {
  return useQuery({
    queryKey: ["diet", "meal-logs", { userId, date }],
    queryFn: async () => {
      const startOfDay = `${date}T00:00:00`;
      const endOfDay = `${date}T23:59:59`;

      const { data, error } = await supabase
        .from("meal_logs")
        .select("*")
        .eq("user_id", userId!)
        .gte("logged_at", startOfDay)
        .lte("logged_at", endOfDay);
      if (error) throw error;
      return data as MealLog[];
    },
    enabled: !!userId && !!date,
  });
}

export function useWaterLogs(userId?: string, date?: string) {
  return useQuery({
    queryKey: ["diet", "water-logs", { userId, date }],
    queryFn: async () => {
      const startOfDay = `${date}T00:00:00`;
      const endOfDay = `${date}T23:59:59`;

      const { data, error } = await supabase
        .from("water_logs")
        .select("*")
        .eq("user_id", userId!)
        .gte("logged_at", startOfDay)
        .lte("logged_at", endOfDay);
      if (error) throw error;
      return data as { id: string; amount_ml: number; logged_at: string }[];
    },
    enabled: !!userId && !!date,
  });
}
