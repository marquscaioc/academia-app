-- =============================================
-- Challenge Teams + Pose of the Day
-- =============================================

CREATE TABLE IF NOT EXISTS public.challenge_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  total_score NUMERIC(10,2) DEFAULT 0,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.challenge_participants
  ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES public.challenge_teams(id) ON DELETE SET NULL;

-- Daily pose for anti-cheat
ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS pose_verification BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS team_mode BOOLEAN DEFAULT FALSE;

-- Pose of the day table
CREATE TABLE IF NOT EXISTS public.daily_poses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pose_emoji TEXT NOT NULL,
  pose_description TEXT NOT NULL,
  active_date DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE
);

-- Seed some poses
INSERT INTO public.daily_poses (pose_emoji, pose_description, active_date) VALUES
  ('💪', 'Faca uma pose de biceps', CURRENT_DATE),
  ('🙌', 'Levante as duas maos', CURRENT_DATE + 1),
  ('🤙', 'Faca sinal de hang loose', CURRENT_DATE + 2),
  ('✌️', 'Faca sinal de paz', CURRENT_DATE + 3),
  ('👊', 'Mostre o punho cerrado', CURRENT_DATE + 4),
  ('🫡', 'Faca uma continencia', CURRENT_DATE + 5),
  ('🤘', 'Faca sinal de rock', CURRENT_DATE + 6)
ON CONFLICT (active_date) DO NOTHING;

-- RLS
ALTER TABLE public.challenge_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_poses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View challenge teams" ON public.challenge_teams FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Manage challenge teams" ON public.challenge_teams FOR ALL USING (
  EXISTS (SELECT 1 FROM public.challenges WHERE id = challenge_id AND created_by = auth.uid())
);

CREATE POLICY "View daily poses" ON public.daily_poses FOR SELECT TO authenticated USING (TRUE);
