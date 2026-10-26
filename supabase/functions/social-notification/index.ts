// Supabase Edge Function: social-notification
// Called after a workout is completed
// Notifies followers who opted in

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

interface SocialNotifPayload {
  user_id: string;
  user_name: string;
}

Deno.serve(async (req) => {
  try {
    const payload: SocialNotifPayload = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Get followers with opt-in
    const { data: followers } = await supabase
      .from("user_follows")
      .select("follower_id, follower:profiles!follower_id(push_token, notify_follower_workouts)")
      .eq("following_id", payload.user_id);

    let sentCount = 0;

    for (const f of followers ?? []) {
      const follower = f.follower as unknown as { push_token: string | null; notify_follower_workouts: boolean } | null;
      if (!follower?.push_token || !follower.notify_follower_workouts) continue;

      await fetch(EXPO_PUSH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: follower.push_token,
          title: `${payload.user_name} acabou de treinar! 💪`,
          body: "Bora treinar tambem?",
          data: { type: "social_workout", screen: "social" },
          sound: "default",
        }),
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
