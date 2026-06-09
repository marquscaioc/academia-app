import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useBodyMeasurements, useProgressPhotos } from "../../../hooks/queries/useProgress";
import { getSignedUrls } from "../../../lib/supabase/media";
import { usePersonalRecords } from "../../../hooks/queries/usePersonalRecords";
import { useAdherenceScore } from "../../../hooks/queries/useCheckins";
import { useWorkoutSessions } from "../../../hooks/queries/useWorkouts";
import { exportProgressReport, ProgressReportData } from "../../../lib/utils/exportPdf";
import { Card } from "../../../components/ui/Card";
import { DisplayHeading } from "../../../components/ui/DisplayHeading";
import { SectionLabel } from "../../../components/ui/SectionLabel";
import { amethystGlow, font } from "../../../lib/design/tokens";

type Period = 30 | 60 | 90;

export default function ExportReportScreen() {
  const { user, profile } = useAuth();
  const [period, setPeriod] = useState<Period>(30);
  const [exporting, setExporting] = useState(false);

  const { data: measurements } = useBodyMeasurements(user?.id);
  const { data: photos } = useProgressPhotos(user?.id);
  const { data: prs } = usePersonalRecords(user?.id);
  const { data: adherence } = useAdherenceScore(user?.id);
  const { data: sessions } = useWorkoutSessions(user?.id);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - period);

  const filteredMeasurements = (measurements ?? []).filter(
    (m) => new Date(m.measured_at) >= cutoff,
  );
  const filteredSessions = (sessions ?? []).filter(
    (s) => new Date(s.started_at) >= cutoff && s.finished_at,
  );
  const filteredPhotos = (photos ?? []).filter(
    (p) => new Date(p.taken_at) >= cutoff,
  );

  const handleExport = async () => {
    setExporting(true);
    try {
      // progress-photos e bucket privado: assina os paths antes de embutir no PDF
      const signedPhotos = await getSignedUrls(
        "progress-photos",
        filteredPhotos.map((p) => p.photo_url),
      );
      const data: ProgressReportData = {
        studentName: profile?.full_name ?? "Aluno",
        trainerName: "Personal Trainer",
        period: `Ultimos ${period} dias`,
        measurements: filteredMeasurements.map((m) => ({
          date: new Date(m.measured_at).toLocaleDateString("pt-BR"),
          weight: m.weight_kg ?? undefined,
          bodyFat: m.body_fat_pct ?? undefined,
          chest: m.chest_cm ?? undefined,
          waist: m.waist_cm ?? undefined,
          hips: m.hips_cm ?? undefined,
          bicepsLeft: m.bicep_left_cm ?? undefined,
          bicepsRight: m.bicep_right_cm ?? undefined,
          thighLeft: m.thigh_left_cm ?? undefined,
          thighRight: m.thigh_right_cm ?? undefined,
          calfLeft: m.calf_left_cm ?? undefined,
          calfRight: m.calf_right_cm ?? undefined,
        })),
        prs: (prs ?? []).map((pr) => ({
          exerciseName: pr.exercise_name,
          weight: pr.max_weight,
          reps: pr.max_reps,
          date: new Date(pr.achieved_at).toLocaleDateString("pt-BR"),
        })),
        photos: filteredPhotos.map((p) => ({
          url: signedPhotos[p.photo_url] ?? p.photo_url,
          date: new Date(p.taken_at).toLocaleDateString("pt-BR"),
          pose: p.pose ?? "frente",
        })),
        workoutCount: filteredSessions.length,
        adherenceScore: Math.round(adherence?.overallScore ?? 0),
      };
      await exportProgressReport(data);
    } catch (e) {
      Alert.alert("Erro ao exportar", "Nao foi possivel gerar o relatorio. Tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  const periods: { value: Period; label: string }[] = [
    { value: 30, label: "30 dias" },
    { value: 60, label: "60 dias" },
    { value: 90, label: "90 dias" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-2">
          <Pressable onPress={() => router.back()}>
            <Text className="text-violet-400" style={{ fontFamily: font.medium }}>← Voltar</Text>
          </Pressable>
          <View className="w-16" />
        </View>
        <DisplayHeading size="xl" className="mb-8">Exportar relatorio.</DisplayHeading>

        {/* Period selector */}
        <SectionLabel className="mb-3 ml-1">Periodo</SectionLabel>
        <View className="flex-row gap-2 mb-6">
          {periods.map((p) => (
            <Pressable
              key={p.value}
              onPress={() => setPeriod(p.value)}
              className={`flex-1 py-3 rounded-2xl items-center ${
                period === p.value ? "bg-violet-500" : "bg-surface-card border border-surface-border"
              }`}
            >
              <Text
                className={`text-sm ${period === p.value ? "text-white" : "text-text-muted"}`}
                style={{ fontFamily: font.semibold }}
              >
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Preview */}
        <Card variant="outlined" className="mb-4">
          <Text className="text-sm text-text-primary mb-3" style={{ fontFamily: font.semibold }}>O relatorio incluira:</Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>Treinos realizados</Text>
              <Text className="text-sm text-text-primary" style={{ fontFamily: font.bold }}>{filteredSessions.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>Medidas registradas</Text>
              <Text className="text-sm text-text-primary" style={{ fontFamily: font.bold }}>{filteredMeasurements.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>Recordes pessoais</Text>
              <Text className="text-sm text-text-primary" style={{ fontFamily: font.bold }}>{prs?.length ?? 0}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>Fotos de progresso</Text>
              <Text className="text-sm text-text-primary" style={{ fontFamily: font.bold }}>{filteredPhotos.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>Score de adesao</Text>
              <Text className="text-sm text-violet-400" style={{ fontFamily: font.bold }}>{Math.round(adherence?.overallScore ?? 0)}%</Text>
            </View>
          </View>
        </Card>

        <Pressable
          onPress={handleExport}
          disabled={exporting}
          className="mb-10 rounded-2xl overflow-hidden"
          style={amethystGlow}
        >
          <LinearGradient
            colors={exporting ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.9 }}
            className="items-center py-4"
          >
            {exporting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                Exportar PDF
              </Text>
            )}
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
