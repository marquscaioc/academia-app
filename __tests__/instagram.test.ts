import { normalizeInstagramLink } from "../lib/utils/instagram";

// Same pattern as the CHECK constraint in supabase/migrations/00052_challenge_instagram_link.sql.
const DB_PATTERN = /^https:\/\/www[.]instagram[.]com\/[A-Za-z0-9._/?=&%-]+$/;

describe("normalizeInstagramLink", () => {
  it("turns handles into profile URLs", () => {
    expect(normalizeInstagramLink("@projeto.gaab")).toEqual({ url: "https://www.instagram.com/projeto.gaab/" });
    expect(normalizeInstagramLink(" projeto_gaab ")).toEqual({ url: "https://www.instagram.com/projeto_gaab/" });
  });

  it("normalizes instagram.com links to https://www", () => {
    expect(normalizeInstagramLink("instagram.com/p/ABC123/")).toEqual({ url: "https://www.instagram.com/p/ABC123/" });
    expect(normalizeInstagramLink("http://Instagram.com/reel/xyz?igsh=abc")).toEqual({ url: "https://www.instagram.com/reel/xyz?igsh=abc" });
    expect(normalizeInstagramLink("https://www.instagram.com/perfil")).toEqual({ url: "https://www.instagram.com/perfil" });
  });

  it("empty means no link", () => {
    expect(normalizeInstagramLink("   ")).toEqual({ url: null });
  });

  it("rejects other sites and look-alike hosts", () => {
    for (const bad of ["https://evil.com/instagram.com/x", "https://instagram.com.evil.com/x", "javascript:alert(1)", "https://www.instagram.com/", "@a..b", "https://www.instagram.com/x y"]) {
      expect(normalizeInstagramLink(bad)).toHaveProperty("error");
    }
  });

  it("every accepted URL satisfies the database constraint", () => {
    for (const ok of ["@projeto.gaab", "instagram.com/p/ABC123/", "http://instagram.com/reel/xyz?igsh=abc&utm_source=ig_web"]) {
      const r = normalizeInstagramLink(ok);
      expect("url" in r && r.url && DB_PATTERN.test(r.url)).toBe(true);
    }
  });
});
