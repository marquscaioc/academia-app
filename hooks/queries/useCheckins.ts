import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface QuestionnaireTemplate {
  id: string;
  created_by: string;
  title: string;
  description: string | null;
  frequency: string;
  is_active: boolean;
  questions?: QuestionnaireQuestion[];
}

export interface QuestionnaireQuestion {
  id: string;
  template_id: string;
  question_text: string;
  question_type: "text" | "number" | "scale" | "choice" | "multiple_choice" | "photo" | "boolean";
  options: string[] | null;
  is_required: boolean;
  sort_order: number;
  metadata: Record<string, unknown> | null;
}

export interface CheckIn {
  id: string;
  user_id: string;
  template_id: string;
  trainer_id: string | null;
  status: "pending" | "submitted" | "reviewed";
  submitted_at: string | null;
  reviewed_at: string | null;
  trainer_notes: string | null;
  created_at: string;
  template?: { title: string };
}

export function useQuestionnaireTemplates(trainerId?: string) {
  return useQuery({
    queryKey: ["questionnaires", "templates", trainerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questionnaire_templates")
        .select("*, questions:questionnaire_questions(*)")
        .eq("created_by", trainerId!)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;

      for (const t of data ?? []) {
        if (t.questions) {
          t.questions.sort((a: QuestionnaireQuestion, b: QuestionnaireQuestion) => a.sort_order - b.sort_order);
        }
      }
      return data as QuestionnaireTemplate[];
    },
    enabled: !!trainerId,
  });
}

export function useCheckIns(userId?: string, status?: string) {
  return useQuery({
    queryKey: ["checkins", "list", userId, status],
    queryFn: async () => {
      let query = supabase
        .from("check_ins")
        .select("*, template:questionnaire_templates(title)")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(50);

      if (status) query = query.eq("status", status);

      const { data, error } = await query;
      if (error) throw error;
      return data as CheckIn[];
    },
    enabled: !!userId,
  });
}

export function useAdherenceScore(userId?: string) {
  return useQuery({
    queryKey: ["progress", "adherence", userId],
    queryFn: async () => {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // Workout adherence: sessions in last 30 days
      const { count: workoutCount } = await supabase
        .from("workout_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!)
        .gte("started_at", thirtyDaysAgo)
        .not("finished_at", "is", null);

      // Meal adherence: meal logs in last 7 days
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { count: mealLogCount } = await supabase
        .from("meal_logs")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!)
        .gte("logged_at", sevenDaysAgo);

      // Check-in adherence: submitted check-ins in last 30 days
      const { count: submittedCheckins } = await supabase
        .from("check_ins")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!)
        .eq("status", "submitted")
        .gte("created_at", thirtyDaysAgo);

      const { count: totalCheckins } = await supabase
        .from("check_ins")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!)
        .gte("created_at", thirtyDaysAgo);

      // Calculate scores
      const workoutTarget = 12; // ~3x per week
      const workoutScore = Math.min(100, ((workoutCount ?? 0) / workoutTarget) * 100);
      const checkinScore = totalCheckins ? ((submittedCheckins ?? 0) / totalCheckins) * 100 : 100;
      const overallScore = Math.round((workoutScore + checkinScore) / 2);

      return {
        workoutCount: workoutCount ?? 0,
        workoutScore: Math.round(workoutScore),
        mealLogCount: mealLogCount ?? 0,
        checkinScore: Math.round(checkinScore),
        overallScore,
      };
    },
    enabled: !!userId,
  });
}
