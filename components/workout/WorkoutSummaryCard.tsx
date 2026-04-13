import { Text, View } from "react-native";
import { StreakBadge } from "../social/StreakBadge";

interface WorkoutSummaryCardProps {
  workoutName: string;
  duration: string;
  totalVolume: number;
  exerciseCount: number;
  setsCompleted: number;
  streak: number;
  date: string;
}

export function WorkoutSummaryCard({
  workoutName, duration, totalVolume, exerciseCount, setsCompleted, streak, date,
}: WorkoutSummaryCardProps) {
  return (
    <View className="bg-surface-card border border-violet-500/30 rounded-3xl p-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xs text-violet-400 font-bold uppercase tracking-wider">Treino Concluido</Text>
        <StreakBadge streak={streak} size="md" />
      </View>

      <Text className="text-2xl font-black text-text-primary mb-1">{workoutName}</Text>
      <Text className="text-xs text-text-muted mb-6">{date}</Text>

      <View className="flex-row gap-3">
        <View className="flex-1 bg-violet-500/10 rounded-2xl p-3 items-center">
          <Text className="text-lg font-black text-violet-400">{duration}</Text>
          <Text className="text-[10px] text-text-muted">Duracao</Text>
        </View>
        <View className="flex-1 bg-ice-400/10 rounded-2xl p-3 items-center">
          <Text className="text-lg font-black text-ice-400">{totalVolume}kg</Text>
          <Text className="text-[10px] text-text-muted">Volume</Text>
        </View>
        <View className="flex-1 bg-success-500/10 rounded-2xl p-3 items-center">
          <Text className="text-lg font-black text-success-500">{setsCompleted}</Text>
          <Text className="text-[10px] text-text-muted">Series</Text>
        </View>
      </View>

      <View className="mt-4 items-center">
        <Text className="text-[10px] text-text-muted">{exerciseCount} exercicios</Text>
      </View>
    </View>
  );
}
