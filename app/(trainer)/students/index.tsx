import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useUpdateStudentStatus } from "../../../hooks/mutations/useStudentStatus";
import { Avatar } from "../../../components/ui/Avatar";
import { EmptyState } from "../../../components/ui/EmptyState";

interface StudentRelation {
  id: string;
  student_id: string;
  status: "active" | "paused" | "cancelled" | "pending";
  started_at: string;
  ended_at: string | null;
  student?: { full_name: string; avatar_url: string | null };
}

type Filter = "active" | "paused" | "all";

export default function StudentsScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const updateStatus = useUpdateStudentStatus();
  const [waterModal, setWaterModal] = useState<{ studentId: string; name: string } | null>(null);
  const [waterGoal, setWaterGoal] = useState("");
  const [filter, setFilter] = useState<Filter>("active");

  const updateWaterGoal = useMutation({
    mutationFn: async ({ studentId, goalMl }: { studentId: string; goalMl: number }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ water_goal_ml: goalMl })
        .eq("id", studentId);
      if (error) throw error;
    },
    onSuccess: () => {
      setWaterModal(null);
      setWaterGoal("");
      queryClient.invalidateQueries({ queryKey: ["trainer", "students"] });
    },
  });

  const { data: allStudents, isLoading } = useQuery({
    queryKey: ["trainer", "students", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_students")
        .select("*, student:profiles!student_id(full_name, avatar_url)")
        .eq("trainer_id", user!.id)
        .order("started_at", { ascending: false });
      if (error) throw error;
      return data as StudentRelation[];
    },
    enabled: !!user,
  });

  const activeCount = allStudents?.filter((s) => s.status === "active").length ?? 0;
  const pausedCount = allStudents?.filter((s) => s.status !== "active").length ?? 0;

  const students = allStudents?.filter((s) => {
    if (filter === "active") return s.status === "active";
    if (filter === "paused") return s.status === "paused" || s.status === "cancelled";
    return true;
  });

  const handleReactivate = (studentId: string) => {
    if (!user) return;
    updateStatus.mutate({ trainer_id: user.id, student_id: studentId, status: "active" });
  };

  const handlePause = (studentId: string) => {
    if (!user) return;
    updateStatus.mutate({ trainer_id: user.id, student_id: studentId, status: "paused" });
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-black text-text-primary">Alunos</Text>
          <Link href="/(trainer)/students/invite" asChild>
            <Pressable className="bg-violet-500 px-4 py-2 rounded-xl active:bg-violet-600">
              <Text className="text-white font-black text-xs">+ Convidar</Text>
            </Pressable>
          </Link>
        </View>

        {/* Filter tabs */}
        <View className="flex-row gap-2 mb-4">
          {([
            { value: "active" as Filter, label: "Ativos", count: activeCount },
            { value: "paused" as Filter, label: "Inativos", count: pausedCount },
            { value: "all" as Filter, label: "Todos", count: null },
          ]).map((t) => (
            <Pressable
              key={t.value}
              onPress={() => setFilter(t.value)}
              className={`px-3 py-1.5 rounded-full ${
                filter === t.value ? "bg-violet-500" : "bg-surface-card border border-surface-border"
              }`}
            >
              <Text className={`text-xs font-bold ${filter === t.value ? "text-white" : "text-text-muted"}`}>
                {t.label}{t.count != null ? ` (${t.count})` : ""}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !students?.length ? (
          <EmptyState
            icon="👥"
            title="Nenhum aluno"
            description={filter === "active" ? "Convide alunos com codigo de convite." : "Nenhum aluno inativo."}
          />
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-2 pb-4"
            renderItem={({ item }) => {
              const isActive = item.status === "active";
              return (
                <View className={`bg-surface-card border rounded-2xl p-4 ${
                  isActive ? "border-surface-border" : "border-warning-500/30"
                }`}>
                  <Pressable
                    onPress={() => router.push(`/(trainer)/students/${item.student_id}` as never)}
                    onLongPress={() => {
                      setWaterModal({ studentId: item.student_id, name: item.student?.full_name ?? "Aluno" });
                      setWaterGoal("");
                    }}
                    className="flex-row items-center gap-4 active:opacity-70"
                  >
                    <Avatar uri={item.student?.avatar_url} name={item.student?.full_name} size="lg" />
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-text-primary">{item.student?.full_name}</Text>
                      <Text className="text-xs text-text-muted mt-0.5">
                        Desde {new Date(item.started_at).toLocaleDateString("pt-BR")}
                      </Text>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${
                      isActive ? "bg-violet-500/10" : item.status === "paused" ? "bg-warning-500/15" : "bg-danger-500/15"
                    }`}>
                      <Text className={`text-[10px] font-bold ${
                        isActive ? "text-violet-400" : item.status === "paused" ? "text-warning-500" : "text-danger-500"
                      }`}>
                        {isActive ? "Ativo" : item.status === "paused" ? "Pausado" : "Cancelado"}
                      </Text>
                    </View>
                  </Pressable>

                  {/* Action buttons */}
                  {!isActive ? (
                    <Pressable
                      onPress={() => handleReactivate(item.student_id)}
                      disabled={updateStatus.isPending}
                      className="bg-success-500 rounded-xl py-2.5 items-center mt-3 active:bg-success-600 flex-row justify-center gap-2"
                    >
                      <Text className="text-white text-sm">↻</Text>
                      <Text className="text-white font-black text-xs">Reativar aluno</Text>
                    </Pressable>
                  ) : (
                    <Pressable
                      onPress={() => handlePause(item.student_id)}
                      disabled={updateStatus.isPending}
                      className="border border-surface-border rounded-xl py-2 items-center mt-3 active:bg-surface-hover"
                    >
                      <Text className="text-text-muted font-bold text-xs">Pausar acompanhamento</Text>
                    </Pressable>
                  )}
                </View>
              );
            }}
          />
        )}
      </View>

      {/* Water goal modal */}
      <Modal visible={!!waterModal} animationType="fade" transparent>
        <View className="flex-1 items-center justify-center bg-black/60 px-6">
          <View className="bg-dark-200 rounded-3xl p-6 w-full max-w-sm">
            <Text className="text-lg font-black text-text-primary mb-1">Meta de Agua</Text>
            <Text className="text-sm text-text-muted mb-5">{waterModal?.name}</Text>

            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Meta diaria (ml)</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary mb-5"
              placeholder="2500"
              placeholderTextColor="#6E6580"
              value={waterGoal}
              onChangeText={setWaterGoal}
              keyboardType="numeric"
            />

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setWaterModal(null)}
                className="flex-1 bg-surface-elevated rounded-2xl py-3.5 items-center active:bg-surface-hover"
              >
                <Text className="text-text-secondary font-bold">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (waterModal && waterGoal) {
                    updateWaterGoal.mutate({ studentId: waterModal.studentId, goalMl: parseInt(waterGoal) });
                  }
                }}
                disabled={!waterGoal || updateWaterGoal.isPending}
                className="flex-1 bg-violet-500 rounded-2xl py-3.5 items-center active:bg-violet-600"
              >
                <Text className="text-white font-bold">
                  {updateWaterGoal.isPending ? "Salvando..." : "Salvar"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
