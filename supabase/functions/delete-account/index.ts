// Supabase Edge Function: delete-account (LGPD self-service account deletion)
// The authenticated caller deletes THEIR OWN account. Removes the auth user
// (cascades profiles + all ON DELETE CASCADE data) plus best-effort storage cleanup.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

// Buckets whose object paths are prefixed with the owner's user id.
const USER_BUCKETS = ["avatars", "feed-media", "exercise-videos", "brand-assets"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
    if (!jwt) return json({ error: "unauthorized" }, 401);

    const { data: auth } = await admin.auth.getUser(jwt);
    const user = auth?.user;
    if (!user) return json({ error: "unauthorized" }, 401);

    // Best-effort storage cleanup (paths are "<userId>/<file>").
    for (const bucket of USER_BUCKETS) {
      try {
        const { data: files } = await admin.storage.from(bucket).list(user.id, { limit: 1000 });
        if (files?.length) {
          await admin.storage.from(bucket).remove(files.map((f) => `${user.id}/${f.name}`));
        }
      } catch (_) {
        // ignore per-bucket failures — DB cascade is the source of truth
      }
    }

    // Delete the auth user → cascades profiles + all dependent rows.
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) return json({ error: error.message }, 500);

    return json({ deleted: true });
  } catch (error) {
    return json({ error: String(error) }, 500);
  }
});
