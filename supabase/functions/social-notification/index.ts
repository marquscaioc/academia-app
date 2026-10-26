// Supabase Edge Function: social-notification
// Called by the app after a workout is completed. Notifies followers who opted in.
// The actor is ALWAYS the authenticated caller (JWT) — the request body is ignored,
// so nobody can send "X just trained" pushes on behalf of another user.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
    if (!jwt) return json({ error: "unauthorized" }, 401);
    const { data: auth } = await supabase.auth.getUser(jwt);
    const userId = auth?.user?.id;
    if (!userId) return json({ error: "unauthorized" }, 401);

    // Only notify when the caller really finished a workout in the last 10 minutes
    // (prevents using this endpoint as a spam cannon).
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { data: recent } = await supabase
      .from("workout_sessions")
      .select("id")
      .eq("user_id", userId)
      .gte("finished_at", since)
      .limit(1);
    if (!recent?.length) return json({ sent: 0 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, display_name")
      .eq("id", userId)
      .single();
    const name = profile?.display_name || profile?.full_name || "Alguém";

    const { data: followers } = await supabase
      .from("user_follows")
      .select("follower_id, follower:profiles!follower_id(push_token, notify_follower_workouts)")
      .eq("following_id", userId);

    const messages = (followers ?? [])
      .map((f) => f.follower as unknown as { push_token: string | null; notify_follower_workouts: boolean } | null)
      .filter((f) => f?.push_token && f.notify_follower_workouts)
      .map((f) => ({
        to: f!.push_token,
        title: `${name} acabou de treinar! 💪`,
        body: "Bora treinar também?",
        data: { type: "social_workout", screen: "social" },
        sound: "default",
      }));

    // Expo accepts up to 100 messages per request.
    for (let i = 0; i < messages.length; i += 100) {
      await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messages.slice(i, i + 100)),
      });
    }

    return json({ sent: messages.length });
  } catch (error) {
    return json({ error: String(error) }, 500);
  }
});
