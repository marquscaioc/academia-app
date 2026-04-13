// Supabase Edge Function: plan-expiring
// Scheduled daily at 9am via pg_cron
// Sends push notification 7 days and 1 day before plan expires

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

Deno.serve(async (_req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const now = new Date();
    const in7days = new Date(now);
    in7days.setDate(in7days.getDate() + 7);
    const in1day = new Date(now);
    in1day.setDate(in1day.getDate() + 1);

    const format = (d: Date) => d.toISOString().split("T")[0];

    let sentCount = 0;

    // Check workout plans expiring in 7 days or 1 day
    for (const { days, date } of [{ days: 7, date: format(in7days) }, { days: 1, date: format(in1day) }]) {
      const { data: workoutPlans } = await supabase
        .from("workout_plans")
        .select("id, name, student_id, student:profiles!student_id(full_name, push_token)")
        .eq("is_active", true)
        .gte("ends_at", date + "T00:00:00")
        .lte("ends_at", date + "T23:59:59");

      for (const plan of workoutPlans ?? []) {
        const student = plan.student as { full_name: string; push_token: string | null } | null;
        if (!student?.push_token) continue;

        await fetch(EXPO_PUSH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: student.push_token,
            title: `Plano expira em ${days} dia${days > 1 ? "s" : ""}!`,
            body: `Seu plano "${plan.name}" expira em breve. Fale com seu personal.`,
            data: { type: "plan_expiring", screen: "workouts" },
            sound: "default",
          }),
        });

        await supabase.from("notifications").insert({
          user_id: plan.student_id,
          type: "plan_expiring",
          title: `Plano expira em ${days} dia${days > 1 ? "s" : ""}`,
          body: `Seu plano "${plan.name}" expira em breve.`,
          is_pushed: true,
        });

        // WhatsApp
        await supabase.functions.invoke("whatsapp-reminder", {
          body: { user_id: plan.student_id, template: "plan_expiring", params: { planName: plan.name } },
        });

        sentCount++;
      }

      // Check diet plans too
      const { data: dietPlans } = await supabase
        .from("diet_plans")
        .select("id, name, student_id, student:profiles!student_id(full_name, push_token)")
        .eq("is_active", true)
        .gte("ends_at", date + "T00:00:00")
        .lte("ends_at", date + "T23:59:59");

      for (const plan of dietPlans ?? []) {
        const student = plan.student as { full_name: string; push_token: string | null } | null;
        if (!student?.push_token) continue;

        await fetch(EXPO_PUSH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: student.push_token,
            title: `Dieta expira em ${days} dia${days > 1 ? "s" : ""}!`,
            body: `Seu plano alimentar "${plan.name}" expira em breve.`,
            data: { type: "plan_expiring", screen: "diet" },
            sound: "default",
          }),
        });

        sentCount++;
      }
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
