-- Professional referrals are a trainer-owned directory. No student or clinical data.
ALTER TABLE public.trainer_profiles ADD COLUMN contact_whatsapp TEXT
  CHECK (contact_whatsapp IS NULL OR contact_whatsapp ~ '^[1-9][0-9]{7,14}$');
COMMENT ON COLUMN public.trainer_profiles.contact_whatsapp IS
  'Explicitly published professional contact for active linked students; independent of private phone and automation opt-in.';

CREATE TABLE public.professional_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 1 AND 120),
  profession TEXT NOT NULL CHECK (profession IN ('nutritionist', 'sports_doctor')),
  specialty TEXT NOT NULL CHECK (char_length(btrim(specialty)) BETWEEN 1 AND 160),
  registration TEXT CHECK (char_length(registration) <= 80),
  bio TEXT CHECK (char_length(bio) <= 1200),
  whatsapp_number TEXT CHECK (whatsapp_number IS NULL OR whatsapp_number ~ '^[1-9][0-9]{7,14}$'),
  booking_url TEXT CHECK (booking_url IS NULL OR (char_length(booking_url) <= 2000 AND booking_url ~ '^https://[a-zA-Z0-9-]+([.][a-zA-Z0-9-]+)+(:[0-9]+)?([/?#][^[:space:]]*)?$')),
  content_url TEXT CHECK (content_url IS NULL OR (char_length(content_url) <= 2000 AND content_url ~ '^https://[a-zA-Z0-9-]+([.][a-zA-Z0-9-]+)+(:[0-9]+)?([/?#][^[:space:]]*)?$')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (whatsapp_number IS NOT NULL OR booking_url IS NOT NULL)
);
CREATE INDEX professional_partners_trainer ON public.professional_partners(trainer_id, is_active);
CREATE TRIGGER professional_partners_updated_at BEFORE UPDATE ON public.professional_partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
ALTER TABLE public.professional_partners ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.professional_partners TO authenticated;
REVOKE ALL ON public.professional_partners FROM anon;

CREATE POLICY "Trainer manages own professional directory"
  ON public.professional_partners FOR ALL TO authenticated
  USING (trainer_id = (SELECT auth.uid()) AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role = 'trainer'
  ))
  WITH CHECK (trainer_id = (SELECT auth.uid()) AND EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role = 'trainer'
  ));
CREATE POLICY "Linked students read active professional referrals"
  ON public.professional_partners FOR SELECT TO authenticated
  USING (is_active AND EXISTS (
    SELECT 1 FROM public.trainer_students ts
    WHERE ts.trainer_id = professional_partners.trainer_id
      AND ts.student_id = (SELECT auth.uid()) AND ts.status = 'active'
  ));
