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
  /**
   * How to color the change since the first point. "neutral" (default) for body metrics: the app does not
   * assume whether going up or down is good for the student's goal. "higher-is-better" for strength marks.
   */
  trend?: "neutral" | "higher-is-better";
  /** Bars start at 0 so differences are not exaggerated. Off for body metrics, where small changes matter. */
  zeroBaseline?: boolean;
}

/** pt-BR decimal comma. */
const fmt = (v: number) => v.toFixed(1).replace(".", ",");

export function SimpleLineChart({
  data,
  height = 160,
  color = "#27272A",
  unit = "",
  title,
  trend = "neutral",
  zeroBaseline = false,
}: SimpleLineChartProps) {
  if (!data.length) {
    return (
      <View className="bg-surface-card border border-surface-border rounded-2xl p-5 items-center py-10">
        <Text className="text-text-muted text-sm font-sans">Dados insuficientes para o gráfico</Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = range * 0.1;
  const effectiveMin = zeroBaseline ? 0 : min - padding;
  const effectiveRange = zeroBaseline ? max * 1.05 || 1 : range + padding * 2;

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
              {fmt(latest)}{unit}
            </Text>
            {data.length > 1 ? (
              <Text
                className={`text-xs font-bold ${
                  trend === "neutral" || diff === 0 ? "text-text-secondary" : diff > 0 ? "text-success-500" : "text-warning-500"
                }`}
              >
                {diff > 0 ? "+" : ""}{fmt(diff)}
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
                  {fmt(point.value)}
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
                <Text className="text-[8px] text-text-muted mt-1 font-sans">{point.label}</Text>
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
          <Text className="text-[10px] text-text-muted font-sans">Mín: {fmt(min)}{unit}</Text>
          <Text className="text-[10px] text-text-muted font-sans">Máx: {fmt(max)}{unit}</Text>
        </View>
      ) : null}
    </View>
  );
}
