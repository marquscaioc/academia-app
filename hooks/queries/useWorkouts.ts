import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface WorkoutPlan {
  id: string;
  trainer_id: string | null;
  student_id: string | null;
  name: string;
  description: string | null;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  workouts?: Workout[];
}

export interface Workout {
  id: string;
  plan_id: string;
  name: string;
  day_of_week: number[] | null;
  sort_order: number;
  estimated_duration_minutes: number | null;
  notes: string | null;
  exercises?: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  sort_order: number;
  superset_group: number | null;
  target_sets: number;
  target_reps: string;
  target_weight_kg: number | null;
  target_rpe: number | null;
  rest_seconds: number;
  tempo: string | null;
  notes: string | null;
  exercise?: {
    id: string;
    name: string;
    video_url: string | null;
    thumbnail_url: string | null;
    muscle_group?: { name: string } | null;
  };
}

export function useWorkoutPlans(studentId?: string) {
  return useQuery({
    queryKey: ["workouts", "plans", { studentId }],
    queryFn: async () => {
      let query = supabase
        .from("workout_plans")
        .select("*, workouts(*, exercises:workout_exercises(*, exercise:exercises(id, name, video_url, thumbnail_url, muscle_group:muscle_groups!primary_muscle_group_id(name))))")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (studentId) {
        query = query.eq("student_id", studentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as WorkoutPlan[];
    },
    enabled: !!studentId,
  });
}

export function useWorkoutDetail(workoutId: string) {
  return useQuery({
    queryKey: ["workouts", "detail", workoutId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workouts")
        .select(
          "*, exercises:workout_exercises(*, exercise:exercises(id, name, description, instructions, video_url, thumbnail_url, muscle_group:muscle_groups!primary_muscle_group_id(name)))",
        )
        .eq("id", workoutId)
        .single();
      if (error) throw error;

      if (data.exercises) {
        data.exercises.sort(
          (a: WorkoutExercise, b: WorkoutExercise) =>
            a.sort_order - b.sort_order,
        );
      }

      return data as Workout;
    },
    enabled: !!workoutId,
  });
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_id: string | null;
  started_at: string;
  finished_at: string | null;
  duration_seconds: number | null;
  overall_rpe: number | null;
  notes: string | null;
  mood: string | null;
  workout?: { name: string; plan: { name: string } } | null;
}

export function useWorkoutSessions(userId?: string) {
  return useQuery({
    queryKey: ["workouts", "sessions", { userId }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workout_sessions")
        .select("*, workout:workouts(name, plan:workout_plans(name))")
        .eq("user_id", userId!)
        .order("started_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as WorkoutSession[];
    },
    enabled: !!userId,
  });
}
