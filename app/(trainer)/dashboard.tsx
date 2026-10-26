import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth/provider";
import { supabase } from "../../lib/supabase/client";
import { useTrainerOverview } from "../../hooks/queries/useStudentAdherence";
import { dashboardSummary, sortByAttention } from "../../lib/trainer/adherence";
import { StudentAdherenceRow } from "../../components/trainer/StudentAdherenceRow";
import { AppIcon, DisplayHeading, SectionLabel, type IconName } from "../../components/ui";
import { font } from "../../lib/design/tokens";

function MetricCard({ value, label, icon, color }: { value: string; label: string; icon: IconName; color: string }) {
  return (
    <View className="flex-1 min-w-[150px] bg-surface-card border border-surface-border rounded-3xl p-5">
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
  const { data: overview, isLoading: overviewLoading, error: overviewError, refetch: refetchOverview } = useTrainerOverview(user?.id);
  const summary = overview ? dashboardSummary(overview) : null;
  const attentionList = overview ? sortByAttention(overview) : [];

  const { data: counts } = useQuery({
    queryKey: ["trainer", "dashboard-counts", user?.id],
    queryFn: async () => {
      const [plans, assignedPlans, exercises] = await Promise.all([
        supabase
          .from("workout_plans")
          .select("*", { count: "exact", head: true })
          .eq("trainer_id", user!.id),
        supabase
          .from("workout_plans")
          .select("*", { count: "exact", head: true })
          .eq("trainer_id", user!.id)
          .not("student_id", "is", null),
        supabase
          .from("exercises")
          .select("*", { count: "exact", head: true })
          .eq("created_by", user!.id),
      ]);
      return {
        workoutPlans: plans.count ?? 0,
        assignedPlans: assignedPlans.count ?? 0,
        customExercises: exercises.count ?? 0,
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
              <Text className="text-white/70 text-xs mt-0.5" style={{ fontFamily: font.regular }}>Selecione aluno, exercícios e configure</Text>
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
              <Text className="text-text-muted text-xs mt-0.5" style={{ fontFamily: font.regular }}>Refeições, macros e metas para o aluno</Text>
            </View>
            <AppIcon name="arrow-right" size={20} color="#C636E0" strokeWidth={2} />
          </Pressable>
        </Link>

        {/* Metrics */}
        {summary ? (
          <View className="flex-row flex-wrap gap-3 mb-6">
            <MetricCard value={String(summary.activeStudents)} label="Alunos ativos" icon="social" color="text-violet-400" />
            <MetricCard
              value={`${summary.trainedLast7d}/${summary.activeStudents}`}
              label="Treinaram (7 dias)"
              icon="workout"
              color="text-ice-400"
            />
            <MetricCard value={String(summary.pendingCheckins)} label="Check-ins pendentes" icon="clipboard" color="text-fuchsia-400" />
            <MetricCard value={String(summary.plansEndingSoon)} label="Planos vencendo (7d)" icon="calendar" color="text-warning-500" />
            {summary.subscriptionsNeedingAttention > 0 ? (
              <MetricCard
                value={String(summary.subscriptionsNeedingAttention)}
                label="Assinaturas a verificar"
                icon="financial"
                color="text-danger-500"
              />
            ) : null}
          </View>
        ) : null}

        {/* Ferramentas (acesso direto, sobretudo no mobile onde nao ha sidebar) */}
        <View className="mb-6">
          <SectionLabel className="mb-3">Ferramentas</SectionLabel>
          <View className="flex-row flex-wrap gap-2">
            {([
              { href: "/(trainer)/chat", icon: "message", label: "Mensagens" },
              { href: "/(trainer)/checkins/builder", icon: "clipboard", label: "Check-ins" },
              { href: "/(trainer)/checkins/responses", icon: "trend", label: "Respostas" },
              { href: "/(trainer)/courses", icon: "courses", label: "Aulas" },
              { href: "/partners", icon: "user", label: "Parceiros" },
              { href: "/(trainer)/checkins/branding", icon: "sparkles", label: "Branding" },
              { href: "/(trainer)/diet-builder/substitutions", icon: "repeat", label: "Substituições" },
              { href: "/(trainer)/recipes/new", icon: "food", label: "Nova receita" },
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
            { step: "01", text: "Adicione exercícios na biblioteca", done: (counts?.customExercises ?? 0) > 0 },
            { step: "02", text: "Crie planos de treino", done: (counts?.workoutPlans ?? 0) > 0 },
            { step: "03", text: "Convide seus alunos", done: (summary?.activeStudents ?? 0) > 0 },
            { step: "04", text: "Atribua treinos e acompanhe", done: (counts?.assignedPlans ?? 0) > 0 },
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
          <SectionLabel className="mb-4">Acompanhamento dos alunos</SectionLabel>
          {overviewLoading ? (
            <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>Carregando…</Text>
          ) : overviewError ? (
            <Pressable onPress={() => refetchOverview()} accessibilityRole="button" className="bg-surface-card border border-danger-500/30 rounded-3xl p-5">
              <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>Não foi possível carregar os alunos.</Text>
              <Text className="text-xs text-text-muted mt-1" style={{ fontFamily: font.regular }}>Toque para tentar novamente.</Text>
            </Pressable>
          ) : attentionList.length > 0 ? (
            <View className="gap-2">
              {attentionList.map((s) => (
                <StudentAdherenceRow
                  key={s.student_id}
                  student={s}
                  onPress={() => router.push(`/(trainer)/students/${s.student_id}` as never)}
                />
              ))}
            </View>
          ) : (
            <View className="bg-surface-card border border-surface-border rounded-3xl p-6 items-center">
              <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-4">
                <AppIcon name="trend" size={28} color="#9B40D8" strokeWidth={2} />
              </View>
              <DisplayHeading size="sm" className="mb-2">Nenhum aluno ativo</DisplayHeading>
              <Text className="text-sm text-text-muted text-center mb-4" style={{ fontFamily: font.regular }}>
                Convide alunos para acompanhar treinos,{"\n"}check-ins e evolução aqui.
              </Text>
              <Link href="/(trainer)/students/invite" asChild>
                <Pressable accessibilityRole="button" className="bg-violet-500 rounded-2xl px-5 py-3 active:bg-violet-600">
                  <Text className="text-white text-sm" style={{ fontFamily: font.semibold }}>Convidar aluno</Text>
                </Pressable>
              </Link>
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
