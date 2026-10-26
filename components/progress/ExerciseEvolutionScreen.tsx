import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { font, palette } from "../../lib/design/tokens";
import { AppIcon, EmptyState, SectionLabel } from "../ui";
import { LoadingScreen } from "../ui/LoadingScreen";
import { WebContainer } from "../layout/WebContainer";
import { SimpleLineChart } from "./SimpleLineChart";
import { useExerciseEvolution } from "../../hooks/queries/useExerciseEvolution";
import { evolutionSummary, type EvolutionMetric } from "../../lib/workout/evolution";
import { formatKg } from "../../lib/workout/metrics";
import { pluralize } from "../../lib/utils/plural";

const METRICS: { key: EvolutionMetric; label: string; hint: string }[] = [
  { key: "maxWeightKg", label: "Carga máx.", hint: "Maior carga em uma série válida (sem aquecimento) em cada sessão." },
  { key: "bestE1rmKg", label: "1RM estimado", hint: "Estimativa de Epley pela melhor série de 1 a 12 repetições. É uma estimativa, não um teste de carga máxima." },
  { key: "volumeKg", label: "Volume", hint: "Soma de carga × repetições das séries válidas na sessão." },
];

const shortDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

interface Props {
  /** Whose sets to show: the signed-in student, or a linked student for the trainer (RLS enforces it). */
  userId?: string;
  fallbackHref: string;
  backLabel: string;
  /** Route to a session detail; omitted → rows are not pressable. */
  sessionHref?: (sessionId: string) => string;
}

export default function ExerciseEvolutionScreen({ userId, fallbackHref, backLabel, sessionHref }: Props) {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const { data: points, name, isLoading, error, refetch } = useExerciseEvolution(userId, exerciseId);
  const [metric, setMetric] = useState<EvolutionMetric>("maxWeightKg");
  const goBack = () => (router.canGoBack() ? router.back() : router.replace(fallbackHref as never));

  if (isLoading) return <LoadingScreen />;

  const current = METRICS.find((m) => m.key === metric)!;
  const summary = points ? evolutionSummary(points, metric) : null;
  const chartData = (points ?? [])
    .filter((p) => p[metric] !== null)
    .slice(-20)
    .map((p) => ({ label: shortDate(p.date), value: p[metric] as number }));

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <WebContainer maxWidth={760}>
        <ScrollView contentContainerClassName="px-6 pt-6 pb-10">
          <Pressable onPress={goBack} accessibilityRole="button" accessibilityLabel="Voltar" className="flex-row items-center gap-1 mb-5 self-start">
            <AppIcon name="chevron-left" size={18} color={palette.textMuted} strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>{backLabel}</Text>
          </Pressable>

          {error ? (
            <EmptyState
              iconName="trend"
              title="Não foi possível carregar"
              description="Verifique sua conexão e tente novamente."
              actionLabel="Tentar novamente"
              onAction={() => refetch()}
            />
          ) : !points?.length || !summary ? (
            <EmptyState
              iconName="trend"
              title="Sem registros ainda"
              description="Finalize um treino registrando carga e repetições deste exercício para ver a evolução."
            />
          ) : (
            <>
              <Text className="text-xs uppercase text-text-muted mb-1" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>
                Evolução
              </Text>
              <Text className="text-3xl text-text-primary mb-5" style={{ fontFamily: font.display }}>{name}</Text>

              <View className="flex-row bg-surface-card border border-surface-border rounded-2xl p-1 mb-2" accessibilityRole="tablist">
                {METRICS.map((m) => (
                  <Pressable
                    key={m.key}
                    onPress={() => setMetric(m.key)}
                    accessibilityRole="tab"
                    aria-selected={metric === m.key}
                    className={`flex-1 py-2 rounded-xl items-center ${metric === m.key ? "bg-violet-500" : ""}`}
                  >
                    <Text className={`text-xs ${metric === m.key ? "text-white" : "text-text-muted"}`} style={{ fontFamily: font.semibold }}>
                      {m.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text className="text-[11px] text-text-muted mb-4 ml-1" style={{ fontFamily: font.regular }}>{current.hint}</Text>

              <View className="flex-row gap-3 mb-4">
                {[
                  { label: "Sessões", value: String(summary.sessions) },
                  { label: "Melhor", value: formatKg(summary.best) },
                  {
                    label: "Variação",
                    value: summary.change === null ? "—" : `${summary.change > 0 ? "+" : ""}${formatKg(summary.change)}`,
                  },
                ].map((c) => (
                  <View key={c.label} className="flex-1 bg-surface-card border border-surface-border rounded-2xl p-4">
                    <SectionLabel className="mb-1">{c.label}</SectionLabel>
                    <Text className="text-lg text-text-primary" style={{ fontFamily: font.semibold }}>{c.value}</Text>
                  </View>
                ))}
              </View>

              {chartData.length > 0 ? (
                <View className="mb-6">
                  <SimpleLineChart data={chartData} title={current.label} unit=" kg" trend="higher-is-better" zeroBaseline />
                </View>
              ) : (
                <View className="bg-surface-card border border-surface-border rounded-2xl p-5 mb-6">
                  <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>
                    Nenhuma série entre 1 e 12 repetições — sem 1RM estimado para este exercício.
                  </Text>
                </View>
              )}

              <SectionLabel className="mb-3">Sessões</SectionLabel>
              <View className="gap-2">
                {[...points].reverse().map((p) => {
                  const href = sessionHref?.(p.sessionId);
                  return (
                    <Pressable
                      key={p.sessionId}
                      onPress={href ? () => router.push(href as never) : undefined}
                      disabled={!href}
                      accessibilityRole={href ? "button" : undefined}
                      className="bg-surface-card border border-surface-border rounded-2xl px-4 py-3 flex-row items-center gap-3 active:bg-surface-hover"
                    >
                      <View className="flex-1">
                        <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>
                          {new Date(p.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                        </Text>
                        <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: font.regular }}>
                          {pluralize(p.workingSets, "série", "séries")} · máx. {formatKg(p.maxWeightKg)}
                          {p.bestE1rmKg !== null ? ` · 1RM est. ${formatKg(p.bestE1rmKg)}` : ""} · vol. {formatKg(p.volumeKg)}
                        </Text>
                      </View>
                      {href ? <AppIcon name="chevron-right" size={16} color={palette.textMuted} strokeWidth={2} /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </ScrollView>
      </WebContainer>
    </SafeAreaView>
  );
}
