import { Link, router } from "expo-router";
import { useState, type ReactNode } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useAuth } from "../../../lib/auth/provider";
import { useBodyMeasurements, useProgressPhotos } from "../../../hooks/queries/useProgress";
import { useAdherenceScore } from "../../../hooks/queries/useCheckins";
import { Card } from "../../../components/ui/Card";
import { AppIcon, DisplayHeading, SectionLabel } from "../../../components/ui";
import { font } from "../../../lib/design/tokens";
import { SimpleLineChart } from "../../../components/progress/SimpleLineChart";
import { AdherenceRing } from "../../../components/progress/AdherenceRing";
import { PhotoComparison } from "../../../components/progress/PhotoComparison";
import { CheckinScoreChart } from "../../../components/progress/CheckinScoreChart";
import { useCheckinScoreHistory } from "../../../hooks/queries/useCheckinScoreHistory";
import { useUserAchievements } from "../../../hooks/queries/useFeed";
import { useSignedUrls } from "../../../lib/supabase/media";
import { WebContainer } from "../../../components/layout/WebContainer";
import { useTrainedExercises } from "../../../hooks/queries/useExerciseEvolution";
import { formatKg } from "../../../lib/workout/metrics";
import { pluralize } from "../../../lib/utils/plural";

function QuerySection({ query, label, children }: {
  query: { isLoading: boolean; isError: boolean; refetch: () => unknown };
  label: string;
  children: ReactNode;
}) {
  if (query.isLoading) {
    return (
      <Card variant="outlined" className="mb-6">
        <View className="flex-row items-center gap-3" accessibilityRole="progressbar" accessibilityLabel={`Carregando ${label}`}>
          <ActivityIndicator color="#27272A" />
          <Text className="text-text-muted text-sm" style={{ fontFamily: font.regular }}>Carregando {label}...</Text>
        </View>
      </Card>
    );
  }
  if (query.isError) {
    return (
      <Card variant="outlined" className="mb-6">
        <Text accessibilityRole="alert" className="text-text-secondary text-sm" style={{ fontFamily: font.regular }}>
          Não foi possível carregar {label}.
        </Text>
        <Pressable onPress={() => { void query.refetch(); }} accessibilityRole="button" accessibilityLabel={`Tentar carregar ${label} novamente`} className="self-start py-3">
          <Text className="text-violet-400 text-sm" style={{ fontFamily: font.semibold }}>Tentar novamente</Text>
        </Pressable>
      </Card>
    );
  }
  return <>{children}</>;
}

