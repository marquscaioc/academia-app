// Supabase Edge Function: auto-checkin
// Scheduled daily via pg_cron (see 00024_cron_edge_functions.sql.template)
// Finds active questionnaire templates and sends check-ins to the creator's active students.
// Cadence is enforced against the last check-in of each template/student, so "biweekly" really means
// every other Monday and a repeated run on the same day creates nothing new.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireServiceRole } from "../_shared/auth.ts";
import { type ExpoMessage, sendExpoPush } from "../_shared/expoPush.ts";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Minimum days since the previous check-in of the same template (slightly under the period, so a
 *  run a few hours later than last time still sends). null = not due today. */
function minGapDays(frequency: string, now: Date): number | null {
  const monday = now.getUTCDay() === 1;
  switch (frequency) {
    case "daily": return 0.5;
    case "weekly": return monday ? 6 : null;
    case "biweekly": return monday ? 13 : null;
    case "monthly": return now.getUTCDate() === 1 ? 27 : null;
    default: return null; // "custom" is sent manually by the professional
  }
}

Deno.serve(async (req) => {
  const denied = requireServiceRole(req);
  if (denied) return denied;
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const now = new Date();

    const { data: templates, error: templatesError } = await supabase
      .from("questionnaire_templates")
      .select("id, title, frequency, created_by")
      .eq("is_active", true);
    if (templatesError) throw templatesError;

    let created = 0;
    let failed = 0;
    const pushes: ExpoMessage[] = [];
    const rows: Record<string, unknown>[] = [];

    for (const template of templates ?? []) {
      const gap = minGapDays(template.frequency, now);
      if (gap === null || !template.created_by) continue;

      const { data: students } = await supabase
        .from("trainer_students")
        .select("student_id, student:profiles!student_id(push_token, is_active)")
        .eq("trainer_id", template.created_by)
        .eq("status", "active");

      for (const link of students ?? []) {
        const student = link.student as unknown as { push_token: string | null; is_active: boolean } | null;
        if (student && student.is_active === false) continue;

        const { data: existing } = await supabase
          .from("check_ins")
          .select("id")
          .eq("user_id", link.student_id)
          .eq("template_id", template.id)
          .gte("created_at", new Date(now.getTime() - gap * DAY_MS).toISOString())
          .limit(1);
        if (existing?.length) continue;

        const { error: insertError } = await supabase.from("check_ins").insert({
          user_id: link.student_id,
          template_id: template.id,
          trainer_id: template.created_by,
        });
        if (insertError) {
          failed++;
          console.error(`auto-checkin insert failed for template ${template.id}: ${insertError.message}`);
          continue;
        }
        created++;

        const body = `Responda o questionário "${template.title}".`;
        rows.push({
          user_id: link.student_id,
          type: "check_in_due",
          title: "Check-in pendente",
          body,
          data: { type: "check_in_due" },
          is_pushed: !!student?.push_token,
        });
        if (student?.push_token) {
          pushes.push({ to: student.push_token, title: "Check-in pendente", body, data: { type: "check_in_due" }, sound: "default" });
        }
      }
    }

    if (rows.length) await supabase.from("notifications").insert(rows);
    const push = await sendExpoPush(supabase, pushes);

    return new Response(JSON.stringify({ created, failed, pushed: push.accepted }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`auto-checkin failed: ${String(error)}`);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
