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
import { AppIcon } from "../../../components/ui";
import { useExercises, useMuscleGroups } from "../../../hooks/queries/useExercises";
import { translateExerciseName } from "../../../lib/utils/exerciseTranslations";
import { useAuth } from "../../../lib/auth/provider";
import { font } from "../../../lib/design/tokens";

export default function ExercisesScreen() {
  const { user, role } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string | undefined>();
  const { data: exercises, isLoading } = useExercises({
    search: search || undefined,
    muscleGroupId: selectedMuscle,
    userId: user?.id,
    role,
  });
  const { data: muscleGroups } = useMuscleGroups();

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text
              className="text-[10px] uppercase text-text-muted mb-1"
              style={{ fontFamily: font.semibold, letterSpacing: 2.5 }}
            >
              Biblioteca
            </Text>
            <Text
              className="text-[34px] leading-tight text-text-primary"
              style={{ fontFamily: font.display }}
            >
              Exercícios.
            </Text>
          </View>
          <Link href="/(trainer)/exercises/create" asChild>
            <Pressable className="flex-row items-center gap-1.5 bg-violet-500 px-4 py-2 rounded-2xl active:bg-violet-600">
              <AppIcon name="plus" size={16} color="#FFFFFF" strokeWidth={2} />
              <Text
                className="text-white text-sm"
                style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
              >
                Novo
              </Text>
            </Pressable>
          </Link>
        </View>

        {/* Search */}
        <View className="flex-row items-center gap-2.5 bg-surface-card/80 border border-surface-border rounded-2xl px-4 mb-4">
          <AppIcon name="search" size={18} color="#6E6382" strokeWidth={2} />
          <TextInput
            className="flex-1 py-3.5 text-[15px] text-text-primary"
            placeholder="Buscar exercicio..."
            placeholderTextColor="#6E6382"
            value={search}
            onChangeText={setSearch}
            style={{ fontFamily: font.regular }}
          />
        </View>

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
              <Text
                className={`text-xs ${!selectedMuscle ? "text-white" : "text-text-muted"}`}
                style={{ fontFamily: font.semibold }}
              >
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
                <Text
                  className={`text-xs ${
                    selectedMuscle === mg.id ? "text-white" : "text-text-muted"
                  }`}
                  style={{ fontFamily: font.semibold }}
                >
                  {mg.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Count */}
        {exercises?.length ? (
          <Text
            className="text-xs text-text-muted mb-2"
            style={{ fontFamily: font.regular }}
          >
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
            iconName="workout"
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
