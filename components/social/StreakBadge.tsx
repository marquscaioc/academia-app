import { Text, View } from "react-native";

import { AppIcon } from "../ui";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md";
}

export function StreakBadge({ streak, size = "sm" }: StreakBadgeProps) {
  if (streak <= 0) return null;

  const iconSize = size === "sm" ? 14 : 18;
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";

  return (
    <View className={`flex-row items-center gap-1 bg-warning-500/15 rounded-full ${padding}`}>
      <AppIcon name="streak" size={iconSize} color="#FB923C" strokeWidth={2} />
      <Text className={`${textSize} font-black text-warning-500`}>{streak}</Text>
    </View>
  );
}
