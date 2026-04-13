// Supabase Edge Function: whatsapp-reminder
// Sends WhatsApp messages via Cloud API
// Called on-demand from auto-checkin or plan-expiring

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface WhatsAppPayload {
  user_id: string;
  template: "checkin_reminder" | "daily_workout" | "plan_expiring";
  params?: Record<string, string>;
}

Deno.serve(async (req) => {
  try {
    const payload: WhatsAppPayload = await req.json();
    const whatsappToken = Deno.env.get("WHATSAPP_TOKEN");
    const whatsappPhoneId = Deno.env.get("WHATSAPP_PHONE_ID");

    if (!whatsappToken || !whatsappPhoneId) {
      return new Response(JSON.stringify({ sent: false, reason: "whatsapp_not_configured" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

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

    // Clean phone number
    const phone = profile.whatsapp_number.replace(/\D/g, "");

    const templateMessages: Record<string, { text: string }> = {
      checkin_reminder: {
        text: `Oi ${profile.full_name?.split(" ")[0]}! Seu check-in esta pendente. Responda pelo app para seu personal acompanhar seu progresso.`,
      },
      daily_workout: {
        text: `Bom dia ${profile.full_name?.split(" ")[0]}! Voce tem treino programado para hoje. Abra o app e bora treinar! 💪`,
      },
      plan_expiring: {
        text: `${profile.full_name?.split(" ")[0]}, seu plano expira em breve! Converse com seu personal para renovar. ${payload.params?.planName ?? ""}`,
      },
    };

    const msg = templateMessages[payload.template];
    if (!msg) {
      return new Response(JSON.stringify({ sent: false, reason: "unknown_template" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Send via WhatsApp Cloud API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${whatsappToken}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone,
          type: "text",
          text: { body: msg.text },
        }),
      },
    );

    const result = await response.json();

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
