import { Link } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useWorkoutPlans, useWorkoutSessions } from "../../../hooks/queries/useWorkouts";
import { WorkoutCalendar } from "../../../components/progress/WorkoutCalendar";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function WorkoutsScreen() {
  const { user } = useAuth();
  const { data: plans, isLoading } = useWorkoutPlans(user?.id);
  const { data: sessions } = useWorkoutSessions(user?.id);

  const trainedDates = useMemo(() => {
    const dates = new Set<string>();
    for (const s of sessions ?? []) {
      if (s.finished_at) {
        dates.add(s.started_at.split("T")[0]);
      }
    }
    return dates;
  }, [sessions]);

  const allWorkouts = plans?.flatMap((p) => (p.workouts ?? []).map((w) => ({ ...w, planName: p.name }))) ?? [];

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-black text-text-primary">Meus Treinos</Text>
          <Link href="/(student)/(workouts)/history" asChild>
            <Pressable className="bg-surface-card border border-surface-border px-3 py-1.5 rounded-lg">
              <Text className="text-text-muted font-bold text-xs">Historico</Text>
            </Pressable>
          </Link>
        </View>

        {/* Calendar */}
        <View className="mb-6">
          <WorkoutCalendar trainedDates={trainedDates} />
        </View>

        {/* Workouts list */}
        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !allWorkouts.length ? (
          <View className="bg-surface-card border border-surface-border rounded-2xl p-8 items-center">
            <Text className="text-3xl mb-3">🏋️</Text>
            <Text className="text-base font-bold text-text-primary">Nenhum treino ainda</Text>
            <Text className="text-sm text-text-muted text-center mt-2 max-w-[260px] leading-5">
              Seus planos de treino aparecerão aqui quando seu personal atribui-los.
            </Text>
          </View>
        ) : (
          <View className="gap-3 mb-10">
            <Text className="text-xs font-bold text-text-muted tracking-wider uppercase mb-1">
              Seus treinos
            </Text>
            {allWorkouts.map((w) => (
              <Link key={w.id} href={`/(student)/(workouts)/${w.id}`} asChild>
                <Pressable className="bg-surface-card border border-surface-border rounded-2xl p-5 active:bg-surface-hover">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-base font-bold text-text-primary">{w.name}</Text>
                    <View className="bg-violet-500/10 px-2 py-1 rounded-full">
                      <Text className="text-[10px] font-bold text-violet-400">
                        {w.exercises?.length ?? 0} exercicios
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs text-text-muted">{w.planName}</Text>
                  {w.estimated_duration_minutes ? (
                    <Text className="text-xs text-text-muted mt-1">~{w.estimated_duration_minutes}min</Text>
                  ) : null}
                </Pressable>
              </Link>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
