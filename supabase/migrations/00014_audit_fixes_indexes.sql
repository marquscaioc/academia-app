-- =============================================
-- AUDIT FIXES: Missing indexes + constraints
-- =============================================

-- Indexes on is_active columns (frequently filtered in RLS)
CREATE INDEX IF NOT EXISTS idx_workout_plans_active ON public.workout_plans(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_diet_plans_active ON public.diet_plans(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_exercises_active ON public.exercises(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON public.subscription_plans(is_active) WHERE is_active = TRUE;

-- Chat: conversations.last_message_at (ordered queries)
CREATE INDEX IF NOT EXISTS idx_conversations_last_msg_at ON public.conversations(last_message_at DESC NULLS LAST);

-- Feed: author + visibility combined (home feed queries)
CREATE INDEX IF NOT EXISTS idx_feed_posts_public_created ON public.feed_posts(created_at DESC) WHERE visibility = 'public';

-- Achievement tracking
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);

-- Check-ins by status for trainer dashboard
CREATE INDEX IF NOT EXISTS idx_check_ins_trainer_status ON public.check_ins(trainer_id, status, created_at DESC);

-- Payment records pending (for MRR calculations)
CREATE INDEX IF NOT EXISTS idx_payments_pending ON public.payment_records(trainer_id, status) WHERE status = 'pending';

-- Diet macro sanity constraints
DO $$ BEGIN
  -- Only add if not exists
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diet_plans_target_cal_positive') THEN
    ALTER TABLE public.diet_plans ADD CONSTRAINT diet_plans_target_cal_positive CHECK (target_calories IS NULL OR target_calories > 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diet_plans_target_prot_positive') THEN
    ALTER TABLE public.diet_plans ADD CONSTRAINT diet_plans_target_prot_positive CHECK (target_protein_g IS NULL OR target_protein_g >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diet_plans_target_carb_positive') THEN
    ALTER TABLE public.diet_plans ADD CONSTRAINT diet_plans_target_carb_positive CHECK (target_carbs_g IS NULL OR target_carbs_g >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'diet_plans_target_fat_positive') THEN
    ALTER TABLE public.diet_plans ADD CONSTRAINT diet_plans_target_fat_positive CHECK (target_fat_g IS NULL OR target_fat_g >= 0);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'meal_items_cal_nonnegative') THEN
    ALTER TABLE public.meal_items ADD CONSTRAINT meal_items_cal_nonnegative CHECK (calories IS NULL OR calories >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'body_measurements_weight_positive') THEN
    ALTER TABLE public.body_measurements ADD CONSTRAINT body_measurements_weight_positive CHECK (weight_kg IS NULL OR (weight_kg > 0 AND weight_kg < 500));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'body_measurements_bf_range') THEN
    ALTER TABLE public.body_measurements ADD CONSTRAINT body_measurements_bf_range CHECK (body_fat_pct IS NULL OR (body_fat_pct >= 0 AND body_fat_pct <= 100));
  END IF;
END $$;

-- Set updated_at automatically on subscription_plans (missing)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS subscription_plans_updated_at ON public.subscription_plans;
CREATE TRIGGER subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
