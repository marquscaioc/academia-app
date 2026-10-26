import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import { filterExercises, type ExerciseOrigin } from "../../lib/utils/exerciseFilter";

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
  equipmentId?: string;
  /** Client-side: "mine" = created by userId, "global" = shared library. */
  origin?: ExerciseOrigin;
  search?: string;
  userId?: string;
  role?: "student" | "trainer" | "admin" | null;
}) {
  return useQuery({
    queryKey: ["exercises", "list", filters?.muscleGroupId, filters?.equipmentId, filters?.userId, filters?.role],
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
      if (filters?.equipmentId) {
        query = query.eq("equipment_id", filters.equipmentId);
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
    // Client-side search across English name + PT-BR translation + muscle/equipment, and origin
    select: (data) => filterExercises(data, { search: filters?.search, origin: filters?.origin, userId: filters?.userId }),
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
