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
