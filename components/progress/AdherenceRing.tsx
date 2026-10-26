import { Text, View } from "react-native";

interface AdherenceRingProps {
  score: number;
  label: string;
  size?: number;
}

export function AdherenceRing({ score, label, size = 100 }: AdherenceRingProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const color = clampedScore >= 80 ? "#22C55E" : clampedScore >= 50 ? "#FBBF24" : "#EF4444";

  return (
    <View className="items-center">
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          borderWidth: 6,
          borderColor: `${color}30`,
        }}
      >
        {/* Foreground arc approximation using border segments */}
        <View
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            borderWidth: 6,
            borderColor: "transparent",
            borderTopColor: clampedScore > 0 ? color : "transparent",
            borderRightColor: clampedScore > 25 ? color : "transparent",
            borderBottomColor: clampedScore > 50 ? color : "transparent",
            borderLeftColor: clampedScore > 75 ? color : "transparent",
            transform: [{ rotate: "-45deg" }],
          }}
        />
        <Text className="text-2xl font-black text-text-primary">{Math.round(clampedScore)}</Text>
        <Text className="text-[8px] text-text-muted font-bold">%</Text>
      </View>
      <Text className="text-xs text-text-muted font-bold mt-2 uppercase tracking-wider">{label}</Text>
    </View>
  );
}
