-- =============================================
-- FASE 2: Dieta, Desafios, Social, Achievements
-- =============================================

-- =============================================
-- 1. DIET / NUTRITION
-- =============================================

CREATE TABLE public.diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_calories INTEGER,
  target_protein_g NUMERIC(6,1),
  target_carbs_g NUMERIC(6,1),
  target_fat_g NUMERIC(6,1),
  target_fiber_g NUMERIC(6,1),
  is_active BOOLEAN DEFAULT TRUE,
  starts_at DATE,
  ends_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER diet_plans_updated_at
  BEFORE UPDATE ON public.diet_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_diet_plans_student ON public.diet_plans(student_id) WHERE is_active = TRUE;

CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diet_plan_id UUID NOT NULL REFERENCES public.diet_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  target_time TIME,
  notes TEXT
);

CREATE TABLE public.meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  quantity NUMERIC(8,2),
  unit TEXT DEFAULT 'g',
  calories NUMERIC(6,1),
  protein_g NUMERIC(6,1),
  carbs_g NUMERIC(6,1),
  fat_g NUMERIC(6,1),
  notes TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT TRUE,
  notes TEXT
);

CREATE INDEX idx_meal_logs_user_date ON public.meal_logs(user_id, logged_at DESC);

CREATE TABLE public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL DEFAULT 250,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_water_logs_user_date ON public.water_logs(user_id, logged_at DESC);

-- =============================================
-- 2. CHALLENGES & COMPETITIONS
-- =============================================

CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  scoring_mode TEXT NOT NULL DEFAULT 'days_active'
    CHECK (scoring_mode IN ('days_active', 'check_in_count', 'total_volume', 'custom_points')),
  scoring_config JSONB DEFAULT '{}',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  is_public BOOLEAN DEFAULT TRUE,
  max_participants INTEGER,
  require_photo_proof BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'upcoming'
    CHECK (status IN ('upcoming', 'active', 'ended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_challenges_status ON public.challenges(status, starts_at);

CREATE TABLE public.challenge_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_score NUMERIC(10,2) DEFAULT 0,
  check_in_count INTEGER DEFAULT 0,
  last_check_in_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

CREATE INDEX idx_challenge_participants_leaderboard
  ON public.challenge_participants(challenge_id, total_score DESC);

CREATE TABLE public.challenge_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_session_id UUID REFERENCES public.workout_sessions(id),
  photo_url TEXT,
  caption TEXT,
  points NUMERIC(10,2) NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_challenge_entries_challenge ON public.challenge_entries(challenge_id, created_at DESC);
CREATE INDEX idx_challenge_entries_user ON public.challenge_entries(user_id, created_at DESC);

-- =============================================
-- 3. SOCIAL FEED
-- =============================================

CREATE TABLE public.feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_type TEXT NOT NULL DEFAULT 'text'
    CHECK (post_type IN ('text', 'workout_completed', 'progress_photo', 'challenge_entry', 'achievement', 'milestone')),
  content TEXT,
  media_urls TEXT[],
  workout_session_id UUID REFERENCES public.workout_sessions(id),
  challenge_id UUID REFERENCES public.challenges(id),
  visibility TEXT DEFAULT 'public'
    CHECK (visibility IN ('public', 'followers', 'trainers_only', 'private')),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feed_posts_author ON public.feed_posts(author_id, created_at DESC);
CREATE INDEX idx_feed_posts_feed ON public.feed_posts(created_at DESC) WHERE visibility = 'public';

CREATE TABLE public.feed_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL DEFAULT 'like'
    CHECK (reaction_type IN ('like', 'fire', 'strong', 'clap')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- Update likes_count on reaction insert/delete
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feed_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feed_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER feed_reactions_count
  AFTER INSERT OR DELETE ON public.feed_reactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_likes_count();

CREATE TABLE public.feed_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.feed_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.feed_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feed_comments_post ON public.feed_comments(post_id, created_at);

-- Update comments_count on comment insert/delete
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.feed_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.feed_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER feed_comments_count
  AFTER INSERT OR DELETE ON public.feed_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_comments_count();

-- =============================================
-- 4. FOLLOW SYSTEM
-- =============================================

CREATE TABLE public.user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON public.user_follows(follower_id);
CREATE INDEX idx_follows_following ON public.user_follows(following_id);

-- Add follower counts to profiles
ALTER TABLE public.profiles
  ADD COLUMN followers_count INTEGER DEFAULT 0,
  ADD COLUMN following_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION public.update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    UPDATE public.profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles SET following_count = following_count - 1 WHERE id = OLD.follower_id;
    UPDATE public.profiles SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER follow_counts
  AFTER INSERT OR DELETE ON public.user_follows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_follow_counts();

-- =============================================
-- 5. ACHIEVEMENTS / BADGES
-- =============================================

CREATE TABLE public.achievement_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT '🏆',
  criteria_type TEXT NOT NULL
    CHECK (criteria_type IN ('workout_count', 'streak_days', 'challenge_won', 'weight_pr', 'social_posts', 'check_in_streak')),
  criteria_threshold INTEGER NOT NULL DEFAULT 1,
  points INTEGER DEFAULT 10,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements ON public.user_achievements(user_id);

-- =============================================
-- SEED: Achievements
-- =============================================

INSERT INTO public.achievement_definitions (name, description, icon, criteria_type, criteria_threshold, points, sort_order) VALUES
  ('Primeiro Treino', 'Complete seu primeiro treino', '💪', 'workout_count', 1, 10, 1),
  ('Semana Consistente', 'Treine 3x na mesma semana', '📅', 'workout_count', 3, 20, 2),
  ('Dedicação Total', 'Complete 10 treinos', '🔥', 'workout_count', 10, 50, 3),
  ('Máquina de Treinar', 'Complete 50 treinos', '⚡', 'workout_count', 50, 100, 4),
  ('Lenda da Academia', 'Complete 100 treinos', '👑', 'workout_count', 100, 200, 5),
  ('Streak de 7 dias', 'Treine 7 dias seguidos', '🔥', 'streak_days', 7, 50, 6),
  ('Streak de 30 dias', 'Treine 30 dias seguidos', '💎', 'streak_days', 30, 200, 7),
  ('Campeão', 'Vença um desafio', '🏆', 'challenge_won', 1, 100, 8),
  ('Influencer Fitness', 'Publique 10 posts no feed', '📱', 'social_posts', 10, 30, 9),
  ('Check-in Master', 'Complete 10 check-ins seguidos', '✅', 'check_in_streak', 10, 50, 10);
