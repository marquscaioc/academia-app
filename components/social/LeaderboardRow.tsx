import { Text, View } from "react-native";
import { Avatar } from "../ui/Avatar";

interface LeaderboardRowProps {
  rank: number;
  name: string;
  avatarUrl?: string | null;
  score: number;
  checkIns: number;
  isCurrentUser?: boolean;
}

const rankIcons: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

export function LeaderboardRow({
  rank,
  name,
  avatarUrl,
  score,
  checkIns,
  isCurrentUser,
}: LeaderboardRowProps) {
  return (
    <View
      className={`flex-row items-center py-3 px-4 rounded-xl ${
        isCurrentUser ? "bg-primary-50" : ""
      }`}
    >
      <View className="w-8 items-center">
        {rankIcons[rank] ? (
          <Text className="text-lg">{rankIcons[rank]}</Text>
        ) : (
          <Text className="text-sm font-bold text-gray-400">#{rank}</Text>
        )}
      </View>

      <View className="ml-3">
        <Avatar uri={avatarUrl} name={name} size="sm" />
      </View>

      <View className="flex-1 ml-3">
        <Text
          className={`text-sm font-semibold ${isCurrentUser ? "text-primary-700" : "text-gray-900"}`}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text className="text-xs text-gray-400">{checkIns} check-ins</Text>
      </View>

      <Text className={`text-lg font-bold ${isCurrentUser ? "text-primary-600" : "text-gray-900"}`}>
        {score}
      </Text>
    </View>
  );
}
