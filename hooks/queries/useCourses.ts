import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  sort_order: number;
  is_free: boolean;
  progress?: { completed: boolean; watched_seconds: number } | null;
}

export interface Course {
  id: string;
  trainer_id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  is_published: boolean;
  is_free: boolean;
  created_at: string;
  lessons?: Lesson[];
  trainer?: { full_name: string; avatar_url: string | null };
}

export function useCourses(opts: { studentId?: string; trainerId?: string }) {
  return useQuery({
    queryKey: ["courses", opts],
    queryFn: async () => {
      let query = supabase
        .from("courses")
        .select("*, trainer:profiles!trainer_id(full_name, avatar_url), lessons(id, title, sort_order, duration_seconds, thumbnail_url, is_free)")
        .order("created_at", { ascending: false });

      if (opts.trainerId) query = query.eq("trainer_id", opts.trainerId);
      else query = query.eq("is_published", true);

      const { data, error } = await query;
      if (error) throw error;
      return data as Course[];
    },
    enabled: !!(opts.studentId || opts.trainerId),
  });
}

export function useCourseDetail(courseId: string, userId?: string) {
  return useQuery({
    queryKey: ["courses", "detail", courseId, userId],
    queryFn: async () => {
      const { data: course, error } = await supabase
        .from("courses")
        .select("*, trainer:profiles!trainer_id(full_name, avatar_url), lessons(*)")
        .eq("id", courseId)
        .single();
      if (error) throw error;

      // Fetch progress
      if (userId && course.lessons?.length) {
        const lessonIds = (course.lessons as Lesson[]).map((l) => l.id);
        const { data: progress } = await supabase
          .from("lesson_progress")
          .select("*")
          .eq("user_id", userId)
          .in("lesson_id", lessonIds);
        const progressMap = new Map(progress?.map((p) => [p.lesson_id, p]) ?? []);
        course.lessons = (course.lessons as Lesson[])
          .map((l) => ({ ...l, progress: progressMap.get(l.id) ?? null }))
          .sort((a, b) => a.sort_order - b.sort_order);
      }

      return course as Course;
    },
    enabled: !!courseId,
  });
}
