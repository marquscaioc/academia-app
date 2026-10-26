-- 00034_security_tenant_isolation.sql
-- Fecha vazamentos entre tenants e escaladas de privilegio apontados em docs/AUDIT.md.
-- Idempotente e NAO destrutivo: so substitui policies/funcoes e adiciona triggers.
-- Nenhuma linha de dados e apagada ou alterada.

-- ============================================================
-- [CRITICAL] trainer_students: qualquer usuario podia inserir um vinculo
-- (trainer_id = self, student_id = vitima) e ganhar leitura de perfil, sessoes,
-- medidas, fotos e alimentacao da vitima via is_trainer_of().
-- Vinculos passam a ser criados SOMENTE por accept_invite() (SECURITY DEFINER).
-- ============================================================
DROP POLICY IF EXISTS "Trainers can manage their relationships" ON public.trainer_students;
DROP POLICY IF EXISTS "Trainers view own relationships" ON public.trainer_students;
DROP POLICY IF EXISTS "Trainers update own relationships" ON public.trainer_students;
DROP POLICY IF EXISTS "Trainers delete own relationships" ON public.trainer_students;

CREATE POLICY "Trainers view own relationships" ON public.trainer_students
  FOR SELECT TO authenticated USING (trainer_id = (SELECT auth.uid()));
CREATE POLICY "Trainers update own relationships" ON public.trainer_students
  FOR UPDATE TO authenticated
  USING (trainer_id = (SELECT auth.uid()))
  WITH CHECK (trainer_id = (SELECT auth.uid()));
