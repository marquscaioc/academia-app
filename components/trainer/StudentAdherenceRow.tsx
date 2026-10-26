import { Pressable, Text, View } from "react-native";
import { Avatar } from "../ui/Avatar";

interface StudentAdherenceRowProps {
  name: string;
  avatarUrl: string | null;
  workoutAdherence: number;
  checkinAdherence: number;
  overallAdherence: number;
  onPress?: () => void;
}

function AdherenceDot({ score }: { score: number }) {
  const color = score >= 80 ? "bg-success-500" : score >= 50 ? "bg-warning-500" : "bg-danger-500";
  return (
    <View className="items-center">
      <View className={`w-3 h-3 rounded-full ${color}`} />
      <Text className="text-[9px] text-text-muted mt-0.5">{score}%</Text>
    </View>
  );
}

export function StudentAdherenceRow({
  name, avatarUrl, workoutAdherence, checkinAdherence, overallAdherence, onPress,
}: StudentAdherenceRowProps) {
  const bgColor = overallAdherence >= 80
    ? "bg-success-500/5 border-success-500/20"
    : overallAdherence >= 50
      ? "bg-warning-500/5 border-warning-500/20"
      : "bg-danger-500/5 border-danger-500/20";

  return (
    <Pressable
      onPress={onPress}
      className={`border rounded-2xl p-4 flex-row items-center gap-3 active:bg-surface-hover ${bgColor}`}
    >
      <Avatar uri={avatarUrl} name={name} size="md" />
      <View className="flex-1">
        <Text className="text-sm font-bold text-text-primary">{name}</Text>
        <Text className="text-[10px] text-text-muted mt-0.5">
          {overallAdherence >= 80 ? "Otimo" : overallAdherence >= 50 ? "Atencao" : "Critico"}
        </Text>
      </View>
      <View className="flex-row gap-3">
        <View className="items-center">
          <AdherenceDot score={workoutAdherence} />
          <Text className="text-[8px] text-text-muted mt-0.5">Treino</Text>
        </View>
        <View className="items-center">
          <AdherenceDot score={checkinAdherence} />
          <Text className="text-[8px] text-text-muted mt-0.5">Check-in</Text>
        </View>
      </View>
    </Pressable>
  );
}
