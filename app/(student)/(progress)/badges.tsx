import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useUserAchievements } from "../../../hooks/queries/useFeed";
import { AchievementCard } from "../../../components/achievements/AchievementCard";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import { font } from "../../../lib/design/tokens";

export default function BadgesScreen() {
  const { user } = useAuth();
  const { data: userAchievements } = useUserAchievements(user?.id);

  const { data: allAchievements, isLoading } = useQuery({
    queryKey: ["achievements", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievement_definitions")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const earnedIds = new Set(userAchievements?.map((a) => a.achievement?.id ?? a.achievement_id) ?? []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-violet-400" style={{ fontFamily: font.medium }}>← Voltar</Text>
          </Pressable>
          <Text className="text-2xl text-text-primary" style={{ fontFamily: font.display }}>Conquistas</Text>
          <View className="w-16" />
        </View>

        <View className="flex-row items-center gap-3 mb-6">
          <Text className="text-4xl text-violet-400" style={{ fontFamily: font.display }}>{earnedIds.size}</Text>
          <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>de {allAchievements?.length ?? 0} conquistas</Text>
        </View>

        <View className="flex-row flex-wrap gap-3 mb-10">
          {(allAchievements ?? []).map((a) => (
            <View key={a.id} style={{ width: "30%" }}>
              <AchievementCard
                name={a.name}
                description={a.description ?? ""}
                icon={a.icon ?? "⭐"}
                earned={earnedIds.has(a.id)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
