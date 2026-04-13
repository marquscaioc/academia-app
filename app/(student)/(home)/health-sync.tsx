import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useHealthData } from "../../../hooks/queries/useHealthData";
import { useSyncHealthData } from "../../../hooks/mutations/useSyncHealth";
import { isHealthAvailable } from "../../../lib/health/healthConnect";
import { Card } from "../../../components/ui/Card";

export default function HealthSyncScreen() {
  const { user } = useAuth();
  const today = new Date();
  const { data: healthData } = useHealthData(today);
  const syncHealth = useSyncHealthData();
  const available = isHealthAvailable();

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-violet-400 font-medium">← Voltar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Saude & Sync</Text>
          <View className="w-16" />
        </View>

        {!available ? (
          <Card variant="outlined" className="items-center py-8">
            <Text className="text-3xl mb-3">📱</Text>
            <Text className="text-sm font-bold text-text-primary mb-2">Disponivel no celular</Text>
            <Text className="text-xs text-text-muted text-center">
              A integracao com Apple Health / Google Fit esta disponivel apenas no app nativo (iOS/Android).
            </Text>
          </Card>
        ) : (
          <>
            {/* Today's data */}
            <Text className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Dados de hoje</Text>
            <View className="flex-row gap-3 mb-6">
              <Card className="flex-1 items-center py-4">
                <Text className="text-3xl font-black text-violet-400">{healthData?.steps ?? 0}</Text>
                <Text className="text-[10px] text-text-muted">Passos</Text>
              </Card>
              <Card className="flex-1 items-center py-4">
                <Text className="text-3xl font-black text-ice-400">{healthData?.calories ?? 0}</Text>
                <Text className="text-[10px] text-text-muted">Calorias</Text>
              </Card>
              <Card className="flex-1 items-center py-4">
                <Text className="text-3xl font-black text-success-500">{healthData?.workouts.length ?? 0}</Text>
                <Text className="text-[10px] text-text-muted">Treinos</Text>
              </Card>
            </View>

            {/* Sync button */}
            <Pressable
              onPress={() => user && syncHealth.mutate({ userId: user.id, date: today })}
              disabled={syncHealth.isPending}
              className="bg-violet-500 rounded-2xl py-4 items-center mb-6 active:bg-violet-600"
            >
              <Text className="text-white font-black text-base">
                {syncHealth.isPending ? "Sincronizando..." : "Sincronizar Agora"}
              </Text>
            </Pressable>

            {syncHealth.data ? (
              <Card variant="outlined" className="mb-6">
                <Text className="text-sm text-text-primary">
                  {syncHealth.data.synced} treinos sincronizados
                </Text>
              </Card>
            ) : null}

            {/* External workouts */}
            {healthData?.workouts.length ? (
              <View>
                <Text className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Treinos Externos</Text>
                {healthData.workouts.map((w, idx) => (
                  <Card key={idx} variant="outlined" className="mb-2">
                    <Text className="text-sm font-bold text-text-primary">{w.name}</Text>
                    <Text className="text-xs text-text-muted mt-1">
                      {w.duration}min | {w.calories} cal
                    </Text>
                  </Card>
                ))}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
