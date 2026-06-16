import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminExercicio {
  id: string;
  name: string;
  primary_muscle_group_id: string | null;
  exercise_type: string | null;
  is_active: boolean | null;
  grupo: string | null;
}

export interface AdminAlimento {
  id: string;
  name: string;
  category: string | null;
  source: string | null;
  has_macros: boolean | null;
  kcal_100g: number | null;
}

export interface AdminTecnica {
  id: string;
  name: string;
  color: string | null;
  description: string | null;
  is_active: boolean | null;
  created_by: string | null;
}

export interface AdminGrupoMuscular {
  id: string;
  name: string;
}

export interface AdminPlano {
  id: string;
  name: string;
  price_brl: number | null;
  billing_period: string | null;
  is_active: boolean | null;
  features: string[] | null;
}

export interface AdminQuestionario {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean | null;
  created_at: string | null;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useAdminExercicios() {
  return useQuery<AdminExercicio[]>({
    queryKey: ["admin", "exercicios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercises")
        .select("*, muscle_groups!exercises_primary_muscle_group_id_fkey(name)")
        .order("name");

      if (error) throw error;

      return (data ?? []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        name: row.name as string,
        primary_muscle_group_id: row.primary_muscle_group_id as string | null,
        exercise_type: row.exercise_type as string | null,
        is_active: row.is_active as boolean | null,
        grupo:
          row.muscle_groups != null
            ? ((row.muscle_groups as Record<string, unknown>).name as string)
            : null,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminAlimentos() {
  return useQuery<AdminAlimento[]>({
    queryKey: ["admin", "alimentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("foods")
        .select("id, name, category, source, has_macros, kcal_100g")
        .order("name");

      if (error) throw error;
      return (data ?? []) as AdminAlimento[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminTecnicas() {
  return useQuery<AdminTecnica[]>({
    queryKey: ["admin", "tecnicas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("training_techniques")
        .select("*")
        .order("name");

      if (error) throw error;
      return (data ?? []) as AdminTecnica[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminGruposMusculares() {
  return useQuery<AdminGrupoMuscular[]>({
    queryKey: ["admin", "grupos-musculares"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("muscle_groups")
        .select("*")
        .order("name");

      if (error) throw error;
      return (data ?? []) as AdminGrupoMuscular[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminPlanos() {
  return useQuery<AdminPlano[]>({
    queryKey: ["admin", "planos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("name");

      if (error) throw error;
      return (data ?? []) as AdminPlano[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminQuestionarios() {
  return useQuery<AdminQuestionario[]>({
    queryKey: ["admin", "questionarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questionnaire_templates")
        .select("*")
        .order("title");

      if (error) throw error;
      return (data ?? []) as AdminQuestionario[];
    },
    staleTime: 1000 * 60 * 5,
  });
}
