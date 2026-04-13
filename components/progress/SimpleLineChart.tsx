import { Text, View } from "react-native";

interface DataPoint {
  label: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  unit?: string;
  title?: string;
}

export function SimpleLineChart({
  data,
  height = 160,
  color = "#A855F7",
  unit = "",
  title,
}: SimpleLineChartProps) {
  if (!data.length) {
    return (
      <View className="bg-surface-card border border-surface-border rounded-2xl p-5 items-center py-10">
        <Text className="text-text-muted text-sm">Dados insuficientes para o grafico</Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = range * 0.1;
  const effectiveMin = min - padding;
  const effectiveRange = range + padding * 2;

  const latest = values[values.length - 1];
  const first = values[0];
  const diff = latest - first;

  return (
    <View className="bg-surface-card border border-surface-border rounded-2xl p-5">
      {title ? (
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xs font-bold text-text-muted uppercase tracking-wider">{title}</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg font-black text-text-primary">
              {latest.toFixed(1)}{unit}
            </Text>
            {data.length > 1 ? (
              <Text className={`text-xs font-bold ${diff <= 0 ? "text-success-500" : "text-warning-500"}`}>
                {diff > 0 ? "+" : ""}{diff.toFixed(1)}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}

      {/* Chart area */}
      <View style={{ height }} className="flex-row items-end gap-px">
        {data.map((point, idx) => {
          const barHeight = ((point.value - effectiveMin) / effectiveRange) * height;
          const isLast = idx === data.length - 1;
          const isMax = point.value === max;

          return (
            <View key={idx} className="flex-1 items-center" style={{ height }}>
              {/* Value label on top for last/max */}
              {(isLast || isMax) && data.length > 1 ? (
                <Text className="text-[8px] text-text-muted font-bold mb-1">
                  {point.value.toFixed(1)}
                </Text>
              ) : null}

              {/* Bar */}
              <View className="flex-1 w-full justify-end items-center">
                <View
                  className="w-full rounded-t-sm"
                  style={{
                    height: Math.max(barHeight, 4),
                    backgroundColor: isLast ? color : `${color}40`,
                    maxWidth: 32,
                    borderRadius: 4,
                  }}
                />
              </View>

              {/* Date label */}
              {idx % Math.ceil(data.length / 6) === 0 || isLast ? (
                <Text className="text-[8px] text-text-muted mt-1">{point.label}</Text>
              ) : (
                <View className="h-3" />
              )}
            </View>
          );
        })}
      </View>

      {/* Min/Max reference */}
      {data.length > 1 ? (
        <View className="flex-row justify-between mt-3">
          <Text className="text-[10px] text-text-muted">Min: {min.toFixed(1)}{unit}</Text>
          <Text className="text-[10px] text-text-muted">Max: {max.toFixed(1)}{unit}</Text>
        </View>
      ) : null}
    </View>
  );
}
