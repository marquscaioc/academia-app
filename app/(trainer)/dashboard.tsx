import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useAuth } from "../../lib/auth/provider";

function MetricCard({ value, label, icon, color }: { value: string; label: string; icon: string; color: string }) {
  return (
    <View className="flex-1 bg-surface-card border border-surface-border rounded-2xl p-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-2xl">{icon}</Text>
        <Text className={`text-3xl font-black ${color}`}>{value}</Text>
      </View>
      <Text className="text-xs text-text-muted uppercase tracking-wider font-bold">
        {label}
      </Text>
    </View>
  );
}

export default function TrainerDashboardScreen() {
  const { profile, signOut } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] ?? "Trainer";

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <Text className="text-xs text-violet-400 font-bold uppercase tracking-widest mb-1">
              Painel do Personal
            </Text>
            <Text className="text-3xl font-black text-text-primary tracking-tight">
              {firstName}
            </Text>
          </View>
          <Link href="/profile/edit" asChild>
            <Pressable className="w-10 h-10 bg-surface-card border border-surface-border rounded-xl items-center justify-center">
              <Text className="text-sm">⚙️</Text>
            </Pressable>
          </Link>
        </View>

        {/* CTA: Criar plano */}
        <Link href="/(trainer)/workout-builder" asChild>
          <Pressable className="bg-violet-400 rounded-2xl p-5 mb-6 flex-row items-center gap-4 active:bg-violet-500">
            <View className="w-12 h-12 bg-dark-400/20 rounded-xl items-center justify-center">
              <Text className="text-2xl">📝</Text>
            </View>
            <View className="flex-1">
              <Text className="text-dark-400 font-black text-base">Criar Plano de Treino</Text>
              <Text className="text-dark-400/70 text-xs mt-0.5">Selecione aluno, exercicios e configure</Text>
            </View>
            <Text className="text-dark-400 font-black text-lg">→</Text>
          </Pressable>
        </Link>

        {/* Metrics */}
        <View className="flex-row gap-3 mb-6">
          <MetricCard value="0" label="Alunos ativos" icon="👥" color="text-violet-400" />
          <MetricCard value="0" label="Treinos criados" icon="🏋️" color="text-ice-400" />
        </View>

        {/* Getting started */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-6">
          <View className="flex-row items-center gap-3 mb-5">
            <View className="w-10 h-10 bg-violet-400/20 rounded-xl items-center justify-center">
              <Text className="text-lg">🚀</Text>
            </View>
            <Text className="text-lg font-black text-text-primary">
              Primeiros passos
            </Text>
          </View>

          {[
            { step: "01", text: "Adicione exercicios na biblioteca", done: false },
            { step: "02", text: "Crie planos de treino", done: false },
            { step: "03", text: "Convide seus alunos", done: false },
            { step: "04", text: "Atribua treinos e acompanhe", done: false },
          ].map((item) => (
            <View key={item.step} className="flex-row items-center gap-4 py-3 border-b border-surface-border last:border-0">
              <View className={`w-8 h-8 rounded-lg items-center justify-center ${
                item.done ? "bg-violet-400" : "bg-surface-elevated"
              }`}>
                <Text className={`text-xs font-black ${
                  item.done ? "text-dark-400" : "text-text-muted"
                }`}>
                  {item.step}
                </Text>
              </View>
              <Text className={`text-sm flex-1 ${
                item.done ? "text-text-muted line-through" : "text-text-secondary"
              }`}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick stats placeholder */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-6">
          <Text className="text-xs text-text-muted uppercase tracking-wider font-bold mb-4">
            Atividade recente
          </Text>
          <View className="items-center py-6">
            <Text className="text-3xl mb-3">📈</Text>
            <Text className="text-sm text-text-muted text-center">
              Dados de atividade aparecerão aqui{"\n"}quando seus alunos comecarem a treinar.
            </Text>
          </View>
        </View>

        {/* Sign out */}
        <Pressable
          onPress={signOut}
          className="border border-surface-border rounded-2xl py-3.5 items-center mb-10 active:bg-surface-hover"
        >
          <Text className="text-text-muted font-bold text-sm">Sair da conta</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
