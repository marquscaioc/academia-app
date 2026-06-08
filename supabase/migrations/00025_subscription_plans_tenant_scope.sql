-- 00025_subscription_plans_tenant_scope.sql
-- T0-27 (financeiro): a policy "Students view plans" usava USING (is_active = TRUE),
-- expondo os planos/precos de TODOS os trainers a qualquer aluno autenticado.
-- Decisao de produto (default seguro multi-tenant): o aluno so ve planos ativos
-- dos seus trainers ATIVOS. Nenhum client depende de ver planos de outros trainers.
-- Idempotente.

DROP POLICY IF EXISTS "Students view plans" ON public.subscription_plans;
CREATE POLICY "Students view plans" ON public.subscription_plans
  FOR SELECT TO authenticated
  USING (
    is_active = TRUE
    AND EXISTS (
      SELECT 1 FROM public.trainer_students ts
      WHERE ts.student_id = auth.uid()
        AND ts.trainer_id = subscription_plans.trainer_id
        AND ts.status = 'active'
    )
  );
