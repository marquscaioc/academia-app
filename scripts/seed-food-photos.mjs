// scripts/seed-food-photos.mjs
// Fase 2 dos Alimentos: da foto REAL aos alimentos TACO (que so tinham placeholder
// por categoria). Fonte GRATUITA: imagem principal do artigo da Wikipedia PT
// (REST `page/summary`), buscada pelo termo principal do nome. Agrupa por termo
// (1 busca por familia de alimento) e grava em public.foods.image_url.
// Idempotente: so toca em quem esta sem image_url.
//
// Licenca: imagens vem do Wikimedia Commons (CC/Dominio Publico); algumas exigem
// atribuicao por-imagem -> revisar antes de uso comercial amplo. Filtra SVG/diagramas
// e usa so a imagem de artigos "standard" (ignora desambiguacao).
//
// Uso:
//   SUPABASE_PROJECT_REF=xxxx SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/seed-food-photos.mjs
import process from "node:process";

const REF = process.env.SUPABASE_PROJECT_REF;
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
if (!REF || !TOKEN) {
  console.error("Faltam SUPABASE_PROJECT_REF / SUPABASE_ACCESS_TOKEN no ambiente.");
  process.exit(1);
}
const UA = "ProjetoGaab-food-photos/1.0 (https://projetogaab.app; contato@projetogaab.app)";

async function sql(query) {
  const r = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const j = await r.json();
  if (!r.ok || (j && j.error)) throw new Error(JSON.stringify(j));
  return j;
}

const esc = (s) => `'${String(s).replace(/'/g, "''")}'`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// termo de busca: primeiro token antes da virgula, sem parenteses.
const term = (name) => String(name).split(",")[0].replace(/\(.*?\)/g, "").trim();

// imagem principal do artigo da Wikipedia PT para o termo (jpg/png, sem svg).
async function wikiImage(t) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let r;
    try {
      r = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`, {
        headers: { "User-Agent": UA, accept: "application/json" },
      });
    } catch {
      await sleep(1500);
      continue;
    }
    if (r.status === 429) { await sleep(2500); continue; }
    if (r.status === 404) return null;
    if (!r.ok) return null;
    const j = await r.json();
    if (j.type !== "standard") return null; // ignora desambiguacao/redirect ruim
    const src = j.thumbnail?.source || j.originalimage?.source;
    if (!src) return null;
    if (/\.svg/i.test(src) || !/\.(jpe?g|png)(\b|\/|$)/i.test(src)) return null; // so fotos
    return src.replace(/\/\d+px-/, "/500px-"); // bump thumb -> 500px
  }
  return null;
}

const rows = await sql(
  "select id, name from public.foods where source='taco' and (image_url is null or image_url='') order by name",
);
console.log(`TACO sem foto: ${rows.length}`);

const byTerm = new Map();
for (const f of rows) {
  const t = term(f.name).toLowerCase();
  if (t.length < 2) continue;
  if (!byTerm.has(t)) byTerm.set(t, []);
  byTerm.get(t).push(f.id);
}
console.log(`termos unicos: ${byTerm.size}`);

let n = 0, hit = 0, miss = 0;
for (const [t, ids] of byTerm) {
  let img = null;
  try { img = await wikiImage(t); } catch { img = null; }
  await sleep(350); // gentil com a API da Wikipedia (evita 429)
  if (img) {
    await sql(`update public.foods set image_url=${esc(img)} where id in (${ids.map(esc).join(",")})`);
    hit += ids.length;
  } else {
    miss += ids.length;
  }
  if (++n % 25 === 0) console.log(`${n}/${byTerm.size} termos | ${hit} com foto | ${miss} sem match`);
}
console.log(`FIM: ${hit} alimentos com foto, ${miss} sem match (mantem placeholder).`);
