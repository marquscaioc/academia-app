-- 00026_review_hardening.sql
-- Hardening apontado pelo code-review do branch. Idempotente.

-- ============================================================
-- [HIGH] A trava de 00018 so protegia `role`; o proprio usuario ainda podia
-- alterar outras colunas server-managed em profiles (ex.: is_active, ou
-- reverter onboarding_completed). Estende o trigger.
-- (Confirmado: nenhum fluxo do client altera profiles.is_active sobre si mesmo.)
-- ============================================================

CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() = NEW.id THEN
    -- role: apenas a selecao inicial no onboarding, e so student/trainer
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      IF COALESCE(OLD.onboarding_completed, FALSE) = TRUE
         OR NEW.role NOT IN ('student', 'trainer') THEN
        RAISE EXCEPTION 'Alteracao de papel (role) nao permitida.';
      END IF;
    END IF;
    -- is_active e gerenciado pelo servidor/admin, nunca pelo proprio usuario
    IF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
      RAISE EXCEPTION 'Alteracao de is_active nao permitida.';
    END IF;
    -- nao permite reverter o onboarding ja concluido
    IF COALESCE(OLD.onboarding_completed, FALSE) = TRUE
       AND COALESCE(NEW.onboarding_completed, FALSE) = FALSE THEN
      RAISE EXCEPTION 'Nao e permitido reverter o onboarding.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- ============================================================
-- [MEDIUM] search_path nas funcoes SECURITY DEFINER das quais o branch passou
-- a depender criticamente (o SELECT restrito de invites apoia-se no aceite via
-- accept_invite, que chama get_or_create_dm).
-- ============================================================

ALTER FUNCTION public.accept_invite(text, uuid) SET search_path = public;
ALTER FUNCTION public.get_or_create_dm(uuid, uuid) SET search_path = public;
