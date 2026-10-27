// Supabase Edge Function: plan-expiring
// Scheduled daily at 9am via pg_cron
// Sends push notification 7 days and 1 day before plan expires.
// Each plan is announced once per milestone, so a re-run on the same day sends nothing new.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireServiceRole } from "../_shared/auth.ts";
import { type ExpoMessage, sendExpoPush } from "../_shared/expoPush.ts";
import { consumeRateLimit } from "../_shared/rateLimit.ts";

// Guards a second run on the same (UTC) day; later days target other end dates anyway.
// consume_rate_limit (00039) purges windows older than a day, so longer windows would not stick.
const ONCE_WINDOW_S = 24 * 60 * 60;

type PlanRow = { id: string; name: string; student_id: string; student: unknown };

Deno.serve(async (req) => {
  const denied = requireServiceRole(req);
  if (denied) return denied;
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

    const pushes: ExpoMessage[] = [];
    const rows: Record<string, unknown>[] = [];

    const kinds = [
      { table: "workout_plans", label: "Plano", noun: "plano", screen: "workouts" },
      { table: "diet_plans", label: "Dieta", noun: "plano alimentar", screen: "diet" },
    ] as const;

    for (const { days, date } of [{ days: 7, date: format(in7days) }, { days: 1, date: format(in1day) }]) {
      const when = `${days} dia${days > 1 ? "s" : ""}`;
      for (const kind of kinds) {
        const { data: plans } = await supabase
          .from(kind.table)
          .select("id, name, student_id, student:profiles!student_id(full_name, push_token)")
          .eq("is_active", true)
          .gte("ends_at", date + "T00:00:00")
          .lte("ends_at", date + "T23:59:59");

        for (const plan of (plans ?? []) as PlanRow[]) {
          if (!plan.student_id) continue;
          if (!(await consumeRateLimit(supabase, `plan-expiring:${kind.table}:${plan.id}:${days}`, 1, ONCE_WINDOW_S))) continue;

          rows.push({
            user_id: plan.student_id,
            type: "plan_expiring",
            title: `${kind.label} expira em ${when}`,
            body: `Seu ${kind.noun} "${plan.name}" expira em breve.`,
            data: { screen: kind.screen },
            is_pushed: true,
          });

          const student = plan.student as { full_name: string; push_token: string | null } | null;
          if (!student?.push_token) continue;
          pushes.push({
            to: student.push_token,
            title: `${kind.label} expira em ${when}!`,
            body: `Seu ${kind.noun} "${plan.name}" expira em breve. Fale com seu profissional.`,
            data: { type: "plan_expiring", screen: kind.screen },
            sound: "default",
          });
        }
      }
    }

    if (rows.length) await supabase.from("notifications").insert(rows);
    const push = await sendExpoPush(supabase, pushes);

    return new Response(JSON.stringify({ notified: rows.length, sent: push.accepted, failed: push.failed, removed_tokens: push.removedTokens }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`plan-expiring failed: ${String(error)}`);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
