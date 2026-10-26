// Supabase Edge Function: weekly-digest
// Scheduled weekly (Monday 8am) via pg_cron (see 00024_cron_edge_functions.sql.template).
// Creates an in-app "Resumo semanal" notification per active student: finished workouts, streak,
// answered check-ins and new achievements of the last 7 days. It does NOT send email (no provider is
// configured), so it does not read e-mail addresses and stores no contact data in the notification.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireServiceRole } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  const denied = requireServiceRole(req);
  if (denied) return denied;
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: students, error } = await supabase
      .from("profiles")
      .select("id, current_streak")
      .eq("role", "student")
      .eq("is_active", true);
    if (error) throw error;

    let created = 0;

    for (const student of students ?? []) {
      const { count: workoutCount } = await supabase
        .from("workout_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", student.id)
        .not("finished_at", "is", null)
        .gte("started_at", weekAgo);

      const { count: checkinCount } = await supabase
        .from("check_ins")
        .select("*", { count: "exact", head: true })
        .eq("user_id", student.id)
        .eq("status", "submitted")
        .gte("submitted_at", weekAgo);

      const { data: newAchievements } = await supabase
        .from("user_achievements")
        .select("achievement:achievement_definitions(name)")
        .eq("user_id", student.id)
        .gte("earned_at", weekAgo);

      const streak = student.current_streak ?? 0;
      const achievementNames = (newAchievements ?? [])
        .map((a) => (a.achievement as unknown as { name: string } | null)?.name)
        .filter(Boolean);

      const workouts = workoutCount ?? 0;
      const checkins = checkinCount ?? 0;
      const { error: insertError } = await supabase.from("notifications").insert({
        user_id: student.id,
        type: "weekly_digest",
        title: "Resumo semanal",
        body: `${workouts} ${workouts === 1 ? "treino" : "treinos"}, sequência de ${streak} ${streak === 1 ? "dia" : "dias"}, ${checkins} ${checkins === 1 ? "check-in" : "check-ins"}`,
        data: { workoutCount: workouts, streak, checkinCount: checkins, achievementNames },
        is_pushed: false,
      });
      if (!insertError) created++;
    }

    return new Response(JSON.stringify({ processed: students?.length ?? 0, created }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
