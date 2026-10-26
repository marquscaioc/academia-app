-- =============================================
-- Sprint 4.5: Integracoes & Polish
-- =============================================

-- Recipes
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id),
  name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  image_url TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER DEFAULT 1,
  calories_per_serving NUMERIC(6,1),
  protein_per_serving NUMERIC(6,1),
  carbs_per_serving NUMERIC(6,1),
  fat_per_serving NUMERIC(6,1),
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipes_tags ON public.recipes USING GIN(tags);

CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC(8,2),
  unit TEXT DEFAULT 'g',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.recipe_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View public recipes" ON public.recipes FOR SELECT TO authenticated USING (is_public = TRUE OR created_by = auth.uid());
CREATE POLICY "Create recipes" ON public.recipes FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Manage own recipes" ON public.recipes FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Delete own recipes" ON public.recipes FOR DELETE USING (created_by = auth.uid());
CREATE POLICY "View recipe ingredients" ON public.recipe_ingredients FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Manage recipe ingredients" ON public.recipe_ingredients FOR ALL USING (
  EXISTS (SELECT 1 FROM public.recipes WHERE id = recipe_id AND created_by = auth.uid())
);
CREATE POLICY "Manage own favorites" ON public.recipe_favorites FOR ALL USING (user_id = auth.uid());

-- Student notes (trainer prontuario)
CREATE TABLE IF NOT EXISTS public.student_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'injury', 'goal', 'observation')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_notes ON public.student_notes(student_id, created_at DESC);

ALTER TABLE public.student_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trainers manage own notes" ON public.student_notes FOR ALL USING (trainer_id = auth.uid());
CREATE POLICY "Students view own notes" ON public.student_notes FOR SELECT USING (student_id = auth.uid());

-- WhatsApp
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN DEFAULT FALSE;

-- Health sync
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS health_sync_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE public.workout_sessions ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
