-- 00028: Fix incomplete account-deletion cascade
--
-- 8 foreign keys to profiles(id) were ON DELETE NO ACTION, which blocked
-- deleting an auth user (and broke the delete-account edge function / LGPD
-- self-service deletion). Strategy:
--   * "actor/author" refs on NULLABLE columns -> ON DELETE SET NULL
--     (unlink, but preserve other users' / shared data)
--   * refs on NOT NULL columns (row meaningless without the user) -> ON DELETE CASCADE

BEGIN;

-- SET NULL (nullable columns)
ALTER TABLE public.check_ins DROP CONSTRAINT check_ins_trainer_id_fkey,
  ADD CONSTRAINT check_ins_trainer_id_fkey FOREIGN KEY (trainer_id)
  REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.conversations DROP CONSTRAINT conversations_created_by_fkey,
  ADD CONSTRAINT conversations_created_by_fkey FOREIGN KEY (created_by)
  REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.invites DROP CONSTRAINT invites_accepted_by_fkey,
  ADD CONSTRAINT invites_accepted_by_fkey FOREIGN KEY (accepted_by)
  REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.recipes DROP CONSTRAINT recipes_created_by_fkey,
  ADD CONSTRAINT recipes_created_by_fkey FOREIGN KEY (created_by)
  REFERENCES public.profiles(id) ON DELETE SET NULL;

-- CASCADE (NOT NULL columns)
ALTER TABLE public.food_substitutions DROP CONSTRAINT food_substitutions_created_by_fkey,
  ADD CONSTRAINT food_substitutions_created_by_fkey FOREIGN KEY (created_by)
  REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.payment_records DROP CONSTRAINT payment_records_student_id_fkey,
  ADD CONSTRAINT payment_records_student_id_fkey FOREIGN KEY (student_id)
  REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.payment_records DROP CONSTRAINT payment_records_trainer_id_fkey,
  ADD CONSTRAINT payment_records_trainer_id_fkey FOREIGN KEY (trainer_id)
  REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.subscriptions DROP CONSTRAINT subscriptions_trainer_id_fkey,
  ADD CONSTRAINT subscriptions_trainer_id_fkey FOREIGN KEY (trainer_id)
  REFERENCES public.profiles(id) ON DELETE CASCADE;

COMMIT;
