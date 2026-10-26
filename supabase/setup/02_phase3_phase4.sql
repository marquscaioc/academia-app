-- =============================================================================
-- ACADEMIA APP - PARTE 2/12: Chat, Financeiro, Convites, Grupos, Desafios em equipe
-- =============================================================================
-- Cole no SQL Editor do Supabase e clique em RUN.
-- Idempotente (use IF NOT EXISTS / ON CONFLICT).
-- =============================================================================



-- ========================================================================
-- 00005_phase3_chat_financial.sql
-- ========================================================================

-- =============================================
-- FASE 3: Chat, Financeiro, Grupos
-- =============================================

-- =============================================
-- 1. CONVERSATIONS & MESSAGING
-- =============================================

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_type TEXT NOT NULL CHECK (conversation_type IN ('direct', 'group', 'challenge')),
  name TEXT,
  image_url TEXT,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id),
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_last_msg ON public.conversations(last_message_at DESC);

CREATE TABLE public.conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  is_muted BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conv_members_user ON public.conversation_members(user_id);
CREATE INDEX idx_conv_members_conv ON public.conversation_members(conversation_id);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'workout_share', 'system')),
  media_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conv ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);

-- Update conversation last_message on new message
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at,
      last_message_preview = LEFT(COALESCE(NEW.content, '[midia]'), 100)
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER message_update_conversation
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversation_last_message();

-- Helper: get or create direct conversation between two users
CREATE OR REPLACE FUNCTION public.get_or_create_dm(user_a UUID, user_b UUID)
RETURNS UUID AS $$
DECLARE
  conv_id UUID;
BEGIN
  SELECT cm1.conversation_id INTO conv_id
  FROM public.conversation_members cm1
  JOIN public.conversation_members cm2 ON cm1.conversation_id = cm2.conversation_id
  JOIN public.conversations c ON c.id = cm1.conversation_id
  WHERE cm1.user_id = user_a AND cm2.user_id = user_b AND c.conversation_type = 'direct';

  IF conv_id IS NOT NULL THEN
    RETURN conv_id;
  END IF;

  INSERT INTO public.conversations (conversation_type, created_by)
  VALUES ('direct', user_a)
  RETURNING id INTO conv_id;

  INSERT INTO public.conversation_members (conversation_id, user_id) VALUES (conv_id, user_a);
  INSERT INTO public.conversation_members (conversation_id, user_id) VALUES (conv_id, user_b);

  RETURN conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 2. SUBSCRIPTION PLANS & BILLING
-- =============================================

CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'BRL',
  billing_interval TEXT DEFAULT 'monthly' CHECK (billing_interval IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  features JSONB DEFAULT '[]',
  max_students INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_sub_plans_trainer ON public.subscription_plans(trainer_id) WHERE is_active = TRUE;

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  trainer_id UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'cancelled', 'paused')),
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_trainer ON public.subscriptions(trainer_id, status);
CREATE INDEX idx_subscriptions_student ON public.subscriptions(student_id);

CREATE TABLE public.payment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.profiles(id),
  student_id UUID NOT NULL REFERENCES public.profiles(id),
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_trainer ON public.payment_records(trainer_id, created_at DESC);
CREATE INDEX idx_payments_status ON public.payment_records(trainer_id, status);

-- =============================================
-- 3. RLS POLICIES
-- =============================================

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records ENABLE ROW LEVEL SECURITY;

-- Chat policies
CREATE POLICY "View own conversations" ON public.conversations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_members WHERE conversation_id = id AND user_id = auth.uid())
);
CREATE POLICY "Create conversations" ON public.conversations FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

CREATE POLICY "View conversation members" ON public.conversation_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_members cm WHERE cm.conversation_id = conversation_members.conversation_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Join conversations" ON public.conversation_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Update own membership" ON public.conversation_members FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Leave conversations" ON public.conversation_members FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "View messages in my conversations" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.conversation_members WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Send messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (
  sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.conversation_members WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);

-- Financial policies
CREATE POLICY "Trainers manage own plans" ON public.subscription_plans FOR ALL USING (trainer_id = auth.uid());
CREATE POLICY "Students view plans" ON public.subscription_plans FOR SELECT TO authenticated USING (is_active = TRUE);

CREATE POLICY "Trainers manage subscriptions" ON public.subscriptions FOR ALL USING (trainer_id = auth.uid());
CREATE POLICY "Students view own subscriptions" ON public.subscriptions FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Trainers manage payments" ON public.payment_records FOR ALL USING (trainer_id = auth.uid());
CREATE POLICY "Students view own payments" ON public.payment_records FOR SELECT USING (student_id = auth.uid());



-- ========================================================================
-- 00006_phase4_invites_notifications.sql
-- ========================================================================

-- =============================================
-- FASE 4: Convites, Notificações avançadas
-- =============================================

-- =============================================
-- 1. INVITE SYSTEM
-- =============================================

