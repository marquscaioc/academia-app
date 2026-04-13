-- =============================================
-- Sprint 4.3: Desafios Competitivos (Gym Rats parity)
-- =============================================

-- Expand scoring modes
ALTER TABLE public.challenges DROP CONSTRAINT IF EXISTS challenges_scoring_mode_check;
ALTER TABLE public.challenges ADD CONSTRAINT challenges_scoring_mode_check
  CHECK (scoring_mode IN ('days_active', 'check_in_count', 'total_volume', 'custom_points', 'workouts_completed', 'active_minutes'));

-- Hustle Points: custom point rules per challenge
CREATE TABLE IF NOT EXISTS public.challenge_point_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('workout', 'cardio', 'photo', 'checkin', 'steps', 'custom')),
  label TEXT NOT NULL,
  points NUMERIC(6,2) NOT NULL DEFAULT 1,
  max_per_day INTEGER,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_challenge_point_rules ON public.challenge_point_rules(challenge_id);

ALTER TABLE public.challenge_point_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View challenge point rules" ON public.challenge_point_rules FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Manage challenge point rules" ON public.challenge_point_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.challenges WHERE id = challenge_id AND created_by = auth.uid())
);

-- Track activity type and point rule on entries
ALTER TABLE public.challenge_entries ADD COLUMN IF NOT EXISTS activity_type TEXT DEFAULT 'checkin';
ALTER TABLE public.challenge_entries ADD COLUMN IF NOT EXISTS point_rule_id UUID REFERENCES public.challenge_point_rules(id);

-- Anti-cheat columns
ALTER TABLE public.challenge_entries ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT TRUE;
ALTER TABLE public.challenge_entries ADD COLUMN IF NOT EXISTS flagged_reason TEXT;

-- Team score function
CREATE OR REPLACE FUNCTION public.increment_team_score(p_team_id UUID, p_points NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE public.challenge_teams
  SET total_score = total_score + p_points
  WHERE id = p_team_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed more daily poses (30 days)
INSERT INTO public.daily_poses (pose_emoji, pose_description, active_date)
SELECT
  (ARRAY['💪','🙌','🤙','✌️','👊','🫡','🤘','👆','🖐️','🤟'])[1 + (n % 10)],
  (ARRAY['Faca uma pose de biceps','Levante as duas maos','Faca sinal de hang loose','Faca sinal de paz','Mostre o punho cerrado','Faca uma continencia','Faca sinal de rock','Aponte para cima','Mao aberta bem alto','Sinal de eu te amo'])[1 + (n % 10)],
  CURRENT_DATE + n
FROM generate_series(7, 30) AS n
ON CONFLICT (active_date) DO NOTHING;
