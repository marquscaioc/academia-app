-- =============================================
-- Sprint 4.4: Comunidade & Engajamento
-- =============================================

-- Streaks
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_workout_date DATE;

-- Function to update streak after workout session finishes
CREATE OR REPLACE FUNCTION public.update_user_streak()
RETURNS TRIGGER AS $$
DECLARE
  prev_date DATE;
  streak INT;
BEGIN
  IF NEW.finished_at IS NOT NULL AND (OLD.finished_at IS NULL) THEN
    SELECT last_workout_date, current_streak INTO prev_date, streak
    FROM public.profiles WHERE id = NEW.user_id;

    IF prev_date = CURRENT_DATE THEN
      -- Already trained today, no change
      NULL;
    ELSIF prev_date = CURRENT_DATE - 1 THEN
      -- Consecutive day
      streak := COALESCE(streak, 0) + 1;
      UPDATE public.profiles
      SET current_streak = streak,
          longest_streak = GREATEST(COALESCE(longest_streak, 0), streak),
          last_workout_date = CURRENT_DATE
      WHERE id = NEW.user_id;
    ELSE
      -- Streak broken, restart at 1
      UPDATE public.profiles
      SET current_streak = 1,
          last_workout_date = CURRENT_DATE,
          longest_streak = GREATEST(COALESCE(longest_streak, 0), 1)
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS workout_streak_update ON public.workout_sessions;
CREATE TRIGGER workout_streak_update
  AFTER UPDATE ON public.workout_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_streak();

-- Social notification preference
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notify_follower_workouts BOOLEAN DEFAULT FALSE;