CREATE POLICY "Trainers delete own relationships" ON public.trainer_students
  FOR DELETE TO authenticated USING (trainer_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.trainer_students_guard()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND (
       NEW.trainer_id IS DISTINCT FROM OLD.trainer_id
    OR NEW.student_id IS DISTINCT FROM OLD.student_id) THEN
    RAISE EXCEPTION 'trainer_id/student_id sao imutaveis.';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_trainer_students_guard ON public.trainer_students;
CREATE TRIGGER trg_trainer_students_guard BEFORE UPDATE ON public.trainer_students
  FOR EACH ROW EXECUTE FUNCTION public.trainer_students_guard();

-- ============================================================
-- [HIGH] accept_invite confiava no student_uuid recebido. Agora usa o chamador,
-- trava o convite (FOR UPDATE) e impede o treinador de aceitar o proprio convite.
-- ============================================================
CREATE OR REPLACE FUNCTION public.accept_invite(invite_code TEXT, student_uuid UUID)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  inv RECORD;
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL OR student_uuid IS DISTINCT FROM v_uid THEN
    RETURN jsonb_build_object('success', false, 'error', 'Nao autorizado');
  END IF;

  SELECT * INTO inv FROM public.invites
   WHERE code = invite_code AND status = 'pending' AND expires_at > NOW()
   FOR UPDATE;

  IF NOT FOUND OR inv.trainer_id = v_uid THEN
    RETURN jsonb_build_object('success', false, 'error', 'Convite invalido ou expirado');
  END IF;

  UPDATE public.invites
     SET status = 'accepted', accepted_by = v_uid, accepted_at = NOW()
   WHERE id = inv.id;

  INSERT INTO public.trainer_students (trainer_id, student_id, status)
  VALUES (inv.trainer_id, v_uid, 'active')
  ON CONFLICT (trainer_id, student_id) DO UPDATE SET status = 'active', started_at = NOW();

  PERFORM public.get_or_create_dm(inv.trainer_id, v_uid);

  RETURN jsonb_build_object('success', true, 'trainer_id', inv.trainer_id);
END $$;

-- ============================================================
-- [HIGH] Escritas do treinador nao verificavam se o aluno era dele
-- (planos de treino/dieta, check-ins, assinaturas, cobrancas, notas).
-- has_trainer_link: existe vinculo (qualquer status) criado via convite.
-- Qualquer status preserva operacoes legitimas sobre ex-alunos (ex.: baixar
-- cobranca antiga) sem reabrir o vazamento, pois vinculos so nascem por convite.
-- ============================================================
CREATE OR REPLACE FUNCTION public.has_trainer_link(p_student UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trainer_students
     WHERE trainer_id = auth.uid() AND student_id = p_student
  );
$$;

DROP POLICY IF EXISTS "Trainers can manage plans for their students" ON public.workout_plans;
CREATE POLICY "Trainers can manage plans for their students" ON public.workout_plans
  FOR ALL TO authenticated
  USING (trainer_id = (SELECT auth.uid()))
  WITH CHECK (
    trainer_id = (SELECT auth.uid())
    AND (student_id IS NULL OR public.has_trainer_link(student_id))
  );

DROP POLICY IF EXISTS "Trainers manage student diet plans" ON public.diet_plans;
CREATE POLICY "Trainers manage student diet plans" ON public.diet_plans
  FOR ALL TO authenticated
  USING (trainer_id = (SELECT auth.uid()))
  WITH CHECK (
    trainer_id = (SELECT auth.uid())
    AND (student_id IS NULL OR public.has_trainer_link(student_id))
  );

DROP POLICY IF EXISTS "Trainers can manage check-ins for their students" ON public.check_ins;
CREATE POLICY "Trainers can manage check-ins for their students" ON public.check_ins
  FOR ALL TO authenticated
  USING (trainer_id = (SELECT auth.uid()))
  WITH CHECK (trainer_id = (SELECT auth.uid()) AND public.has_trainer_link(user_id));

DROP POLICY IF EXISTS "Trainers manage subscriptions" ON public.subscriptions;
CREATE POLICY "Trainers manage subscriptions" ON public.subscriptions
  FOR ALL TO authenticated
  USING (trainer_id = (SELECT auth.uid()))
  WITH CHECK (
    trainer_id = (SELECT auth.uid())
    AND public.has_trainer_link(student_id)
    AND EXISTS (
      SELECT 1 FROM public.subscription_plans p
       WHERE p.id = plan_id AND p.trainer_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Trainers manage payments" ON public.payment_records;
CREATE POLICY "Trainers manage payments" ON public.payment_records
  FOR ALL TO authenticated
  USING (trainer_id = (SELECT auth.uid()))
  WITH CHECK (
    trainer_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.subscriptions s
       WHERE s.id = subscription_id
         AND s.trainer_id = (SELECT auth.uid())
         AND s.student_id = payment_records.student_id
    )
  );

DROP POLICY IF EXISTS "Trainers manage own notes" ON public.student_notes;
CREATE POLICY "Trainers manage own notes" ON public.student_notes
  FOR ALL TO authenticated
  USING (trainer_id = (SELECT auth.uid()))
  WITH CHECK (trainer_id = (SELECT auth.uid()) AND public.has_trainer_link(student_id));

-- ============================================================
-- [HIGH] Funcoes SECURITY DEFINER sem autorizacao.
-- ============================================================
-- get_user_prs: qualquer usuario lia os PRs de qualquer outro (IDOR).
-- Como INVOKER, as policies de workout_session_sets passam a valer
-- (proprio usuario ou treinador vinculado).
ALTER FUNCTION public.get_user_prs(UUID) SECURITY INVOKER;
ALTER FUNCTION public.get_user_prs(UUID) SET search_path = public;

-- increment_challenge_score: qualquer usuario somava pontos arbitrarios a qualquer um.
CREATE OR REPLACE FUNCTION public.increment_challenge_score(p_challenge_id UUID, p_user_id UUID, p_points NUMERIC)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Nao autorizado.';
  END IF;
  IF p_points IS NULL OR p_points < 0 OR p_points > 100000 THEN
    RAISE EXCEPTION 'Pontuacao invalida.';
  END IF;
  UPDATE public.challenge_participants
     SET total_score = total_score + p_points,
         check_in_count = check_in_count + 1,
         last_check_in_at = NOW()
   WHERE challenge_id = p_challenge_id AND user_id = p_user_id;
END $$;

CREATE OR REPLACE FUNCTION public.increment_team_score(p_team_id UUID, p_points NUMERIC)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (
       SELECT 1 FROM public.challenge_participants
        WHERE team_id = p_team_id AND user_id = auth.uid())
     OR p_points IS NULL OR p_points < 0 OR p_points > 100000 THEN
    RAISE EXCEPTION 'Nao autorizado.';
  END IF;
  UPDATE public.challenge_teams SET total_score = total_score + p_points WHERE id = p_team_id;
END $$;

-- ============================================================
-- [HIGH] Conversas/grupos: qualquer usuario que soubesse o UUID entrava na
-- conversa (lendo o historico) e podia se promover a admin.
-- Membros passam a ser adicionados pelo criador da conversa/grupo; entrar
-- sozinho so e permitido em grupos publicos. DMs continuam via get_or_create_dm.
-- ============================================================
DROP POLICY IF EXISTS "Join conversations" ON public.conversation_members;
CREATE POLICY "Join conversations" ON public.conversation_members
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
       WHERE c.id = conversation_id AND c.created_by = (SELECT auth.uid())
    )
    AND (role = 'member' OR user_id = (SELECT auth.uid()))
  );

