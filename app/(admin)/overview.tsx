import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth/provider";
import { supabase } from "../../lib/supabase/client";
import { font } from "../../lib/design/tokens";
import { AppIcon, type IconName } from "../../components/ui";

function MetricBox({ value, label, icon }: { value: string; label: string; icon: IconName }) {
  return (
    <View className="flex-1 bg-surface-card border border-surface-border rounded-3xl p-5">
      <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-4">
        <AppIcon name={icon} size={18} color="#9B40D8" strokeWidth={2} />
      </View>
      <Text className="text-3xl text-text-primary" style={{ fontFamily: font.display }}>{value}</Text>
      <Text
        className="text-[10px] text-text-muted mt-1 uppercase"
        style={{ fontFamily: font.semibold, letterSpacing: 2 }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function AdminOverviewScreen() {
  const { signOut } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      // RPC agrega as metricas bypassando a RLS (so para admin); contar direto
      // do client retornava ~0 porque a RLS restringe a leitura por tenant.
      const { data, error } = await supabase.rpc("admin_platform_stats");
      if (error) throw error;
      return (data ?? {}) as {
        totalUsers: number;
        trainers: number;
        students: number;
        workoutSessions: number;
        challenges: number;
        posts: number;
      };
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="mb-8">
          <Text
            className="text-danger-500 uppercase mb-2"
            style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 3 }}
          >
            Admin
          </Text>
          <Text className="text-4xl text-text-primary" style={{ fontFamily: font.display }}>
            Painel da plataforma.
          </Text>
        </View>

        <View className="flex-row gap-3 mb-3">
          <MetricBox value={String(stats?.totalUsers ?? 0)} label="Usuarios totais" icon="social" />
          <MetricBox value={String(stats?.trainers ?? 0)} label="Trainers" icon="clipboard" />
        </View>

        <View className="flex-row gap-3 mb-3">
          <MetricBox value={String(stats?.students ?? 0)} label="Alunos" icon="user" />
          <MetricBox value={String(stats?.workoutSessions ?? 0)} label="Sessoes de treino" icon="workout" />
        </View>

        <View className="flex-row gap-3 mb-8">
          <MetricBox value={String(stats?.challenges ?? 0)} label="Desafios" icon="trophy" />
          <MetricBox value={String(stats?.posts ?? 0)} label="Posts no feed" icon="message" />
        </View>

        <Pressable
          onPress={signOut}
          className="border border-surface-border rounded-2xl py-3.5 items-center mb-10 active:bg-surface-hover"
        >
          <Text
            className="text-text-muted text-sm"
            style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
          >
            Sair da conta
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
