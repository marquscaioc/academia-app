// supabase/functions/food-lookup/index.ts
// Food search (Open Food Facts + local cache). Deployed with --no-verify-jwt (query-string API), so the
// caller's session is verified here: anonymous / anon-key calls are rejected, inputs are validated and
// each user is rate limited (it calls a third-party API and writes the shared `foods` cache).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { consumeRateLimit, tooManyRequests } from "../_shared/rateLimit.ts";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};
const JSON_HEADERS = { ...CORS, "Content-Type": "application/json" };
const LIMIT = 30; // lookups per user per minute
const WINDOW_S = 60;
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
const OFF = "https://world.openfoodfacts.org";
const OFF_HEADERS = {
  headers: {
    "User-Agent": "ProjetoGaab/1.0 (food-lookup edge function; contact rafaelfratazzi@gmail.com)",
    "Accept": "application/json",
    "From": "rafaelfratazzi@gmail.com",
  },
};
function macros(n: Record<string, unknown>) {
  const g = (k: string) => { const v = Number(n?.[k]); return Number.isFinite(v) ? v : null; };
  return {
    kcal_100g: g("energy-kcal_100g") ?? 0, protein_g_100g: g("proteins_100g") ?? 0,
    carbs_g_100g: g("carbohydrates_100g") ?? 0, fat_g_100g: g("fat_100g") ?? 0,
    fiber_g_100g: g("fiber_100g"),
    sodium_mg_100g: (() => { const s = g("sodium_100g"); return s == null ? null : s * 1000; })(),
  };
}
async function offFetch(url: string): Promise<any> {
  const r = await fetch(url, OFF_HEADERS);
  if (!r.ok) throw new Error(`OFF HTTP ${r.status}`);
  const text = await r.text();
  try { return JSON.parse(text); } catch { throw new Error(`OFF non-JSON (${r.status}): ${text.slice(0, 200)}`); }
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const url = new URL(req.url);
    const barcode = url.searchParams.get("barcode")?.trim() || null;
    const q = url.searchParams.get("q")?.trim() || null;
    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
    const { data: auth } = jwt ? await supa.auth.getUser(jwt) : { data: null };
    if (!auth?.user) return reply({ error: "unauthorized" }, 401);
    if (barcode && !/^\d{8,14}$/.test(barcode)) return reply({ error: "barcode inválido" }, 400);
    if (!barcode && q && (q.length < 2 || q.length > 80)) return reply({ error: "busca deve ter de 2 a 80 caracteres" }, 400);
    if (!barcode && !q) return reply({ error: "informe barcode ou q" }, 400);
    if (!(await consumeRateLimit(supa, `food:${auth.user.id}`, LIMIT, WINDOW_S))) return tooManyRequests(WINDOW_S, CORS);
    let products: any[] = [];
    let offError: string | null = null;
    if (barcode) {
      try {
        const j = await offFetch(`${OFF}/api/v2/product/${encodeURIComponent(barcode)}.json?fields=code,product_name,brands,image_url,categories,nutriments`);
        if (j?.product) products = [j.product];
      } catch (e) { offError = String(e); }
    } else if (q) {
      try {
        const j = await offFetch(`${OFF}/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=12&lc=pt&cc=br&fields=code,product_name,brands,image_url,categories,nutriments`);
        products = Array.isArray(j?.products) ? j.products : [];
      } catch (e) { offError = String(e); }
    }
    // Cache OFF results when available
    if (products.length) {
      const rows = products.filter((p) => p.product_name && p.code).map((p) => ({
        name: p.product_name, brand: p.brands ?? null, category: (p.categories ?? "").split(",")[0]?.trim() || null,
        source: "off", source_ref: String(p.code), image_url: p.image_url ?? null, ...macros(p.nutriments ?? {}),
      }));
      if (rows.length) {
        await supa.from("foods").upsert(rows, { onConflict: "source,source_ref" });
        const { data } = await supa.from("foods").select("*").eq("source", "off").in("source_ref", rows.map((r) => r.source_ref));
        return reply({ results: data ?? [], source: "off_live" });
      }
    }
    // Fallback: full-text search in local cache (includes taco + previously cached OFF items)
    if (q) {
      // Escape LIKE wildcards so the user's text is matched literally.
      const pattern = q.replace(/[\\%_]/g, (c) => "\\" + c);
      const { data } = await supa.from("foods").select("*").ilike("name", `%${pattern}%`).limit(20);
      return reply({ results: data ?? [], source: offError ? "cache_fallback" : "cache", off_error: offError ?? undefined });
    }
    // Barcode miss
    return reply({ results: [], off_error: offError ?? undefined });
  } catch (e) { return reply({ error: String(e) }, 500); }
});
