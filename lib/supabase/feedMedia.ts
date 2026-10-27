import { readUploadBody } from "./uploadBody";
import { supabase } from "./client";
import { getSignedUrls } from "./media";

// The database stores paths. Signed links are temporary presentation data only.
export const FEED_MEDIA_REFRESH_MS = 45 * 60 * 1000;

export async function resolveFeedMedia<T extends { media_urls: string[] | null }>(posts: T[]): Promise<T[]> {
  const signed = await getSignedUrls("feed-media", posts.flatMap((post) => post.media_urls ?? []));
  return posts.map((post) => ({
    ...post,
    media_urls: post.media_urls?.map((value) => signed[value]).filter((value): value is string => !!value) ?? null,
  }));
}

export async function uploadFeedPhoto(userId: string, uri: string): Promise<string> {
  const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
  const body = await readUploadBody(uri);
  const { error } = await supabase.storage.from("feed-media").upload(path, body, { contentType: "image/jpeg" });
  if (error) throw error;
  return path;
}

// Called only for this attempt's paths. Check references first: a failed network
// response may hide a successful INSERT, so never delete a committed post's media.
export async function removeUnpublishedFeedMedia(userId: string, paths: string[]): Promise<void> {
  const ownPaths = paths.filter((path) => path.startsWith(`${userId}/`));
  if (!ownPaths.length) return;
  const { data, error } = await supabase.from("feed_posts").select("media_urls").eq("author_id", userId);
  if (error) return; // Preserve files when the server cannot confirm they are unused.
  const referenced = new Set((data ?? []).flatMap((post) => post.media_urls ?? []));
  const unused = ownPaths.filter((path) => !referenced.has(path));
  if (unused.length) await supabase.storage.from("feed-media").remove(unused);
}
