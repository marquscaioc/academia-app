// Supabase Edge Function: smart-nudge
// Scheduled daily at 10am
// Sends one push when a student reaches 3, 5 and 7 days without training (once per milestone).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { requireServiceRole } from "../_shared/auth.ts";
import { type ExpoMessage, sendExpoPush } from "../_shared/expoPush.ts";
import { consumeRateLimit } from "../_shared/rateLimit.ts";

const messages = [
  { days: 3, title: "Sentimos sua falta! 💪", body: (name: string) => `${name}, já faz 3 dias desde seu último treino. Que tal uma sessão leve hoje?` },
  { days: 5, title: "Bora voltar? 🏋️", body: (name: string) => `${name}, 5 dias sem treinar! Seu progresso agradece cada sessão. Vamos lá!` },
  { days: 7, title: "Não desista! 🔥", body: (name: string) => `${name}, já faz 1 semana! Lembre-se: consistência vence intensidade. Um treino hoje faz toda a diferença.` },
];

// Guards a second run on the same (UTC) day; on other days daysSince no longer matches the milestone.
// consume_rate_limit (00039) purges windows older than a day, so longer windows would not stick.
const ONCE_WINDOW_S = 24 * 60 * 60;

Deno.serve(async (req) => {
  const denied = requireServiceRole(req);
  if (denied) return denied;
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: students } = await supabase
      .from("profiles")
      .select("id, full_name, push_token, last_workout_date")
      .eq("role", "student")
      .eq("is_active", true)
      .not("push_token", "is", null);

    const pushes: ExpoMessage[] = [];
    const rows: Record<string, unknown>[] = [];
    const today = new Date();

    for (const student of students ?? []) {
      if (!student.last_workout_date) continue;

      const lastDate = new Date(student.last_workout_date);
      const daysSince = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      // Only on the milestone day itself; the key also guards against a second run that day.
      const msg = messages.find((m) => m.days === daysSince);
      if (!msg) continue;
      if (!(await consumeRateLimit(supabase, `smart-nudge:${student.id}:${student.last_workout_date}:${msg.days}`, 1, ONCE_WINDOW_S))) continue;

      const firstName = student.full_name?.split(" ")[0] || "Atleta";
      pushes.push({
        to: student.push_token,
        title: msg.title,
        body: msg.body(firstName),
        data: { type: "smart_nudge", screen: "home" },
        sound: "default",
      });
      rows.push({
        user_id: student.id,
        type: "smart_nudge",
        title: msg.title,
        body: msg.body(firstName),
        is_pushed: true,
      });
    }

    if (rows.length) await supabase.from("notifications").insert(rows);
    const push = await sendExpoPush(supabase, pushes);

    return new Response(JSON.stringify({ sent: push.accepted, failed: push.failed, removed_tokens: push.removedTokens }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`smart-nudge failed: ${String(error)}`);
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
