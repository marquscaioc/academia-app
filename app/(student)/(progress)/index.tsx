import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useAuth } from "../../../lib/auth/provider";
import { useBodyMeasurements, useProgressPhotos } from "../../../hooks/queries/useProgress";
import { useAdherenceScore } from "../../../hooks/queries/useCheckins";
import { Card } from "../../../components/ui/Card";
import { SimpleLineChart } from "../../../components/progress/SimpleLineChart";
import { AdherenceRing } from "../../../components/progress/AdherenceRing";
import { PhotoComparison } from "../../../components/progress/PhotoComparison";
import { CheckinScoreChart } from "../../../components/progress/CheckinScoreChart";
import { useCheckinScoreHistory } from "../../../hooks/queries/useCheckinScoreHistory";
import { useUserAchievements } from "../../../hooks/queries/useFeed";

export default function ProgressScreen() {
  const { user } = useAuth();
  const { data: measurements } = useBodyMeasurements(user?.id);
  const { data: photos } = useProgressPhotos(user?.id);
  const { data: adherence } = useAdherenceScore(user?.id);
  const { data: checkinHistory } = useCheckinScoreHistory(user?.id);
  const { data: achievements } = useUserAchievements(user?.id);

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
        <Text className="text-2xl font-black text-text-primary mb-6">Meu Progresso</Text>

        {/* Weight + Variation cards */}
        <View className="flex-row gap-3 mb-6">
          <Card variant="outlined" className="flex-1">
            <Text className="text-xs text-text-muted mb-1 uppercase tracking-wider font-bold">Peso atual</Text>
            <Text className="text-2xl font-black text-text-primary">
              {latestWeight ? `${latestWeight}kg` : "--"}
            </Text>
          </Card>
          <Card variant="outlined" className="flex-1">
            <Text className="text-xs text-text-muted mb-1 uppercase tracking-wider font-bold">Variacao</Text>
            <Text className={`text-2xl font-black ${
              weightDiff === null ? "text-text-muted" : weightDiff <= 0 ? "text-success-500" : "text-warning-500"
            }`}>
              {weightDiff !== null ? `${weightDiff > 0 ? "+" : ""}${weightDiff.toFixed(1)}kg` : "--"}
            </Text>
          </Card>
        </View>

        {/* Adherence rings */}
        {adherence ? (
          <View className="flex-row justify-around mb-6 bg-surface-card border border-surface-border rounded-2xl py-6">
            <AdherenceRing score={adherence.workoutScore} label="Treino" />
            <AdherenceRing score={adherence.checkinScore} label="Check-ins" />
            <AdherenceRing score={adherence.overallScore} label="Geral" />
          </View>
        ) : null}

        {/* Quick actions */}
        <View className="flex-row gap-3 mb-6">
          <Link href="/(student)/(progress)/add-measurement" asChild>
            <Pressable className="flex-1 bg-surface-card border border-surface-border rounded-2xl py-4 items-center active:bg-surface-hover">
              <Text className="text-xl mb-1">📏</Text>
              <Text className="text-xs font-bold text-text-secondary">Registrar medidas</Text>
            </Pressable>
          </Link>
          <Link href="/(student)/(progress)/add-photo" asChild>
            <Pressable className="flex-1 bg-surface-card border border-surface-border rounded-2xl py-4 items-center active:bg-surface-hover">
              <Text className="text-xl mb-1">📸</Text>
              <Text className="text-xs font-bold text-text-secondary">Tirar foto</Text>
            </Pressable>
          </Link>
          <Link href="/(student)/(progress)/export-report" asChild>
            <Pressable className="flex-1 bg-surface-card border border-surface-border rounded-2xl py-4 items-center active:bg-surface-hover">
              <Text className="text-xl mb-1">📄</Text>
              <Text className="text-xs font-bold text-text-secondary">Exportar PDF</Text>
            </Pressable>
          </Link>
        </View>

        {/* Weight chart */}
        <View className="mb-6">
          <SimpleLineChart data={weightData} title="Peso" unit="kg" color="#781BB6" />
        </View>

        {/* Waist chart */}
        {waistData.length > 0 ? (
          <View className="mb-6">
            <SimpleLineChart data={waistData} title="Cintura" unit="cm" color="#67E8F9" />
          </View>
        ) : null}

        {/* Achievements */}
        {achievements && achievements.length > 0 ? (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-bold text-text-muted uppercase tracking-wider">Minhas Conquistas</Text>
              <Link href="/(student)/(progress)/badges" asChild>
                <Pressable>
                  <Text className="text-violet-400 text-xs font-bold">Ver todas</Text>
                </Pressable>
              </Link>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3">
              {achievements.slice(0, 5).map((a) => (
                <View key={a.id} className="bg-violet-500/10 border border-violet-500/30 rounded-2xl px-4 py-3 items-center mr-3" style={{ minWidth: 80 }}>
                  <Text className="text-2xl mb-1">🏆</Text>
                  <Text className="text-[10px] font-bold text-text-primary text-center" numberOfLines={1}>
                    {a.achievement?.name ?? "Conquista"}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* Check-in score chart */}
        {checkinHistory && checkinHistory.length > 0 ? (
          <View className="mb-6">
            <Text className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Score de Check-in</Text>
            <Card variant="outlined">
              <CheckinScoreChart data={checkinHistory} />
            </Card>
          </View>
        ) : null}

        {/* Recent measurements */}
        <View className="mb-6">
          <Text className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Medidas recentes</Text>
          {!measurements?.length ? (
            <Card variant="outlined">
              <Text className="text-sm text-text-muted text-center">Nenhuma medida registrada.</Text>
            </Card>
          ) : (
            <View className="gap-2">
              {measurements.slice(0, 5).map((m) => (
                <Card key={m.id} variant="outlined">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-medium text-text-secondary">
                      {new Date(m.measured_at).toLocaleDateString("pt-BR")}
                    </Text>
                    <View className="flex-row gap-4">
                      {m.weight_kg ? <Text className="text-sm text-text-primary font-black">{m.weight_kg}kg</Text> : null}
                      {m.body_fat_pct ? <Text className="text-sm text-text-muted">{m.body_fat_pct}%BF</Text> : null}
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>

        {/* Before/After comparison */}
        {photos && photos.length >= 2 ? (
          <View className="mb-6">
            <Text className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Comparativo</Text>
            <PhotoComparison
              beforeUrl={photos[photos.length - 1].photo_url}
              afterUrl={photos[0].photo_url}
              beforeDate={new Date(photos[photos.length - 1].taken_at).toLocaleDateString("pt-BR")}
              afterDate={new Date(photos[0].taken_at).toLocaleDateString("pt-BR")}
            />
          </View>
        ) : null}

        {/* Progress photos */}
        <View className="mb-10">
          <Text className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Fotos de progresso</Text>
          {!photos?.length ? (
            <Card variant="outlined">
              <Text className="text-sm text-text-muted text-center">Nenhuma foto ainda.</Text>
            </Card>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {photos.slice(0, 6).map((photo) => (
                <View key={photo.id} className="w-[31%] aspect-[3/4]">
                  <Image
                    source={{ uri: photo.photo_url }}
                    style={{ width: "100%", height: "100%", borderRadius: 12 }}
                    contentFit="cover"
                  />
                  <Text className="text-[10px] text-text-muted text-center mt-1">
                    {new Date(photo.taken_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
