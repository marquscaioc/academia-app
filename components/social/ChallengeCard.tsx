import { Pressable, Text, View } from "react-native";
import { Badge } from "../ui/Badge";

interface ChallengeCardProps {
  title: string;
  description?: string | null;
  status: "upcoming" | "active" | "ended";
  scoringMode: string;
  startsAt: string;
  endsAt: string;
  creatorName?: string;
  requirePhoto?: boolean;
  onPress?: () => void;
}

const statusLabels: Record<string, { label: string; variant: "primary" | "success" | "default" }> = {
  upcoming: { label: "Em breve", variant: "primary" },
  active: { label: "Ativo", variant: "success" },
  ended: { label: "Encerrado", variant: "default" },
};

const scoringLabels: Record<string, string> = {
  days_active: "Dias ativos",
  check_in_count: "Check-ins",
  total_volume: "Volume total",
  custom_points: "Pontos",
};

export function ChallengeCard({
  title,
  description,
  status,
  scoringMode,
  startsAt,
  endsAt,
  creatorName,
  requirePhoto,
  onPress,
}: ChallengeCardProps) {
  const statusInfo = statusLabels[status] ?? statusLabels.active;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

  return (
    <Pressable
      onPress={onPress}
      className="bg-white border border-gray-200 rounded-2xl p-5 active:bg-gray-50"
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-lg font-bold text-gray-900 flex-1 mr-2" numberOfLines={1}>
          {title}
        </Text>
        <Badge label={statusInfo.label} variant={statusInfo.variant} />
      </View>

      {description ? (
        <Text className="text-sm text-gray-500 mb-3" numberOfLines={2}>
          {description}
        </Text>
      ) : null}

      <View className="flex-row flex-wrap gap-3">
        <Text className="text-xs text-gray-400">
          {formatDate(startsAt)} - {formatDate(endsAt)}
        </Text>
        <Text className="text-xs text-gray-400">
          {scoringLabels[scoringMode] ?? scoringMode}
        </Text>
        {requirePhoto ? (
          <Text className="text-xs text-gray-400">📷 Foto obrigatoria</Text>
        ) : null}
      </View>

      {creatorName ? (
        <Text className="text-xs text-gray-400 mt-2">por {creatorName}</Text>
      ) : null}
    </Pressable>
  );
}
