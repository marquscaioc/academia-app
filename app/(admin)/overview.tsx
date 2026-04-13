import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth/provider";
import { supabase } from "../../lib/supabase/client";

function MetricBox({ value, label, icon }: { value: string; label: string; icon: string }) {
  return (
    <View className="flex-1 bg-surface-card border border-surface-border rounded-2xl p-5">
      <Text className="text-2xl mb-2">{icon}</Text>
      <Text className="text-3xl font-black text-text-primary">{value}</Text>
      <Text className="text-[10px] text-text-muted mt-1 uppercase tracking-wider font-bold">{label}</Text>
    </View>
  );
}

export default function AdminOverviewScreen() {
  const { signOut } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: trainers } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "trainer");
      const { count: students } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student");
      const { count: workoutSessions } = await supabase.from("workout_sessions").select("*", { count: "exact", head: true });
      const { count: challenges } = await supabase.from("challenges").select("*", { count: "exact", head: true });
      const { count: posts } = await supabase.from("feed_posts").select("*", { count: "exact", head: true });

      return {
        totalUsers: totalUsers ?? 0,
        trainers: trainers ?? 0,
        students: students ?? 0,
        workoutSessions: workoutSessions ?? 0,
        challenges: challenges ?? 0,
        posts: posts ?? 0,
      };
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="mb-8">
          <Text className="text-xs text-danger-500 font-black uppercase tracking-widest mb-1">Admin</Text>
          <Text className="text-3xl font-black text-text-primary tracking-tight">Painel da Plataforma</Text>
        </View>

        <View className="flex-row gap-3 mb-3">
          <MetricBox value={String(stats?.totalUsers ?? 0)} label="Usuarios totais" icon="👥" />
          <MetricBox value={String(stats?.trainers ?? 0)} label="Trainers" icon="📋" />
        </View>

        <View className="flex-row gap-3 mb-3">
          <MetricBox value={String(stats?.students ?? 0)} label="Alunos" icon="💪" />
          <MetricBox value={String(stats?.workoutSessions ?? 0)} label="Sessoes de treino" icon="🏋️" />
        </View>

        <View className="flex-row gap-3 mb-8">
          <MetricBox value={String(stats?.challenges ?? 0)} label="Desafios" icon="🏆" />
          <MetricBox value={String(stats?.posts ?? 0)} label="Posts no feed" icon="📱" />
        </View>

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