-- Membro so altera o proprio estado de leitura/silencio, nunca o papel.
DROP POLICY IF EXISTS "Update own membership" ON public.conversation_members;
CREATE POLICY "Update own membership" ON public.conversation_members
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.conversation_members_guard()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND (
       NEW.role IS DISTINCT FROM OLD.role
    OR NEW.conversation_id IS DISTINCT FROM OLD.conversation_id
    OR NEW.user_id IS DISTINCT FROM OLD.user_id) THEN
    RAISE EXCEPTION 'Alteracao de membro nao permitida.';
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_conversation_members_guard ON public.conversation_members;
CREATE TRIGGER trg_conversation_members_guard BEFORE UPDATE ON public.conversation_members
  FOR EACH ROW EXECUTE FUNCTION public.conversation_members_guard();

-- Policy original comparava conversation_id = id dentro da subquery (sempre falso).
DROP POLICY IF EXISTS "View own conversations" ON public.conversations;
CREATE POLICY "View own conversations" ON public.conversations
  FOR SELECT TO authenticated
  USING (
    created_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.conversation_members cm
       WHERE cm.conversation_id = conversations.id AND cm.user_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "Join groups" ON public.group_members;
CREATE POLICY "Join groups" ON public.group_members
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.groups g
       WHERE g.id = group_id
         AND (
           g.created_by = (SELECT auth.uid())
           OR (g.is_public = TRUE AND user_id = (SELECT auth.uid()) AND role = 'member')
         )
    )
  );

-- Policy original de grupos tinha o mesmo bug de coluna nao qualificada.
DROP POLICY IF EXISTS "View public groups" ON public.groups;
CREATE POLICY "View public groups" ON public.groups
  FOR SELECT TO authenticated
  USING (
    is_public = TRUE
    OR created_by = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1 FROM public.group_members gm
       WHERE gm.group_id = groups.id AND gm.user_id = (SELECT auth.uid())
    )
  );

-- ============================================================
-- [MEDIUM] Isolamento de tenant: policies legadas anulavam o escopo de 00017
-- (policies permissivas sao combinadas com OR).
-- ============================================================
DROP POLICY IF EXISTS "View public challenges" ON public.challenges;
DROP POLICY IF EXISTS "View public recipes" ON public.recipes;

-- Participantes continuam vendo os desafios dos quais participam.
-- Helper SECURITY DEFINER: a policy de challenge_participants consulta challenges,
-- entao uma subquery direta aqui causaria recursao infinita de RLS.
CREATE OR REPLACE FUNCTION public.is_challenge_participant(p_challenge UUID)
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.challenge_participants
     WHERE challenge_id = p_challenge AND user_id = auth.uid()
  );
$$;

DROP POLICY IF EXISTS "challenges_select_participant" ON public.challenges;
CREATE POLICY "challenges_select_participant" ON public.challenges
  FOR SELECT TO authenticated
  USING (public.is_challenge_participant(challenges.id));

-- Criador nao pode "empurrar" o desafio para a base de outro treinador.
DROP POLICY IF EXISTS "Manage own challenges" ON public.challenges;
CREATE POLICY "Manage own challenges" ON public.challenges
  FOR UPDATE TO authenticated
  USING (created_by = (SELECT auth.uid()))
  WITH CHECK (
    created_by = (SELECT auth.uid())
    AND (trainer_id IS NULL OR trainer_id = (SELECT auth.uid()) OR public.is_admin())
  );

-- Exercicios: so admin publica no catalogo global.
DROP POLICY IF EXISTS "Trainers can create exercises" ON public.exercises;
CREATE POLICY "Trainers can create exercises" ON public.exercises
  FOR INSERT TO authenticated
  WITH CHECK (created_by = (SELECT auth.uid()) AND (is_global IS NOT TRUE OR public.is_admin()));

DROP POLICY IF EXISTS "Trainers can update own exercises" ON public.exercises;
CREATE POLICY "Trainers can update own exercises" ON public.exercises
  FOR UPDATE TO authenticated
  USING (created_by = (SELECT auth.uid()))
  WITH CHECK (created_by = (SELECT auth.uid()) AND (is_global IS NOT TRUE OR public.is_admin()));

