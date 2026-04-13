import { useLocalSearchParams, router } from "expo-router";
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
import { ExerciseCard } from "../../../components/workout/ExerciseCard";
import { RestTimer } from "../../../components/workout/RestTimer";
import { useAuth } from "../../../lib/auth/provider";
import { useWorkoutDetail, WorkoutExercise } from "../../../hooks/queries/useWorkouts";
import {
  useStartSession,
  useLogSet,
  useFinishSession,
} from "../../../hooks/mutations/useLogWorkout";
import { useTimerStore } from "../../../stores/useTimerStore";
import { useWorkoutSessionStore } from "../../../stores/useWorkoutSessionStore";

export default function WorkoutExecutionScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { user } = useAuth();
  const { data: workout, isLoading } = useWorkoutDetail(workoutId ?? "");
  const startSessionMutation = useStartSession();
  const logSetMutation = useLogSet();
  const finishSessionMutation = useFinishSession();
  const timerStore = useTimerStore();
  const sessionStore = useWorkoutSessionStore();
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);

  if (isLoading || !workout) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center">
        <ActivityIndicator size="large" color="#781BB6" />
      </SafeAreaView>
    );
  }

  const exercises = workout.exercises ?? [];
  const currentExercise = exercises[activeExerciseIdx];
  const completedSets = currentExercise
    ? sessionStore.getCompletedSetsForExercise(currentExercise.exercise_id)
    : [];

  const handleStartWorkout = async () => {
    if (!user) return;
    const session = await startSessionMutation.mutateAsync({
      user_id: user.id,
      workout_id: workoutId,
    });
    sessionStore.startSession(session.id, workoutId);
  };

  const handleLogSet = async () => {
    if (!sessionStore.sessionId || !currentExercise) return;

    const setNumber = completedSets.length + 1;
    await logSetMutation.mutateAsync({
      session_id: sessionStore.sessionId,
      exercise_id: currentExercise.exercise_id,
      workout_exercise_id: currentExercise.id,
      set_number: setNumber,
      reps: currentExercise.target_reps
        ? parseInt(currentExercise.target_reps)
        : undefined,
      weight_kg: currentExercise.target_weight_kg ?? undefined,
    });

    sessionStore.addSet({
      exerciseId: currentExercise.exercise_id,
      workoutExerciseId: currentExercise.id,
      setNumber,
      reps: currentExercise.target_reps
        ? parseInt(currentExercise.target_reps)
        : undefined,
      weightKg: currentExercise.target_weight_kg ?? undefined,
      completed: true,
    });

    if (setNumber < (currentExercise.target_sets ?? 3)) {
      timerStore.start(currentExercise.rest_seconds ?? 60);
    }
  };

  const handleNextExercise = () => {
    if (activeExerciseIdx < exercises.length - 1) {
      setActiveExerciseIdx(activeExerciseIdx + 1);
    }
  };

  const handleFinishWorkout = async () => {
    if (!sessionStore.sessionId || !sessionStore.startedAt) return;

    const durationSeconds = Math.floor(
      (Date.now() - sessionStore.startedAt.getTime()) / 1000,
    );

    await finishSessionMutation.mutateAsync({
      session_id: sessionStore.sessionId,
      duration_seconds: durationSeconds,
    });

    sessionStore.endSession();
    router.back();
  };

  if (!sessionStore.isActive) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400">
        <ScrollView className="flex-1 px-6 pt-6">
          <Pressable onPress={() => router.back()} className="mb-4">
            <Text className="text-violet-400 font-medium">Voltar</Text>
          </Pressable>

          <Text className="text-2xl font-bold text-text-primary mb-2">
            {workout.name}
          </Text>
          {workout.notes ? (
            <Text className="text-sm text-text-muted mb-6">{workout.notes}</Text>
          ) : null}

          <View className="gap-3 mb-8">
            {exercises.map((ex, idx) => (
              <ExerciseCard
                key={ex.id}
                name={ex.exercise?.name ?? "Exercicio"}
                muscleGroup={ex.exercise?.muscle_group?.name}
                thumbnailUrl={ex.exercise?.thumbnail_url}
                targetSets={ex.target_sets}
                targetReps={ex.target_reps}
                targetWeightKg={ex.target_weight_kg}
                restSeconds={ex.rest_seconds}
              />
            ))}
          </View>

          <Pressable
            onPress={handleStartWorkout}
            disabled={startSessionMutation.isPending}
            className="bg-violet-500 rounded-xl py-4 items-center mb-10 active:bg-violet-600"
          >
            {startSessionMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Iniciar Treino
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-xs text-text-muted uppercase">
              Exercicio {activeExerciseIdx + 1}/{exercises.length}
            </Text>
            <Text className="text-xl font-bold text-text-primary">
              {currentExercise?.exercise?.name ?? "Exercicio"}
            </Text>
          </View>
          <Pressable
            onPress={handleFinishWorkout}
            className="bg-danger-500/10 px-4 py-2 rounded-lg"
          >
            <Text className="text-danger-600 font-semibold text-sm">
              Finalizar
            </Text>
          </Pressable>
        </View>

        {currentExercise ? (
          <View className="flex-1">
            <View className="bg-surface-card rounded-2xl p-5 mb-4">
              <View className="flex-row justify-between mb-3">
                <Text className="text-sm text-text-muted">Meta</Text>
                <Text className="text-sm font-semibold text-text-primary">
                  {currentExercise.target_sets} x{" "}
                  {currentExercise.target_reps ?? "10-12"}
                  {currentExercise.target_weight_kg
                    ? ` @ ${currentExercise.target_weight_kg}kg`
                    : ""}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-sm text-text-muted">Concluidas</Text>
                <Text className="text-sm font-bold text-violet-400">
                  {completedSets.length} / {currentExercise.target_sets ?? 3}
                </Text>
              </View>
            </View>

            <View className="gap-2 mb-6">
              {Array.from({
                length: currentExercise.target_sets ?? 3,
              }).map((_, idx) => {
                const isCompleted = idx < completedSets.length;
                const isCurrent = idx === completedSets.length;
                return (
                  <View
                    key={idx}
                    className={`flex-row items-center justify-between p-4 rounded-xl ${
                      isCompleted
                        ? "bg-success-500/10"
                        : isCurrent
                          ? "bg-violet-500/10 border-2 border-violet-500/30"
                          : "bg-surface-card"
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        isCompleted ? "text-success-600" : "text-text-secondary"
                      }`}
                    >
                      Serie {idx + 1}
                    </Text>
                    {isCompleted ? (
                      <Text className="text-success-600 font-medium">
                        Concluida
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>

            <View className="gap-3 mt-auto mb-6">
              {completedSets.length < (currentExercise.target_sets ?? 3) ? (
                <Pressable
                  onPress={handleLogSet}
                  disabled={logSetMutation.isPending}
                  className="bg-violet-500 rounded-xl py-4 items-center active:bg-violet-600"
                >
                  <Text className="text-white font-bold text-base">
                    Completar Serie {completedSets.length + 1}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleNextExercise}
                  disabled={activeExerciseIdx >= exercises.length - 1}
                  className={`rounded-xl py-4 items-center ${
                    activeExerciseIdx >= exercises.length - 1
                      ? "bg-surface-border"
                      : "bg-violet-500 active:bg-violet-600"
                  }`}
                >
                  <Text className="text-white font-bold text-base">
                    {activeExerciseIdx >= exercises.length - 1
                      ? "Ultimo exercicio"
                      : "Proximo Exercicio"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        ) : null}
      </View>

      <RestTimer />
    </SafeAreaView>
  );
}
