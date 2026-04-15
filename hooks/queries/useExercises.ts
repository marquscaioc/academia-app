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

import { translateExerciseName } from "../../lib/utils/exerciseTranslations";

// Normalize for accent-insensitive search (remove accents, lowercase)
function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function useExercises(filters?: {
  muscleGroupId?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["exercises", "list", filters?.muscleGroupId],
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

      const { data, error } = await query;
      if (error) throw error;
      return data as Exercise[];
    },
    select: (data) => {
      // Client-side search across English name + PT-BR translation + muscle/equipment
      if (!filters?.search?.trim()) return data;
      const term = normalize(filters.search.trim());
      return data.filter((ex) => {
        const en = normalize(ex.name);
        const pt = normalize(translateExerciseName(ex.name));
        const muscle = normalize(ex.muscle_group?.name ?? "");
        const equip = normalize(ex.equipment?.name ?? "");
        return en.includes(term) || pt.includes(term) || muscle.includes(term) || equip.includes(term);
      });
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
