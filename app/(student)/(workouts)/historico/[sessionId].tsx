import { useMemo } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font, palette } from "../../../../lib/design/tokens";
import { AppIcon, EmptyState, SectionLabel } from "../../../../components/ui";
import { LoadingScreen } from "../../../../components/ui/LoadingScreen";
import { WebContainer } from "../../../../components/layout/WebContainer";
import { useSessionDetail } from "../../../../hooks/queries/useWorkouts";
import { compareSessions, type ExerciseComparison } from "../../../../lib/workout/compare";
import { formatDuration, formatKg } from "../../../../lib/workout/metrics";

function formatDate(iso: string, withWeekday = false) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: withWeekday ? "long" : undefined,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Delta({ value, unit }: { value: number | null; unit: string }) {
  if (value === null) return null;
  if (value === 0) {
    return <Text className="text-xs text-text-muted" style={{ fontFamily: font.medium }}>= anterior</Text>;
  }
  const up = value > 0;
  return (
    <Text
      className="text-xs"
      style={{ fontFamily: font.semibold, color: up ? palette.success : palette.danger }}
      accessibilityLabel={`${up ? "Aumento" : "Redução"} de ${Math.abs(value)} ${unit} em relação à sessão anterior`}
    >
      {up ? "▲" : "▼"} {Math.abs(value).toLocaleString("pt-BR")} {unit}
    </Text>
  );
}

function Stat({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <View className="flex-1 bg-surface-card border border-surface-border rounded-2xl p-4">
      <Text className="text-[10px] uppercase text-text-muted mb-1" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>
        {label}
      </Text>
      <Text className="text-lg text-text-primary" style={{ fontFamily: font.semibold }}>{value}</Text>
      {children}
    </View>
  );
}

function ExerciseBlock({ ex, hasBaseline }: { ex: ExerciseComparison; hasBaseline: boolean }) {
  return (
    <View className="bg-surface-card border border-surface-border rounded-3xl p-5 mb-3">
      <View className="flex-row items-start justify-between gap-3 mb-3">
        <Text className="flex-1 text-base text-text-primary" style={{ fontFamily: font.semibold }}>{ex.exerciseName}</Text>
        <View className="items-end">
          <Text className="text-xs text-text-secondary" style={{ fontFamily: font.medium }}>
            {ex.volume.toLocaleString("pt-BR")} kg
          </Text>
          <Delta value={ex.volumeDelta} unit="kg" />
        </View>
      </View>

      <View className="flex-row px-1 mb-1">
        <Text className="w-14 text-[10px] uppercase text-text-muted" style={{ fontFamily: font.semibold }}>Série</Text>
        <Text className="flex-1 text-[10px] uppercase text-text-muted" style={{ fontFamily: font.semibold }}>Carga</Text>
        <Text className="w-16 text-right text-[10px] uppercase text-text-muted" style={{ fontFamily: font.semibold }}>Reps</Text>
      </View>
      {ex.sets.map((s) => (
        <View key={`${s.exerciseId}-${s.setNumber}`} className="flex-row items-center px-1 py-1.5 border-t border-surface-border">
          <Text className="w-14 text-sm text-text-secondary" style={{ fontFamily: font.medium }}>
            {s.isWarmup ? "Aq." : s.setNumber}
          </Text>
          <Text className="flex-1 text-sm text-text-primary" style={{ fontFamily: font.medium }}>{formatKg(s.weightKg)}</Text>
          <Text className="w-16 text-right text-sm text-text-primary" style={{ fontFamily: font.medium }}>{s.reps ?? "—"}</Text>
        </View>
      ))}

      {hasBaseline ? (
        <Text className="text-xs text-text-muted mt-3" style={{ fontFamily: font.regular }}>
          {ex.previous
            ? `Sessão anterior: ${ex.previous.workingSets} ${ex.previous.workingSets === 1 ? "série" : "séries"}, carga máx. ${formatKg(ex.previous.maxWeightKg)}`
            : "Exercício não realizado na sessão anterior deste treino."}
          {ex.maxWeightDelta ? ` (${ex.maxWeightDelta > 0 ? "+" : "−"}${Math.abs(ex.maxWeightDelta).toLocaleString("pt-BR")} kg)` : ""}
        </Text>
      ) : null}
    </View>
  );
}

