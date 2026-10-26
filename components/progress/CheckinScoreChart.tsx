import { Text, View } from "react-native";

interface ScoreData {
  weekLabel: string;
  avgScore: number;
}

interface CheckinScoreChartProps {
  data: ScoreData[];
  height?: number;
}

export function CheckinScoreChart({ data, height = 120 }: CheckinScoreChartProps) {
  if (!data.length) return null;

  const maxScore = 100;

  return (
    <View>
      <View className="flex-row items-end gap-1" style={{ height }}>
        {data.map((d, idx) => {
          const barHeight = Math.max((d.avgScore / maxScore) * height, 4);
          const color = d.avgScore >= 80 ? "bg-success-500" : d.avgScore >= 50 ? "bg-warning-500" : "bg-danger-500";

          return (
            <View key={idx} className="flex-1 items-center justify-end">
              {idx === data.length - 1 ? (
                <Text className="text-[10px] font-bold text-text-primary mb-1">{d.avgScore}%</Text>
              ) : null}
              <View className={`w-full rounded-t-lg ${color}`} style={{ height: barHeight }} />
            </View>
          );
        })}
      </View>
      <View className="flex-row mt-1">
        {data.map((d, idx) => (
          <View key={idx} className="flex-1 items-center">
            <Text className="text-[8px] text-text-muted">{d.weekLabel}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
