import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { font, amethystGlow } from "../../../lib/design/tokens";
import { DisplayHeading } from "../../../components/ui/DisplayHeading";
import { SectionLabel } from "../../../components/ui/SectionLabel";
import { AppIcon } from "../../../components/ui";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useExercises, useMuscleGroups } from "../../../hooks/queries/useExercises";
import {
  useCreateWorkoutPlan,
  useAddWorkout,
  useAddWorkoutExercise,
} from "../../../hooks/mutations/useExerciseMutations";
import { Avatar } from "../../../components/ui/Avatar";

interface SelectedExercise {
  exercise_id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest: number;
  rpe: string;
  tempo: string;
  supersetGroup: number | null;
}

type Step = "select-student" | "plan-info" | "add-exercises" | "review";

export default function WorkoutBuilderScreen() {
  const { user, role } = useAuth();
  const [step, setStep] = useState<Step>("select-student");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [workoutName, setWorkoutName] = useState("Treino A");
  const [exercises, setExercises] = useState<SelectedExercise[]>([]);
  const [searchExercise, setSearchExercise] = useState("");
  const [saving, setSaving] = useState(false);

  const createPlan = useCreateWorkoutPlan();
  const addWorkout = useAddWorkout();
  const addExercise = useAddWorkoutExercise();

  const { data: students } = useQuery({
    queryKey: ["trainer", "students", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_students")
        .select("*, student:profiles!student_id(id, full_name, avatar_url)")
        .eq("trainer_id", user!.id)
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: exerciseList } = useExercises({ search: searchExercise || undefined, userId: user?.id, role });
  const { data: muscleGroups } = useMuscleGroups();

  const addExerciseToList = (ex: { id: string; name: string }) => {
    setExercises([
      ...exercises,
      { exercise_id: ex.id, name: ex.name, sets: 3, reps: "10-12", weight: "", rest: 60, rpe: "", tempo: "", supersetGroup: null },
    ]);
    setSearchExercise("");
  };

  const removeExercise = (idx: number) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const updateExercise = (idx: number, field: keyof SelectedExercise, value: string | number) => {
    const updated = [...exercises];
    updated[idx] = { ...updated[idx], [field]: value };
    setExercises(updated);
  };

  // Liga/desliga o exercicio num superset com o de cima (mesmo superset_group)
  const toggleSuperset = (idx: number) => {
    if (idx === 0) return;
    const updated = exercises.map((e) => ({ ...e }));
    const prevGroup = updated[idx - 1].supersetGroup;
    if (updated[idx].supersetGroup && updated[idx].supersetGroup === prevGroup) {
      updated[idx].supersetGroup = null;
    } else {
      let group = prevGroup;
      if (!group) {
        group = Math.max(0, ...updated.map((e) => e.supersetGroup ?? 0)) + 1;
        updated[idx - 1].supersetGroup = group;
      }
      updated[idx].supersetGroup = group;
    }
    setExercises(updated);
  };

  const handleSave = async () => {
    if (!user || !selectedStudentId || !planName.trim() || exercises.length === 0) return;
    setSaving(true);
    try {
      const plan = await createPlan.mutateAsync({
        trainer_id: user.id,
        student_id: selectedStudentId,
        name: planName.trim(),
        description: planDescription.trim() || undefined,
      });

      const workout = await addWorkout.mutateAsync({
        plan_id: plan.id,
        name: workoutName.trim() || "Treino A",
        sort_order: 0,
      });

      for (let i = 0; i < exercises.length; i++) {
        const ex = exercises[i];
        await addExercise.mutateAsync({
          workout_id: workout.id,
          exercise_id: ex.exercise_id,
          sort_order: i,
          target_sets: ex.sets,
          target_reps: ex.reps,
          target_weight_kg: ex.weight ? parseFloat(ex.weight) : undefined,
          target_rpe: ex.rpe ? parseFloat(ex.rpe) : undefined,
          tempo: ex.tempo.trim() || undefined,
          superset_group: ex.supersetGroup ?? undefined,
          rest_seconds: ex.rest,
        });
      }

      router.back();
    } catch (e) {
      Alert.alert("Erro", "Nao foi possivel salvar o plano. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-surface-border">
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
          <AppIcon name="arrow-left" size={16} color="#6E6382" strokeWidth={2} />
          <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Cancelar</Text>
        </Pressable>
        <DisplayHeading size="sm" className="text-text-primary">
          {step === "select-student" ? "Selecionar aluno" :
           step === "plan-info" ? "Info do plano" :
           step === "add-exercises" ? "Exercícios" : "Revisar"}
        </DisplayHeading>
        <View className="w-16" />
      </View>

      {/* Step indicator */}
      <View className="flex-row px-6 py-3 gap-2">
        {(["select-student", "plan-info", "add-exercises", "review"] as Step[]).map((s, i) => (
          <View key={s} className={`flex-1 h-1 rounded-full ${
            (["select-student", "plan-info", "add-exercises", "review"] as Step[]).indexOf(step) >= i
              ? "bg-violet-500" : "bg-surface-border"
          }`} />
        ))}
      </View>

      {/* Step: Select Student */}
      {step === "select-student" ? (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-6 py-4 gap-2"
          ListEmptyComponent={
            <View className="items-center py-10">
              <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-4">
                <AppIcon name="user-add" size={28} color="#9B40D8" strokeWidth={2} />
              </View>
              <Text className="text-text-muted text-sm" style={{ fontFamily: font.regular }}>Nenhum aluno. Convide um primeiro.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedStudentId(item.student?.id);
                setSelectedStudentName(item.student?.full_name ?? "");
                setStep("plan-info");
              }}
              className="bg-surface-card border border-surface-border rounded-3xl p-4 flex-row items-center gap-4 active:bg-surface-hover"
            >
              <Avatar uri={item.student?.avatar_url} name={item.student?.full_name} size="lg" />
              <View className="flex-1">
                <Text className="text-[15px] text-text-primary" style={{ fontFamily: font.semibold }}>{item.student?.full_name}</Text>
                <Text className="text-text-secondary text-xs mt-0.5" style={{ fontFamily: font.regular }}>Selecionar aluno</Text>
              </View>
              <AppIcon name="chevron-right" size={18} color="#6E6382" strokeWidth={2} />
            </Pressable>
          )}
        />
      ) : null}

      {/* Step: Plan Info */}
      {step === "plan-info" ? (
        <ScrollView className="flex-1 px-6 py-6" keyboardShouldPersistTaps="handled">
          <View className="bg-surface-card border border-surface-border rounded-3xl p-4 flex-row items-center gap-3 mb-6">
            <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
              <AppIcon name="user" size={18} color="#9B40D8" strokeWidth={2} />
            </View>
            <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>Aluno:</Text>
            <Text className="text-sm text-violet-400 flex-1" style={{ fontFamily: font.semibold }}>{selectedStudentName}</Text>
          </View>

          <View className="gap-5">
            <View>
              <SectionLabel className="mb-2 ml-1">Nome do plano *</SectionLabel>
              <TextInput
                className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                placeholder="Ex: Hipertrofia - Março 2026"
                placeholderTextColor="#6E6382"
                value={planName}
                onChangeText={setPlanName}
                style={{ fontFamily: font.regular }}
              />
            </View>
            <View>
              <SectionLabel className="mb-2 ml-1">Descricao</SectionLabel>
              <TextInput
                className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                placeholder="Observacoes do plano"
                placeholderTextColor="#6E6382"
                value={planDescription}
                onChangeText={setPlanDescription}
                multiline
                style={{ minHeight: 60, textAlignVertical: "top", fontFamily: font.regular }}
              />
            </View>
            <View>
              <SectionLabel className="mb-2 ml-1">Nome do treino</SectionLabel>
              <TextInput
                className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                placeholder="Treino A"
                placeholderTextColor="#6E6382"
                value={workoutName}
                onChangeText={setWorkoutName}
                style={{ fontFamily: font.regular }}
              />
            </View>
          </View>

          <Pressable
            onPress={() => planName.trim() && setStep("add-exercises")}
            disabled={!planName.trim()}
            className="rounded-2xl overflow-hidden mt-8"
            style={planName.trim() ? amethystGlow : undefined}
          >
            <LinearGradient
              colors={planName.trim() ? ["#781BB6", "#C636E0"] : ["#201B2A", "#201B2A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              style={{ paddingVertical: 18, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}
            >
              <Text className={planName.trim() ? "text-white" : "text-text-muted"} style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                Próximo: exercícios
              </Text>
              <AppIcon name="arrow-right" size={18} color={planName.trim() ? "#FFFFFF" : "#6E6382"} strokeWidth={2} />
            </LinearGradient>
          </Pressable>
        </ScrollView>
      ) : null}

      {/* Step: Add Exercises */}
      {step === "add-exercises" ? (
        <View className="flex-1">
          <View className="px-6 py-3">
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Buscar exercicio para adicionar..."
              placeholderTextColor="#6E6382"
              value={searchExercise}
              onChangeText={setSearchExercise}
              style={{ fontFamily: font.regular }}
            />
          </View>

          {searchExercise.trim() ? (
            <FlatList
              data={exerciseList?.slice(0, 5)}
              keyExtractor={(item) => item.id}
              contentContainerClassName="px-6 gap-1"
              className="max-h-48"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => addExerciseToList(item)}
                  className="bg-surface-elevated rounded-2xl p-3 flex-row items-center gap-3"
                >
                  <View className="w-9 h-9 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                    <AppIcon name="workout" size={18} color="#9B40D8" strokeWidth={2} />
                  </View>
                  <Text className="text-sm text-text-primary flex-1" style={{ fontFamily: font.regular }}>{item.name}</Text>
                  <View className="flex-row items-center gap-1">
                    <AppIcon name="plus" size={14} color="#9B40D8" strokeWidth={2} />
                    <Text className="text-violet-400 text-xs" style={{ fontFamily: font.semibold }}>Add</Text>
                  </View>
                </Pressable>
              )}
            />
          ) : null}

          <ScrollView className="flex-1 px-6 py-4">
            {exercises.length === 0 ? (
              <View className="items-center py-10">
                <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-4">
                  <AppIcon name="search" size={28} color="#9B40D8" strokeWidth={2} />
                </View>
                <Text className="text-text-muted text-sm" style={{ fontFamily: font.regular }}>Busque e adicione exercicios acima</Text>
              </View>
            ) : (
              <View className="gap-3">
                {exercises.map((ex, idx) => (
                  <View key={idx} className="bg-surface-card border border-surface-border rounded-3xl p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-[15px] text-text-primary flex-1" style={{ fontFamily: font.semibold }}>{ex.name}</Text>
                      <Pressable onPress={() => removeExercise(idx)} className="flex-row items-center gap-1">
                        <AppIcon name="trash" size={14} color="#FB7185" strokeWidth={2} />
                        <Text className="text-danger-500 text-xs" style={{ fontFamily: font.semibold }}>Remover</Text>
                      </Pressable>
                    </View>
                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <Text className="text-[10px] text-text-muted mb-1" style={{ fontFamily: font.medium }}>Series</Text>
                        <TextInput
                          className="bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-sm text-text-primary text-center"
                          value={String(ex.sets)}
                          onChangeText={(v) => updateExercise(idx, "sets", parseInt(v) || 0)}
                          keyboardType="number-pad"
                          style={{ fontFamily: font.regular }}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[10px] text-text-muted mb-1" style={{ fontFamily: font.medium }}>Reps</Text>
                        <TextInput
                          className="bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-sm text-text-primary text-center"
                          value={ex.reps}
                          onChangeText={(v) => updateExercise(idx, "reps", v)}
                          style={{ fontFamily: font.regular }}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[10px] text-text-muted mb-1" style={{ fontFamily: font.medium }}>Peso (kg)</Text>
                        <TextInput
                          className="bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-sm text-text-primary text-center"
                          value={ex.weight}
                          onChangeText={(v) => updateExercise(idx, "weight", v)}
                          keyboardType="decimal-pad"
                          placeholder="-"
                          placeholderTextColor="#6E6382"
                          style={{ fontFamily: font.regular }}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[10px] text-text-muted mb-1" style={{ fontFamily: font.medium }}>Desc. (s)</Text>
                        <TextInput
                          className="bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-sm text-text-primary text-center"
                          value={String(ex.rest)}
                          onChangeText={(v) => updateExercise(idx, "rest", parseInt(v) || 60)}
                          keyboardType="number-pad"
                          style={{ fontFamily: font.regular }}
                        />
                      </View>
                    </View>
                    {/* Linha 2: RPE / Tempo + superset */}
                    <View className="flex-row gap-2 mt-2">
                      <View className="flex-1">
                        <Text className="text-[10px] text-text-muted mb-1" style={{ fontFamily: font.medium }}>RPE</Text>
                        <TextInput
                          className="bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-sm text-text-primary text-center"
                          value={ex.rpe}
                          onChangeText={(v) => updateExercise(idx, "rpe", v)}
                          keyboardType="decimal-pad"
                          placeholder="-"
                          placeholderTextColor="#6E6382"
                          style={{ fontFamily: font.regular }}
                        />
                      </View>
                      <View style={{ flex: 2 }}>
                        <Text className="text-[10px] text-text-muted mb-1" style={{ fontFamily: font.medium }}>Tempo (cadência)</Text>
                        <TextInput
                          className="bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-sm text-text-primary text-center"
                          value={ex.tempo}
                          onChangeText={(v) => updateExercise(idx, "tempo", v)}
                          placeholder="2-0-1-0"
                          placeholderTextColor="#6E6382"
                          style={{ fontFamily: font.regular }}
                        />
                      </View>
                    </View>
                    {idx > 0 ? (
                      <Pressable onPress={() => toggleSuperset(idx)} className="mt-2 flex-row items-center gap-2">
                        <View className={`w-5 h-5 rounded items-center justify-center ${
                          ex.supersetGroup && exercises[idx - 1].supersetGroup === ex.supersetGroup
                            ? "bg-violet-500"
                            : "bg-surface-elevated border border-surface-border"
                        }`}>
                          {ex.supersetGroup && exercises[idx - 1].supersetGroup === ex.supersetGroup ? (
                            <AppIcon name="check" size={12} color="#FFFFFF" strokeWidth={2} />
                          ) : null}
                        </View>
                        <AppIcon name="link" size={14} color="#6E6382" strokeWidth={2} />
                        <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Superset com o exercício acima</Text>
                      </Pressable>
                    ) : null}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <View className="px-6 py-4 border-t border-surface-border">
            <Pressable
              onPress={() => exercises.length > 0 && setStep("review")}
              disabled={exercises.length === 0}
              className="rounded-2xl overflow-hidden"
              style={exercises.length > 0 ? amethystGlow : undefined}
            >
              <LinearGradient
                colors={exercises.length > 0 ? ["#781BB6", "#C636E0"] : ["#201B2A", "#201B2A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={{ paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}
              >
                <Text className={exercises.length > 0 ? "text-white" : "text-text-muted"} style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                  Revisar ({exercises.length} exercícios)
                </Text>
                <AppIcon name="arrow-right" size={18} color={exercises.length > 0 ? "#FFFFFF" : "#6E6382"} strokeWidth={2} />
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Step: Review */}
      {step === "review" ? (
        <ScrollView className="flex-1 px-6 py-6">
          <View className="bg-surface-card border border-violet-500/20 rounded-3xl p-5 mb-4">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                <AppIcon name="clipboard" size={18} color="#9B40D8" strokeWidth={2} />
              </View>
              <SectionLabel tone="accent">Plano</SectionLabel>
            </View>
            <DisplayHeading size="sm" className="text-text-primary">{planName}</DisplayHeading>
            <View className="flex-row items-center gap-1.5 mt-1">
              <AppIcon name="user" size={14} color="#6E6382" strokeWidth={2} />
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Para: {selectedStudentName}</Text>
            </View>
          </View>

          <SectionLabel className="mb-3">
            {workoutName} — {exercises.length} exercicios
          </SectionLabel>

          <View className="gap-2 mb-8">
            {exercises.map((ex, idx) => (
              <View key={idx} className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-3">
                <View className="w-8 h-8 bg-surface-elevated rounded-xl items-center justify-center">
                  <Text className="text-xs text-text-muted" style={{ fontFamily: font.bold }}>{idx + 1}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{ex.name}</Text>
                  <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: font.regular }}>
                    {ex.sets}x{ex.reps} {ex.weight ? `@ ${ex.weight}kg` : ""} · {ex.rest}s desc.
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row gap-3 mb-10">
            <Pressable
              onPress={() => setStep("add-exercises")}
              className="flex-1 border border-surface-border rounded-2xl py-4 flex-row items-center justify-center gap-2"
            >
              <AppIcon name="pencil" size={16} color="#A99FBA" strokeWidth={2} />
              <Text className="text-text-secondary text-sm" style={{ fontFamily: font.semibold }}>Editar</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={saving}
              className="flex-1 rounded-2xl overflow-hidden"
              style={amethystGlow}
            >
              <LinearGradient
                colors={saving ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={{ paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <AppIcon name="check-circle" size={18} color="#FFFFFF" strokeWidth={2} />
                    <Text className="text-white text-sm" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>Salvar plano</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