CREATE TABLE public.invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  accepted_by UUID REFERENCES public.profiles(id),
  accepted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invites_code ON public.invites(code) WHERE status = 'pending';
CREATE INDEX idx_invites_trainer ON public.invites(trainer_id);

-- Function to generate invite code
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to accept invite
CREATE OR REPLACE FUNCTION public.accept_invite(invite_code TEXT, student_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  inv RECORD;
BEGIN
  SELECT * INTO inv FROM public.invites
  WHERE code = invite_code AND status = 'pending' AND expires_at > NOW();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Convite invalido ou expirado');
  END IF;

  -- Update invite
  UPDATE public.invites SET status = 'accepted', accepted_by = student_uuid, accepted_at = NOW()
  WHERE id = inv.id;

  -- Create trainer-student relationship
  INSERT INTO public.trainer_students (trainer_id, student_id, status)
  VALUES (inv.trainer_id, student_uuid, 'active')
  ON CONFLICT (trainer_id, student_id) DO UPDATE SET status = 'active', started_at = NOW();

  -- Create DM conversation
  PERFORM public.get_or_create_dm(inv.trainer_id, student_uuid);

  RETURN jsonb_build_object('success', true, 'trainer_id', inv.trainer_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 2. NOTIFICATION PREFERENCES
-- =============================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{
    "push_workouts": true,
    "push_messages": true,
    "push_challenges": true,
    "push_checkins": true,
    "email_digest": false
  }';

-- =============================================
-- 3. RLS
-- =============================================

ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trainers manage own invites" ON public.invites FOR ALL USING (trainer_id = auth.uid());
CREATE POLICY "Anyone can view invite by code" ON public.invites FOR SELECT TO authenticated USING (TRUE);



-- ========================================================================
-- 00007_groups_storage_buckets.sql
-- ========================================================================

-- =============================================
-- GAPS: Groups, Storage Buckets, Increment function
-- Idempotent version (safe to re-run)
-- =============================================

-- =============================================
-- 1. GROUPS / COMMUNITIES
-- =============================================

CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);

CREATE OR REPLACE FUNCTION public.update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS group_member_count ON public.group_members;
CREATE TRIGGER group_member_count
  AFTER INSERT OR DELETE ON public.group_members
  FOR EACH ROW EXECUTE FUNCTION public.update_group_member_count();

ALTER TABLE public.feed_posts ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL;

-- RLS (drop if exists then create)
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "View public groups" ON public.groups;
  DROP POLICY IF EXISTS "Create groups" ON public.groups;
  DROP POLICY IF EXISTS "Manage own groups" ON public.groups;
  DROP POLICY IF EXISTS "Delete own groups" ON public.groups;
  DROP POLICY IF EXISTS "View group members" ON public.group_members;
  DROP POLICY IF EXISTS "Join groups" ON public.group_members;
  DROP POLICY IF EXISTS "Leave groups" ON public.group_members;
END $$;

CREATE POLICY "View public groups" ON public.groups FOR SELECT TO authenticated USING (
  is_public = TRUE OR created_by = auth.uid() OR EXISTS (
    SELECT 1 FROM public.group_members WHERE group_id = id AND user_id = auth.uid()
  )
);
CREATE POLICY "Create groups" ON public.groups FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Manage own groups" ON public.groups FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Delete own groups" ON public.groups FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "View group members" ON public.group_members FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.groups WHERE id = group_id AND (is_public = TRUE OR created_by = auth.uid()))
  OR user_id = auth.uid()
);
CREATE POLICY "Join groups" ON public.group_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Leave groups" ON public.group_members FOR DELETE USING (user_id = auth.uid());

-- =============================================
-- 2. CHALLENGE SCORE INCREMENT FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION public.increment_challenge_score(p_challenge_id UUID, p_user_id UUID, p_points NUMERIC)
RETURNS VOID AS $$
BEGIN
  UPDATE public.challenge_participants
  SET total_score = total_score + p_points,
      check_in_count = check_in_count + 1,
      last_check_in_at = NOW()
  WHERE challenge_id = p_challenge_id AND user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 3. STORAGE BUCKETS
-- =============================================

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('exercise-videos', 'exercise-videos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('progress-photos', 'progress-photos', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('feed-media', 'feed-media', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-media', 'chat-media', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('brand-assets', 'brand-assets', true) ON CONFLICT DO NOTHING;

-- Storage policies (drop if exists then create)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users upload own avatar" ON storage.objects;
  DROP POLICY IF EXISTS "Avatars public read" ON storage.objects;
  DROP POLICY IF EXISTS "Users upload progress photos" ON storage.objects;
  DROP POLICY IF EXISTS "Users read own progress photos" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated upload feed media" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated read feed media" ON storage.objects;
END $$;

CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Avatars public read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "Users upload progress photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users read own progress photos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authenticated upload feed media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'feed-media');
CREATE POLICY "Authenticated read feed media" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'feed-media');



-- ========================================================================
-- 00008_challenge_teams_poses.sql
-- ========================================================================

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

