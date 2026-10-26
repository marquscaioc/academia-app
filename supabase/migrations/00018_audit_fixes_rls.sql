-- 00018_audit_fixes_rls.sql
-- Correcoes de seguranca RLS apontadas pela auditoria (Trilha 0).
-- Idempotente: seguro para reaplicar.

-- =============================================
-- T0-01: Escalada de privilegio em public.profiles
-- A policy de UPDATE (00002) tinha apenas USING e nenhum WITH CHECK, e nao
-- havia trava no campo `role`. Como o app faz `profiles.update(...)` direto do
-- client (onboarding e edicao de perfil), qualquer usuario autenticado podia
-- `update({ role: 'admin' })` na propria linha e virar admin, ou trocar de
-- role livremente. Correcao: WITH CHECK + trigger BEFORE UPDATE que so permite
-- a selecao inicial de role no onboarding (student/trainer) e bloqueia trocas
-- posteriores. service_role (auth.uid() IS NULL) e admin gerenciando OUTROS
-- usuarios continuam funcionando.
-- =============================================

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND auth.uid() = NEW.id THEN
    -- Permite apenas a selecao inicial no onboarding, e somente student/trainer.
    IF COALESCE(OLD.onboarding_completed, FALSE) = TRUE
       OR NEW.role NOT IN ('student', 'trainer') THEN
      RAISE EXCEPTION 'Alteracao de papel (role) nao permitida.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- =============================================
-- T0-09: public.user_achievements sem policy de INSERT
-- 00004 criou apenas a policy de SELECT, entao o auto-award de conquistas
-- feito no client (useCheckAndAwardAchievements) era silenciosamente bloqueado
-- pela RLS. Adiciona INSERT escopado ao proprio usuario.
-- (O SELECT permanece publico de proposito: badges aparecem em perfis publicos.)
-- =============================================

DROP POLICY IF EXISTS "Insert own achievements" ON public.user_achievements;
CREATE POLICY "Insert own achievements"
  ON public.user_achievements FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- T0-15: public.student_notes vazando para o aluno
-- 00013 criou "Students view own notes" (SELECT WHERE student_id = auth.uid()),
-- expondo ao aluno as anotacoes clinicas/privadas do profissional
-- (note_type injury/observation/goal). Remove o acesso de leitura do aluno;
-- a policy "Trainers manage own notes" (FOR ALL) permanece.
-- =============================================

DROP POLICY IF EXISTS "Students view own notes" ON public.student_notes;
