import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth/provider";
import { supabase } from "../../lib/supabase/client";
import { useStudentAdherenceList } from "../../hooks/queries/useStudentAdherence";
import { StudentAdherenceRow } from "../../components/trainer/StudentAdherenceRow";
import { AppIcon, DisplayHeading, SectionLabel, type IconName } from "../../components/ui";
import { font } from "../../lib/design/tokens";

function MetricCard({ value, label, icon, color }: { value: string; label: string; icon: IconName; color: string }) {
  return (
    <View className="flex-1 bg-surface-card border border-surface-border rounded-3xl p-5">
      <View className="flex-row items-center justify-between mb-3">
        <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
          <AppIcon name={icon} size={18} color="#9B40D8" strokeWidth={2} />
        </View>
        <Text className={`text-4xl ${color}`} style={{ fontFamily: font.display, letterSpacing: -0.5 }}>{value}</Text>
      </View>
      <SectionLabel>{label}</SectionLabel>
    </View>
  );
}

export default function TrainerDashboardScreen() {
  const { user, profile, signOut } = useAuth();
  const firstName = profile?.full_name?.split(" ")[0] ?? "Trainer";
  const { data: adherenceList } = useStudentAdherenceList(user?.id);

  const { data: counts } = useQuery({
    queryKey: ["trainer", "dashboard-counts", user?.id],
    queryFn: async () => {
      const [students, plans] = await Promise.all([
        supabase
          .from("trainer_students")
          .select("*", { count: "exact", head: true })
          .eq("trainer_id", user!.id)
          .eq("status", "active"),
        supabase
          .from("workout_plans")
          .select("*", { count: "exact", head: true })
          .eq("trainer_id", user!.id),
      ]);
      return {
        activeStudents: students.count ?? 0,
        workoutPlans: plans.count ?? 0,
      };
    },
    enabled: !!user,
  });

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <View>
            <SectionLabel tone="accent" className="mb-2">
              Painel do Personal
            </SectionLabel>
            <DisplayHeading size="lg">{firstName}</DisplayHeading>
          </View>
          <Link href="/profile/edit" asChild>
            <Pressable className="w-10 h-10 bg-surface-card border border-surface-border rounded-2xl items-center justify-center active:bg-surface-hover">
              <AppIcon name="settings" size={18} color="#A99FBA" strokeWidth={2} />
            </Pressable>
          </Link>
        </View>

        {/* CTA: Criar plano */}
        <Link href="/(trainer)/workout-builder" asChild>
          <Pressable className="bg-violet-500 rounded-3xl p-5 mb-6 flex-row items-center gap-4 active:bg-violet-600">
            <View className="w-12 h-12 bg-dark-400/20 rounded-2xl items-center justify-center">
              <AppIcon name="clipboard-check" size={22} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-white text-base" style={{ fontFamily: font.semibold, letterSpacing: 0.3 }}>Criar plano de treino</Text>
              <Text className="text-white/70 text-xs mt-0.5" style={{ fontFamily: font.regular }}>Selecione aluno, exercicios e configure</Text>
            </View>
            <AppIcon name="arrow-right" size={20} color="#FFFFFF" strokeWidth={2} />
          </Pressable>
        </Link>

        {/* CTA: Criar dieta */}
        <Link href="/(trainer)/diet-builder" asChild>
          <Pressable className="bg-surface-card border border-fuchsia-400/30 rounded-3xl p-5 mb-6 flex-row items-center gap-4 active:bg-surface-hover">
            <View className="w-12 h-12 bg-fuchsia-400/20 rounded-2xl items-center justify-center">
              <AppIcon name="diet" size={22} color="#C636E0" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text className="text-fuchsia-400 text-base" style={{ fontFamily: font.semibold, letterSpacing: 0.3 }}>Criar plano alimentar</Text>
              <Text className="text-text-muted text-xs mt-0.5" style={{ fontFamily: font.regular }}>Refeicoes, macros e metas para o aluno</Text>
            </View>
            <AppIcon name="arrow-right" size={20} color="#C636E0" strokeWidth={2} />
          </Pressable>
        </Link>

        {/* Metrics */}
        <View className="flex-row gap-3 mb-6">
          <MetricCard value={String(counts?.activeStudents ?? 0)} label="Alunos ativos" icon="social" color="text-violet-400" />
          <MetricCard value={String(counts?.workoutPlans ?? 0)} label="Treinos criados" icon="workout" color="text-ice-400" />
        </View>

        {/* Ferramentas (acesso direto, sobretudo no mobile onde nao ha sidebar) */}
        <View className="mb-6">
          <SectionLabel className="mb-3">Ferramentas</SectionLabel>
          <View className="flex-row flex-wrap gap-2">
            {([
              { href: "/(trainer)/checkins/builder", icon: "clipboard", label: "Check-ins" },
              { href: "/(trainer)/checkins/responses", icon: "trend", label: "Respostas" },
              { href: "/(trainer)/whatsapp", icon: "chat", label: "WhatsApp" },
              { href: "/(trainer)/courses", icon: "courses", label: "Aulas" },
              { href: "/(trainer)/checkins/branding", icon: "sparkles", label: "Branding" },
              { href: "/(trainer)/diet-builder/substitutions", icon: "repeat", label: "Substituições" },
            ] as { href: string; icon: IconName; label: string }[]).map((t) => (
              <Link key={t.href} href={t.href as never} asChild>
                <Pressable className="bg-surface-card border border-surface-border rounded-2xl px-4 py-3 flex-row items-center gap-2.5 active:bg-surface-hover">
                  <View className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                    <AppIcon name={t.icon} size={16} color="#9B40D8" strokeWidth={2} />
                  </View>
                  <Text className="text-xs text-text-secondary" style={{ fontFamily: font.semibold }}>{t.label}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>

        {/* Getting started */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-6 mb-6">
          <View className="flex-row items-center gap-3 mb-5">
            <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
              <AppIcon name="rocket" size={18} color="#9B40D8" strokeWidth={2} />
            </View>
            <DisplayHeading size="sm">Primeiros passos</DisplayHeading>
          </View>

          {[
            { step: "01", text: "Adicione exercicios na biblioteca", done: false },
            { step: "02", text: "Crie planos de treino", done: false },
            { step: "03", text: "Convide seus alunos", done: false },
            { step: "04", text: "Atribua treinos e acompanhe", done: false },
          ].map((item) => (
            <View key={item.step} className="flex-row items-center gap-4 py-3 border-b border-surface-border last:border-0">
              <View className={`w-8 h-8 rounded-lg items-center justify-center ${
                item.done ? "bg-violet-500" : "bg-surface-elevated"
              }`}>
                <Text className={`text-xs ${
                  item.done ? "text-white" : "text-text-muted"
                }`} style={{ fontFamily: font.bold }}>
                  {item.step}
                </Text>
              </View>
              <Text className={`text-sm flex-1 ${
                item.done ? "text-text-muted line-through" : "text-text-secondary"
              }`} style={{ fontFamily: font.regular }}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Student adherence alerts */}
        <View className="mb-6">
          <SectionLabel className="mb-4">Adesao dos Alunos</SectionLabel>
          {adherenceList && adherenceList.length > 0 ? (
            <View className="gap-2">
              {adherenceList.map((s) => (
                <StudentAdherenceRow
                  key={s.studentId}
                  name={s.name}
                  avatarUrl={s.avatarUrl}
                  workoutAdherence={s.workoutAdherence}
                  checkinAdherence={s.checkinAdherence}
                  overallAdherence={s.overallAdherence}
                />
              ))}
            </View>
          ) : (
            <View className="bg-surface-card border border-surface-border rounded-3xl p-6 items-center">
              <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-4">
                <AppIcon name="trend" size={28} color="#9B40D8" strokeWidth={2} />
              </View>
              <DisplayHeading size="sm" className="mb-2">Sem dados ainda</DisplayHeading>
              <Text className="text-sm text-text-muted text-center" style={{ fontFamily: font.regular }}>
                Dados de adesao aparecerão aqui{"\n"}quando seus alunos comecarem a treinar.
              </Text>
            </View>
          )}
        </View>

        {/* Sign out */}
        <Pressable
          onPress={signOut}
          className="border border-surface-border rounded-2xl py-3.5 items-center mb-10 active:bg-surface-hover"
        >
          <Text className="text-text-muted text-sm" style={{ fontFamily: font.semibold }}>Sair da conta</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
