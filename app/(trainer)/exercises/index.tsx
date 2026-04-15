import { Link } from "expo-router";
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
import { ExerciseCard } from "../../../components/workout/ExerciseCard";
import { EmptyState } from "../../../components/ui/EmptyState";
import { useExercises, useMuscleGroups } from "../../../hooks/queries/useExercises";
import { translateExerciseName } from "../../../lib/utils/exerciseTranslations";

export default function ExercisesScreen() {
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string | undefined>();
  const { data: exercises, isLoading } = useExercises({
    search: search || undefined,
    muscleGroupId: selectedMuscle,
  });
  const { data: muscleGroups } = useMuscleGroups();

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-black text-text-primary">Exercicios</Text>
          <Link href="/(trainer)/exercises/create" asChild>
            <Pressable className="bg-violet-500 px-4 py-2 rounded-xl active:bg-violet-600">
              <Text className="text-white font-black text-sm">+ Novo</Text>
            </Pressable>
          </Link>
        </View>

        {/* Search */}
        <TextInput
          className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-3.5 text-base text-text-primary mb-4"
          placeholder="Buscar exercicio..."
          placeholderTextColor="#6E6580"
          value={search}
          onChangeText={setSearch}
        />

        {/* Muscle group filters - fixed height ScrollView */}
        <View style={{ height: 36, marginBottom: 12 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, alignItems: "center" }}
          >
            <Pressable
              onPress={() => setSelectedMuscle(undefined)}
              className={`px-3 py-1.5 rounded-full border ${
                !selectedMuscle ? "bg-violet-500 border-violet-500" : "bg-surface-card border-surface-border"
              }`}
            >
              <Text className={`text-xs font-bold ${!selectedMuscle ? "text-white" : "text-text-muted"}`}>
                Todos
              </Text>
            </Pressable>
            {muscleGroups?.map((mg) => (
              <Pressable
                key={mg.id}
                onPress={() => setSelectedMuscle(selectedMuscle === mg.id ? undefined : mg.id)}
                className={`px-3 py-1.5 rounded-full border ${
                  selectedMuscle === mg.id
                    ? "bg-violet-500 border-violet-500"
                    : "bg-surface-card border-surface-border"
                }`}
              >
                <Text className={`text-xs font-bold ${
                  selectedMuscle === mg.id ? "text-white" : "text-text-muted"
                }`}>
                  {mg.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Count */}
        {exercises?.length ? (
          <Text className="text-xs text-text-muted mb-2">
            {exercises.length} exercicio{exercises.length !== 1 ? "s" : ""}
          </Text>
        ) : null}

        {/* Exercises list */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !exercises?.length ? (
          <EmptyState
            icon="🏋️"
            title="Nenhum exercicio encontrado"
            description="Adicione exercicios com instrucoes para montar os treinos dos seus alunos."
          />
        ) : (
          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <ExerciseCard
                name={translateExerciseName(item.name)}
                muscleGroup={item.muscle_group?.name}
                equipment={item.equipment?.name}
                thumbnailUrl={item.thumbnail_url}
                videoUrl={item.video_url}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
