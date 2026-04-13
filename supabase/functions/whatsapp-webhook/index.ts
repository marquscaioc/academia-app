// Supabase Edge Function: whatsapp-webhook
// Receives webhook events from Evolution API v1.8.x
// Handles: incoming messages, connection status changes

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface WebhookPayload {
  event: string;
  instance: string;
  data: Record<string, unknown>;
}

Deno.serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    switch (payload.event) {
      case "messages.upsert": {
        const data = payload.data as {
          key: { remoteJid: string; fromMe: boolean; id: string };
          message?: { conversation?: string; extendedTextMessage?: { text?: string } };
          pushName?: string;
          messageTimestamp?: string;
        };

        // Ignore messages sent by us
        if (data.key.fromMe) break;

        const phone = data.key.remoteJid?.replace("@s.whatsapp.net", "") ?? "";
        const text = data.message?.conversation ?? data.message?.extendedTextMessage?.text ?? "";
        const senderName = data.pushName ?? "Desconhecido";

        if (!phone || !text) break;

        // Find the student by whatsapp number
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, full_name")
          .or(`whatsapp_number.eq.${phone},whatsapp_number.eq.${phone.replace("55", "")}`)
          .limit(1)
          .maybeSingle();

        if (!profile) {
          // Unknown number — log it
          await supabase.from("notifications").insert({
            user_id: null as unknown as string,
            type: "whatsapp_incoming_unknown",
            title: `WhatsApp de ${senderName}`,
            body: text.substring(0, 200),
            data: { phone, senderName, raw: data },
          });
          break;
        }

        // Find the trainer for this student
        const { data: relation } = await supabase
          .from("trainer_students")
          .select("trainer_id")
          .eq("student_id", profile.id)
          .eq("status", "active")
          .limit(1)
          .maybeSingle();

        if (relation) {
          // Find or create DM conversation
          const { data: existingConv } = await supabase
            .from("conversation_members")
            .select("conversation_id")
            .eq("user_id", profile.id)
            .limit(10);

          let conversationId: string | null = null;

          if (existingConv) {
            for (const cm of existingConv) {
              const { data: otherMember } = await supabase
                .from("conversation_members")
                .select("user_id")
                .eq("conversation_id", cm.conversation_id)
                .eq("user_id", relation.trainer_id)
                .maybeSingle();
              if (otherMember) { conversationId = cm.conversation_id; break; }
            }
          }

          if (conversationId) {
            // Insert message into chat
            await supabase.from("messages").insert({
              conversation_id: conversationId,
              sender_id: profile.id,
              content: `[WhatsApp] ${text}`,
              message_type: "text",
            });
          }

          // Notify trainer
          await supabase.functions.invoke("push-notification", {
            body: {
              user_id: relation.trainer_id,
              title: `${profile.full_name} via WhatsApp`,
              body: text.substring(0, 100),
              data: { type: "whatsapp_incoming", student_id: profile.id },
            },
          });
        }
        break;
      }

      case "connection.update": {
        const state = (payload.data as { state?: string }).state;
        // Could log connection changes or notify admin
        console.log(`WhatsApp connection: ${state}`);
        break;
      }

      default:
        break;
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
