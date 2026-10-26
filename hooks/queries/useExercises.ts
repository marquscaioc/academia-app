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
  userId?: string;
  role?: "student" | "trainer" | "admin" | null;
}) {
  return useQuery({
    queryKey: ["exercises", "list", filters?.muscleGroupId, filters?.userId, filters?.role],
    queryFn: async () => {
      // Resolve trainer scope for defense-in-depth
      let trainerScopeIds: string[] = [];
      if (filters?.role === "student" && filters?.userId) {
        const { data: links } = await supabase
          .from("trainer_students")
          .select("trainer_id")
          .eq("student_id", filters.userId)
          .eq("status", "active");
        trainerScopeIds = (links ?? []).map((l) => l.trainer_id as string);
      } else if (filters?.role === "trainer" && filters?.userId) {
        trainerScopeIds = [filters.userId];
      }

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

      // Tenant filter: global exercises OR created by self/linked-trainers
      if (filters?.role === "trainer" && filters?.userId) {
        query = query.or(`is_global.eq.true,created_by.eq.${filters.userId}`);
      } else if (filters?.role === "student" && filters?.userId) {
        const createdByIn = trainerScopeIds.length
          ? `,created_by.in.(${trainerScopeIds.join(",")})`
          : "";
        query = query.or(`is_global.eq.true${createdByIn}`);
      } else {
        query = query.eq("is_global", true);
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
