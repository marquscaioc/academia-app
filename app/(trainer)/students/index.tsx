import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { Avatar } from "../../../components/ui/Avatar";
import { EmptyState } from "../../../components/ui/EmptyState";

interface StudentRelation {
  id: string;
  student_id: string;
  status: string;
  started_at: string;
  student?: { full_name: string; avatar_url: string | null; email?: string };
}

export default function StudentsScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [waterModal, setWaterModal] = useState<{ studentId: string; name: string } | null>(null);
  const [waterGoal, setWaterGoal] = useState("");

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
    },
  });

  const { data: students, isLoading } = useQuery({
    queryKey: ["trainer", "students", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_students")
        .select("*, student:profiles!student_id(full_name, avatar_url)")
        .eq("trainer_id", user!.id)
        .eq("status", "active")
        .order("started_at", { ascending: false });
      if (error) throw error;
      return data as StudentRelation[];
    },
    enabled: !!user,
  });

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-black text-text-primary">Alunos</Text>
          <Link href="/(trainer)/students/invite" asChild>
            <Pressable className="bg-violet-500 px-4 py-2 rounded-xl active:bg-violet-600">
              <Text className="text-white font-black text-xs">+ Convidar</Text>
            </Pressable>
          </Link>
        </View>

        {students?.length ? (
          <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-6 flex-row items-center gap-3">
            <Text className="text-2xl font-black text-violet-400">{students.length}</Text>
            <Text className="text-xs text-text-muted uppercase tracking-wider font-bold">
              aluno{students.length !== 1 ? "s" : ""} ativo{students.length !== 1 ? "s" : ""}
            </Text>
          </View>
        ) : null}

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !students?.length ? (
          <EmptyState
            icon="👥"
            title="Nenhum aluno ainda"
            description="Convide seus alunos com um codigo para comecar a gerenciar treinos e acompanhar o progresso."
          />
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-2"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(`/(trainer)/students/${item.student_id}` as never)}
                onLongPress={() => {
                  setWaterModal({ studentId: item.student_id, name: item.student?.full_name ?? "Aluno" });
                  setWaterGoal("");
                }}
                className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-4 active:bg-surface-hover"
              >
                <Avatar
                  uri={item.student?.avatar_url}
                  name={item.student?.full_name}
                  size="lg"
                />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-text-primary">
                    {item.student?.full_name}
                  </Text>
                  <Text className="text-xs text-text-muted mt-0.5">
                    Desde {new Date(item.started_at).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
                <View className="bg-violet-500/10 px-2 py-1 rounded-full">
                  <Text className="text-[10px] font-bold text-violet-400">Ativo</Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>

      {/* Water goal modal */}
      <Modal visible={!!waterModal} animationType="fade" transparent>
        <View className="flex-1 items-center justify-center bg-black/60 px-6">
          <View className="bg-dark-200 rounded-3xl p-6 w-full max-w-sm">
            <Text className="text-lg font-black text-text-primary mb-1">Meta de Agua</Text>
            <Text className="text-sm text-text-muted mb-5">{waterModal?.name}</Text>

            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
              Meta diaria (ml)
            </Text>
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
