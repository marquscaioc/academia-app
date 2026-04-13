import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExerciseCard } from "../../../components/workout/ExerciseCard";
import { EmptyState } from "../../../components/ui/EmptyState";
import { useExercises, useMuscleGroups } from "../../../hooks/queries/useExercises";

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
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-black text-text-primary">Exercicios</Text>
          <Link href="/(trainer)/exercises/create" asChild>
            <Pressable className="bg-violet-400 px-4 py-2 rounded-xl active:bg-violet-500">
              <Text className="text-dark-400 font-black text-sm">+ Novo</Text>
            </Pressable>
          </Link>
        </View>

        <TextInput
          className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-3.5 text-base text-text-primary mb-4"
          placeholder="Buscar exercicio..."
          placeholderTextColor="#6B6B73"
          value={search}
          onChangeText={setSearch}
        />

        <FlatList
          data={muscleGroups}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          className="mb-4 max-h-10"
          contentContainerClassName="gap-2"
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedMuscle(selectedMuscle === item.id ? undefined : item.id)}
              className={`px-3 py-1.5 rounded-full border ${
                selectedMuscle === item.id
                  ? "bg-violet-400 border-violet-400"
                  : "bg-surface-card border-surface-border"
              }`}
            >
              <Text className={`text-xs font-bold ${
                selectedMuscle === item.id ? "text-dark-400" : "text-text-muted"
              }`}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#A855F7" />
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
            contentContainerClassName="gap-3 pb-4"
            renderItem={({ item }) => (
              <ExerciseCard
                name={item.name}
                muscleGroup={item.muscle_group?.name}
                equipment={item.equipment?.name}
                thumbnailUrl={item.thumbnail_url}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
