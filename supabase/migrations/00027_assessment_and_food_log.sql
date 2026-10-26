-- 00027_assessment_and_food_log.sql
-- #3: avaliacao fisica (dobras cutaneas) + registro alimentar livre + foto da refeicao.
-- Idempotente.

-- ============================================================
-- Avaliacao fisica: dobras cutaneas (mm) em body_measurements
-- ============================================================
ALTER TABLE public.body_measurements
  ADD COLUMN IF NOT EXISTS skinfold_triceps_mm numeric,
  ADD COLUMN IF NOT EXISTS skinfold_subscapular_mm numeric,
  ADD COLUMN IF NOT EXISTS skinfold_suprailiac_mm numeric,
  ADD COLUMN IF NOT EXISTS skinfold_abdominal_mm numeric,
  ADD COLUMN IF NOT EXISTS skinfold_thigh_mm numeric,
  ADD COLUMN IF NOT EXISTS skinfold_chest_mm numeric;

-- ============================================================
-- Foto da refeicao logada (registro alimentar)
-- ============================================================
ALTER TABLE public.meal_logs
  ADD COLUMN IF NOT EXISTS photo_url text;

-- ============================================================
-- Registro alimentar LIVRE (alimentos avulsos, fora do plano prescrito)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.food_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  food_name text NOT NULL,
  quantity numeric,
  unit text,
  calories numeric,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  photo_url text,
  logged_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

-- O aluno gerencia os proprios registros
DROP POLICY IF EXISTS "Users manage own food logs" ON public.food_logs;
CREATE POLICY "Users manage own food logs" ON public.food_logs
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- O trainer ativo do aluno pode ler (monitoramento)
DROP POLICY IF EXISTS "Trainers view student food logs" ON public.food_logs;
CREATE POLICY "Trainers view student food logs" ON public.food_logs
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.trainer_students ts
    WHERE ts.student_id = food_logs.user_id
      AND ts.trainer_id = auth.uid()
      AND ts.status = 'active'
  ));

CREATE INDEX IF NOT EXISTS idx_food_logs_user_day ON public.food_logs(user_id, logged_at DESC);
