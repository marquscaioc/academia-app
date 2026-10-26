-- =============================================
-- 00052: optional Instagram link on challenges
-- The professional can point participants to the challenge's Instagram profile or post.
-- Only https://www.instagram.com/ URLs are stored (the app normalizes "@perfil" and bare
-- instagram.com links to that form), so the column cannot be used to send people elsewhere.
-- Existing table grants and RLS on challenges already cover the new column.
-- =============================================

ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS instagram_url TEXT
  CONSTRAINT challenges_instagram_url_check CHECK (
    instagram_url IS NULL OR (
      char_length(instagram_url) <= 300
      AND instagram_url ~ '^https://www[.]instagram[.]com/[A-Za-z0-9._/?=&%-]+$'
    )
  );
