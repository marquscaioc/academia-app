-- Private social media: authorization follows the referencing row's RLS.
-- Existing objects and legacy public URLs are preserved; clients sign on read.
UPDATE storage.buckets SET public = false WHERE id = 'feed-media';

-- Avoid the groups -> group_members -> groups policy recursion, and ensure a
-- public-looking post inside a private group cannot expose that group's media.
CREATE OR REPLACE FUNCTION public.is_group_member(p_group uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
     WHERE group_id = p_group AND user_id = auth.uid()
  );
$$;
REVOKE ALL ON FUNCTION public.is_group_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_group_member(uuid) TO authenticated;

DROP POLICY IF EXISTS "View public groups" ON public.groups;
CREATE POLICY "View public groups" ON public.groups
  FOR SELECT TO authenticated
  USING (is_public = true OR created_by = (SELECT auth.uid()) OR public.is_group_member(id));

DROP POLICY IF EXISTS "Group posts require group access" ON public.feed_posts;
CREATE POLICY "Group posts require group access" ON public.feed_posts
  AS RESTRICTIVE FOR SELECT TO authenticated
  USING (group_id IS NULL OR EXISTS (SELECT 1 FROM public.groups g WHERE g.id = feed_posts.group_id));

-- Accept the old getPublicUrl form as well as new paths. Do not accept arbitrary
-- URLs containing a bucket name. Historical generated file names are URL-safe.
CREATE OR REPLACE FUNCTION public.feed_media_path(p_value text)
RETURNS text LANGUAGE sql IMMUTABLE STRICT SET search_path = public AS $$
  SELECT CASE
    WHEN p_value ~ '^https?://' THEN
      CASE WHEN p_value ~ '^https?://[^/]+/storage/v1/object/(public|sign|authenticated)/feed-media/'
        THEN split_part(regexp_replace(p_value, '^https?://[^/]+/storage/v1/object/(public|sign|authenticated)/feed-media/', ''), '?', 1)
        ELSE NULL END
    ELSE p_value
  END;
$$;
REVOKE ALL ON FUNCTION public.feed_media_path(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.feed_media_path(text) TO authenticated;

DROP POLICY IF EXISTS "Authenticated read feed media" ON storage.objects;
DROP POLICY IF EXISTS "Read authorized feed media" ON storage.objects;
CREATE POLICY "Read authorized feed media" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'feed-media'
    AND (
      (storage.foldername(name))[1] = (SELECT auth.uid())::text
      OR EXISTS (
        SELECT 1 FROM public.feed_posts p
         WHERE p.author_id::text = (storage.foldername(storage.objects.name))[1]
           AND EXISTS (
             SELECT 1 FROM unnest(p.media_urls) value
              WHERE public.feed_media_path(value) = storage.objects.name
           )
      )
      OR EXISTS (
        SELECT 1 FROM public.challenge_entries e
         WHERE e.user_id::text = (storage.foldername(storage.objects.name))[1]
           AND public.feed_media_path(e.photo_url) = storage.objects.name
      )
    )
  );

-- INSERT/UPDATE/DELETE remain constrained to the caller's own folder by 00036.
-- Matching the author's folder above prevents an attacker from publishing a
-- victim's known private path in their own public post to gain Storage access.
