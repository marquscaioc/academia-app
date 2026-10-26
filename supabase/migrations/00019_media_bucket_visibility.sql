-- 00019_media_bucket_visibility.sql
-- T0-02 (decisao de produto): a midia do feed e conteudo social, servido
-- publicamente via CDN (o app lia com getPublicUrl, que so funciona em bucket
-- publico). As fotos de progresso (progress-photos) permanecem PRIVADAS e
-- passam a ser lidas via signed URL no app.
-- Idempotente.

UPDATE storage.buckets SET public = true WHERE id = 'feed-media';
