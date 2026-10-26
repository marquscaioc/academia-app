import { useEffect, useState } from "react";
import { View } from "react-native";
import { Image } from "expo-image";

interface ExerciseAnimationProps {
  thumbnailUrl?: string | null;
  secondFrameUrl?: string | null;
  size?: number;
  intervalMs?: number;
  borderRadius?: number;
  autoPlay?: boolean;
}

/**
 * Alternates between two exercise images to create a GIF-like animation.
 * Falls back gracefully if only one image is available.
 */
export function ExerciseAnimation({
  thumbnailUrl,
  secondFrameUrl,
  size = 64,
  intervalMs = 800,
  borderRadius = 14,
  autoPlay = true,
}: ExerciseAnimationProps) {
  const [frame, setFrame] = useState(0);
  const hasSecondFrame = !!secondFrameUrl && secondFrameUrl !== thumbnailUrl;

  useEffect(() => {
    if (!autoPlay || !hasSecondFrame) return;
    const id = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), intervalMs);
    return () => clearInterval(id);
  }, [autoPlay, hasSecondFrame, intervalMs]);

  if (!thumbnailUrl) {
    return (
      <View
        className="bg-surface-elevated items-center justify-center"
        style={{ width: size, height: size, borderRadius }}
      />
    );
  }

  const currentUrl = frame === 1 && hasSecondFrame ? secondFrameUrl : thumbnailUrl;

  return (
    <Image
      source={{ uri: currentUrl ?? thumbnailUrl }}
      style={{ width: size, height: size, borderRadius }}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
    />
  );
}
