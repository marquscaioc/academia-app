import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface Exercise {
  id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  primary_muscle_group_id: string | null;
  equipment_id: string | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  exercise_type: "strength" | "cardio" | "flexibility" | "calisthenics" | null;
  is_global: boolean;
  created_by: string | null;
  muscle_group?: { id: string; name: string } | null;
  equipment?: { id: string; name: string } | null;
}

export interface MuscleGroup {
  id: string;
  name: string;
  sort_order: number;
}

export interface Equipment {
  id: string;
  name: string;
}

export function useExercises(filters?: {
  muscleGroupId?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["exercises", "list", filters],
    queryFn: async () => {
      let query = supabase
        .from("exercises")
        .select(
          "*, muscle_group:muscle_groups!primary_muscle_group_id(id, name), equipment:equipment(id, name)",
        )
        .eq("is_active", true)
        .order("name");

      if (filters?.muscleGroupId) {
        query = query.eq("primary_muscle_group_id", filters.muscleGroupId);
      }

      if (filters?.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Exercise[];
    },
  });
}

export function useMuscleGroups() {
  return useQuery({
    queryKey: ["exercises", "muscle-groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("muscle_groups")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as MuscleGroup[];
    },
    staleTime: Infinity,
  });
}

export function useEquipment() {
  return useQuery({
    queryKey: ["exercises", "equipment"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipment")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Equipment[];
    },
    staleTime: Infinity,
  });
}
