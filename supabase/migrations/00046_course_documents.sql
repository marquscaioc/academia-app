-- PDF lessons share the existing course permissions and private media bucket.
ALTER TABLE public.lessons ADD COLUMN document_url text;
UPDATE storage.buckets SET allowed_mime_types = ARRAY['video/mp4','video/quicktime','video/webm','application/pdf']
  WHERE id = 'course-media';

-- Extend media reads to authorized PDF lesson references. The path is bound to
-- the course's real trainer and ID, preventing cross-tenant path laundering.
DROP POLICY "Authorized lesson media" ON storage.objects;
CREATE POLICY "Authorized lesson media" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'course-media' AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR EXISTS (SELECT 1 FROM public.lessons l JOIN public.courses c ON c.id = l.course_id
      WHERE (l.video_url = storage.objects.name OR l.document_url = storage.objects.name)
        AND c.trainer_id::text = (storage.foldername(storage.objects.name))[1]
        AND c.id::text = (storage.foldername(storage.objects.name))[2])
  )
);
