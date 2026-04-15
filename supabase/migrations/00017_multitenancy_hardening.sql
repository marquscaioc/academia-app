-- ============================================================
-- Migration 00017: Multi-tenancy hardening
-- ============================================================
-- Adds per-trainer scoping to content currently treated as global:
--   * recipes.trainer_id       (NULL = global, set = trainer-scoped)
--   * challenges.trainer_id    (NULL = global, set = trainer-scoped)
--   * trainer_profiles.whatsapp_instance_name (per-trainer Evolution instance)
--
-- Backward compatible: existing rows keep trainer_id = NULL (visible to all).
-- RLS policies updated to enforce: trainer_id IS NULL OR belongs-to-student's-trainer.
-- ============================================================

-- 1. WhatsApp per-trainer instance name
ALTER TABLE trainer_profiles
  ADD COLUMN IF NOT EXISTS whatsapp_instance_name TEXT;

-- Unique per-instance to avoid two trainers pointing at the same Evolution instance.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_trainer_profiles_whatsapp_instance_name
  ON trainer_profiles (whatsapp_instance_name)
  WHERE whatsapp_instance_name IS NOT NULL;

-- 2. Challenges per-trainer scope
ALTER TABLE challenges
  ADD COLUMN IF NOT EXISTS trainer_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_challenges_trainer_id
  ON challenges (trainer_id)
  WHERE trainer_id IS NOT NULL;

-- 3. Recipes per-trainer scope
ALTER TABLE recipes
  ADD COLUMN IF NOT EXISTS trainer_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_recipes_trainer_id
  ON recipes (trainer_id)
  WHERE trainer_id IS NOT NULL;

-- ============================================================
-- RLS policy updates
-- ============================================================

-- Challenges: user can view if
--   * trainer_id IS NULL (global)     AND is_public
--   * trainer_id = auth.uid()         (own)
--   * created_by = auth.uid()         (own, legacy)
--   * student linked to trainer_id via active trainer_students row
DROP POLICY IF EXISTS "challenges_select_public_or_own" ON challenges;
DROP POLICY IF EXISTS "Users can view public or own challenges" ON challenges;
DROP POLICY IF EXISTS "challenges_select" ON challenges;

CREATE POLICY "challenges_select_tenant_scoped" ON challenges FOR SELECT
  USING (
    (trainer_id IS NULL AND is_public = TRUE)
    OR created_by = auth.uid()
    OR trainer_id = auth.uid()
    OR trainer_id IN (
      SELECT ts.trainer_id FROM trainer_students ts
      WHERE ts.student_id = auth.uid() AND ts.status = 'active'
    )
  );

-- Recipes: same pattern
DROP POLICY IF EXISTS "recipes_select" ON recipes;
DROP POLICY IF EXISTS "recipes_select_public" ON recipes;
DROP POLICY IF EXISTS "Anyone can view public recipes" ON recipes;

CREATE POLICY "recipes_select_tenant_scoped" ON recipes FOR SELECT
  USING (
    (trainer_id IS NULL AND is_public = TRUE)
    OR created_by = auth.uid()
    OR trainer_id = auth.uid()
    OR trainer_id IN (
      SELECT ts.trainer_id FROM trainer_students ts
      WHERE ts.student_id = auth.uid() AND ts.status = 'active'
    )
  );

-- ============================================================
-- Comments for discoverability
-- ============================================================
COMMENT ON COLUMN trainer_profiles.whatsapp_instance_name IS
  'Evolution API instance name for this trainer. Null = trainer has not yet provisioned WhatsApp.';
COMMENT ON COLUMN challenges.trainer_id IS
  'Tenant owner. NULL = global challenge visible to all students (if is_public). Set = only visible to this trainer and their active students.';
COMMENT ON COLUMN recipes.trainer_id IS
  'Tenant owner. NULL = global recipe visible to all students (if is_public). Set = only visible to this trainer and their active students.';
