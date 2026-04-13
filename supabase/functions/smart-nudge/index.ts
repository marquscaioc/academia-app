// Supabase Edge Function: smart-nudge
// Scheduled daily at 10am
// Sends personalized push to students who haven't trained in 3+ days

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

const messages = [
  { days: 3, title: "Sentimos sua falta! 💪", body: (name: string) => `${name}, ja faz 3 dias desde seu ultimo treino. Que tal uma sessao leve hoje?` },
  { days: 5, title: "Bora voltar? 🏋️", body: (name: string) => `${name}, 5 dias sem treinar! Seu progresso agradece cada sessao. Vamos la!` },
  { days: 7, title: "Nao desista! 🔥", body: (name: string) => `${name}, ja faz 1 semana! Lembre-se: consistencia vence intensidade. Um treino hoje faz toda a diferenca.` },
];

Deno.serve(async (_req) => {
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

    let sentCount = 0;
    const today = new Date();

    for (const student of students ?? []) {
      if (!student.last_workout_date) continue;

      const lastDate = new Date(student.last_workout_date);
      const daysSince = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      // Find the appropriate message
      const msg = messages.filter((m) => daysSince >= m.days).pop();
      if (!msg) continue;

      // Only send once per threshold (avoid daily spam)
      if (daysSince !== msg.days && daysSince !== msg.days + 1) continue;

      await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: student.push_token,
          title: msg.title,
          body: msg.body(student.full_name?.split(" ")[0] ?? "Atleta"),
          data: { type: "smart_nudge", screen: "home" },
          sound: "default",
        }),
      });

      await supabase.from("notifications").insert({
        user_id: student.id,
        type: "smart_nudge",
        title: msg.title,
        body: msg.body(student.full_name ?? "Atleta"),
        is_pushed: true,
      });

      // WhatsApp
      await supabase.functions.invoke("whatsapp-reminder", {
        body: { user_id: student.id, template: "smart_nudge", params: { message: msg.body(student.full_name?.split(" ")[0] ?? "Atleta") } },
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
