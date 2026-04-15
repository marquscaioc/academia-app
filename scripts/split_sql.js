const fs = require("fs");
const path = require("path");

const MIGRATIONS_DIR = "supabase/migrations";
const OUT_DIR = "supabase/setup";

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Clean old setup files
fs.readdirSync(OUT_DIR).forEach((f) => fs.unlinkSync(path.join(OUT_DIR, f)));

const banner = (title) => `

-- ========================================================================
-- ${title}
-- ========================================================================

`;

const header = (n, total, name) => `-- =============================================================================
-- ACADEMIA APP - PARTE ${n}/${total}: ${name}
-- =============================================================================
-- Cole no SQL Editor do Supabase e clique em RUN.
-- Idempotente (use IF NOT EXISTS / ON CONFLICT).
-- =============================================================================

`;

const TOTAL = 12;
const files = [];

// === PARTE 1: Schema base (migrations 00001-00004) ===
{
  let content = header(1, TOTAL, "Schema base + RLS Fase 1+2");
  ["00001_initial_schema.sql", "00002_rls_policies.sql", "00003_phase2_diet_challenges_social.sql", "00004_phase2_rls_policies.sql"].forEach((m) => {
    content += banner(m);
    content += fs.readFileSync(path.join(MIGRATIONS_DIR, m), "utf8") + "\n";
  });
  files.push(["01_schema_base.sql", content]);
}

// === PARTE 2: Migrations Fase 3+4 (00005-00008) ===
{
  let content = header(2, TOTAL, "Chat, Financeiro, Convites, Grupos, Desafios em equipe");
  ["00005_phase3_chat_financial.sql", "00006_phase4_invites_notifications.sql", "00007_groups_storage_buckets.sql", "00008_challenge_teams_poses.sql"].forEach((m) => {
    content += banner(m);
    content += fs.readFileSync(path.join(MIGRATIONS_DIR, m), "utf8") + "\n";
  });
  files.push(["02_phase3_phase4.sql", content]);
}

// === PARTE 3: Migrations Sprint 41-45 + audit (00009-00014) ===
{
  let content = header(3, TOTAL, "Sprints adicionais + auditoria");
  ["00009_sprint41_training_progress.sql", "00010_sprint42_checkin_scoring.sql", "00011_sprint43_challenges_advanced.sql", "00012_sprint44_community.sql", "00013_sprint45_integrations.sql", "00014_audit_fixes_indexes.sql"].forEach((m) => {
    content += banner(m);
    content += fs.readFileSync(path.join(MIGRATIONS_DIR, m), "utf8") + "\n";
  });
  files.push(["03_sprints_audit.sql", content]);
}

// === PARTE 4: Lookup data (muscle groups, equipment, achievements) ===
{
  let content = header(4, TOTAL, "Dados iniciais (grupos musculares + equipamentos + achievements)");
  content += fs.readFileSync("supabase/seed.sql", "utf8") + "\n";
  files.push(["04_lookups.sql", content]);
}

// === PARTES 5-8: Exercícios (873 divididos em ~220 cada) ===
{
  const exSql = fs.readFileSync("supabase/exercises_seed.sql", "utf8");
  const lines = exSql.split("\n");
  const setupLines = lines.slice(0, 9); // header + DELETE statements
  const inserts = [];
  let buf = [];
  for (const line of lines.slice(9)) {
    buf.push(line);
    if (line.trim() === ");") {
      inserts.push(buf.join("\n"));
      buf = [];
    }
  }

  const chunkSize = 220;
  const chunks = [];
  for (let i = 0; i < inserts.length; i += chunkSize) chunks.push(inserts.slice(i, i + chunkSize));

  chunks.forEach((c, idx) => {
    const partNum = 5 + idx;
    let content = header(partNum, TOTAL, `Exercícios ${idx * chunkSize + 1}-${Math.min((idx + 1) * chunkSize, 873)} de 873`);
    if (idx === 0) {
      content += setupLines.join("\n") + "\n";
    }
    content += c.join("\n") + "\n";
    files.push([`0${partNum}_exercises_${idx + 1}.sql`, content]);
  });
}

// === PARTES 9-12: Imagens dos exercícios (873 UPDATEs divididos em ~220) ===
{
  const imgSql = fs.readFileSync(path.join(MIGRATIONS_DIR, "00015_exercise_images.sql"), "utf8");
  const updates = imgSql.split("\n").filter((l) => l.startsWith("UPDATE"));
  const chunkSize = 220;
  const chunks = [];
  for (let i = 0; i < updates.length; i += chunkSize) chunks.push(updates.slice(i, i + chunkSize));

  chunks.forEach((c, idx) => {
    const partNum = 9 + idx;
    let content = header(partNum, TOTAL, `Imagens ${idx * chunkSize + 1}-${Math.min((idx + 1) * chunkSize, 873)} de 873 (animação GIF)`);
    content += c.join("\n") + "\n";
    files.push([`${String(partNum).padStart(2, "0")}_images_${idx + 1}.sql`, content]);
  });
}

// Write all
files.forEach(([name, content]) => {
  fs.writeFileSync(path.join(OUT_DIR, name), content);
  const kb = (fs.statSync(path.join(OUT_DIR, name)).size / 1024).toFixed(0);
  console.log(`  ${name.padEnd(28)} ${kb.padStart(4)} KB`);
});

console.log(`\n${files.length} arquivos em supabase/setup/`);
console.log("\n📋 Cole um por vez no SQL Editor, na ordem.");