export default function SessionDetailScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { data, isLoading, error, refetch } = useSessionDetail(sessionId);
  const comparison = useMemo(
    () => (data ? compareSessions(data.sets, data.previous?.sets ?? null) : null),
    [data],
  );

  const goBack = () => (router.canGoBack() ? router.back() : router.replace("/(student)/(workouts)/history" as never));

  if (isLoading) return <LoadingScreen />;

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <WebContainer maxWidth={760}>
        <ScrollView contentContainerClassName="px-6 pt-6 pb-10">
          <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Voltar" className="flex-row items-center gap-1 mb-5 self-start">
            <AppIcon name="chevron-left" size={18} color={palette.textMuted} strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Histórico</Text>
          </Pressable>

          {error || !data || !comparison ? (
            <EmptyState
              iconName="clipboard"
              title="Não foi possível abrir este treino"
              description="Verifique sua conexão e tente novamente."
              actionLabel="Tentar novamente"
              onAction={() => refetch()}
            />
          ) : (
            <>
              <Text className="text-xs uppercase text-text-muted mb-1" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>
                {formatDate(data.session.started_at, true)}
              </Text>
              <Text className="text-3xl text-text-primary mb-1" style={{ fontFamily: font.display }}>
                {data.session.workout?.name ?? "Treino livre"}
              </Text>
              {data.session.workout?.plan?.name ? (
                <Text className="text-sm text-text-secondary mb-5" style={{ fontFamily: font.regular }}>
                  {data.session.workout.plan.name}
                </Text>
              ) : (
                <View className="mb-5" />
              )}

              {!data.session.finished_at ? (
                <View className="bg-warning-500/10 border border-warning-500/25 rounded-2xl p-4 mb-5">
                  <Text className="text-sm" style={{ fontFamily: font.medium, color: palette.warning }}>
                    Este treino não foi finalizado.
                  </Text>
                </View>
              ) : null}

              <View className="flex-row gap-3 mb-3">
                <Stat label="Duração" value={data.session.duration_seconds ? formatDuration(data.session.duration_seconds) : "—"} />
                <Stat label="Volume" value={`${comparison.totalVolume.toLocaleString("pt-BR")} kg`}>
                  <Delta value={comparison.totalVolumeDelta} unit="kg" />
                </Stat>
              </View>
              <View className="flex-row gap-3 mb-6">
                <Stat label="Exercícios" value={String(comparison.exercises.length)} />
                <Stat label="Séries" value={String(comparison.exercises.reduce((n, e) => n + e.workingSets, 0))} />
              </View>

              <Text className="text-xs text-text-muted mb-4" style={{ fontFamily: font.regular }}>
                {data.previous
                  ? `Comparado com a sessão anterior deste treino (${formatDate(data.previous.started_at)}).`
                  : "Primeira vez que você registra este treino — sem sessão anterior para comparar."}
              </Text>

              <SectionLabel className="mb-3">Exercícios</SectionLabel>
              {comparison.exercises.length === 0 ? (
                <Text className="text-sm text-text-secondary" style={{ fontFamily: font.regular }}>
                  Nenhuma série registrada nesta sessão.
                </Text>
              ) : (
                comparison.exercises.map((ex) => <ExerciseBlock key={ex.exerciseId} ex={ex} hasBaseline={!!data.previous} />)
              )}

              {data.session.notes ? (
                <>
                  <SectionLabel className="mt-4 mb-2">Notas</SectionLabel>
                  <Text className="text-sm text-text-secondary" style={{ fontFamily: font.regular }}>{data.session.notes}</Text>
                </>
              ) : null}
            </>
          )}
        </ScrollView>
      </WebContainer>
    </SafeAreaView>
  );
}
