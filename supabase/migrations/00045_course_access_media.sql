-- Course metadata is discoverable by linked students; paid lesson bodies stay
-- closed until a server-verified entitlement model is introduced in Phase 6.
DROP POLICY "Trainers manage own courses" ON public.courses;
CREATE POLICY "Trainers manage own courses" ON public.courses FOR ALL TO authenticated
  USING (trainer_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('trainer', 'admin')
  )) WITH CHECK (trainer_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('trainer', 'admin')
  ));

DROP POLICY "Students view accessible lessons" ON public.lessons;
CREATE POLICY "Students view accessible lessons" ON public.lessons FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.courses c JOIN public.trainer_students ts ON ts.trainer_id = c.trainer_id
    WHERE c.id = lessons.course_id AND c.is_published = TRUE
      AND ts.student_id = auth.uid() AND ts.status = 'active'
      AND (c.is_free = TRUE OR lessons.is_free = TRUE)
  )
);

DROP POLICY "Users manage own progress" ON public.lesson_progress;
CREATE POLICY "Users manage own progress" ON public.lesson_progress FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (
    user_id = auth.uid() AND watched_seconds >= 0
    AND EXISTS (SELECT 1 FROM public.lessons l WHERE l.id = lesson_progress.lesson_id)
  );
DROP POLICY "Trainers view student progress" ON public.lesson_progress;
CREATE POLICY "Trainers view student progress" ON public.lesson_progress FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.lessons l JOIN public.courses c ON c.id = l.course_id
    JOIN public.trainer_students ts ON ts.trainer_id = c.trainer_id
    WHERE l.id = lesson_progress.lesson_id AND c.trainer_id = auth.uid()
      AND ts.student_id = lesson_progress.user_id AND ts.status = 'active'
  )
);

-- New lesson uploads are isolated from the public exercise demonstration bucket.
-- Path: <trainer UUID>/<course UUID>/<file>. Legacy external/public lesson URLs
-- remain untouched; their objects require a separately authorized storage copy.
INSERT INTO storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
VALUES ('course-media', 'course-media', false, 524288000, ARRAY['video/mp4','video/quicktime','video/webm'])
ON CONFLICT (id) DO UPDATE SET public = false;

CREATE POLICY "Owners upload course media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'course-media' AND (storage.foldername(name))[1] = auth.uid()::text
  AND EXISTS (SELECT 1 FROM public.courses c WHERE c.id::text = (storage.foldername(storage.objects.name))[2]
    AND c.trainer_id = auth.uid())
);
CREATE POLICY "Authorized lesson media" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'course-media' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (SELECT 1 FROM public.lessons l JOIN public.courses c ON c.id = l.course_id
      WHERE l.video_url = storage.objects.name AND c.trainer_id::text = (storage.foldername(storage.objects.name))[1]
        AND c.id::text = (storage.foldername(storage.objects.name))[2])
  )
);
CREATE POLICY "Owners delete course media" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'course-media' AND (storage.foldername(name))[1] = auth.uid()::text
);
