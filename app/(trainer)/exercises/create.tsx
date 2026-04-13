import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import {
  useMuscleGroups,
  useEquipment,
} from "../../../hooks/queries/useExercises";
import { useCreateExercise } from "../../../hooks/mutations/useExerciseMutations";

export default function CreateExerciseScreen() {
  const { user } = useAuth();
  const { data: muscleGroups } = useMuscleGroups();
  const { data: equipmentList } = useEquipment();
  const createExercise = useCreateExercise();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(
    null,
  );
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null,
  );
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [exerciseType, setExerciseType] = useState<string>("strength");
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Informe o nome do exercicio");
      return;
    }
    if (!user) return;

    setError("");

    await createExercise.mutateAsync({
      name: name.trim(),
      description: description.trim() || undefined,
      instructions: instructions.trim() || undefined,
      primary_muscle_group_id: selectedMuscleGroup ?? undefined,
      equipment_id: selectedEquipment ?? undefined,
      difficulty: difficulty as "beginner" | "intermediate" | "advanced",
      exercise_type: exerciseType as
        | "strength"
        | "cardio"
        | "flexibility"
        | "calisthenics",
      created_by: user.id,
    });

    router.back();
  };

  const difficulties = [
    { value: "beginner", label: "Iniciante" },
    { value: "intermediate", label: "Intermediario" },
    { value: "advanced", label: "Avancado" },
  ];

  const types = [
    { value: "strength", label: "Forca" },
    { value: "cardio", label: "Cardio" },
    { value: "flexibility", label: "Flexibilidade" },
    { value: "calisthenics", label: "Calistenia" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary-600 font-medium">Cancelar</Text>
          </Pressable>
          <Text className="text-lg font-bold text-gray-900">
            Novo Exercicio
          </Text>
          <View className="w-16" />
        </View>

        {error ? (
          <View className="bg-danger-500/10 rounded-xl p-4 mb-4">
            <Text className="text-danger-600 text-center">{error}</Text>
          </View>
        ) : null}

        <View className="gap-5">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">
              Nome *
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 bg-gray-50"
              placeholder="Ex: Supino reto com barra"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">
              Descricao
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 bg-gray-50"
              placeholder="Descricao breve do exercicio"
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1 ml-1">
              Instrucoes
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-900 bg-gray-50"
              placeholder="Passo a passo da execucao"
              placeholderTextColor="#9ca3af"
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={4}
              style={{ minHeight: 100, textAlignVertical: "top" }}
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
              Grupo Muscular
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {muscleGroups?.map((mg) => (
                <Pressable
                  key={mg.id}
                  onPress={() =>
                    setSelectedMuscleGroup(
                      selectedMuscleGroup === mg.id ? null : mg.id,
                    )
                  }
                  className={`px-3 py-2 rounded-lg border ${
                    selectedMuscleGroup === mg.id
                      ? "bg-primary-600 border-primary-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedMuscleGroup === mg.id
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {mg.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
              Equipamento
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {equipmentList?.map((eq) => (
                <Pressable
                  key={eq.id}
                  onPress={() =>
                    setSelectedEquipment(
                      selectedEquipment === eq.id ? null : eq.id,
                    )
                  }
                  className={`px-3 py-2 rounded-lg border ${
                    selectedEquipment === eq.id
                      ? "bg-primary-600 border-primary-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      selectedEquipment === eq.id
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {eq.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
              Dificuldade
            </Text>
            <View className="flex-row gap-2">
              {difficulties.map((d) => (
                <Pressable
                  key={d.value}
                  onPress={() => setDifficulty(d.value)}
                  className={`flex-1 py-2.5 rounded-lg border items-center ${
                    difficulty === d.value
                      ? "bg-primary-600 border-primary-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      difficulty === d.value ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {d.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-2 ml-1">
              Tipo
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {types.map((t) => (
                <Pressable
                  key={t.value}
                  onPress={() => setExerciseType(t.value)}
                  className={`px-4 py-2.5 rounded-lg border ${
                    exerciseType === t.value
                      ? "bg-primary-600 border-primary-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      exerciseType === t.value ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {t.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={handleCreate}
            disabled={createExercise.isPending}
            className="bg-primary-600 rounded-xl py-4 items-center mt-4 mb-10 active:bg-primary-700"
          >
            {createExercise.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-base">
                Criar Exercicio
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
