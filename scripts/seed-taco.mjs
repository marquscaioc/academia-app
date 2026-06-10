// scripts/seed-taco.mjs
// Seeds the public.foods table with ~597 items from the Brazilian TACO table
// (Tabela Brasileira de Composição de Alimentos, 4ª edição)
// Source: https://github.com/isaquetdiniz/taco-api/blob/main/references/TACO_formatted.json
//
// Usage:
//   export SUPABASE_PROJECT_REF=<ref>
//   export SUPABASE_ACCESS_TOKEN=<token>
//   node scripts/seed-taco.mjs

import { readFileSync } from "node:fs";

const REF = process.env.SUPABASE_PROJECT_REF;
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!REF || !TOKEN) {
  console.error(
    "Faltam variáveis de ambiente: SUPABASE_PROJECT_REF e SUPABASE_ACCESS_TOKEN"
  );
  process.exit(1);
}

// JSON shape (flat, per-100g values):
//   id, description, category,
//   energy_kcal, protein_g, carbohydrate_g, lipid_g,
//   fiber_g, sodium_mg
// Some numeric fields may be "NA", "*", or "" — treat those as null.
const raw = JSON.parse(readFileSync("scripts/data/taco.json", "utf8"));

const num = (v) => {
  if (v == null || v === "" || v === "NA" || v === "*" || v === "Tr") return null;
  const n = parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

const rows = raw
  .map((r) => ({
    name: r.description ?? r.nome ?? r.name,
    category: r.category ?? r.categoria ?? r.grupo ?? null,
    source_ref: String(r.id ?? r.codigo ?? r.numero),
    kcal_100g: num(r.energy_kcal ?? r.energia ?? r.kcal) ?? 0,
    protein_g_100g: num(r.protein_g ?? r.protein ?? r.proteina) ?? 0,
    carbs_g_100g: num(r.carbohydrate_g ?? r.carbohydrate ?? r.carboidrato ?? r.carbo) ?? 0,
    fat_g_100g: num(r.lipid_g ?? r.lipid ?? r.lipideos ?? r.gordura) ?? 0,
    fiber_g_100g: num(r.fiber_g ?? r.fiber ?? r.fibra),
    sodium_mg_100g: num(r.sodium_mg ?? r.sodium ?? r.sodio),
  }))
  .filter((r) => r.name && r.source_ref);

console.log(`Normalised ${rows.length} rows from TACO JSON`);

const esc = (v) =>
  v == null ? "null" : `'${String(v).replace(/'/g, "''")}'`;

const values = rows.map(
  (r) =>
    `(${esc(r.name)},${esc(r.category)},'taco',${esc(r.source_ref)},${r.kcal_100g},${r.protein_g_100g},${r.carbs_g_100g},${r.fat_g_100g},${r.fiber_g_100g ?? "null"},${r.sodium_mg_100g ?? "null"})`
);

async function run(query) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );
  const j = await res.json();
  if (!res.ok || j.error) throw new Error(JSON.stringify(j));
  return j;
}

const CHUNK = 200;
for (let i = 0; i < values.length; i += CHUNK) {
  const chunk = values.slice(i, i + CHUNK);
  await run(
    `insert into public.foods (name,category,source,source_ref,kcal_100g,protein_g_100g,carbs_g_100g,fat_g_100g,fiber_g_100g,sodium_mg_100g)
     values ${chunk.join(",")}
     on conflict (source,source_ref) where source_ref is not null
     do update set
       name=excluded.name,
       category=excluded.category,
       kcal_100g=excluded.kcal_100g,
       protein_g_100g=excluded.protein_g_100g,
       carbs_g_100g=excluded.carbs_g_100g,
       fat_g_100g=excluded.fat_g_100g,
       fiber_g_100g=excluded.fiber_g_100g,
       sodium_mg_100g=excluded.sodium_mg_100g;`
  );
  console.log(`upsert ${Math.min(i + CHUNK, values.length)}/${values.length}`);
}

console.log("TACO seed OK");
