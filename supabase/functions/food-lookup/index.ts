// supabase/functions/food-lookup/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const OFF = "https://br.openfoodfacts.org";
function macros(n: Record<string, unknown>) {
  const g = (k: string) => { const v = Number(n?.[k]); return Number.isFinite(v) ? v : null; };
  return {
    kcal_100g: g("energy-kcal_100g") ?? 0, protein_g_100g: g("proteins_100g") ?? 0,
    carbs_g_100g: g("carbohydrates_100g") ?? 0, fat_g_100g: g("fat_100g") ?? 0,
    fiber_g_100g: g("fiber_100g"),
    sodium_mg_100g: (() => { const s = g("sodium_100g"); return s == null ? null : s * 1000; })(),
  };
}
Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const barcode = url.searchParams.get("barcode"); const q = url.searchParams.get("q");
    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    let products: any[] = [];
    if (barcode) {
      const r = await fetch(`${OFF}/api/v2/product/${encodeURIComponent(barcode)}.json?fields=code,product_name,brands,image_url,categories,nutriments`);
      const j = await r.json(); if (j?.product) products = [j.product];
    } else if (q) {
      const r = await fetch(`${OFF}/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=12&fields=code,product_name,brands,image_url,categories,nutriments`);
      const j = await r.json(); products = Array.isArray(j?.products) ? j.products : [];
    } else return new Response(JSON.stringify({ error: "informe barcode ou q" }), { status: 400 });
    const rows = products.filter((p) => p.product_name && p.code).map((p) => ({
      name: p.product_name, brand: p.brands ?? null, category: (p.categories ?? "").split(",")[0]?.trim() || null,
      source: "off", source_ref: String(p.code), image_url: p.image_url ?? null, ...macros(p.nutriments ?? {}),
    }));
    if (rows.length) await supa.from("foods").upsert(rows, { onConflict: "source,source_ref" });
    const { data } = await supa.from("foods").select("*").eq("source", "off").in("source_ref", rows.map((r) => r.source_ref));
    return new Response(JSON.stringify({ results: data ?? [] }), { headers: { "Content-Type": "application/json" } });
  } catch (e) { return new Response(JSON.stringify({ error: String(e) }), { status: 500 }); }
});
