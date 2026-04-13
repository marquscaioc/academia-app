// Supabase Edge Function: hydration-reminder
// Scheduled every 2 hours via pg_cron or external scheduler
// Sends push to students who haven't logged water recently

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

Deno.serve(async (_req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    const todayStart = new Date().toISOString().split("T")[0] + "T00:00:00";

    // Get all active students with water goals and push tokens
    const { data: students } = await supabase
      .from("profiles")
      .select("id, full_name, push_token, water_goal_ml")
      .eq("role", "student")
      .eq("is_active", true)
      .not("push_token", "is", null)
      .gt("water_goal_ml", 0);

    if (!students || students.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    let sentCount = 0;

    for (const student of students) {
      // Check if student logged water in the last 2 hours
      const { data: recentLogs } = await supabase
        .from("water_logs")
        .select("id")
        .eq("user_id", student.id)
        .gte("created_at", twoHoursAgo)
        .limit(1);

      if (recentLogs && recentLogs.length > 0) continue;

      // Get total water today
      const { data: todayLogs } = await supabase
        .from("water_logs")
        .select("amount_ml")
        .eq("user_id", student.id)
        .gte("created_at", todayStart);

      const totalToday = (todayLogs ?? []).reduce((sum, l) => sum + l.amount_ml, 0);
      const remaining = (student.water_goal_ml ?? 2500) - totalToday;

      if (remaining <= 0) continue;

      // Send push
      await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: student.push_token,
          title: "Hora de beber agua! 💧",
          body: `Voce ainda precisa de ${remaining}ml para atingir sua meta de ${student.water_goal_ml}ml.`,
          data: { type: "hydration_reminder", screen: "diet" },
          sound: "default",
        }),
      });

      // Save notification
      await supabase.from("notifications").insert({
        user_id: student.id,
        type: "hydration_reminder",
        title: "Hora de beber agua!",
        body: `Faltam ${remaining}ml para sua meta.`,
        is_pushed: true,
      });

      sentCount++;
    }

    return new Response(JSON.stringify({ sent: sentCount }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
