// Supabase Edge Function: auto-checkin
// Schedule via pg_cron or call periodically
// Finds active questionnaire templates and sends check-ins to students

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const now = new Date();
  const dayOfWeek = now.getDay();

  // Get active templates
  const { data: templates } = await supabase
    .from("questionnaire_templates")
    .select("*, creator:profiles!created_by(id)")
    .eq("is_active", true);

  let sent = 0;

  for (const template of templates ?? []) {
    // Determine if it's time to send based on frequency
    const shouldSend =
      template.frequency === "daily" ||
      (template.frequency === "weekly" && dayOfWeek === 1) || // Monday
      (template.frequency === "biweekly" && dayOfWeek === 1 && now.getDate() <= 14) ||
      (template.frequency === "monthly" && now.getDate() === 1);

    if (!shouldSend) continue;

    // Get trainer's students
    const { data: students } = await supabase
      .from("trainer_students")
      .select("student_id")
      .eq("trainer_id", template.created_by)
      .eq("status", "active");

    for (const student of students ?? []) {
      // Check if already sent today
      const today = now.toISOString().split("T")[0];
      const { data: existing } = await supabase
        .from("check_ins")
        .select("id")
        .eq("user_id", student.student_id)
        .eq("template_id", template.id)
        .gte("created_at", `${today}T00:00:00`)
        .limit(1);

      if (existing?.length) continue;

      // Create check-in
      await supabase.from("check_ins").insert({
        user_id: student.student_id,
        template_id: template.id,
        trainer_id: template.created_by,
      });

      // Send push notification
      await supabase.functions.invoke("push-notification", {
        body: {
          user_id: student.student_id,
          title: "Check-in pendente",
          body: `Responda o questionario "${template.title}"`,
          data: { type: "check_in_due" },
        },
      });

      // Send WhatsApp reminder (if opted in)
      await supabase.functions.invoke("whatsapp-reminder", {
        body: {
          user_id: student.student_id,
          template: "checkin_reminder",
        },
      });

      sent++;
    }
  }

  return new Response(JSON.stringify({ sent }), {
    headers: { "Content-Type": "application/json" },
  });
});
