import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useBodyMeasurements, useProgressPhotos } from "../../../hooks/queries/useProgress";
import { usePersonalRecords } from "../../../hooks/queries/usePersonalRecords";
import { useAdherenceScore } from "../../../hooks/queries/useCheckins";
import { useWorkoutSessions } from "../../../hooks/queries/useWorkouts";
import { exportProgressReport, ProgressReportData } from "../../../lib/utils/exportPdf";
import { Card } from "../../../components/ui/Card";

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
          url: p.photo_url,
          date: new Date(p.taken_at).toLocaleDateString("pt-BR"),
          pose: p.pose ?? "frente",
        })),
        workoutCount: filteredSessions.length,
        adherenceScore: Math.round(adherence?.overallScore ?? 0),
      };
      await exportProgressReport(data);
    } catch (e) {
      // silent
    }
    setExporting(false);
  };

  const periods: { value: Period; label: string }[] = [
    { value: 30, label: "30 dias" },
    { value: 60, label: "60 dias" },
    { value: 90, label: "90 dias" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-violet-400 font-medium">← Voltar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Exportar Relatorio</Text>
          <View className="w-16" />
        </View>

        {/* Period selector */}
        <Text className="text-xs font-bold text-text-muted mb-3 ml-1 tracking-wider uppercase">
          Periodo
        </Text>
        <View className="flex-row gap-2 mb-6">
          {periods.map((p) => (
            <Pressable
              key={p.value}
              onPress={() => setPeriod(p.value)}
              className={`flex-1 py-3 rounded-xl items-center ${
                period === p.value ? "bg-violet-500" : "bg-surface-card border border-surface-border"
              }`}
            >
              <Text className={`text-sm font-bold ${period === p.value ? "text-white" : "text-text-muted"}`}>
                {p.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Preview */}
        <Card variant="outlined" className="mb-4">
          <Text className="text-sm font-bold text-text-primary mb-3">O relatorio incluira:</Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-muted">Treinos realizados</Text>
              <Text className="text-sm font-bold text-text-primary">{filteredSessions.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-muted">Medidas registradas</Text>
              <Text className="text-sm font-bold text-text-primary">{filteredMeasurements.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-muted">Recordes pessoais</Text>
              <Text className="text-sm font-bold text-text-primary">{prs?.length ?? 0}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-muted">Fotos de progresso</Text>
              <Text className="text-sm font-bold text-text-primary">{filteredPhotos.length}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-text-muted">Score de adesao</Text>
              <Text className="text-sm font-bold text-violet-400">{Math.round(adherence?.overallScore ?? 0)}%</Text>
            </View>
          </View>
        </Card>

        <Pressable
          onPress={handleExport}
          disabled={exporting}
          className={`rounded-2xl items-center py-4 mb-10 ${exporting ? "bg-violet-700" : "bg-violet-500 active:bg-violet-600"}`}
        >
          {exporting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white font-black text-base tracking-wide">Exportar PDF</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
