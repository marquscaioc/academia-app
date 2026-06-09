import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useWorkoutSessions } from "../../../hooks/queries/useWorkouts";
import { font } from "../../../lib/design/tokens";
import { AppIcon } from "../../../components/ui";
import { WebContainer } from "../../../components/layout/WebContainer";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "--";
  const m = Math.floor(seconds / 60);
  return `${m}min`;
}

const moodEmoji: Record<string, string> = {
  great: "🤩", good: "😊", ok: "😐", bad: "😞", terrible: "😫",
};

export default function WorkoutHistoryScreen() {
  const { user } = useAuth();
  const { data: sessions, isLoading } = useWorkoutSessions(user?.id);

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <WebContainer maxWidth={1180}>
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1">
            <AppIcon name="chevron-left" size={18} color="#6E6382" strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Voltar</Text>
          </Pressable>
          <Text className="text-2xl text-text-primary" style={{ fontFamily: font.display }}>Histórico</Text>
          <View className="w-16" />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !sessions?.length ? (
          <View className="flex-1 items-center justify-center px-8">
            <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-4">
              <AppIcon name="clipboard" size={28} color="#9B40D8" strokeWidth={2} />
            </View>
            <Text className="text-xl text-text-primary mb-1.5 text-center" style={{ fontFamily: font.display }}>Nenhum treino ainda</Text>
            <Text className="text-text-secondary text-sm text-center" style={{ fontFamily: font.regular }}>Seus treinos registrados vão aparecer aqui.</Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-2 pb-4"
            renderItem={({ item }) => (
              <View className="bg-surface-card border border-surface-border rounded-3xl p-5">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                    <AppIcon name="workout" size={18} color="#9B40D8" strokeWidth={2} />
                  </View>
                  <Text className="flex-1 text-sm text-text-primary" style={{ fontFamily: font.semibold }}>
                    {item.workout?.name ?? "Treino livre"}
                  </Text>
                  {item.mood ? (
                    <Text className="text-lg">{moodEmoji[item.mood] ?? ""}</Text>
                  ) : null}
                </View>
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-1.5">
                    <AppIcon name="calendar" size={14} color="#6E6382" strokeWidth={2} />
                    <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                      {new Date(item.started_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <AppIcon name="timer" size={14} color="#6E6382" strokeWidth={2} />
                    <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                      {formatDuration(item.duration_seconds)}
                    </Text>
                  </View>
                  {item.overall_rpe ? (
                    <View className="flex-row items-center gap-1.5">
                      <AppIcon name="gauge" size={14} color="#9B40D8" strokeWidth={2} />
                      <Text className="text-xs text-violet-400" style={{ fontFamily: font.bold }}>RPE {item.overall_rpe}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            )}
          />
        )}
      </View>
      </WebContainer>
    </SafeAreaView>
  );
}
