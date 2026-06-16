-- Expansão do banco de alimentos com catálogo treino.io (TACO + TBCA + TBCA 7.2 + Tucunduva)
-- Aplicado manualmente em prod (16/jun): 3794 alimentos novos → total 4220

-- Tornar macros nullable (alimentos sem dados nutricionais ficam visíveis mas marcados)
ALTER TABLE foods
  ALTER COLUMN kcal_100g      DROP NOT NULL,
  ALTER COLUMN protein_g_100g DROP NOT NULL,
  ALTER COLUMN carbs_g_100g   DROP NOT NULL,
  ALTER COLUMN fat_g_100g     DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS has_macros BOOLEAN NOT NULL DEFAULT TRUE;

-- Índice único em name (case-insensitive) para ON CONFLICT
CREATE UNIQUE INDEX IF NOT EXISTS foods_name_unique ON foods (LOWER(name));

-- Atualizar constraint source para aceitar bases brasileiras
ALTER TABLE foods DROP CONSTRAINT IF EXISTS foods_source_check;
ALTER TABLE foods ADD CONSTRAINT foods_source_check
  CHECK (source IN ('taco','off','tbca','tbca72','tucunduva','manual'));

-- Marcar alimentos existentes com macros reais
UPDATE foods SET has_macros = TRUE WHERE kcal_100g IS NOT NULL;

-- Os 3794 novos alimentos foram inseridos via script (alimentos_treino_io.csv)
-- com has_macros=FALSE e macros NULL (enriquecidos via food-lookup on-demand)
