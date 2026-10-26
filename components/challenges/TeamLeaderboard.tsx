import { Text, View } from "react-native";
import { ChallengeTeam } from "../../hooks/queries/useChallengeTeams";

interface TeamLeaderboardProps {
  teams: ChallengeTeam[];
}

const medals = ["🥇", "🥈", "🥉"];

export function TeamLeaderboard({ teams }: TeamLeaderboardProps) {
  if (!teams.length) {
    return (
      <View className="items-center py-8">
        <Text className="text-text-muted text-sm">Nenhuma equipe formada ainda.</Text>
      </View>
    );
  }

  return (
    <View className="gap-2">
      {teams.map((team, idx) => (
        <View
          key={team.id}
          className={`flex-row items-center gap-3 p-4 rounded-2xl ${
            idx < 3 ? "bg-violet-500/5 border border-violet-500/20" : "bg-surface-card border border-surface-border"
          }`}
        >
          <Text className="text-lg w-8 text-center">
            {idx < 3 ? medals[idx] : `#${idx + 1}`}
          </Text>
          <View className="flex-1">
            <Text className="text-sm font-bold text-text-primary">{team.name}</Text>
            <Text className="text-[10px] text-text-muted">{team.member_count} membros</Text>
          </View>
          <Text className="text-lg font-black text-violet-400">{team.total_score}</Text>
        </View>
      ))}
    </View>
  );
}
