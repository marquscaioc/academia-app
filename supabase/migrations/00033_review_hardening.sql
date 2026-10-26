-- 00033_review_hardening.sql
-- Hardening apontado pela revisão adversarial do PR feat/web-launch-cut. Idempotente.

-- ============================================================
-- [S2] get_or_create_dm é SECURITY DEFINER e confiava nos UUIDs vindos do client,
-- permitindo a QUALQUER autenticado forçar um DM com QUALQUER user_id (spam/cold-DM).
-- Exige que o chamador (auth.uid()) seja um dos participantes. CREATE OR REPLACE
-- re-declara o SET search_path (definido em 00026) para não perdê-lo.
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_or_create_dm(user_a UUID, user_b UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  conv_id UUID;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() NOT IN (user_a, user_b) THEN
    RAISE EXCEPTION 'Nao autorizado a abrir esta conversa.';
  END IF;

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
$$;

-- ============================================================
-- [S1] A policy de UPDATE de check_ins (00031) deixa o aluno virar
-- pending->submitted, mas NÃO restringe colunas: ele poderia sobrescrever
-- trainer_id / trainer_notes / reviewed_at / template_id da própria linha.
-- Trigger BEFORE UPDATE: quando o ator é o próprio aluno (auth.uid() = NEW.user_id),
-- bloqueia qualquer alteração nessas colunas geridas pelo trainer/servidor.
-- (status, submitted_at e weighted_score[trigger de score] continuam livres;
--  o trainer atua via auth.uid() = trainer_id, logo não cai nesta trava.)
-- ============================================================
CREATE OR REPLACE FUNCTION public.enforce_checkin_student_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() = NEW.user_id THEN
    IF NEW.trainer_id    IS DISTINCT FROM OLD.trainer_id
       OR NEW.trainer_notes IS DISTINCT FROM OLD.trainer_notes
       OR NEW.reviewed_at   IS DISTINCT FROM OLD.reviewed_at
       OR NEW.template_id   IS DISTINCT FROM OLD.template_id
       OR NEW.user_id       IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'Aluno so pode atualizar status/submitted_at do proprio check-in.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_checkin_student_update ON public.check_ins;
CREATE TRIGGER enforce_checkin_student_update
  BEFORE UPDATE ON public.check_ins
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_checkin_student_update();
