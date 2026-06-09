import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useUserAchievements } from "../../../hooks/queries/useFeed";
import { AchievementCard } from "../../../components/achievements/AchievementCard";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import { AppIcon, SectionLabel } from "../../../components/ui";
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
        <View className="flex-row items-center justify-between mb-8">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <AppIcon name="arrow-left" size={18} color="#9B40D8" strokeWidth={2} />
            <Text className="text-violet-400" style={{ fontFamily: font.medium }}>Voltar</Text>
          </Pressable>
          <View className="w-16" />
        </View>

        <View className="mb-8">
          <SectionLabel className="mb-2">Suas conquistas</SectionLabel>
          <View className="flex-row items-center gap-4">
            <View className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
              <AppIcon name="trophy" size={26} color="#9B40D8" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-5xl text-text-primary" style={{ fontFamily: font.display, letterSpacing: -0.5 }}>Conquistas</Text>
              <View className="flex-row items-baseline gap-1.5 mt-1">
                <Text className="text-base text-violet-400" style={{ fontFamily: font.semibold }}>{earnedIds.size}</Text>
                <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>de {allAchievements?.length ?? 0} desbloqueadas</Text>
              </View>
            </View>
          </View>
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
