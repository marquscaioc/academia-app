import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import type { PlanWorkoutPayload } from "../../lib/trainer/planDraft";

interface CreateExerciseInput {
  name: string;
  description?: string;
  instructions?: string;
  primary_muscle_group_id?: string;
  equipment_id?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  exercise_type?: "strength" | "cardio" | "flexibility" | "calisthenics";
  video_url?: string;
  thumbnail_url?: string;
  created_by: string;
}

export function useCreateExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateExerciseInput) => {
      const { data, error } = await supabase
        .from("exercises")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
  });
}

interface CreateWorkoutPlanInput {
  /** null = template (modelo), only visible to the trainer. */
  student_id: string | null;
  name: string;
  description?: string;
  workouts: PlanWorkoutPayload[];
}

function notifyNewPlan(studentId: string | null, planName: string) {
  if (!studentId) return;
  supabase.functions
    .invoke("push-notification", {
      body: {
        user_id: studentId,
        title: "Novo treino disponível!",
        body: `Seu personal criou o plano "${planName}". Confira!`,
        data: { type: "new_workout", screen: "workouts" },
      },
    })
    .catch(() => {});
}

function invalidatePlans(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["workouts"] });
  queryClient.invalidateQueries({ queryKey: ["trainer"] });
}

/** Plan + workouts + exercises in one transaction (create_workout_plan, migration 00038). */
export function useCreateWorkoutPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateWorkoutPlanInput) => {
      const { data, error } = await supabase.rpc("create_workout_plan", {
        p_student_id: input.student_id,
        p_name: input.name,
        p_description: input.description ?? null,
        p_workouts: input.workouts,
      });
      if (error) throw error;
      // Only after the whole plan exists.
      notifyNewPlan(input.student_id, input.name);
      return data as string;
    },
    onSuccess: () => invalidatePlans(queryClient),
  });
}

/** Duplicates one of the trainer's plans to a student or to a template (copy_workout_plan, migration 00038). */
export function useCopyWorkoutPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { source_plan_id: string; student_id: string | null; name: string }) => {
      const { data, error } = await supabase.rpc("copy_workout_plan", {
        p_source_plan_id: input.source_plan_id,
        p_student_id: input.student_id,
        p_name: input.name,
      });
      if (error) throw error;
      notifyNewPlan(input.student_id, input.name);
      return data as string;
    },
    onSuccess: () => invalidatePlans(queryClient),
  });
}
