// Supabase Edge Function: whatsapp-reminder
// Sends WhatsApp messages via Evolution API (self-hosted, free, open source)
// Called on-demand from auto-checkin, plan-expiring, or smart-nudge
//
// Required env vars:
//   EVOLUTION_API_URL  — e.g. https://evolution.seudominio.com
//   EVOLUTION_API_KEY  — API key configured on Evolution API instance
//   EVOLUTION_INSTANCE — instance name (e.g. "academia-app")

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface WhatsAppPayload {
  user_id: string;
  template: "checkin_reminder" | "daily_workout" | "plan_expiring" | "smart_nudge";
  params?: Record<string, string>;
}

Deno.serve(async (req) => {
  try {
    const payload: WhatsAppPayload = await req.json();

    const evolutionUrl = Deno.env.get("EVOLUTION_API_URL");
    const evolutionKey = Deno.env.get("EVOLUTION_API_KEY");
    const evolutionInstance = Deno.env.get("EVOLUTION_INSTANCE") ?? "academia-app";

    if (!evolutionUrl || !evolutionKey) {
      return new Response(JSON.stringify({ sent: false, reason: "evolution_not_configured" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("whatsapp_number, whatsapp_opt_in, full_name")
      .eq("id", payload.user_id)
      .single();

    if (!profile?.whatsapp_number || !profile.whatsapp_opt_in) {
      return new Response(JSON.stringify({ sent: false, reason: "no_opt_in" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Clean phone number — Evolution API expects: 5511999999999
    let phone = profile.whatsapp_number.replace(/\D/g, "");
    if (!phone.startsWith("55")) phone = "55" + phone;

    const firstName = profile.full_name?.split(" ")[0] ?? "Atleta";

    // Template messages
    const templates: Record<string, string> = {
      checkin_reminder: `Oi ${firstName}! 📋\n\nSeu check-in esta pendente. Responda pelo app para seu personal acompanhar seu progresso.\n\n👉 Acesse o app agora!`,
      daily_workout: `Bom dia ${firstName}! 💪\n\nVoce tem treino programado para hoje. Bora comecar?\n\n🏋️ Abra o app e veja seu treino!`,
      plan_expiring: `${firstName}, atencao! ⚠️\n\nSeu plano ${payload.params?.planName ? `"${payload.params.planName}" ` : ""}expira em breve!\n\nConverse com seu personal para renovar e nao perder seu progresso.`,
      smart_nudge: `${firstName}, sentimos sua falta! 🔥\n\n${payload.params?.message ?? "Ja faz alguns dias desde seu ultimo treino. Que tal voltar hoje?"}\n\n💪 Bora manter o foco!`,
    };

    const text = templates[payload.template];
    if (!text) {
      return new Response(JSON.stringify({ sent: false, reason: "unknown_template" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Send via Evolution API
    const response = await fetch(
      `${evolutionUrl}/message/sendText/${evolutionInstance}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: evolutionKey,
        },
        body: JSON.stringify({
          number: phone,
          text: text,
        }),
      },
    );

    const result = await response.json();

    // Log notification in database
    await supabase.from("notifications").insert({
      user_id: payload.user_id,
      type: `whatsapp_${payload.template}`,
      title: "Mensagem WhatsApp enviada",
      body: text.substring(0, 100),
      data: { channel: "whatsapp", template: payload.template },
      is_pushed: true,
    });

    return new Response(JSON.stringify({ sent: true, result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
