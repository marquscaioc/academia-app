// Exercise media helpers. The catalog seeded from free-exercise-db stores a second JPG frame
// in `video_url`, so a URL is only treated as a video when its path has a video extension.

const VIDEO_EXTENSIONS = /\.(mp4|mov|m4v|webm|m3u8)$/i;

export function isPlayableVideo(url: string | null | undefined): url is string {
  if (!url) return false;
  const path = url.split(/[?#]/)[0];
  return VIDEO_EXTENSIONS.test(path);
}
