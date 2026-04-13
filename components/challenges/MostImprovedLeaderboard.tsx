import { Text, View } from "react-native";
import { Avatar } from "../ui/Avatar";
import { MostImprovedEntry } from "../../hooks/queries/useMostImproved";

interface MostImprovedLeaderboardProps {
  entries: MostImprovedEntry[];
}

export function MostImprovedLeaderboard({ entries }: MostImprovedLeaderboardProps) {
  if (!entries.length) {
    return (
      <View className="items-center py-8">
        <Text className="text-text-muted text-sm">Dados insuficientes para ranking de evolucao.</Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      {entries.map((entry, idx) => (
        <View
          key={entry.userId}
          className={`flex-row items-center gap-3 p-4 rounded-2xl ${
            entry.improvementPct > 0 ? "bg-success-500/5 border border-success-500/20" : "bg-surface-card border border-surface-border"
          }`}
        >
          <Text className="text-sm font-black text-text-muted w-6">#{idx + 1}</Text>
          <Avatar uri={entry.avatarUrl} name={entry.name} size="sm" />
          <View className="flex-1">
            <Text className="text-sm font-bold text-text-primary">{entry.name}</Text>
            <Text className="text-[10px] text-text-muted">
              {entry.firstWeekScore} → {entry.lastWeekScore} pts/dia
            </Text>
          </View>
          <View className={`px-2.5 py-1 rounded-full ${
            entry.improvementPct > 0 ? "bg-success-500/15" : "bg-danger-500/15"
          }`}>
            <Text className={`text-xs font-black ${
              entry.improvementPct > 0 ? "text-success-500" : "text-danger-500"
            }`}>
              {entry.improvementPct > 0 ? "+" : ""}{entry.improvementPct}%
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
