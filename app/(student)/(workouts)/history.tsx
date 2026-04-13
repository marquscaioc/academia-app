import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useWorkoutSessions } from "../../../hooks/queries/useWorkouts";

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
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-text-muted font-medium text-sm">← Voltar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Historico</Text>
          <View className="w-16" />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#BBFF00" />
          </View>
        ) : !sessions?.length ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-3xl mb-3">📋</Text>
            <Text className="text-text-muted text-sm">Nenhum treino registrado ainda.</Text>
          </View>
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-2 pb-4"
            renderItem={({ item }) => (
              <View className="bg-surface-card border border-surface-border rounded-2xl p-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-bold text-text-primary">
                    {item.workout?.name ?? "Treino livre"}
                  </Text>
                  {item.mood ? (
                    <Text className="text-lg">{moodEmoji[item.mood] ?? ""}</Text>
                  ) : null}
                </View>
                <View className="flex-row gap-4">
                  <Text className="text-xs text-text-muted">
                    {new Date(item.started_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </Text>
                  <Text className="text-xs text-text-muted">
                    {formatDuration(item.duration_seconds)}
                  </Text>
                  {item.overall_rpe ? (
                    <Text className="text-xs text-lime-500 font-bold">RPE {item.overall_rpe}</Text>
                  ) : null}
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
