// Supabase Edge Function: push-notification
// Trigger via database webhook when workout_plans is inserted
// or manually via supabase.functions.invoke('push-notification', { body: {...} })

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface PushPayload {
  user_id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  try {
    const payload: PushPayload = await req.json();
    const { user_id, title, body, data } = payload;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Get user's push token
    const { data: profile } = await supabase
      .from("profiles")
      .select("push_token")
      .eq("id", user_id)
      .single();

    if (!profile?.push_token) {
      return new Response(JSON.stringify({ sent: false, reason: "no_token" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Save notification to database
    await supabase.from("notifications").insert({
      user_id,
      type: (data?.type as string) ?? "default",
      title,
      body,
      data,
      is_pushed: true,
    });

    // Send push via Expo
    const pushResponse = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: profile.push_token,
        title,
        body,
        data,
        sound: "default",
        priority: "high",
      }),
    });

    const result = await pushResponse.json();

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
