import { Link } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useAuth } from "../../../lib/auth/provider";
import { useWorkoutPlans, useWorkoutSessions } from "../../../hooks/queries/useWorkouts";
import { WorkoutCalendar } from "../../../components/progress/WorkoutCalendar";
import { AppIcon, BigStat, DisplayHeading, Logo, SectionLabel } from "../../../components/ui";
import { WebContainer } from "../../../components/layout/WebContainer";
import { font, palette } from "../../../lib/design/tokens";
import { recommendNextWorkout, workoutStatuses } from "../../../lib/workout/schedule";
import { useWorkoutSessionStore } from "../../../stores/useWorkoutSessionStore";

export default function WorkoutsScreen() {
  const { user } = useAuth();
  const { data: plans, isLoading, isError, refetch } = useWorkoutPlans(user?.id);
  const { data: sessions } = useWorkoutSessions(user?.id);
  const activeWorkoutId = useWorkoutSessionStore((s) => s.workoutId);
  const activeWorkoutName = useWorkoutSessionStore((s) => s.workoutName);

  const trainedDates = useMemo(() => {
    const dates = new Set<string>();
    for (const s of sessions ?? []) {
      if (s.finished_at) {
        dates.add(s.started_at.split("T")[0]);
      }
    }
    return dates;
  }, [sessions]);

  const allWorkouts = useMemo(
    () =>
      (plans ?? []).flatMap((p) =>
        (p.workouts ?? [])
          .slice()
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((w) => ({ ...w, planName: p.name })),
      ),
    [plans],
  );
  const statuses = useMemo(() => workoutStatuses(allWorkouts, sessions ?? []), [allWorkouts, sessions]);
  const nextWorkout = useMemo(() => recommendNextWorkout(allWorkouts, sessions ?? []), [allWorkouts, sessions]);

  const finishedThisWeek = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    return (sessions ?? []).filter(
      (s) => s.finished_at && new Date(s.started_at) >= weekStart
    ).length;
  }, [sessions]);

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      {/* Atmospheric top wash */}
      <LinearGradient
        colors={["rgba(198,54,224,0.15)", "transparent"]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 340 }}
        pointerEvents="none"
      />

      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
        <WebContainer maxWidth={1180}>
        {/* Masthead */}
        <Animated.View entering={FadeIn.duration(400)} className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3">
            <Logo size="sm" />
            <Text
              className="text-[10px] text-fuchsia-400"
              style={{ fontFamily: font.semibold, letterSpacing: 3 }}
            >
              VOL. 01 · TRAINING
            </Text>
          </View>
          <Link href="/(student)/(workouts)/history" asChild>
            <Pressable className="bg-surface-card border border-surface-border px-3 py-1.5 rounded-lg">
              <Text className="text-text-muted text-[11px]" style={{ fontFamily: font.semibold, letterSpacing: 0.8 }}>
                HISTÓRICO
              </Text>
            </Pressable>
          </Link>
        </Animated.View>

        {/* Editorial headline */}
        <Animated.View entering={FadeInDown.delay(80).springify()} className="mb-2">
          <DisplayHeading size="md" italic tone="muted">
            Seus
          </DisplayHeading>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(160).springify()} className="mb-8">
          <Text
            className="text-text-primary"
            style={{
              fontFamily: font.display,
              fontSize: 56,
              lineHeight: 56,
              letterSpacing: -1,
            }}
          >
            Treinos.
          </Text>
        </Animated.View>

        {activeWorkoutId ? (
          <Link href={`/(student)/(workouts)/${activeWorkoutId}`} asChild>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Retomar treino em andamento: ${activeWorkoutName ?? ""}`}
              className="flex-row items-center gap-3 bg-success-500/10 border border-success-500/30 rounded-2xl p-4 mb-6 active:opacity-80"
            >
              <View className="w-10 h-10 rounded-xl bg-success-500/20 items-center justify-center">
                <AppIcon name="play" size={18} color={palette.success} strokeWidth={2.2} />
              </View>
              <View className="flex-1">
                <Text className="text-text-primary text-sm" style={{ fontFamily: font.semibold }}>
                  Treino em andamento
                </Text>
                <Text className="text-text-secondary text-xs" numberOfLines={1} style={{ fontFamily: font.regular }}>
                  {activeWorkoutName ?? "Toque para continuar"}
                </Text>
              </View>
              <Text className="text-success-500 text-sm" style={{ fontFamily: font.semibold }}>
                Retomar
              </Text>
            </Pressable>
          </Link>
        ) : null}

        {/* Weekly pulse — big numbers */}
        <Animated.View entering={FadeInDown.delay(220).springify()} className="mb-8">
          <SectionLabel withRule className="mb-4">
            Pulso semanal
          </SectionLabel>
          <View className="flex-row items-end justify-between">
            <BigStat value={String(finishedThisWeek)} label="Concluídos" tone="accent" size="xl" />
            <View className="w-px h-14 bg-surface-border mx-4" />
            <BigStat value={String(trainedDates.size)} label="Dias totais" tone="ice" size="xl" align="center" />
          </View>
        </Animated.View>

        {/* Calendar */}
        <Animated.View entering={FadeInDown.delay(280).springify()} className="mb-8">
          <SectionLabel withRule className="mb-4">
            Calendário
          </SectionLabel>
          <WorkoutCalendar trainedDates={trainedDates} />
        </Animated.View>

        {/* Workouts list */}
        {isLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : isError ? (
          <View className="bg-surface-card border border-danger-500/30 rounded-3xl p-6 items-center mb-10">
            <AppIcon name="warning" size={24} color={palette.danger} strokeWidth={2} />
            <Text className="text-text-primary text-base mt-3 mb-1" style={{ fontFamily: font.semibold }}>
              Não foi possível carregar seus treinos
            </Text>
            <Text className="text-text-muted text-sm text-center mb-4" style={{ fontFamily: font.regular }}>
              Verifique sua conexão e tente novamente.
            </Text>
            <Pressable onPress={() => refetch()} accessibilityRole="button" className="bg-violet-500 rounded-xl px-5 py-3">
              <Text className="text-white text-sm" style={{ fontFamily: font.semibold }}>
                Tentar novamente
              </Text>
            </Pressable>
          </View>
        ) : !allWorkouts.length ? (
          <Animated.View
            entering={FadeInDown.delay(340).springify()}
            className="bg-surface-card border border-surface-border rounded-3xl p-10 items-center overflow-hidden"
          >
            <LinearGradient
              colors={["rgba(198,54,224,0.06)", "transparent"]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
              pointerEvents="none"
            />
            <View className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-5">
              <AppIcon name="workout" size={28} color="#9B40D8" strokeWidth={2} />
            </View>
            <DisplayHeading size="sm" italic className="text-center mb-2">
              Nenhum treino ainda
            </DisplayHeading>
            <Text
              className="text-sm text-text-muted text-center max-w-[260px] leading-6"
              style={{ fontFamily: font.regular }}
            >
              Seus planos aparecerão aqui assim que seu personal atribuí-los.
            </Text>
          </Animated.View>
        ) : (
          <View className="gap-3 mb-10">
            <SectionLabel withRule className="mb-2">
              Programa atual
            </SectionLabel>
            <View className="flex-row flex-wrap gap-3">
            {allWorkouts.map((w, idx) => (
              <Animated.View
                key={w.id}
                className="grow basis-[360px]"
                entering={FadeInDown.delay(300 + idx * 60).springify()}
              >
                <Link href={`/(student)/(workouts)/${w.id}`} asChild>
                  <Pressable className="bg-surface-card border border-surface-border rounded-3xl p-5 active:bg-surface-hover overflow-hidden">
                    {w.id === nextWorkout?.id ? (
                      <LinearGradient
                        colors={["rgba(198,54,224,0.12)", "transparent"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                        pointerEvents="none"
                      />
                    ) : null}

                    <View className="flex-row items-start gap-4">
                      {/* Index numeral */}
                      <View className="w-14 items-start">
                        <Text
                          className={w.id === nextWorkout?.id ? "text-fuchsia-400" : "text-text-muted"}
                          style={{
                            fontFamily: font.display,
                            fontSize: 36,
                            lineHeight: 36,
                            letterSpacing: -1,
                          }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </Text>
                      </View>

                      <View className="flex-1">
                        <Text
                          className="text-[10px] text-text-muted mb-1.5"
                          style={{ fontFamily: font.semibold, letterSpacing: 2 }}
                        >
                          {w.planName?.toUpperCase()}
                        </Text>
                        <Text
                          className="text-lg text-text-primary mb-2"
                          style={{ fontFamily: font.semibold, letterSpacing: -0.3 }}
                        >
                          {w.name}
                        </Text>
                        <View className="flex-row items-center gap-4">
                          <View className="flex-row items-center gap-1.5">
                            <AppIcon name="list" size={14} color="#9B40D8" strokeWidth={2} />
                            <Text className="text-[11px] text-violet-300" style={{ fontFamily: font.semibold }}>
                              {w.exercises?.length ?? 0} exercícios
                            </Text>
                          </View>
                          {w.estimated_duration_minutes ? (
                            <View className="flex-row items-center gap-1.5">
                              <AppIcon name="clock" size={14} color="#7FD3E0" strokeWidth={2} />
                              <Text className="text-[11px] text-ice-400" style={{ fontFamily: font.semibold }}>
                                ~{w.estimated_duration_minutes}min
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        <View className="flex-row items-center gap-2 mt-2">
                          {w.id === activeWorkoutId ? (
                            <StatusPill tone="success" label="Em andamento" />
                          ) : statuses[w.id]?.doneToday ? (
                            <StatusPill tone="success" label="Feito hoje" />
                          ) : w.id === nextWorkout?.id ? (
                            <StatusPill tone="accent" label="Próximo" />
                          ) : statuses[w.id]?.doneThisWeek ? (
                            <StatusPill tone="muted" label="Feito esta semana" />
                          ) : null}
                          <Text className="text-[11px] text-text-muted" style={{ fontFamily: font.regular }}>
                            {statuses[w.id]?.lastFinishedAt
                              ? `Último: ${new Date(statuses[w.id].lastFinishedAt as string).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}`
                              : "Ainda não realizado"}
                          </Text>
                        </View>
                      </View>

                      <View className="self-center">
                        <AppIcon name="chevron-right" size={18} color="#6E6382" strokeWidth={2} />
                      </View>
                    </View>
                  </Pressable>
                </Link>
              </Animated.View>
            ))}
            </View>
          </View>
        )}

        <View className="h-10" />
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusPill({ tone, label }: { tone: "success" | "accent" | "muted"; label: string }) {
  const cls = {
    success: "bg-success-500/15 text-success-500",
    accent: "bg-fuchsia-500/15 text-fuchsia-300",
    muted: "bg-surface-elevated text-text-secondary",
  }[tone].split(" ");
  return (
    <View className={`rounded-full px-2 py-0.5 ${cls[0]}`}>
      <Text className={`text-[10px] ${cls[1]}`} style={{ fontFamily: font.semibold, letterSpacing: 0.3 }}>
        {label}
      </Text>
    </View>
  );
}
