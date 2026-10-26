-- 00030_foods_unique_constraint.sql
-- Replace partial unique index with a full UNIQUE CONSTRAINT so PostgREST
-- upsert onConflict("source","source_ref") resolves correctly in the
-- food-lookup edge function.

DROP INDEX IF EXISTS public.foods_source_ref_uniq;

ALTER TABLE public.foods
  DROP CONSTRAINT IF EXISTS foods_source_source_ref_key;

ALTER TABLE public.foods
  ADD CONSTRAINT foods_source_source_ref_key UNIQUE (source, source_ref);
