import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useCreatePost } from "../../../hooks/mutations/useSocialMutations";
import { WorkoutSummaryCard } from "../../../components/workout/WorkoutSummaryCard";
import { WebContainer } from "../../../components/layout/WebContainer";
import { AppIcon, Button } from "../../../components/ui";
import { font, palette } from "../../../lib/design/tokens";
import { formatKg } from "../../../lib/workout/metrics";

interface RecordParam {
  name: string;
  kind: "max_weight" | "e1rm" | "set_volume";
  value: number;
}

const RECORD_LABEL: Record<RecordParam["kind"], string> = {
  max_weight: "Maior carga",
  e1rm: "1RM estimado",
  set_volume: "Maior volume em uma série",
};

function parseRecords(raw?: string): RecordParam[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((r) => r && typeof r.name === "string" && r.kind in RECORD_LABEL) : [];
  } catch {
    return [];
  }
}

export default function SessionCompleteScreen() {
  const params = useLocalSearchParams<{
    workoutName?: string;
    duration?: string;
    volume?: string;
    exercises?: string;
    sets?: string;
    plannedSets?: string;
    records?: string;
  }>();
  const { user, profile } = useAuth();
  const createPost = useCreatePost();
  const [shareError, setShareError] = useState<string | null>(null);

  const workoutName = params.workoutName ?? "Treino";
  const duration = params.duration ?? "0:00";
  const totalVolume = parseInt(params.volume ?? "0", 10) || 0;
  const exerciseCount = parseInt(params.exercises ?? "0", 10) || 0;
  const setsCompleted = parseInt(params.sets ?? "0", 10) || 0;
  const plannedSets = parseInt(params.plannedSets ?? "0", 10) || 0;
  const records = useMemo(() => parseRecords(params.records), [params.records]);
  const streak = profile?.current_streak ?? 0;
  const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const handleShare = async () => {
    if (!user) return;
    setShareError(null);
    try {
      await createPost.mutateAsync({
        author_id: user.id,
        post_type: "workout_completed",
        content: `Treino "${workoutName}" concluído! ${duration} | ${totalVolume} kg de volume | ${setsCompleted} séries`,
      });
      router.replace("/(student)/(social)");
    } catch {
      setShareError("Não foi possível publicar agora. Tente novamente.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <WebContainer maxWidth={640}>
          <View className="px-6 pt-10 items-center">
            <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-5">
              <AppIcon name="celebrate" size={28} color={palette.violet400} strokeWidth={2} />
            </View>
            <Text
              className="text-text-muted mb-2"
              style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}
            >
              Treino concluído
            </Text>
            <Text className="text-text-primary mb-8" style={{ fontFamily: font.display, fontSize: 34, lineHeight: 38 }}>
              Parabéns.
            </Text>

            <View className="w-full">
              <WorkoutSummaryCard
                workoutName={workoutName}
                duration={duration}
                totalVolume={totalVolume}
                exerciseCount={exerciseCount}
                setsCompleted={setsCompleted}
                streak={streak}
                date={date}
              />
            </View>

            {plannedSets > 0 ? (
              <Text className="text-xs text-text-muted mt-3" style={{ fontFamily: font.medium }}>
                {setsCompleted} de {plannedSets} séries prescritas concluídas
              </Text>
            ) : null}

            {records.length > 0 ? (
              <View className="w-full bg-surface-card border border-warning-500/30 rounded-3xl p-5 mt-6">
                <View className="flex-row items-center gap-2 mb-3">
                  <AppIcon name="trophy" size={18} color={palette.warning} strokeWidth={2} />
                  <Text className="text-text-primary text-base" style={{ fontFamily: font.semibold }}>
                    {records.length === 1 ? "Novo recorde pessoal" : `${records.length} novos recordes pessoais`}
                  </Text>
                </View>
                <View className="gap-2">
                  {records.map((r, i) => (
                    <View key={`${r.name}-${r.kind}-${i}`} className="flex-row items-center justify-between">
                      <View className="flex-1 pr-3">
                        <Text className="text-sm text-text-primary" numberOfLines={1} style={{ fontFamily: font.medium }}>
                          {r.name}
                        </Text>
                        <Text className="text-[11px] text-text-muted" style={{ fontFamily: font.regular }}>
                          {RECORD_LABEL[r.kind]}
                        </Text>
                      </View>
                      <Text className="text-sm text-warning-500" style={{ fontFamily: font.bold }}>
                        {r.kind === "set_volume" ? `${Math.round(r.value)} kg` : formatKg(r.value)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null}

            <View className="w-full gap-3 mt-8">
              {shareError ? (
                <Text className="text-xs text-danger-500 text-center" accessibilityRole="alert">
                  {shareError}
                </Text>
              ) : null}
              <Button title="Compartilhar no feed" onPress={handleShare} loading={createPost.isPending} />
              <Button title="Ver histórico" variant="secondary" onPress={() => router.replace("/(student)/(workouts)/history" as never)} />
              <Button title="Fechar" variant="ghost" onPress={() => router.replace("/(student)/(home)")} />
            </View>
          </View>
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
