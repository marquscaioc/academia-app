// Supabase Edge Function: push-notification
// Sends an Expo push + stores a notification row for a target user.
//
// Authorization (fixes IDOR — previously any caller could target any user_id):
//  - service-role caller (cron, DB webhooks, other functions): always allowed
//  - end user: may only target THEMSELVES, unless they are an admin, or a trainer
//    with an active trainer_students link to the target student.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

interface PushPayload {
  user_id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { user_id, title, body, data }: PushPayload = await req.json();
    if (!user_id || !title) return json({ error: "missing_fields" }, 400);

    // --- Authorization ---
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "").trim();
    const isService = jwt.length > 0 && jwt === SERVICE_KEY;

    if (!isService) {
      const { data: auth } = await admin.auth.getUser(jwt);
      const caller = auth?.user;
      if (!caller) return json({ error: "unauthorized" }, 401);

      if (caller.id !== user_id) {
        const { data: callerProfile } = await admin
          .from("profiles")
          .select("role")
          .eq("id", caller.id)
          .single();

        let allowed = callerProfile?.role === "admin";
        if (!allowed && callerProfile?.role === "trainer") {
          const { data: link } = await admin
            .from("trainer_students")
            .select("id")
            .eq("trainer_id", caller.id)
            .eq("student_id", user_id)
            .eq("status", "active")
            .maybeSingle();
          allowed = !!link;
        }
        if (!allowed) return json({ error: "forbidden" }, 403);
      }
    }

    // --- Send ---
    const { data: profile } = await admin
      .from("profiles")
      .select("push_token")
      .eq("id", user_id)
      .single();

    if (!profile?.push_token) return json({ sent: false, reason: "no_token" });

    await admin.from("notifications").insert({
      user_id,
      type: (data?.type as string) ?? "default",
      title,
      body,
      data,
      is_pushed: true,
    });

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
    return json({ sent: true, result });
  } catch (error) {
    return json({ error: String(error) }, 500);
  }
});
