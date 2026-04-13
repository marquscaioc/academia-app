// Supabase Edge Function: weekly-digest
// Scheduled weekly (Monday 8am) via pg_cron
// Sends email summary to students: workouts, streak, check-ins, achievements

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (_req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Get all active students
    const { data: students } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("role", "student")
      .eq("is_active", true);

    let sentCount = 0;

    for (const student of students ?? []) {
      // Get auth user email
      const { data: authUser } = await supabase.auth.admin.getUserById(student.id);
      const email = authUser?.user?.email;
      if (!email) continue;

      // Workouts this week
      const { count: workoutCount } = await supabase
        .from("workout_sessions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", student.id)
        .not("finished_at", "is", null)
        .gte("started_at", weekAgo);

      // Check-ins answered
      const { count: checkinCount } = await supabase
        .from("check_ins")
        .select("*", { count: "exact", head: true })
        .eq("user_id", student.id)
        .eq("status", "submitted")
        .gte("submitted_at", weekAgo);

      // New achievements
      const { data: newAchievements } = await supabase
        .from("user_achievements")
        .select("achievement:achievement_definitions(name)")
        .eq("user_id", student.id)
        .gte("earned_at", weekAgo);

      // Current streak
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak")
        .eq("id", student.id)
        .single();

      const firstName = student.full_name?.split(" ")[0] ?? "Atleta";
      const streak = profile?.current_streak ?? 0;
      const achievementNames = (newAchievements ?? [])
        .map((a) => (a.achievement as unknown as { name: string })?.name)
        .filter(Boolean);

      // Build email HTML
      const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { font-family: system-ui; padding: 32px; max-width: 500px; margin: 0 auto; background: #f8f7fc; color: #1a1a1a; }
  .header { text-align: center; padding: 24px 0; }
  .logo { display: inline-block; width: 48px; height: 48px; background: #781BB6; border-radius: 12px; color: white; font-size: 24px; font-weight: 900; line-height: 48px; text-align: center; }
  h1 { color: #781BB6; font-size: 20px; margin: 16px 0 4px; }
  .stats { display: flex; gap: 12px; margin: 24px 0; }
  .stat { flex: 1; background: white; padding: 16px; border-radius: 12px; text-align: center; border: 1px solid #e8e5f0; }
  .stat-value { font-size: 28px; font-weight: 900; color: #781BB6; }
  .stat-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
  .achievements { background: white; padding: 16px; border-radius: 12px; margin-bottom: 16px; border: 1px solid #e8e5f0; }
  .footer { text-align: center; color: #aaa; font-size: 11px; margin-top: 32px; }
</style></head><body>
  <div class="header">
    <div class="logo">A</div>
    <h1>Resumo Semanal</h1>
    <p style="color:#888;font-size:13px;">Oi ${firstName}, aqui esta seu progresso!</p>
  </div>
  <div class="stats">
    <div class="stat"><div class="stat-value">${workoutCount ?? 0}</div><div class="stat-label">Treinos</div></div>
    <div class="stat"><div class="stat-value">${streak}</div><div class="stat-label">Streak</div></div>
    <div class="stat"><div class="stat-value">${checkinCount ?? 0}</div><div class="stat-label">Check-ins</div></div>
  </div>
  ${achievementNames.length ? `
  <div class="achievements">
    <p style="font-weight:700;font-size:13px;margin:0 0 8px;">Novas Conquistas 🏆</p>
    ${achievementNames.map((n) => `<p style="font-size:13px;margin:4px 0;">⭐ ${n}</p>`).join("")}
  </div>` : ""}
  <p style="text-align:center;font-size:13px;color:#555;">Continue assim! Cada treino conta. 💪</p>
  <div class="footer">Academia App — ${new Date().toLocaleDateString("pt-BR")}</div>
</body></html>`;

      // Send via Supabase Auth (uses configured SMTP)
      // Note: Supabase doesn't have a built-in send email API for custom emails.
      // In production, use Resend, SendGrid, or similar via fetch.
      // For now, store as notification so trainer can see digest was generated.
      await supabase.from("notifications").insert({
        user_id: student.id,
        type: "weekly_digest",
        title: "Resumo semanal",
        body: `${workoutCount ?? 0} treinos, streak de ${streak} dias, ${checkinCount ?? 0} check-ins`,
        data: { workoutCount, streak, checkinCount, achievementNames, email },
        is_pushed: false,
      });

      sentCount++;
    }

    return new Response(JSON.stringify({ processed: sentCount }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
