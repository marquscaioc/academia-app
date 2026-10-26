import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useHealthData } from "../../../hooks/queries/useHealthData";
import { useSyncHealthData } from "../../../hooks/mutations/useSyncHealth";
import { isHealthAvailable } from "../../../lib/health/healthConnect";
import { Card } from "../../../components/ui/Card";
import { AppIcon } from "../../../components/ui";
import { WebContainer } from "../../../components/layout/WebContainer";
import { font, amethystGlow } from "../../../lib/design/tokens";

export default function HealthSyncScreen() {
  const { user } = useAuth();
  const today = new Date();
  const { data: healthData } = useHealthData(today);
  const syncHealth = useSyncHealthData();
  const available = isHealthAvailable();

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <WebContainer maxWidth={1180}>
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <AppIcon name="arrow-left" size={18} color="#9B40D8" strokeWidth={2} />
            <Text className="text-violet-400" style={{ fontFamily: font.medium }}>Voltar</Text>
          </Pressable>
          <Text className="text-2xl text-text-primary" style={{ fontFamily: font.display }}>Saúde & sync</Text>
          <View className="w-16" />
        </View>

        {!available ? (
          <Card variant="outlined" className="items-center py-8">
            <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-4">
              <AppIcon name="device" size={28} color="#9B40D8" strokeWidth={2} />
            </View>
            <Text className="text-base text-text-primary mb-2" style={{ fontFamily: font.display }}>Disponível no celular</Text>
            <Text className="text-xs text-text-muted text-center" style={{ fontFamily: font.regular }}>
              A integracao com Apple Health / Google Fit esta disponivel apenas no app nativo (iOS/Android).
            </Text>
          </Card>
        ) : (
          <>
            {/* Today's data */}
            <Text className="text-xs text-text-muted mb-3 uppercase" style={{ fontFamily: font.semibold, letterSpacing: 2 }}>Dados de hoje</Text>
            <View className="flex-row gap-3 mb-6">
              <Card className="flex-1 items-center py-4">
                <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-2">
                  <AppIcon name="steps" size={18} color="#9B40D8" strokeWidth={2} />
                </View>
                <Text className="text-3xl text-violet-400" style={{ fontFamily: font.display }}>{healthData?.steps ?? 0}</Text>
                <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.regular }}>Passos</Text>
              </Card>
              <Card className="flex-1 items-center py-4">
                <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-2">
                  <AppIcon name="energy" size={18} color="#9B40D8" strokeWidth={2} />
                </View>
                <Text className="text-3xl text-ice-400" style={{ fontFamily: font.display }}>{healthData?.calories ?? 0}</Text>
                <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.regular }}>Calorias</Text>
              </Card>
              <Card className="flex-1 items-center py-4">
                <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-2">
                  <AppIcon name="workout" size={18} color="#9B40D8" strokeWidth={2} />
                </View>
                <Text className="text-3xl text-success-500" style={{ fontFamily: font.display }}>{healthData?.workouts.length ?? 0}</Text>
                <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.regular }}>Treinos</Text>
              </Card>
            </View>

            {/* Sync button */}
            <Pressable
              onPress={() => user && syncHealth.mutate({ userId: user.id, date: today })}
              disabled={syncHealth.isPending}
              className="rounded-2xl overflow-hidden mb-6"
              style={amethystGlow}
            >
              <LinearGradient
                colors={syncHealth.isPending ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                className="py-4 flex-row items-center justify-center gap-2"
              >
                <AppIcon name={syncHealth.isPending ? "refresh" : "repeat"} size={18} color="#FFFFFF" strokeWidth={2} />
                <Text className="text-white text-base" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                  {syncHealth.isPending ? "Sincronizando..." : "Sincronizar agora"}
                </Text>
              </LinearGradient>
            </Pressable>

            {syncHealth.data ? (
              <Card variant="outlined" className="mb-6 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-2xl bg-success-500/15 border border-success-500/25 items-center justify-center">
                  <AppIcon name="check-circle" size={18} color="#34D399" strokeWidth={2} />
                </View>
                <Text className="text-sm text-text-primary flex-1" style={{ fontFamily: font.regular }}>
                  {syncHealth.data.synced} treinos sincronizados
                </Text>
              </Card>
            ) : null}

            {/* External workouts */}
            {healthData?.workouts.length ? (
              <View>
                <Text className="text-xs text-text-muted mb-3 uppercase" style={{ fontFamily: font.semibold, letterSpacing: 2 }}>Treinos externos</Text>
                <View className="flex-row flex-wrap gap-4">
                {healthData.workouts.map((w, idx) => (
                  <Card key={idx} variant="outlined" className="grow basis-[300px] mb-2 flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                      <AppIcon name="activity" size={18} color="#9B40D8" strokeWidth={2} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{w.name}</Text>
                      <Text className="text-xs text-text-muted mt-1" style={{ fontFamily: font.regular }}>
                        {w.duration}min | {w.calories} cal
                      </Text>
                    </View>
                  </Card>
                ))}
                </View>
              </View>
            ) : null}
          </>
        )}
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
