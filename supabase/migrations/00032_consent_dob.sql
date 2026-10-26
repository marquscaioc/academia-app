-- 00032_consent_dob.sql
-- [LGPD] (1) Persiste o consentimento (versao + timestamp) e (2) captura a data
-- de nascimento no cadastro, para que o gate de 16+ seja verificavel e exista
-- prova auditavel de aceite dos Termos/Privacidade (principio de accountability
-- da LGPD). date_of_birth ja existe (00001); adiciona as colunas de consentimento
-- e estende o trigger handle_new_user para copia-las do raw_user_meta_data
-- (enviado pelo signUp). Idempotente.

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS terms_accepted_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS terms_version text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, date_of_birth, terms_accepted_at, terms_version)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuario'),
    'student',
    NULLIF(NEW.raw_user_meta_data->>'date_of_birth', '')::date,
    NULLIF(NEW.raw_user_meta_data->>'terms_accepted_at', '')::timestamptz,
    NULLIF(NEW.raw_user_meta_data->>'terms_version', '')
  );
  RETURN NEW;
END;
$$;
