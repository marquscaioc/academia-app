-- 00023_notifications_update_check.sql
-- T0-27 (parcial): a policy de UPDATE de notifications tinha apenas USING e
-- nenhum WITH CHECK, permitindo reatribuir user_id (ou alterar a linha para
-- outro usuario). Adiciona WITH CHECK. Idempotente.

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
