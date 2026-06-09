import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useRevenueStats, useSubscriptionPlans, usePaymentRecords } from "../../../hooks/queries/useFinancial";
import { useMarkPaymentPaid, useCreateSubscription, useRecordPayment } from "../../../hooks/mutations/useFinancialMutations";
import { Card } from "../../../components/ui/Card";
import { useState } from "react";

function formatCurrency(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`;
}

function AssignPlanModal({
  plan,
  trainerId,
  onClose,
}: {
  plan: { id: string; name: string; price_cents: number };
  trainerId: string;
  onClose: () => void;
}) {
  const createSub = useCreateSubscription();
  const recordPayment = useRecordPayment();
  const { data: students } = useQuery({
    queryKey: ["trainer", "students-active", trainerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_students")
        .select("student_id, student:profiles!student_id(full_name, avatar_url)")
        .eq("trainer_id", trainerId)
        .eq("status", "active");
      if (error) throw error;
      return data as unknown as { student_id: string; student: { full_name: string; avatar_url: string | null } | null }[];
    },
  });

  const busy = createSub.isPending || recordPayment.isPending;

  const assign = async (studentId: string) => {
    try {
      const sub = await createSub.mutateAsync({ student_id: studentId, plan_id: plan.id, trainer_id: trainerId });
      // Gera a 1a cobranca pendente do periodo
      await recordPayment.mutateAsync({
        subscription_id: sub.id,
        trainer_id: trainerId,
        student_id: studentId,
        amount_cents: plan.price_cents,
        status: "pending",
        due_date: new Date().toISOString(),
      });
      onClose();
    } catch {
      // mantem o modal aberto; o aluno pode ja ter o plano
    }
  };

  return (
    <Modal visible animationType="slide" transparent>
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-dark-200 border-t border-surface-border rounded-t-3xl px-6 pt-6 pb-10 max-h-[70%]">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-lg font-black text-text-primary">Atribuir plano</Text>
            <Pressable onPress={onClose}>
              <Text className="text-text-muted text-lg">✕</Text>
            </Pressable>
          </View>
          <Text className="text-xs text-text-muted mb-4">
            {plan.name} · {formatCurrency(plan.price_cents)}
          </Text>
          {!students?.length ? (
            <Text className="text-sm text-text-muted text-center py-6">Nenhum aluno ativo.</Text>
          ) : (
            <ScrollView>
              {students.map((s) => (
                <Pressable
                  key={s.student_id}
                  onPress={() => assign(s.student_id)}
                  disabled={busy}
                  className="flex-row items-center justify-between p-4 mb-2 rounded-2xl border border-surface-border bg-surface-card active:bg-surface-hover"
                >
                  <Text className="text-sm font-bold text-text-primary">{s.student?.full_name ?? "Aluno"}</Text>
                  <Text className="text-violet-400 font-bold text-xs">Atribuir</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function FinancialScreen() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useRevenueStats(user?.id);
  const { data: plans } = useSubscriptionPlans(user?.id);
  const { data: payments } = usePaymentRecords(user?.id);
  const markPaid = useMarkPaymentPaid();
  const [tab, setTab] = useState<"overview" | "plans" | "payments">("overview");
  const [assignPlan, setAssignPlan] = useState<{ id: string; name: string; price_cents: number } | null>(null);

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-black text-text-primary">Financeiro</Text>
          <Link href="/(trainer)/financial/create-plan" asChild>
            <Pressable className="bg-violet-500 px-4 py-2 rounded-xl active:bg-violet-600">
              <Text className="text-white font-black text-xs">+ Plano</Text>
            </Pressable>
          </Link>
        </View>

        {/* Revenue cards */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 bg-surface-card border border-surface-border rounded-2xl p-5">
            <Text className="text-xs text-text-muted uppercase tracking-wider font-bold mb-2">MRR</Text>
            <Text className="text-2xl font-black text-violet-400">
              {statsLoading ? "..." : formatCurrency(stats?.mrr ?? 0)}
            </Text>
          </View>
          <View className="flex-1 bg-surface-card border border-surface-border rounded-2xl p-5">
            <Text className="text-xs text-text-muted uppercase tracking-wider font-bold mb-2">Alunos</Text>
            <Text className="text-2xl font-black text-ice-400">
              {statsLoading ? "..." : stats?.activeStudents}
            </Text>
          </View>
        </View>

        {stats?.pendingPayments ? (
          <View className="bg-warning-500/10 border border-warning-500/20 rounded-2xl p-4 mb-6 flex-row items-center gap-3">
            <Text className="text-lg">⚠️</Text>
            <Text className="text-sm text-warning-500 font-bold flex-1">
              {stats.pendingPayments} pagamento(s) pendente(s)
            </Text>
          </View>
        ) : null}

        {/* Tabs */}
        <View className="flex-row border-b border-surface-border mb-4">
          {(["overview", "plans", "payments"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              className={`flex-1 py-3 items-center border-b-2 ${
                tab === t ? "border-violet-500" : "border-transparent"
              }`}
            >
              <Text className={`font-bold text-xs uppercase tracking-wider ${
                tab === t ? "text-violet-400" : "text-text-muted"
              }`}>
                {t === "overview" ? "Resumo" : t === "plans" ? "Planos" : "Pagamentos"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab content */}
        {tab === "overview" ? (
          <View className="gap-3 mb-10">
            <Card variant="outlined">
              <Text className="text-xs text-text-muted uppercase tracking-wider font-bold mb-3">
                Receita prevista (mensal)
              </Text>
              <Text className="text-3xl font-black text-text-primary">
                {formatCurrency(stats?.mrr ?? 0)}
              </Text>
              <Text className="text-xs text-text-muted mt-1">
                Baseado em {stats?.activeStudents ?? 0} assinaturas ativas
              </Text>
            </Card>
          </View>
        ) : tab === "plans" ? (
          <View className="gap-3 mb-10">
            {!plans?.length ? (
              <Card variant="outlined">
                <Text className="text-sm text-text-muted text-center py-4">
                  Nenhum plano criado. Crie seu primeiro plano!
                </Text>
              </Card>
            ) : (
              plans.map((plan) => (
                <Card key={plan.id} variant="outlined">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-base font-bold text-text-primary">{plan.name}</Text>
                    <View className={`px-2 py-1 rounded-full ${plan.is_active ? "bg-violet-500/10" : "bg-surface-elevated"}`}>
                      <Text className={`text-[10px] font-bold ${plan.is_active ? "text-violet-400" : "text-text-muted"}`}>
                        {plan.is_active ? "Ativo" : "Inativo"}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xl font-black text-violet-400">
                    {formatCurrency(plan.price_cents)}
                    <Text className="text-xs text-text-muted font-normal">/{plan.billing_interval === "monthly" ? "mes" : plan.billing_interval}</Text>
                  </Text>
                  {plan.description ? (
                    <Text className="text-xs text-text-muted mt-2">{plan.description}</Text>
                  ) : null}
                  <Pressable
                    onPress={() => setAssignPlan({ id: plan.id, name: plan.name, price_cents: plan.price_cents })}
                    className="border border-violet-500/30 rounded-xl py-2.5 items-center mt-3 active:bg-violet-500/10"
                  >
                    <Text className="text-violet-400 font-bold text-xs">Atribuir a aluno</Text>
                  </Pressable>
                </Card>
              ))
            )}
          </View>
        ) : (
          <View className="gap-2 mb-10">
            {!payments?.length ? (
              <Card variant="outlined">
                <Text className="text-sm text-text-muted text-center py-4">
                  Nenhum pagamento registrado ainda.
                </Text>
              </Card>
            ) : (
              payments.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => p.status === "pending" && markPaid.mutate(p.id)}
                  className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-3"
                >
                  <View className={`w-3 h-3 rounded-full ${
                    p.status === "paid" ? "bg-success-500" : p.status === "pending" ? "bg-warning-500" : "bg-danger-500"
                  }`} />
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-text-primary">{p.student?.full_name}</Text>
                    <Text className="text-xs text-text-muted">
                      {p.due_date ? new Date(p.due_date).toLocaleDateString("pt-BR") : ""}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-sm font-black text-text-primary">{formatCurrency(p.amount_cents)}</Text>
                    <Text className={`text-[10px] font-bold ${
                      p.status === "paid" ? "text-success-500" : p.status === "pending" ? "text-warning-500" : "text-danger-500"
                    }`}>
                      {p.status === "paid" ? "Pago" : p.status === "pending" ? "Pendente" : "Falhou"}
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {assignPlan && user ? (
        <AssignPlanModal plan={assignPlan} trainerId={user.id} onClose={() => setAssignPlan(null)} />
      ) : null}
    </SafeAreaView>
  );
}
