import { isPlayableVideo } from "../lib/utils/media";

describe("isPlayableVideo", () => {
  it("accepts common video formats, ignoring query strings and case", () => {
    expect(isPlayableVideo("https://x.supabase.co/storage/v1/object/public/exercise-videos/a/b.mp4")).toBe(true);
    expect(isPlayableVideo("https://cdn.example.com/clip.MOV?token=abc")).toBe(true);
    expect(isPlayableVideo("https://cdn.example.com/stream/index.m3u8")).toBe(true);
    expect(isPlayableVideo("https://cdn.example.com/a.webm#t=3")).toBe(true);
  });

  it("rejects images, empty values and extension-less URLs", () => {
    expect(isPlayableVideo("https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/X/1.jpg")).toBe(false);
    expect(isPlayableVideo("https://cdn.example.com/video.mp4.png")).toBe(false);
    expect(isPlayableVideo("https://youtube.com/watch?v=mp4")).toBe(false);
    expect(isPlayableVideo(null)).toBe(false);
    expect(isPlayableVideo("")).toBe(false);
  });
});
