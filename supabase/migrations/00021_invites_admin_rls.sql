-- 00021_invites_admin_rls.sql
-- T0-26 (invites) + T0-14 (admin). Idempotente.

-- ============================================================
-- T0-26: invites com SELECT aberto demais
-- "Anyone can view invite by code" (USING TRUE) expunha TODOS os convites
-- (codigos/emails) a qualquer autenticado, permitindo enumeracao entre tenants.
-- O aceite usa o RPC accept_invite (SECURITY DEFINER, faz lookup interno),
-- entao restringir o SELECT NAO quebra o fluxo de aceitar convite.
-- ============================================================

DROP POLICY IF EXISTS "Anyone can view invite by code" ON public.invites;
DROP POLICY IF EXISTS "View own invites" ON public.invites;
CREATE POLICY "View own invites" ON public.invites
  FOR SELECT TO authenticated
  USING (trainer_id = auth.uid() OR accepted_by = auth.uid());

-- ============================================================
-- T0-14: painel de admin sem dados (RLS bloqueia leitura platform-wide)
-- - is_admin(): SECURITY DEFINER (evita recursao quando usado em policy de
--   profiles, pois a leitura interna bypassa a RLS).
-- - policy de SELECT em profiles para admin (lista de usuarios).
-- - RPC admin_platform_stats(): agrega as metricas do painel bypassando a RLS,
--   mas so para admin.
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

DROP POLICY IF EXISTS "Admins view all profiles" ON public.profiles;
CREATE POLICY "Admins view all profiles" ON public.profiles
  FOR SELECT
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.admin_platform_stats()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Apenas administradores.';
  END IF;
  SELECT jsonb_build_object(
    'totalUsers', (SELECT count(*) FROM public.profiles),
    'trainers', (SELECT count(*) FROM public.profiles WHERE role = 'trainer'),
    'students', (SELECT count(*) FROM public.profiles WHERE role = 'student'),
    'workoutSessions', (SELECT count(*) FROM public.workout_sessions),
    'challenges', (SELECT count(*) FROM public.challenges),
    'posts', (SELECT count(*) FROM public.feed_posts)
  ) INTO result;
  RETURN result;
END;
$$;
