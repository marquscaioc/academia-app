import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
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
}

type Step = "select-student" | "plan-info" | "add-exercises" | "review";

export default function WorkoutBuilderScreen() {
  const { user } = useAuth();
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

  const { data: exerciseList } = useExercises({ search: searchExercise || undefined });
  const { data: muscleGroups } = useMuscleGroups();

  const addExerciseToList = (ex: { id: string; name: string }) => {
    setExercises([
      ...exercises,
      { exercise_id: ex.id, name: ex.name, sets: 3, reps: "10-12", weight: "", rest: 60 },
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

  const handleSave = async () => {
    if (!user || !selectedStudentId || !planName.trim() || exercises.length === 0) return;
    setSaving(true);

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
        rest_seconds: ex.rest,
      });
    }

    setSaving(false);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-surface-border">
        <Pressable onPress={() => router.back()}>
          <Text className="text-text-muted font-medium text-sm">← Cancelar</Text>
        </Pressable>
        <Text className="text-lg font-black text-text-primary">
          {step === "select-student" ? "Selecionar Aluno" :
           step === "plan-info" ? "Info do Plano" :
           step === "add-exercises" ? "Exercicios" : "Revisar"}
        </Text>
        <View className="w-16" />
      </View>

      {/* Step indicator */}
      <View className="flex-row px-6 py-3 gap-2">
        {(["select-student", "plan-info", "add-exercises", "review"] as Step[]).map((s, i) => (
          <View key={s} className={`flex-1 h-1 rounded-full ${
            (["select-student", "plan-info", "add-exercises", "review"] as Step[]).indexOf(step) >= i
              ? "bg-violet-400" : "bg-surface-border"
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
              <Text className="text-text-muted text-sm">Nenhum aluno. Convide um primeiro.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedStudentId(item.student?.id);
                setSelectedStudentName(item.student?.full_name ?? "");
                setStep("plan-info");
              }}
              className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-4 active:bg-surface-hover"
            >
              <Avatar uri={item.student?.avatar_url} name={item.student?.full_name} size="lg" />
              <Text className="text-sm font-bold text-text-primary flex-1">{item.student?.full_name}</Text>
              <Text className="text-violet-400 text-xs font-bold">Selecionar →</Text>
            </Pressable>
          )}
        />
      ) : null}

      {/* Step: Plan Info */}
      {step === "plan-info" ? (
        <ScrollView className="flex-1 px-6 py-6" keyboardShouldPersistTaps="handled">
          <View className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-3 mb-6">
            <Text className="text-sm text-text-muted">Aluno:</Text>
            <Text className="text-sm font-bold text-violet-400">{selectedStudentName}</Text>
          </View>

          <View className="gap-5">
            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Nome do plano *</Text>
              <TextInput
                className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
                placeholder="Ex: Hipertrofia - Março 2026"
                placeholderTextColor="#6B6B73"
                value={planName}
                onChangeText={setPlanName}
              />
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Descricao</Text>
              <TextInput
                className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
                placeholder="Observacoes do plano"
                placeholderTextColor="#6B6B73"
                value={planDescription}
                onChangeText={setPlanDescription}
                multiline
                style={{ minHeight: 60, textAlignVertical: "top" }}
              />
            </View>
            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Nome do treino</Text>
              <TextInput
                className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
                placeholder="Treino A"
                placeholderTextColor="#6B6B73"
                value={workoutName}
                onChangeText={setWorkoutName}
              />
            </View>
          </View>

          <Pressable
            onPress={() => planName.trim() && setStep("add-exercises")}
            disabled={!planName.trim()}
            className={`rounded-2xl items-center mt-8 ${planName.trim() ? "bg-violet-400 active:bg-violet-500" : "bg-surface-border"}`}
            style={{ paddingVertical: 18 }}
          >
            <Text className={`font-black text-base tracking-wide uppercase ${planName.trim() ? "text-dark-400" : "text-text-muted"}`}>
              Proximo: Exercicios
            </Text>
          </Pressable>
        </ScrollView>
      ) : null}

      {/* Step: Add Exercises */}
      {step === "add-exercises" ? (
        <View className="flex-1">
          <View className="px-6 py-3">
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-3 text-sm text-text-primary"
              placeholder="Buscar exercicio para adicionar..."
              placeholderTextColor="#6B6B73"
              value={searchExercise}
              onChangeText={setSearchExercise}
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
                  className="bg-surface-elevated rounded-xl p-3 flex-row items-center gap-3"
                >
                  <Text className="text-sm">🏋️</Text>
                  <Text className="text-sm text-text-primary flex-1">{item.name}</Text>
                  <Text className="text-violet-400 font-bold text-xs">+ Add</Text>
                </Pressable>
              )}
            />
          ) : null}

          <ScrollView className="flex-1 px-6 py-4">
            {exercises.length === 0 ? (
              <View className="items-center py-10">
                <Text className="text-text-muted text-sm">Busque e adicione exercicios acima</Text>
              </View>
            ) : (
              <View className="gap-3">
                {exercises.map((ex, idx) => (
                  <View key={idx} className="bg-surface-card border border-surface-border rounded-2xl p-4">
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-sm font-bold text-text-primary flex-1">{ex.name}</Text>
                      <Pressable onPress={() => removeExercise(idx)}>
                        <Text className="text-danger-500 text-xs font-bold">Remover</Text>
                      </Pressable>
                    </View>
                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <Text className="text-[10px] text-text-muted mb-1">Series</Text>
                        <TextInput
                          className="bg-dark-300 border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary text-center"
                          value={String(ex.sets)}
                          onChangeText={(v) => updateExercise(idx, "sets", parseInt(v) || 0)}
                          keyboardType="number-pad"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[10px] text-text-muted mb-1">Reps</Text>
                        <TextInput
                          className="bg-dark-300 border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary text-center"
                          value={ex.reps}
                          onChangeText={(v) => updateExercise(idx, "reps", v)}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[10px] text-text-muted mb-1">Peso (kg)</Text>
                        <TextInput
                          className="bg-dark-300 border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary text-center"
                          value={ex.weight}
                          onChangeText={(v) => updateExercise(idx, "weight", v)}
                          keyboardType="decimal-pad"
                          placeholder="-"
                          placeholderTextColor="#6B6B73"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[10px] text-text-muted mb-1">Desc. (s)</Text>
                        <TextInput
                          className="bg-dark-300 border border-surface-border rounded-lg px-3 py-2 text-sm text-text-primary text-center"
                          value={String(ex.rest)}
                          onChangeText={(v) => updateExercise(idx, "rest", parseInt(v) || 60)}
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          <View className="px-6 py-4 border-t border-surface-border">
            <Pressable
              onPress={() => exercises.length > 0 && setStep("review")}
              disabled={exercises.length === 0}
              className={`rounded-2xl items-center ${exercises.length > 0 ? "bg-violet-400 active:bg-violet-500" : "bg-surface-border"}`}
              style={{ paddingVertical: 16 }}
            >
              <Text className={`font-black text-sm tracking-wide uppercase ${exercises.length > 0 ? "text-dark-400" : "text-text-muted"}`}>
                Revisar ({exercises.length} exercicios)
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Step: Review */}
      {step === "review" ? (
        <ScrollView className="flex-1 px-6 py-6">
          <View className="bg-surface-card border border-violet-400/20 rounded-2xl p-5 mb-4">
            <Text className="text-xs text-violet-400 font-bold uppercase tracking-wider mb-2">Plano</Text>
            <Text className="text-xl font-black text-text-primary">{planName}</Text>
            <Text className="text-xs text-text-muted mt-1">Para: {selectedStudentName}</Text>
          </View>

          <Text className="text-xs font-bold text-text-muted mb-3 tracking-wider uppercase">
            {workoutName} — {exercises.length} exercicios
          </Text>

          <View className="gap-2 mb-8">
            {exercises.map((ex, idx) => (
              <View key={idx} className="bg-surface-card border border-surface-border rounded-xl p-4 flex-row items-center gap-3">
                <View className="w-8 h-8 bg-surface-elevated rounded-lg items-center justify-center">
                  <Text className="text-xs font-black text-text-muted">{idx + 1}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-text-primary">{ex.name}</Text>
                  <Text className="text-xs text-text-muted mt-0.5">
                    {ex.sets}x{ex.reps} {ex.weight ? `@ ${ex.weight}kg` : ""} · {ex.rest}s desc.
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View className="flex-row gap-3 mb-10">
            <Pressable
              onPress={() => setStep("add-exercises")}
              className="flex-1 border border-surface-border rounded-2xl py-4 items-center"
            >
              <Text className="text-text-secondary font-bold text-sm">Editar</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={saving}
              className={`flex-1 rounded-2xl py-4 items-center ${saving ? "bg-violet-700" : "bg-violet-400 active:bg-violet-500"}`}
            >
              {saving ? (
                <ActivityIndicator color="#0A0A0B" />
              ) : (
                <Text className="text-dark-400 font-black text-sm uppercase">Salvar Plano</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
