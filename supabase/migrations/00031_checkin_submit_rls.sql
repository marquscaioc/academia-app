-- 00031_checkin_submit_rls.sql
-- [CRITICAL] O aluno respondia o check-in, mas o status nunca virava 'submitted'.
-- A tabela check_ins so tinha policies de SELECT (dono) e FOR ALL (trainer), entao
-- o UPDATE do aluno (useSubmitCheckIn) era SILENCIOSAMENTE rejeitado pelo RLS
-- (0 linhas afetadas, PostgREST retorna 200 sem erro). Consequencia: o trainer
-- nunca via as respostas, o trigger de score nunca rodava e o banner de pendencia
-- do aluno nunca limpava.
--
-- Fix: policy de UPDATE restrita ao proprio aluno e a transicao pending -> submitted.
-- Idempotente.

DROP POLICY IF EXISTS "Students submit own check-ins" ON public.check_ins;
CREATE POLICY "Students submit own check-ins" ON public.check_ins
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (user_id = auth.uid() AND status = 'submitted');
