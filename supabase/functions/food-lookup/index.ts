// supabase/functions/food-lookup/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
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
  try {
    const url = new URL(req.url);
    const barcode = url.searchParams.get("barcode"); const q = url.searchParams.get("q");
    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
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
    } else return new Response(JSON.stringify({ error: "informe barcode ou q" }), { status: 400 });
    // Cache OFF results when available
    if (products.length) {
      const rows = products.filter((p) => p.product_name && p.code).map((p) => ({
        name: p.product_name, brand: p.brands ?? null, category: (p.categories ?? "").split(",")[0]?.trim() || null,
        source: "off", source_ref: String(p.code), image_url: p.image_url ?? null, ...macros(p.nutriments ?? {}),
      }));
      if (rows.length) {
        await supa.from("foods").upsert(rows, { onConflict: "source,source_ref" });
        const { data } = await supa.from("foods").select("*").eq("source", "off").in("source_ref", rows.map((r) => r.source_ref));
        return new Response(JSON.stringify({ results: data ?? [], source: "off_live" }), { headers: { "Content-Type": "application/json" } });
      }
    }
    // Fallback: full-text search in local cache (includes taco + previously cached OFF items)
    if (q) {
      const { data } = await supa.from("foods").select("*").ilike("name", `%${q}%`).limit(20);
      return new Response(JSON.stringify({ results: data ?? [], source: offError ? "cache_fallback" : "cache", off_error: offError ?? undefined }), { headers: { "Content-Type": "application/json" } });
    }
    // Barcode miss
    return new Response(JSON.stringify({ results: [], off_error: offError ?? undefined }), { headers: { "Content-Type": "application/json" } });
  } catch (e) { return new Response(JSON.stringify({ error: String(e) }), { status: 500 }); }
});
