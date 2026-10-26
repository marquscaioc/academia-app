import { Text, View } from "react-native";

interface AdherenceRingProps {
  /** null = not enough data; rendered as an empty ring with "—", never as 0 % or 100 %. */
  score: number | null;
  /** Shown under the label when score is null. */
  emptyHint?: string;
  label: string;
  size?: number;
}

export function AdherenceRing({ score, label, size = 100, emptyHint }: AdherenceRingProps) {
  const clampedScore = score === null ? 0 : Math.max(0, Math.min(100, score));
  const color = score === null ? "#6E6382" : clampedScore >= 80 ? "#22C55E" : clampedScore >= 50 ? "#FBBF24" : "#EF4444";

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
        <Text className="text-2xl font-black text-text-primary">{score === null ? "—" : Math.round(clampedScore)}</Text>
        {score === null ? null : <Text className="text-[8px] text-text-muted font-bold">%</Text>}
      </View>
      <Text className="text-xs text-text-muted font-bold mt-2 uppercase tracking-wider">{label}</Text>
      {score === null && emptyHint ? (
        <Text className="text-[10px] text-text-muted mt-0.5 text-center" style={{ maxWidth: size + 10 }}>{emptyHint}</Text>
      ) : null}
    </View>
  );
}
