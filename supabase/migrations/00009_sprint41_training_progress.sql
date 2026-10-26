-- =============================================
-- Sprint 4.1: Treinos & Progresso
-- =============================================

-- Storage policies for exercise-videos bucket
CREATE POLICY "Trainers upload exercise videos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'exercise-videos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Anyone can view exercise videos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'exercise-videos');

-- Function to get personal records for a user
CREATE OR REPLACE FUNCTION public.get_user_prs(p_user_id UUID)
RETURNS TABLE(exercise_id UUID, exercise_name TEXT, max_weight NUMERIC, max_reps INT, achieved_at TIMESTAMPTZ)
AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (s.exercise_id)
    s.exercise_id,
    e.name,
    s.weight_kg,
    s.reps,
    ws.started_at
  FROM public.workout_session_sets s
  JOIN public.workout_sessions ws ON ws.id = s.session_id
  JOIN public.exercises e ON e.id = s.exercise_id
  WHERE ws.user_id = p_user_id
    AND s.weight_kg IS NOT NULL
  ORDER BY s.exercise_id, s.weight_kg DESC, s.reps DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Food substitution equivalences
CREATE TABLE IF NOT EXISTS public.food_substitutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_item_id UUID NOT NULL REFERENCES public.meal_items(id) ON DELETE CASCADE,
  substitute_food_name TEXT NOT NULL,
  substitute_quantity NUMERIC(8,2),
  substitute_unit TEXT DEFAULT 'g',
  substitute_calories NUMERIC(6,1),
  substitute_protein_g NUMERIC(6,1),
  substitute_carbs_g NUMERIC(6,1),
  substitute_fat_g NUMERIC(6,1),
  notes TEXT,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_food_subs_original ON public.food_substitutions(original_item_id);

-- Track which substitution a student chose
ALTER TABLE public.meal_logs ADD COLUMN IF NOT EXISTS substitution_id UUID REFERENCES public.food_substitutions(id);

-- RLS for food substitutions
ALTER TABLE public.food_substitutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage substitutions" ON public.food_substitutions FOR ALL
  USING (created_by = auth.uid());

CREATE POLICY "Students view substitutions for their plans" ON public.food_substitutions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.meal_items mi
    JOIN public.meals m ON m.id = mi.meal_id
    JOIN public.diet_plans dp ON dp.id = m.diet_plan_id
    WHERE mi.id = original_item_id AND dp.student_id = auth.uid()
  ));

-- Personalized hydration goal (set by trainer, default 2500ml)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS water_goal_ml INTEGER DEFAULT 2500;
