import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

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
  trainer_id: string;
  student_id: string;
  name: string;
  description?: string;
}

interface AddWorkoutInput {
  plan_id: string;
  name: string;
  sort_order?: number;
  estimated_duration_minutes?: number;
  notes?: string;
}

interface AddWorkoutExerciseInput {
  workout_id: string;
  exercise_id: string;
  sort_order: number;
  target_sets?: number;
  target_reps?: string;
  target_weight_kg?: number;
  rest_seconds?: number;
  notes?: string;
}

export function useCreateWorkoutPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateWorkoutPlanInput) => {
      const { data, error } = await supabase
        .from("workout_plans")
        .insert(input)
        .select()
        .single();
      if (error) throw error;

      // Send push notification to student
      supabase.functions.invoke("push-notification", {
        body: {
          user_id: input.student_id,
          title: "Novo treino disponivel!",
          body: `Seu personal criou o plano "${input.name}". Confira!`,
          data: { type: "new_workout", screen: "workouts" },
        },
      }).catch(() => {});

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts", "plans"] });
    },
  });
}

export function useAddWorkout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddWorkoutInput) => {
      const { data, error } = await supabase
        .from("workouts")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}

export function useAddWorkoutExercise() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddWorkoutExerciseInput) => {
      const { data, error } = await supabase
        .from("workout_exercises")
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
    },
  });
}
