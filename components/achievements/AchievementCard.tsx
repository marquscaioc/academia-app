import { Text, View } from "react-native";

interface AchievementCardProps {
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number; // 0-100
}

export function AchievementCard({ name, description, icon, earned, progress }: AchievementCardProps) {
  return (
    <View className={`items-center p-3 rounded-2xl border ${
      earned ? "bg-violet-500/10 border-violet-500/30" : "bg-surface-card border-surface-border opacity-50"
    }`}>
      <Text className="text-3xl mb-2">{icon}</Text>
      <Text className={`text-xs font-bold text-center ${earned ? "text-text-primary" : "text-text-muted"}`} numberOfLines={1}>
        {name}
      </Text>
      {!earned && progress != null ? (
        <View className="w-full h-1 bg-surface-border rounded-full mt-2 overflow-hidden">
          <View className="h-full bg-violet-500 rounded-full" style={{ width: `${progress}%` }} />
        </View>
      ) : null}
      {earned ? (
        <Text className="text-[9px] text-violet-400 font-bold mt-1">Conquistado!</Text>
      ) : null}
    </View>
  );
}
