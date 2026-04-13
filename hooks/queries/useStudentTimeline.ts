import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface TimelineEvent {
  id: string;
  type: "workout" | "checkin" | "measurement" | "photo" | "note";
  date: string;
  title: string;
  subtitle?: string;
  data: Record<string, unknown>;
}

export function useStudentTimeline(studentId?: string) {
  return useQuery({
    queryKey: ["trainer", "timeline", studentId],
    queryFn: async () => {
      const events: TimelineEvent[] = [];

      // Workouts
      const { data: sessions } = await supabase
        .from("workout_sessions")
        .select("id, started_at, finished_at, duration_seconds, workout:workouts(name)")
        .eq("user_id", studentId!)
        .not("finished_at", "is", null)
        .order("started_at", { ascending: false })
        .limit(20);

      for (const s of sessions ?? []) {
        const w = s.workout as unknown as { name: string } | null;
        events.push({
          id: s.id,
          type: "workout",
          date: s.started_at,
          title: w?.name ?? "Treino",
          subtitle: s.duration_seconds ? `${Math.round(s.duration_seconds / 60)}min` : undefined,
          data: s,
        });
      }

      // Check-ins
      const { data: checkins } = await supabase
        .from("check_ins")
        .select("id, created_at, status, weighted_score, template:questionnaire_templates(title)")
        .eq("user_id", studentId!)
        .order("created_at", { ascending: false })
        .limit(20);

      for (const c of checkins ?? []) {
        const t = c.template as unknown as { title: string } | null;
        events.push({
          id: c.id,
          type: "checkin",
          date: c.created_at,
          title: t?.title ?? "Check-in",
          subtitle: c.weighted_score != null ? `Score: ${Math.round(c.weighted_score)}%` : c.status,
          data: c,
        });
      }

      // Measurements
      const { data: measurements } = await supabase
        .from("body_measurements")
        .select("id, measured_at, weight_kg, body_fat_pct")
        .eq("user_id", studentId!)
        .order("measured_at", { ascending: false })
        .limit(10);

      for (const m of measurements ?? []) {
        events.push({
          id: m.id,
          type: "measurement",
          date: m.measured_at,
          title: "Medida corporal",
          subtitle: [m.weight_kg ? `${m.weight_kg}kg` : null, m.body_fat_pct ? `${m.body_fat_pct}% BF` : null].filter(Boolean).join(" | "),
          data: m,
        });
      }

      // Photos
      const { data: photos } = await supabase
        .from("progress_photos")
        .select("id, taken_at, pose")
        .eq("user_id", studentId!)
        .order("taken_at", { ascending: false })
        .limit(10);

      for (const p of photos ?? []) {
        events.push({
          id: p.id,
          type: "photo",
          date: p.taken_at,
          title: "Foto de progresso",
          subtitle: p.pose ?? undefined,
          data: p,
        });
      }

      // Notes
      const { data: notes } = await supabase
        .from("student_notes")
        .select("id, created_at, note_type, content")
        .eq("student_id", studentId!)
        .order("created_at", { ascending: false })
        .limit(20);

      for (const n of notes ?? []) {
        events.push({
          id: n.id,
          type: "note",
          date: n.created_at,
          title: "Nota",
          subtitle: n.content.substring(0, 60),
          data: n,
        });
      }

      // Sort by date descending
      events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return events;
    },
    enabled: !!studentId,
  });
}