-- ============================================================
-- [MEDIUM] Integridade de ranking: placar inicial forjado / pontos arbitrarios.
-- Limite 0..100000 e sanidade (modos total_volume/active_minutes enviam o valor
-- medido como pontos). Pendente: calcular pontos no servidor (ver AUDIT.md).
-- ============================================================
DROP POLICY IF EXISTS "Join challenges" ON public.challenge_participants;
CREATE POLICY "Join challenges" ON public.challenge_participants
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND COALESCE(total_score, 0) = 0
    AND COALESCE(check_in_count, 0) = 0
    -- subquery sujeita a RLS: so desafios visiveis ao usuario
    AND EXISTS (SELECT 1 FROM public.challenges c WHERE c.id = challenge_id)
    AND (
      team_id IS NULL OR EXISTS (
        SELECT 1 FROM public.challenge_teams t
         WHERE t.id = team_id AND t.challenge_id = challenge_participants.challenge_id
      )
    )
  );

DROP POLICY IF EXISTS "Create entries" ON public.challenge_entries;
CREATE POLICY "Create entries" ON public.challenge_entries
  FOR INSERT TO authenticated
  WITH CHECK (
    user_id = (SELECT auth.uid())
    AND points >= 0 AND points <= 100000
    AND EXISTS (
      SELECT 1 FROM public.challenge_participants p
       WHERE p.challenge_id = challenge_entries.challenge_id AND p.user_id = (SELECT auth.uid())
    )
  );

-- ============================================================
-- [MEDIUM] Contadores de perfil gerenciados pelo servidor (streak, seguidores).
-- pg_trigger_depth() = 1 => update direto do cliente; triggers internos
-- (streak, follows) rodam aninhados (depth > 1) e continuam funcionando.
-- ============================================================
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() = NEW.id THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      IF COALESCE(OLD.onboarding_completed, FALSE) = TRUE
         OR NEW.role NOT IN ('student', 'trainer') THEN
        RAISE EXCEPTION 'Alteracao de papel (role) nao permitida.';
      END IF;
    END IF;
    IF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
      RAISE EXCEPTION 'Alteracao de is_active nao permitida.';
    END IF;
    IF COALESCE(OLD.onboarding_completed, FALSE) = TRUE
       AND COALESCE(NEW.onboarding_completed, FALSE) = FALSE THEN
      RAISE EXCEPTION 'Nao e permitido reverter o onboarding.';
    END IF;
    IF pg_trigger_depth() = 1 AND (
         NEW.current_streak    IS DISTINCT FROM OLD.current_streak
      OR NEW.longest_streak    IS DISTINCT FROM OLD.longest_streak
      OR NEW.last_workout_date IS DISTINCT FROM OLD.last_workout_date
      OR NEW.followers_count   IS DISTINCT FROM OLD.followers_count
      OR NEW.following_count   IS DISTINCT FROM OLD.following_count) THEN
      RAISE EXCEPTION 'Campos gerenciados pelo servidor.';
    END IF;
  END IF;
  RETURN NEW;
END $$;

-- ============================================================
-- [MEDIUM] Comentarios/reacoes visiveis apenas em posts que o usuario pode ver.
-- ============================================================
DROP POLICY IF EXISTS "View comments" ON public.feed_comments;
CREATE POLICY "View comments" ON public.feed_comments
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.feed_posts p WHERE p.id = post_id));

DROP POLICY IF EXISTS "View reactions" ON public.feed_reactions;
CREATE POLICY "View reactions" ON public.feed_reactions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.feed_posts p WHERE p.id = post_id));

-- ============================================================
-- [LOW] search_path fixo em funcoes SECURITY DEFINER restantes.
-- ============================================================
DO $$
DECLARE fn TEXT;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'public.is_trainer_of(uuid)',
    'public.calculate_checkin_score(uuid)',
    'public.update_user_streak()',
    'public.update_post_likes_count()',
    'public.update_post_comments_count()',
    'public.update_follow_counts()',
    'public.update_group_member_count()',
    'public.update_conversation_last_message()'
  ] LOOP
    BEGIN
      EXECUTE format('ALTER FUNCTION %s SET search_path = public', fn);
    EXCEPTION WHEN undefined_function THEN
      RAISE NOTICE 'funcao % nao existe, ignorando', fn;
    END;
  END LOOP;
END $$;
