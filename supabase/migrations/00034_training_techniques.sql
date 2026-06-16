-- Training techniques: platform defaults + custom per trainer
CREATE TABLE IF NOT EXISTS training_techniques (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  color       TEXT NOT NULL DEFAULT '#9B40D8',
  created_by  UUID REFERENCES profiles(id) ON DELETE CASCADE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NULL created_by = platform default (visible to everyone)
ALTER TABLE training_techniques ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View platform and own techniques"
  ON training_techniques FOR SELECT
  USING (created_by IS NULL OR created_by = auth.uid());

CREATE POLICY "Trainers create own techniques"
  ON training_techniques FOR INSERT
  WITH CHECK (auth.uid() = created_by AND auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('trainer','admin')
  ));

CREATE POLICY "Trainers update own techniques"
  ON training_techniques FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Trainers delete own techniques"
  ON training_techniques FOR DELETE
  USING (created_by = auth.uid());

-- Add technique_id to workout_exercises (optional FK)
ALTER TABLE workout_exercises
  ADD COLUMN IF NOT EXISTS technique_id UUID REFERENCES training_techniques(id) ON DELETE SET NULL;

-- Seed: 10 platform-default techniques (created_by = NULL)
INSERT INTO training_techniques (name, description, color, created_by) VALUES
  ('Drop Set',              'Reduz a carga imediatamente após a falha para continuar a série sem descanso.',        '#EF4444', NULL),
  ('Rest-Pause',            'Pequenas pausas (10-20s) dentro da série para acumular mais volume com alta carga.',   '#8B5CF6', NULL),
  ('Repetições Forçadas',   'Com auxílio do parceiro, realiza reps além da falha concêntrica.',                     '#F97316', NULL),
  ('Negativas',             'Fase excêntrica lenta e controlada (4-6s), maximizando o dano muscular.',              '#3B82F6', NULL),
  ('Pré-exaustão',          'Isola o músculo-alvo antes do movimento composto para garantir fadiga localizada.',    '#EAB308', NULL),
  ('Pausa Ativa',           'Substitui o descanso passivo por movimento leve para manter o fluxo do treino.',       '#22C55E', NULL),
  ('Treino Pirâmide',       'Aumenta (ou diminui) progressivamente a carga a cada série, variando as reps.',        '#A855F7', NULL),
  ('Alongamento Intra-série','Pausa breve com alongamento do músculo trabalhado antes de continuar a série.',        '#14B8A6', NULL),
  ('Cluster Set',           'Divide uma série em mini-séries com micro-pausas de 15-30s entre elas.',               '#EC4899', NULL),
  ('Back Off Set',          'Última série com carga reduzida (~50-60%) para volume adicional com boa execução.',    '#6B7280', NULL)
ON CONFLICT DO NOTHING;