export default function ProgressScreen() {
  const { user } = useAuth();
  const measurementsQuery = useBodyMeasurements(user?.id);
  const { data: measurements } = measurementsQuery;
  const photosQuery = useProgressPhotos(user?.id);
  const { data: photos } = photosQuery;
  const photoSigned = useSignedUrls("progress-photos", (photos ?? []).map((p) => p.photo_url));
  const adherenceQuery = useAdherenceScore(user?.id);
  const { data: adherence } = adherenceQuery;
  const checkinHistoryQuery = useCheckinScoreHistory(user?.id);
  const { data: checkinHistory } = checkinHistoryQuery;
  const achievementsQuery = useUserAchievements(user?.id);
  const { data: achievements } = achievementsQuery;
  const trainedQuery = useTrainedExercises(user?.id);
  const { data: trained } = trainedQuery;
  const [showAllExercises, setShowAllExercises] = useState(false);
  const visibleExercises = showAllExercises ? trained : trained?.slice(0, 5);

  const latestWeight = measurements?.[0]?.weight_kg;
  const firstWeight = measurements?.[measurements.length - 1]?.weight_kg;
  const weightDiff = latestWeight && firstWeight ? latestWeight - firstWeight : null;

  // Prepare chart data
  const weightData = (measurements ?? [])
    .filter((m) => m.weight_kg)
    .reverse()
    .map((m) => ({
      label: new Date(m.measured_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      value: m.weight_kg!,
    }));

  const waistData = (measurements ?? [])
    .filter((m) => m.waist_cm)
    .reverse()
    .map((m) => ({
      label: new Date(m.measured_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      value: m.waist_cm!,
    }));

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <WebContainer maxWidth={1180}>
        <DisplayHeading size="xl" className="mb-6">Meu progresso.</DisplayHeading>

        {/* Weight + Variation cards */}
        <QuerySection query={measurementsQuery} label="medidas">
        <View className="flex-row gap-3 mb-6">
          <Card variant="outlined" className="flex-1">
            <SectionLabel className="mb-1">Peso atual</SectionLabel>
            <Text className="text-3xl text-text-primary" style={{ fontFamily: font.display, letterSpacing: -0.5 }}>
              {latestWeight ? `${latestWeight}kg` : "--"}
            </Text>
          </Card>
          <Card variant="outlined" className="flex-1">
            <SectionLabel className="mb-1">Variação</SectionLabel>
            {/* Neutral on purpose: up or down is only "good" relative to the student's own goal. */}
            <Text
              className={`text-3xl ${weightDiff === null ? "text-text-muted" : "text-text-primary"}`}
              style={{ fontFamily: font.display, letterSpacing: -0.5 }}
            >
              {weightDiff !== null ? `${weightDiff > 0 ? "+" : ""}${weightDiff.toFixed(1)}kg` : "--"}
            </Text>
          </Card>
        </View>
        </QuerySection>

        {/* Adherence rings */}
        <QuerySection query={adherenceQuery} label="adesão">
        {adherence ? (
          <View className="flex-row justify-around mb-6 bg-surface-card border border-surface-border rounded-3xl py-6">
            <AdherenceRing score={adherence.workoutScore} label="Treino" emptyHint="Plano sem dias definidos" />
            <AdherenceRing score={adherence.checkinScore} label="Check-ins" emptyHint="Nenhum solicitado" />
            <AdherenceRing score={adherence.overallScore} label="Geral" emptyHint="Sem dados" />
          </View>
        ) : null}
        </QuerySection>

        {/* Quick actions */}
        <View className="flex-row gap-3 mb-6">
          <Link href="/(student)/(progress)/add-measurement" asChild>
            <Pressable className="flex-1 bg-surface-card border border-surface-border rounded-2xl py-4 items-center active:bg-surface-hover">
              <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-2">
                <AppIcon name="ruler" size={18} color="#3F3F46" strokeWidth={2} />
              </View>
              <Text className="text-xs text-text-secondary" style={{ fontFamily: font.semibold }}>Registrar medidas</Text>
            </Pressable>
          </Link>
          <Link href="/(student)/(progress)/add-photo" asChild>
            <Pressable className="flex-1 bg-surface-card border border-surface-border rounded-2xl py-4 items-center active:bg-surface-hover">
              <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-2">
                <AppIcon name="camera" size={18} color="#3F3F46" strokeWidth={2} />
              </View>
              <Text className="text-xs text-text-secondary" style={{ fontFamily: font.semibold }}>Tirar foto</Text>
            </Pressable>
          </Link>
          <Link href="/(student)/(progress)/export-report" asChild>
            <Pressable className="flex-1 bg-surface-card border border-surface-border rounded-2xl py-4 items-center active:bg-surface-hover">
              <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-2">
                <AppIcon name="file" size={18} color="#3F3F46" strokeWidth={2} />
              </View>
              <Text className="text-xs text-text-secondary" style={{ fontFamily: font.semibold }}>Exportar PDF</Text>
            </Pressable>
          </Link>
        </View>

        {/* Weight chart */}
        {measurementsQuery.isSuccess ? <View className="mb-6">
          <SimpleLineChart data={weightData} title="Peso" unit="kg" color="#27272A" />
        </View> : null}

        {/* Waist chart */}
        {measurementsQuery.isSuccess && waistData.length > 0 ? (
          <View className="mb-6">
            <SimpleLineChart data={waistData} title="Cintura" unit="cm" color="#52525B" />
          </View>
        ) : null}

        {/* Per-exercise evolution (real logged sets only) */}
        <View className="mb-6">
          <SectionLabel className="mb-3">Evolução por exercício</SectionLabel>
          <QuerySection query={trainedQuery} label="evolução dos exercícios">
          {trained && trained.length > 0 ? (
            <View className="gap-2">
              {visibleExercises?.map((e) => (
                <Pressable
                  key={e.exerciseId}
                  onPress={() => router.push(`/(student)/(progress)/evolucao/${e.exerciseId}` as never)}
                  accessibilityRole="button"
                  accessibilityLabel={`Evolução de ${e.name}`}
                  className="bg-surface-card border border-surface-border rounded-2xl px-4 py-3 flex-row items-center gap-3 active:bg-surface-hover"
                >
                  <View className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                    <AppIcon name="trend" size={16} color="#3F3F46" strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }} numberOfLines={1}>{e.name}</Text>
                    <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: font.regular }}>
                      {pluralize(e.sessions, "sessão", "sessões")} · carga máx. {formatKg(e.maxWeightKg)}
                    </Text>
                  </View>
                  <AppIcon name="chevron-right" size={16} color="#71717A" strokeWidth={2} />
                </Pressable>
              ))}
              {trained.length > 5 ? (
                <Pressable onPress={() => setShowAllExercises((v) => !v)} accessibilityRole="button" className="py-2 items-center">
                  <Text className="text-xs text-violet-400" style={{ fontFamily: font.semibold }}>
                    {showAllExercises ? "Mostrar menos" : `Ver todos (${trained.length})`}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            <View className="bg-surface-card border border-surface-border rounded-2xl p-5">
              <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>
                Finalize treinos registrando carga e repetições para ver a evolução de cada exercício.
              </Text>
            </View>
          )}
          </QuerySection>
        </View>

        {/* Achievements */}
        <QuerySection query={achievementsQuery} label="conquistas">
        {achievements && achievements.length > 0 ? (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <SectionLabel>Minhas conquistas</SectionLabel>
              <Link href="/(student)/(progress)/badges" asChild>
                <Pressable className="flex-row items-center gap-1">
                  <Text className="text-violet-400 text-xs" style={{ fontFamily: font.semibold }}>Ver todas</Text>
                  <AppIcon name="chevron-right" size={14} color="#3F3F46" strokeWidth={2} />
                </Pressable>
              </Link>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
              {achievements.slice(0, 5).map((a) => (
                <View key={a.id} className="bg-violet-500/10 border border-violet-500/30 rounded-2xl px-4 py-3 items-center mr-3" style={{ minWidth: 80 }}>
                  <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-2">
                    <AppIcon name="trophy" size={18} color="#27272A" strokeWidth={2} />
                  </View>
                  <Text className="text-[10px] text-text-primary text-center" style={{ fontFamily: font.semibold }} numberOfLines={1}>
                    {a.achievement?.name ?? "Conquista"}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}
        </QuerySection>

        {/* Check-in score chart */}
        <QuerySection query={checkinHistoryQuery} label="histórico de check-ins">
        {checkinHistory && checkinHistory.length > 0 ? (
          <View className="mb-6">
            <SectionLabel className="mb-3">Score de check-in</SectionLabel>
            <Card variant="outlined">
              <CheckinScoreChart data={checkinHistory} />
            </Card>
          </View>
        ) : null}
        </QuerySection>

        {/* Recent measurements */}
        {measurementsQuery.isSuccess ? <View className="mb-6">
          <SectionLabel className="mb-3">Medidas recentes</SectionLabel>
          {!measurements?.length ? (
            <Card variant="outlined">
              <View className="items-center py-4">
                <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-3">
                  <AppIcon name="ruler" size={28} color="#3F3F46" strokeWidth={2} />
                </View>
                <Text className="text-sm text-text-muted text-center" style={{ fontFamily: font.regular }}>Nenhuma medida registrada.</Text>
              </View>
            </Card>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {measurements.slice(0, 5).map((m) => (
                <Card key={m.id} variant="outlined" className="grow basis-[300px]">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-text-secondary" style={{ fontFamily: font.medium }}>
                      {new Date(m.measured_at).toLocaleDateString("pt-BR")}
                    </Text>
                    <View className="flex-row gap-4">
                      {m.weight_kg ? <Text className="text-sm text-text-primary" style={{ fontFamily: font.bold }}>{m.weight_kg}kg</Text> : null}
                      {m.body_fat_pct ? <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>{m.body_fat_pct}%BF</Text> : null}
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View> : null}

        {/* Before/After comparison */}
        {photosQuery.isSuccess && photos && photos.length >= 2 ? (
          <View className="mb-6">
            <SectionLabel className="mb-3">Comparativo</SectionLabel>
            <PhotoComparison
              beforeUrl={photoSigned[photos[photos.length - 1].photo_url] ?? ""}
              afterUrl={photoSigned[photos[0].photo_url] ?? ""}
              beforeDate={new Date(photos[photos.length - 1].taken_at).toLocaleDateString("pt-BR")}
              afterDate={new Date(photos[0].taken_at).toLocaleDateString("pt-BR")}
            />
          </View>
        ) : null}

        {/* Progress photos */}
        <View className="mb-10">
          <SectionLabel className="mb-3">Fotos de progresso</SectionLabel>
          <QuerySection query={photosQuery} label="fotos de progresso">
          {!photos?.length ? (
            <Card variant="outlined">
              <View className="items-center py-4">
                <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-3">
                  <AppIcon name="camera" size={28} color="#3F3F46" strokeWidth={2} />
                </View>
                <Text className="text-sm text-text-muted text-center" style={{ fontFamily: font.regular }}>Nenhuma foto ainda.</Text>
              </View>
            </Card>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {photos.slice(0, 6).map((photo) => (
                <View key={photo.id} className="w-[31%] aspect-[3/4]">
                  <Image
                    source={{ uri: photoSigned[photo.photo_url] ?? "" }}
                    style={{ width: "100%", height: "100%", borderRadius: 12 }}
                    contentFit="cover"
                  />
                  <Text className="text-[10px] text-text-muted text-center mt-1" style={{ fontFamily: font.regular }}>
                    {new Date(photo.taken_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </Text>
                </View>
              ))}
            </View>
          )}
          </QuerySection>
        </View>
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
