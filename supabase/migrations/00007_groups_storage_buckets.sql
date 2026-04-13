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
