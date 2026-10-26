import { removeUnpublishedFeedMedia, resolveFeedMedia, uploadFeedPhoto } from "../lib/supabase/feedMedia";
import { getSignedUrls } from "../lib/supabase/media";
import { readUploadBody } from "../lib/supabase/uploadBody";
import { supabase } from "../lib/supabase/client";

jest.mock("../lib/supabase/client", () => ({
  supabase: { from: jest.fn(), storage: { from: jest.fn() } },
}));
jest.mock("../lib/supabase/uploadBody", () => ({ readUploadBody: jest.fn() }));
jest.mock("../lib/supabase/media", () => ({ getSignedUrls: jest.fn() }));

const sign = getSignedUrls as jest.Mock;
const storage = supabase.storage.from as jest.Mock;
const from = supabase.from as jest.Mock;

beforeEach(() => jest.resetAllMocks());

it("batch signs feed media and never renders an unsigned fallback", async () => {
  sign.mockResolvedValue({ "owner/a.jpg": "https://signed/a?token=one" });
  const posts = [
    { id: "a", media_urls: ["owner/a.jpg", "https://legacy/public/feed-media/owner/private.jpg"] },
    { id: "b", media_urls: null },
  ];
  const result = await resolveFeedMedia(posts);
  expect(sign).toHaveBeenCalledTimes(1);
  expect(result).toEqual([
    { id: "a", media_urls: ["https://signed/a?token=one"] },
    { id: "b", media_urls: null },
  ]);
  expect(posts[0].media_urls).toHaveLength(2);
});

it("cleans only this user's unpublished paths, preserving a committed post after a lost response", async () => {
  const eq = jest.fn().mockResolvedValue({ data: [{ media_urls: ["owner/committed.jpg"] }], error: null });
  from.mockReturnValue({ select: jest.fn().mockReturnValue({ eq }) });
  const remove = jest.fn().mockResolvedValue({ error: null });
  storage.mockReturnValue({ remove });
  await removeUnpublishedFeedMedia("owner", ["owner/committed.jpg", "owner/orphan.jpg", "victim/image.jpg"]);
  expect(remove).toHaveBeenCalledWith(["owner/orphan.jpg"]);
});

it("preserves uploads when reference lookup fails", async () => {
  const eq = jest.fn().mockResolvedValue({ data: null, error: new Error("offline") });
  from.mockReturnValue({ select: jest.fn().mockReturnValue({ eq }) });
  await removeUnpublishedFeedMedia("owner", ["owner/a.jpg"]);
  expect(storage).not.toHaveBeenCalled();
});

it("does not report a successful upload or publish a public URL after Storage rejects it", async () => {
  (readUploadBody as jest.Mock).mockResolvedValue(new ArrayBuffer(4));
  storage.mockReturnValue({ upload: jest.fn().mockResolvedValue({ error: new Error("Storage denied") }) });
  await expect(uploadFeedPhoto("owner", "file:///image.jpg")).rejects.toThrow("Storage denied");
  expect(readUploadBody).toHaveBeenCalledWith("file:///image.jpg");
});
