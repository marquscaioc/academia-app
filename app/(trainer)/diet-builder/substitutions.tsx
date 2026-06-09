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
import { font, amethystGlow } from "../../../lib/design/tokens";
import { LinearGradient } from "expo-linear-gradient";

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
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>← Voltar</Text>
          </Pressable>
          <Text className="text-3xl text-text-primary" style={{ fontFamily: font.display }}>Substituições</Text>
          <View className="w-12" />
        </View>

        {!studentId ? (
          // 1) Escolher aluno
          <View className="gap-2">
            <Text className="text-text-muted uppercase mb-1" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>Escolha o aluno</Text>
            {!students?.length ? (
              <Text className="text-sm text-text-muted text-center py-8" style={{ fontFamily: font.regular }}>Nenhum aluno ativo.</Text>
            ) : (
              students.map((s) => (
                <Pressable
                  key={s.student_id}
                  onPress={() => {
                    setStudentId(s.student_id);
                    setStudentName(s.student?.full_name ?? "Aluno");
                  }}
                  className="flex-row items-center gap-3 p-4 rounded-3xl border border-surface-border bg-surface-card active:bg-surface-hover"
                >
                  <Avatar uri={s.student?.avatar_url} name={s.student?.full_name} size="md" />
                  <Text className="text-sm text-text-primary flex-1" style={{ fontFamily: font.semibold }}>{s.student?.full_name}</Text>
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
            <Text className="text-sm text-text-muted text-center" style={{ fontFamily: font.regular }}>
              {studentName} não tem um plano alimentar ativo com refeições.
            </Text>
          </View>
        ) : (
          // 2) Itens do plano → adicionar substituição
          <View className="gap-4 pb-10">
            <Text className="text-xs text-text-secondary" style={{ fontFamily: font.regular }}>
              Cadastre substituições equivalentes para {studentName}. Elas aparecem no app do aluno.
            </Text>
            {plans[0].meals!.map((meal) => (
              <View key={meal.id}>
                <Text className="text-base text-text-primary mb-2" style={{ fontFamily: font.display }}>{meal.name}</Text>
                <View className="gap-2">
                  {(meal.items ?? []).map((item) => (
                    <View key={item.id} className="bg-surface-card border border-surface-border rounded-3xl p-4">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-sm text-text-primary flex-1" style={{ fontFamily: font.semibold }}>{item.food_name}</Text>
                        <Pressable onPress={() => (activeItem === item.id ? resetForm() : setActiveItem(item.id))}>
                          <Text className="text-violet-400 text-xs" style={{ fontFamily: font.semibold }}>
                            {activeItem === item.id ? "Cancelar" : "+ Substituição"}
                          </Text>
                        </Pressable>
                      </View>

                      {activeItem === item.id ? (
                        <View className="mt-3 gap-2">
                          <TextInput
                            className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                            style={{ fontFamily: font.regular }}
                            placeholder="Alimento substituto"
                            placeholderTextColor="#6E6382"
                            value={foodName}
                            onChangeText={setFoodName}
                          />
                          <View className="flex-row gap-2">
                            <TextInput
                              className="flex-1 bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                              style={{ fontFamily: font.regular }}
                              placeholder="Kcal"
                              placeholderTextColor="#6E6382"
                              keyboardType="numeric"
                              value={cal}
                              onChangeText={setCal}
                            />
                            <TextInput
                              className="flex-1 bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                              style={{ fontFamily: font.regular }}
                              placeholder="Proteína (g)"
                              placeholderTextColor="#6E6382"
                              keyboardType="numeric"
                              value={prot}
                              onChangeText={setProt}
                            />
                          </View>
                          <Pressable
                            onPress={() => submit(item.id)}
                            disabled={!foodName.trim() || createSub.isPending}
                            style={foodName.trim() ? amethystGlow : undefined}
                            className="rounded-2xl overflow-hidden"
                          >
                            {foodName.trim() ? (
                              <LinearGradient
                                colors={["#781BB6", "#C636E0"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0.9 }}
                                className="py-3 items-center"
                              >
                                <Text className="text-white text-sm" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                                  {createSub.isPending ? "Salvando..." : "Salvar substituição"}
                                </Text>
                              </LinearGradient>
                            ) : (
                              <View className="bg-surface-border py-3 items-center">
                                <Text className="text-text-muted text-sm" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                                  Salvar substituição
                                </Text>
                              </View>
                            )}
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
