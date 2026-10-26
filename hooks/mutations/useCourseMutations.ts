import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { trainer_id: string; title: string; description?: string; cover_url?: string }) => {
      const { data, error } = await supabase.from("courses").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useTogglePublishCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from("courses").update({ is_published: input.is_published }).eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useAddLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      course_id: string;
      title: string;
      description?: string;
      video_url?: string;
      thumbnail_url?: string;
      duration_seconds?: number;
      sort_order: number;
      is_free?: boolean;
    }) => {
      const { data, error } = await supabase.from("lessons").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}

export function useMarkLessonComplete() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { user_id: string; lesson_id: string; watched_seconds?: number }) => {
      const { error } = await supabase.from("lesson_progress").upsert({
        user_id: input.user_id,
        lesson_id: input.lesson_id,
        watched_seconds: input.watched_seconds ?? 0,
        completed: true,
        completed_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["courses"] }),
  });
}
