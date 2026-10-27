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
import { useEquipment, useExercises, useMuscleGroups } from "../../../hooks/queries/useExercises";
import type { ExerciseOrigin } from "../../../lib/utils/exerciseFilter";
import { pluralize } from "../../../lib/utils/plural";
import { translateExerciseName } from "../../../lib/utils/exerciseTranslations";
import { useAuth } from "../../../lib/auth/provider";
import { font } from "../../../lib/design/tokens";

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      aria-selected={active}
      className={`px-3 py-1.5 rounded-full border ${active ? "bg-violet-500 border-violet-500" : "bg-surface-card border-surface-border"}`}
    >
      <Text className={`text-xs ${active ? "text-white" : "text-text-muted"}`} style={{ fontFamily: font.semibold }}>
        {label}
      </Text>
    </Pressable>
  );
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ height: 36, marginBottom: 8 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, alignItems: "center" }}>
        {children}
      </ScrollView>
    </View>
  );
}

const ORIGINS: [ExerciseOrigin, string][] = [
  ["all", "Todos"],
  ["mine", "Meus"],
  ["global", "Biblioteca global"],
];

export default function ExercisesScreen() {
  const { user, role } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string | undefined>();
  const [selectedEquipment, setSelectedEquipment] = useState<string | undefined>();
  const [origin, setOrigin] = useState<ExerciseOrigin>("all");
  const { data: exercises, isLoading, error, refetch } = useExercises({
    search: search || undefined,
    muscleGroupId: selectedMuscle,
    equipmentId: selectedEquipment,
    origin,
    userId: user?.id,
    role,
  });
  const { data: muscleGroups } = useMuscleGroups();
  const { data: equipment } = useEquipment();
  const filtered = !!search.trim() || !!selectedMuscle || !!selectedEquipment || origin !== "all";
  const clearFilters = () => {
    setSearch("");
    setSelectedMuscle(undefined);
    setSelectedEquipment(undefined);
    setOrigin("all");
  };

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
          <AppIcon name="search" size={18} color="#71717A" strokeWidth={2} />
          <TextInput
            className="flex-1 py-3.5 text-[15px] text-text-primary"
            placeholder="Buscar por nome, músculo ou equipamento..."
            accessibilityLabel="Buscar exercício"
            placeholderTextColor="#71717A"
            value={search}
            onChangeText={setSearch}
            style={{ fontFamily: font.regular }}
          />
        </View>

        <ChipRow>
          {ORIGINS.map(([value, label]) => (
            <Chip key={value} label={label} active={origin === value} onPress={() => setOrigin(value)} />
          ))}
        </ChipRow>
        <ChipRow>
          <Chip label="Todos os músculos" active={!selectedMuscle} onPress={() => setSelectedMuscle(undefined)} />
          {muscleGroups?.map((mg) => (
            <Chip
              key={mg.id}
              label={mg.name}
              active={selectedMuscle === mg.id}
              onPress={() => setSelectedMuscle(selectedMuscle === mg.id ? undefined : mg.id)}
            />
          ))}
        </ChipRow>
        {equipment?.length ? (
          <ChipRow>
            <Chip label="Qualquer equipamento" active={!selectedEquipment} onPress={() => setSelectedEquipment(undefined)} />
            {equipment.map((eq) => (
              <Chip
                key={eq.id}
                label={eq.name}
                active={selectedEquipment === eq.id}
                onPress={() => setSelectedEquipment(selectedEquipment === eq.id ? undefined : eq.id)}
              />
            ))}
          </ChipRow>
        ) : null}

        {/* Count */}
        {exercises?.length ? (
          <Text className="text-xs text-text-muted mb-2 mt-1" style={{ fontFamily: font.regular }}>
            {pluralize(exercises.length, "exercício", "exercícios")}
          </Text>
        ) : null}

        {/* Exercises list */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#27272A" />
          </View>
        ) : error ? (
          <EmptyState
            iconName="alert"
            title="Não foi possível carregar"
            description="Verifique sua conexão e tente novamente."
            actionLabel="Tentar novamente"
            onAction={() => refetch()}
          />
        ) : !exercises?.length ? (
          filtered ? (
            <EmptyState
              iconName="search"
              title="Nada com esses filtros"
              description="Nenhum exercício combina com a busca e os filtros escolhidos."
              actionLabel="Limpar filtros"
              onAction={clearFilters}
            />
          ) : (
            <EmptyState
              iconName="workout"
              title="Nenhum exercício encontrado"
              description="Adicione exercícios com instruções para montar os treinos dos seus alunos."
            />
          )
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
