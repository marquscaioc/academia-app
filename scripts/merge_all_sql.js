const fs = require("fs");
const path = require("path");

const MIGRATIONS_DIR = "supabase/migrations";

const banner = (title) => `

-- ========================================================================
-- ${title}
-- ========================================================================

`;

const baseHeader = `-- =============================================================================
-- ACADEMIA APP - SETUP COMPLETO DO BANCO DE DADOS
-- =============================================================================
-- Cole tudo isso no SQL Editor do Supabase e clique em RUN.
-- Idempotente: pode rodar várias vezes sem erros (usa IF NOT EXISTS).
-- =============================================================================
`;

// === FILE 1: Schema only (core + lookup + exercises, NO images) ===
let core = baseHeader + "-- ESTA VERSÃO: schema + 873 exercícios (sem imagens)\n";

const migrations = fs.readdirSync(MIGRATIONS_DIR).sort();
for (const m of migrations) {
  // Skip migration 00015 (image updates) - included separately
  if (m === "00015_exercise_images.sql") continue;
  core += banner(`MIGRATION: ${m}`);
  core += fs.readFileSync(path.join(MIGRATIONS_DIR, m), "utf8");
  core += "\n";
}

core += banner("LOOKUP DATA: muscle groups + equipment + achievements");
core += fs.readFileSync("supabase/seed.sql", "utf8");
core += "\n";

core += banner("EXERCISE DATABASE: 873 exercises (sem imagens)");
core += fs.readFileSync("supabase/exercises_seed.sql", "utf8");
core += "\n";

fs.writeFileSync("supabase/SETUP_CORE.sql", core);
const coreMB = (fs.statSync("supabase/SETUP_CORE.sql").size / 1024 / 1024).toFixed(2);
console.log(`✓ supabase/SETUP_CORE.sql (${coreMB} MB) — rodar PRIMEIRO`);

// === FILE 2: Image updates only ===
let images = `-- =============================================================================
-- ACADEMIA APP - IMAGENS DE EXECUÇÃO DOS EXERCÍCIOS (873 GIFs)
-- =============================================================================
-- Rodar APÓS o SETUP_CORE.sql.
-- Adiciona thumbnail + frame de animação para todos os 873 exercícios.
-- =============================================================================

`;
images += fs.readFileSync(path.join(MIGRATIONS_DIR, "00015_exercise_images.sql"), "utf8");

fs.writeFileSync("supabase/SETUP_IMAGES.sql", images);
const imagesMB = (fs.statSync("supabase/SETUP_IMAGES.sql").size / 1024 / 1024).toFixed(2);
console.log(`✓ supabase/SETUP_IMAGES.sql (${imagesMB} MB) — rodar SEGUNDO`);

// === FILE 3: Mega all-in-one ===
let mega = baseHeader + "-- VERSÃO MEGA: tudo em um único arquivo\n";
for (const m of migrations) {
  mega += banner(`MIGRATION: ${m}`);
  mega += fs.readFileSync(path.join(MIGRATIONS_DIR, m), "utf8");
  mega += "\n";
}
mega += banner("LOOKUP DATA");
mega += fs.readFileSync("supabase/seed.sql", "utf8");
mega += "\n";
mega += banner("EXERCISE DATABASE: 873 exercises");
mega += fs.readFileSync("supabase/exercises_seed.sql", "utf8");
mega += "\n";

fs.writeFileSync("supabase/COMPLETE_SETUP.sql", mega);
const megaMB = (fs.statSync("supabase/COMPLETE_SETUP.sql").size / 1024 / 1024).toFixed(2);
console.log(`✓ supabase/COMPLETE_SETUP.sql (${megaMB} MB) — tudo em 1 arquivo`);

console.log("\n📋 RECOMENDADO:");
console.log("   1. Cole SETUP_CORE.sql no SQL Editor → Run");
console.log("   2. Cole SETUP_IMAGES.sql no SQL Editor → Run");
console.log("   (ou COMPLETE_SETUP.sql se preferir tudo de uma vez)");
