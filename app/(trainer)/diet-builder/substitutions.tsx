import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useDietPlans } from "../../../hooks/queries/useDiet";
import { useCreateSubstitution } from "../../../hooks/mutations/useSubstitutionMutations";
import { Avatar } from "../../../components/ui/Avatar";

export default function SubstitutionsScreen() {
  const { user } = useAuth();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string>("");
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [foodName, setFoodName] = useState("");
  const [cal, setCal] = useState("");
  const [prot, setProt] = useState("");
  const createSub = useCreateSubstitution();

  const { data: students } = useQuery({
    queryKey: ["trainer", "students-active", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_students")
        .select("student_id, student:profiles!student_id(full_name, avatar_url)")
        .eq("trainer_id", user!.id)
        .eq("status", "active");
      if (error) throw error;
      return data as unknown as { student_id: string; student: { full_name: string; avatar_url: string | null } | null }[];
    },
    enabled: !!user,
  });

  const { data: plans, isLoading: plansLoading } = useDietPlans(studentId ?? undefined);

  const resetForm = () => {
    setActiveItem(null);
    setFoodName("");
    setCal("");
    setProt("");
  };

  const submit = async (itemId: string) => {
    if (!user || !foodName.trim()) return;
    try {
      await createSub.mutateAsync({
        original_item_id: itemId,
        substitute_food_name: foodName.trim(),
        substitute_calories: cal ? parseFloat(cal) : undefined,
        substitute_protein_g: prot ? parseFloat(prot) : undefined,
        created_by: user.id,
      });
      resetForm();
    } catch {
      // ignore; mantem o form
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => (studentId ? (setStudentId(null), resetForm()) : router.back())}>
            <Text className="text-text-muted font-medium text-sm">← Voltar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Substituições</Text>
          <View className="w-12" />
        </View>

        {!studentId ? (
          // 1) Escolher aluno
          <View className="gap-2">
            <Text className="text-xs text-text-muted uppercase tracking-wider font-bold mb-1">Escolha o aluno</Text>
            {!students?.length ? (
              <Text className="text-sm text-text-muted text-center py-8">Nenhum aluno ativo.</Text>
            ) : (
              students.map((s) => (
                <Pressable
                  key={s.student_id}
                  onPress={() => {
                    setStudentId(s.student_id);
                    setStudentName(s.student?.full_name ?? "Aluno");
                  }}
                  className="flex-row items-center gap-3 p-4 rounded-2xl border border-surface-border bg-surface-card active:bg-surface-hover"
                >
                  <Avatar uri={s.student?.avatar_url} name={s.student?.full_name} size="md" />
                  <Text className="text-sm font-bold text-text-primary flex-1">{s.student?.full_name}</Text>
                  <Text className="text-text-muted text-lg">›</Text>
                </Pressable>
              ))
            )}
          </View>
        ) : plansLoading ? (
          <View className="items-center py-10">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !plans?.length || !plans[0].meals?.length ? (
          <View className="items-center py-10">
            <Text className="text-sm text-text-muted text-center">
              {studentName} não tem um plano alimentar ativo com refeições.
            </Text>
          </View>
        ) : (
          // 2) Itens do plano → adicionar substituição
          <View className="gap-4 pb-10">
            <Text className="text-xs text-text-muted">
              Cadastre substituições equivalentes para {studentName}. Elas aparecem no app do aluno.
            </Text>
            {plans[0].meals!.map((meal) => (
              <View key={meal.id}>
                <Text className="text-sm font-black text-text-primary mb-2">{meal.name}</Text>
                <View className="gap-2">
                  {(meal.items ?? []).map((item) => (
                    <View key={item.id} className="bg-surface-card border border-surface-border rounded-2xl p-4">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm font-bold text-text-primary flex-1">{item.food_name}</Text>
                        <Pressable onPress={() => (activeItem === item.id ? resetForm() : setActiveItem(item.id))}>
                          <Text className="text-violet-400 font-bold text-xs">
                            {activeItem === item.id ? "Cancelar" : "+ Substituição"}
                          </Text>
                        </Pressable>
                      </View>

                      {activeItem === item.id ? (
                        <View className="mt-3 gap-2">
                          <TextInput
                            className="bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary"
                            placeholder="Alimento substituto"
                            placeholderTextColor="#6E6580"
                            value={foodName}
                            onChangeText={setFoodName}
                          />
                          <View className="flex-row gap-2">
                            <TextInput
                              className="flex-1 bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary"
                              placeholder="Kcal"
                              placeholderTextColor="#6E6580"
                              keyboardType="numeric"
                              value={cal}
                              onChangeText={setCal}
                            />
                            <TextInput
                              className="flex-1 bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary"
                              placeholder="Proteína (g)"
                              placeholderTextColor="#6E6580"
                              keyboardType="numeric"
                              value={prot}
                              onChangeText={setProt}
                            />
                          </View>
                          <Pressable
                            onPress={() => submit(item.id)}
                            disabled={!foodName.trim() || createSub.isPending}
                            className={`rounded-xl py-2.5 items-center ${foodName.trim() ? "bg-violet-500" : "bg-surface-border"}`}
                          >
                            <Text className={`font-black text-xs ${foodName.trim() ? "text-white" : "text-text-muted"}`}>
                              {createSub.isPending ? "Salvando..." : "Salvar substituição"}
                            </Text>
                          </Pressable>
                        </View>
                      ) : null}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
