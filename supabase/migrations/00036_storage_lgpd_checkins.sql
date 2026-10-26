-- =============================================
-- 00036: storage policies, LGPD account deletion, check-in answer integrity
-- Additive / policy-replacing only. No data is deleted.
-- =============================================

-- ---------------------------------------------
-- 1. Foreign keys that blocked account deletion (NO ACTION -> SET NULL)
--    Deleting a trainer whose template had student check-ins, or a user whose
--    session was shared in the feed / a challenge, failed with an FK error.
-- ---------------------------------------------
CREATE OR REPLACE FUNCTION pg_temp.fk_set_null(p_table text, p_column text, p_ref text)
RETURNS void LANGUAGE plpgsql AS $$
DECLARE v_name text;
BEGIN
  SELECT c.conname INTO v_name
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
   WHERE c.contype = 'f'
     AND c.conrelid = ('public.' || p_table)::regclass
     AND a.attname = p_column
   LIMIT 1;
  IF v_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT %I', p_table, v_name);
  END IF;
  EXECUTE format('ALTER TABLE public.%I ALTER COLUMN %I DROP NOT NULL', p_table, p_column);
  EXECUTE format(
    'ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES public.%s ON DELETE SET NULL',
    p_table, p_table || '_' || p_column || '_fkey', p_column, p_ref);
END $$;

SELECT pg_temp.fk_set_null('check_ins', 'template_id', 'questionnaire_templates(id)');
SELECT pg_temp.fk_set_null('check_in_answers', 'question_id', 'questionnaire_questions(id)');
SELECT pg_temp.fk_set_null('meal_logs', 'substitution_id', 'food_substitutions(id)');
SELECT pg_temp.fk_set_null('feed_posts', 'workout_session_id', 'workout_sessions(id)');
SELECT pg_temp.fk_set_null('feed_posts', 'challenge_id', 'challenges(id)');
SELECT pg_temp.fk_set_null('challenge_entries', 'workout_session_id', 'workout_sessions(id)');
SELECT pg_temp.fk_set_null('challenge_entries', 'point_rule_id', 'challenge_point_rules(id)');

-- ---------------------------------------------
-- 2. Check-in answers: editable only while the check-in is pending,
--    and only for questions of the check-in's own template.
-- ---------------------------------------------
DROP POLICY IF EXISTS "Users can submit check-in answers" ON public.check_in_answers;
DROP POLICY IF EXISTS "Students view own answers" ON public.check_in_answers;
DROP POLICY IF EXISTS "Students write answers of pending check-ins" ON public.check_in_answers;

CREATE POLICY "Students view own answers" ON public.check_in_answers
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.check_ins c
     WHERE c.id = check_in_id AND c.user_id = (SELECT auth.uid())
  ));

CREATE POLICY "Students write answers of pending check-ins" ON public.check_in_answers
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.check_ins c
     WHERE c.id = check_in_id AND c.user_id = (SELECT auth.uid()) AND c.status = 'pending'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.check_ins c
      JOIN public.questionnaire_questions q ON q.template_id = c.template_id
     WHERE c.id = check_in_id
       AND q.id = question_id
       AND c.user_id = (SELECT auth.uid())
       AND c.status = 'pending'
  ));

-- ---------------------------------------------
-- 3. Storage. Every client upload uses "<auth.uid()>/<file>" as the path.
-- ---------------------------------------------

-- Own-folder replace/delete for every user bucket (avatars could not be removed,
-- progress photos could not be deleted at all).
DO $$
DECLARE b text;
BEGIN
  FOREACH b IN ARRAY ARRAY['avatars', 'progress-photos', 'feed-media', 'exercise-videos', 'brand-assets', 'chat-media']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', 'Own folder update ' || b);
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', 'Own folder delete ' || b);
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR UPDATE TO authenticated
         USING (bucket_id = %L AND (storage.foldername(name))[1] = (SELECT auth.uid())::text)
         WITH CHECK (bucket_id = %L AND (storage.foldername(name))[1] = (SELECT auth.uid())::text)',
      'Own folder update ' || b, b, b);
    EXECUTE format(
      'CREATE POLICY %I ON storage.objects FOR DELETE TO authenticated
         USING (bucket_id = %L AND (storage.foldername(name))[1] = (SELECT auth.uid())::text)',
      'Own folder delete ' || b, b);
  END LOOP;
END $$;

-- feed-media: uploads only into the uploader's own folder (was: any path).
DROP POLICY IF EXISTS "Authenticated upload feed media" ON storage.objects;
CREATE POLICY "Authenticated upload feed media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'feed-media' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

-- brand-assets: trainers could not upload their logo (no INSERT policy).
DROP POLICY IF EXISTS "Trainers upload brand assets" ON storage.objects;
CREATE POLICY "Trainers upload brand assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'brand-assets'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
    AND EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = (SELECT auth.uid()) AND p.role IN ('trainer', 'nutritionist', 'admin'))
  );

-- progress-photos: the linked trainer may view the student's photos.
DROP POLICY IF EXISTS "Trainers read student progress photos" ON storage.objects;
CREATE POLICY "Trainers read student progress photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'progress-photos'
    AND EXISTS (
      SELECT 1 FROM public.trainer_students ts
       WHERE ts.trainer_id = (SELECT auth.uid())
         AND ts.status = 'active'
         AND ts.student_id::text = (storage.foldername(name))[1]
    )
  );

-- chat-media (private, had no policies): path "<uploader>/<conversation_id>/<file>".
-- Uploader writes into their own folder for a conversation they belong to;
-- members of that conversation can read.
DROP POLICY IF EXISTS "Members upload chat media" ON storage.objects;
CREATE POLICY "Members upload chat media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'chat-media'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
    AND (storage.foldername(name))[2] ~ '^[0-9a-f-]{36}$'
    AND public.is_conversation_member(((storage.foldername(name))[2])::uuid, (SELECT auth.uid()))
  );

DROP POLICY IF EXISTS "Members read chat media" ON storage.objects;
CREATE POLICY "Members read chat media" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'chat-media'
    AND (
      (storage.foldername(name))[1] = (SELECT auth.uid())::text
      OR (
        (storage.foldername(name))[2] ~ '^[0-9a-f-]{36}$'
        AND public.is_conversation_member(((storage.foldername(name))[2])::uuid, (SELECT auth.uid()))
      )
    )
  );
