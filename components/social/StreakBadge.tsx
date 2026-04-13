import { Text, View } from "react-native";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md";
}

export function StreakBadge({ streak, size = "sm" }: StreakBadgeProps) {
  if (streak <= 0) return null;

  const fire = streak >= 30 ? "🔥🔥🔥" : streak >= 7 ? "🔥🔥" : "🔥";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";

  return (
    <View className={`flex-row items-center gap-1 bg-warning-500/15 rounded-full ${padding}`}>
      <Text className={textSize}>{fire}</Text>
      <Text className={`${textSize} font-black text-warning-500`}>{streak}</Text>
    </View>
  );
}
