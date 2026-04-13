// Supabase Edge Function: whatsapp-reminder
// Sends WhatsApp via Evolution API v1.8.x (correct textMessage format)
// Env vars: EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface WhatsAppPayload {
  user_id: string;
  template: "checkin_reminder" | "daily_workout" | "plan_expiring" | "smart_nudge" | "welcome";
  params?: Record<string, string>;
}

function formatPhone(phone: string): string {
  let c = phone.replace(/\D/g, "");
  if (!c.startsWith("55")) c = "55" + c;
  return c;
}

async function sendText(url: string, key: string, instance: string, phone: string, text: string): Promise<boolean> {
  try {
    const res = await fetch(`${url}/message/sendText/${instance}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key },
      body: JSON.stringify({
        number: phone,
        textMessage: { text },
        options: { delay: 1200, presence: "composing" },
      }),
    });
    const data = await res.json();
    return !!data.key;
  } catch { return false; }
}

Deno.serve(async (req) => {
  try {
    const payload: WhatsAppPayload = await req.json();
    const evoUrl = Deno.env.get("EVOLUTION_API_URL");
    const evoKey = Deno.env.get("EVOLUTION_API_KEY");
    const evoInstance = Deno.env.get("EVOLUTION_INSTANCE") ?? "academia-app";

    if (!evoUrl || !evoKey) {
      return new Response(JSON.stringify({ sent: false, reason: "not_configured" }), { headers: { "Content-Type": "application/json" } });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: profile } = await supabase
      .from("profiles")
      .select("whatsapp_number, whatsapp_opt_in, full_name")
      .eq("id", payload.user_id)
      .single();

    if (!profile?.whatsapp_number || !profile.whatsapp_opt_in) {
      return new Response(JSON.stringify({ sent: false, reason: "no_opt_in" }), { headers: { "Content-Type": "application/json" } });
    }

    const phone = formatPhone(profile.whatsapp_number);
    const name = profile.full_name?.split(" ")[0] ?? "Atleta";

    const templates: Record<string, string> = {
      welcome: `Oi ${name}! 👋\n\nBem-vindo ao Academia App! Aqui voce vai receber lembretes de treino, check-ins e novidades.\n\n💪 Bora comecar!`,
      checkin_reminder: `Oi ${name}! 📋\n\nSeu check-in esta pendente. Responda pelo app para seu personal acompanhar seu progresso.\n\n👉 Acesse o app agora!`,
      daily_workout: `Bom dia ${name}! 💪\n\nVoce tem treino programado para hoje. Bora comecar?\n\n🏋️ Abra o app e veja seu treino!`,
      plan_expiring: `${name}, atencao! ⚠️\n\nSeu plano ${payload.params?.planName ? `"${payload.params.planName}" ` : ""}expira em breve!\n\nConverse com seu personal para renovar.`,
      smart_nudge: `${name}, sentimos sua falta! 🔥\n\n${payload.params?.message ?? "Ja faz alguns dias desde seu ultimo treino. Que tal voltar hoje?"}\n\n💪 Bora manter o foco!`,
    };

    const text = templates[payload.template];
    if (!text) {
      return new Response(JSON.stringify({ sent: false, reason: "unknown_template" }), { headers: { "Content-Type": "application/json" } });
    }

    // Send with 1 retry
    let sent = await sendText(evoUrl, evoKey, evoInstance, phone, text);
    if (!sent) sent = await sendText(evoUrl, evoKey, evoInstance, phone, text);

    await supabase.from("notifications").insert({
      user_id: payload.user_id,
      type: `whatsapp_${payload.template}`,
      title: "WhatsApp",
      body: text.substring(0, 100),
      data: { channel: "whatsapp", template: payload.template, sent },
      is_pushed: sent,
    });

    return new Response(JSON.stringify({ sent }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
