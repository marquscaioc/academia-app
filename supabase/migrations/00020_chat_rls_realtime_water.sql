-- 00020_chat_rls_realtime_water.sql
-- Correcoes de RLS/realtime do chat e meta de agua (Trilha 0). Idempotente.

-- ============================================================
-- T0-06: recursao infinita na RLS de conversation_members
-- A policy "View conversation members" consultava a PROPRIA tabela, gerando
-- "infinite recursion detected in policy for relation conversation_members",
-- o que derrubava a lista de conversas inteira (e tudo que embute membros).
-- Correcao: helper SECURITY DEFINER (bypassa RLS) + policy que o usa.
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_conversation_member(p_conversation_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_members
    WHERE conversation_id = p_conversation_id AND user_id = p_user_id
  );
$$;

DROP POLICY IF EXISTS "View conversation members" ON public.conversation_members;
CREATE POLICY "View conversation members" ON public.conversation_members
  FOR SELECT
  USING (public.is_conversation_member(conversation_id, auth.uid()));

-- ============================================================
-- T0-07: habilitar Realtime para messages
-- Sem adicionar a tabela a publication, o chat em tempo real nunca dispara
-- num deploy limpo.
-- ============================================================

ALTER TABLE public.messages REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
  END IF;
END $$;

-- ============================================================
-- T0-13: meta de agua trainer -> aluno
-- A policy de UPDATE de profiles so permite o proprio usuario (id = auth.uid),
-- entao o trainer "salvava" a meta de agua do aluno e nada acontecia.
-- RPC SECURITY DEFINER que valida o vinculo trainer-aluno ATIVO antes de gravar.
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_student_water_goal(p_student_id uuid, p_goal_ml integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.trainer_students
    WHERE trainer_id = auth.uid()
      AND student_id = p_student_id
      AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Sem permissao para alterar a meta deste aluno.';
  END IF;
  UPDATE public.profiles SET water_goal_ml = p_goal_ml WHERE id = p_student_id;
END;
$$;
