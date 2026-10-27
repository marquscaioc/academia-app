// Instagram links typed by professionals → the single URL form accepted by challenges.instagram_url
// (migration 00052). Pure; tested in __tests__/instagram.test.ts.

const HANDLE = /^[A-Za-z0-9._]{1,30}$/;
const PATH = /^[A-Za-z0-9._/?=&%-]+$/;
const MAX_LENGTH = 300;

export type InstagramLinkResult = { url: string | null } | { error: string };

/**
 * Accepts "@perfil", "perfil", "instagram.com/perfil" or a full instagram.com URL (profile, post or reel).
 * Empty → { url: null }. Anything pointing outside instagram.com → error in pt-BR.
 */
export function normalizeInstagramLink(input: string): InstagramLinkResult {
  const raw = input.trim();
  if (!raw) return { url: null };
  if (/\s/.test(raw)) return { error: "Link do Instagram inválido." };

  const handle = raw.startsWith("@") ? raw.slice(1) : raw;
  if (HANDLE.test(handle) && !handle.includes("..") && !/instagram[.]com/i.test(raw)) {
    return { url: `https://www.instagram.com/${handle}/` };
  }

  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return { error: "Link do Instagram inválido." };
  }
  const host = parsed.hostname.toLowerCase();
  if (host !== "instagram.com" && host !== "www.instagram.com") {
    return { error: "Use um link do instagram.com ou o @ do perfil." };
  }
  const path = `${parsed.pathname.replace(/^\/+/, "")}${parsed.search}`;
  if (!path || !PATH.test(path)) return { error: "Link do Instagram inválido." };

  const url = `https://www.instagram.com/${path}`;
  if (url.length > MAX_LENGTH) return { error: "Link do Instagram muito longo." };
  return { url };
}
