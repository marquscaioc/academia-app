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
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { font, amethystGlow, amethystGradient } from "../../../lib/design/tokens";
import { DisplayHeading } from "../../../components/ui/DisplayHeading";
import { AppIcon } from "../../../components/ui";
import { ExerciseCard } from "../../../components/workout/ExerciseCard";
import { RestTimer } from "../../../components/workout/RestTimer";
import { VideoPlayerModal } from "../../../components/workout/VideoPlayerModal";
import { useAuth } from "../../../lib/auth/provider";
import { useWorkoutDetail, WorkoutExercise } from "../../../hooks/queries/useWorkouts";
import {
  useStartSession,
  useLogSet,
  useFinishSession,
} from "../../../hooks/mutations/useLogWorkout";
import { useTimerStore } from "../../../stores/useTimerStore";
import { useWorkoutSessionStore } from "../../../stores/useWorkoutSessionStore";
import { useLastPerformance } from "../../../hooks/queries/useLastPerformance";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";

export default function WorkoutExecutionScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { user } = useAuth();
  const { data: workout, isLoading, isError } = useWorkoutDetail(workoutId ?? "");
  const startSessionMutation = useStartSession();
  const logSetMutation = useLogSet();
  const finishSessionMutation = useFinishSession();
  const timerStore = useTimerStore();
  const sessionStore = useWorkoutSessionStore();
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null);
  const [customWeight, setCustomWeight] = useState("");

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (isError || !workout) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center px-6">
        <DisplayHeading size="md" className="text-center mb-2">
          Nao foi possivel carregar o treino
        </DisplayHeading>
        <Text
          className="text-text-secondary text-sm text-center mb-6"
          style={{ fontFamily: font.regular }}
        >
          Verifique sua conexao e tente novamente.
        </Text>
        <Pressable onPress={() => router.back()} style={amethystGlow}>
          <LinearGradient
            colors={amethystGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.9 }}
            className="flex-row gap-2 rounded-2xl px-6 py-3 items-center justify-center"
          >
            <AppIcon name="arrow-left" size={18} color="#FFFFFF" strokeWidth={2} />
            <Text
              className="text-white"
              style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
            >
              Voltar
            </Text>
          </LinearGradient>
        </Pressable>
      </SafeAreaView>
    );
  }

  const exercises = workout.exercises ?? [];
  const currentExercise = exercises[activeExerciseIdx];
  const completedSets = currentExercise
    ? sessionStore.getCompletedSetsForExercise(currentExercise.exercise_id)
    : [];
  const { data: lastPerf } = useLastPerformance(currentExercise?.exercise_id, user?.id, currentExercise?.target_reps);

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
    const effectiveWeight = customWeight
      ? parseFloat(customWeight)
      : lastPerf?.suggestedWeight ?? currentExercise.target_weight_kg ?? undefined;

    await logSetMutation.mutateAsync({
      session_id: sessionStore.sessionId,
      exercise_id: currentExercise.exercise_id,
      workout_exercise_id: currentExercise.id,
      set_number: setNumber,
      reps: currentExercise.target_reps
        ? parseInt(currentExercise.target_reps)
        : undefined,
      weight_kg: effectiveWeight,
    });

    sessionStore.addSet({
      exerciseId: currentExercise.exercise_id,
      workoutExerciseId: currentExercise.id,
      setNumber,
      reps: currentExercise.target_reps
        ? parseInt(currentExercise.target_reps)
        : undefined,
      weightKg: effectiveWeight,
      completed: true,
    });

    if (setNumber < (currentExercise.target_sets ?? 3)) {
      timerStore.start(currentExercise.rest_seconds ?? 60);
    }
  };

  const handleNextExercise = () => {
    if (activeExerciseIdx < exercises.length - 1) {
      setActiveExerciseIdx(activeExerciseIdx + 1);
      setCustomWeight("");
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

    const totalVolume = sessionStore.sets.reduce((sum, s) => sum + (s.weightKg ?? 0) * (s.reps ?? 0), 0);
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;

    sessionStore.endSession();
    router.replace({
      pathname: "/(student)/(workouts)/session-complete",
      params: {
        workoutName: workout?.name ?? "Treino",
        duration: `${mins}:${secs.toString().padStart(2, "0")}`,
        volume: String(Math.round(totalVolume)),
        exercises: String(exercises.length),
        sets: String(sessionStore.sets.length),
      },
    } as never);
  };

  if (!sessionStore.isActive) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400">
        <ScrollView className="flex-1 px-6 pt-6">
          <Pressable
            onPress={() => router.back()}
            className="flex-row items-center gap-1.5 mb-4"
          >
            <AppIcon name="arrow-left" size={18} color="#9B40D8" strokeWidth={2} />
            <Text className="text-violet-400" style={{ fontFamily: font.medium }}>
              Voltar
            </Text>
          </Pressable>

          <Text
            className="text-text-muted uppercase mb-2"
            style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 2 }}
          >
            Treino
          </Text>
          <DisplayHeading size="lg" className="mb-2">
            {workout.name}
          </DisplayHeading>
          {workout.notes ? (
            <Text
              className="text-sm text-text-secondary mb-6"
              style={{ fontFamily: font.regular }}
            >
              {workout.notes}
            </Text>
          ) : null}

          <View className="gap-3 mb-8">
            {exercises.map((ex, idx) => (
              <ExerciseCard
                key={ex.id}
                name={ex.exercise?.name ?? "Exercicio"}
                muscleGroup={ex.exercise?.muscle_group?.name}
                thumbnailUrl={ex.exercise?.thumbnail_url}
                videoUrl={ex.exercise?.video_url}
                targetSets={ex.target_sets}
                targetReps={ex.target_reps}
                targetWeightKg={ex.target_weight_kg}
                restSeconds={ex.rest_seconds}
                onPlayVideo={() => setPlayingVideoUrl(ex.exercise?.video_url ?? null)}
              />
            ))}
          </View>

          <Pressable
            onPress={handleStartWorkout}
            disabled={startSessionMutation.isPending}
            style={amethystGlow}
            className="mb-10"
          >
            <LinearGradient
              colors={
                startSessionMutation.isPending
                  ? ["#50107D", "#86169E"]
                  : amethystGradient
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              className="flex-row gap-2 rounded-2xl py-4 items-center justify-center"
            >
              {startSessionMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <AppIcon name="play" size={20} color="#FFFFFF" strokeWidth={2} />
                  <Text
                    className="text-white text-lg"
                    style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                  >
                    Iniciar treino
                  </Text>
                </>
              )}
            </LinearGradient>
          </Pressable>
        </ScrollView>
        <VideoPlayerModal visible={!!playingVideoUrl} videoUrl={playingVideoUrl} onClose={() => setPlayingVideoUrl(null)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text
              className="text-text-muted uppercase mb-1"
              style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 2 }}
            >
              Exercicio {activeExerciseIdx + 1}/{exercises.length}
            </Text>
            <Text
              className="text-xl text-text-primary"
              style={{ fontFamily: font.bold }}
            >
              {currentExercise?.exercise?.name ?? "Exercicio"}
            </Text>
            {currentExercise?.exercise?.video_url ? (
              <Pressable
                onPress={() => setPlayingVideoUrl(currentExercise.exercise?.video_url ?? null)}
                className="flex-row items-center gap-1.5 mt-1"
              >
                <AppIcon name="play" size={14} color="#9B40D8" strokeWidth={2} />
                <Text
                  className="text-violet-400 text-xs"
                  style={{ fontFamily: font.semibold }}
                >
                  Ver video
                </Text>
              </Pressable>
            ) : null}
          </View>
          <Pressable
            onPress={handleFinishWorkout}
            className="flex-row items-center gap-1.5 bg-danger-500/10 px-4 py-2 rounded-2xl"
          >
            <AppIcon name="check-circle" size={16} color="#FB7185" strokeWidth={2} />
            <Text
              className="text-danger-600 text-sm"
              style={{ fontFamily: font.semibold }}
            >
              Finalizar
            </Text>
          </Pressable>
        </View>

        {currentExercise ? (
          <View className="flex-1">
            <View className="bg-surface-card border border-surface-border rounded-3xl p-5 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <AppIcon name="target" size={16} color="#6E6382" strokeWidth={2} />
                  <Text
                    className="text-sm text-text-secondary"
                    style={{ fontFamily: font.regular }}
                  >
                    Meta
                  </Text>
                </View>
                <Text
                  className="text-sm text-text-primary"
                  style={{ fontFamily: font.semibold }}
                >
                  {currentExercise.target_sets} x{" "}
                  {currentExercise.target_reps ?? "10-12"}
                  {currentExercise.target_weight_kg
                    ? ` @ ${currentExercise.target_weight_kg}kg`
                    : ""}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <AppIcon name="check-all" size={16} color="#6E6382" strokeWidth={2} />
                  <Text
                    className="text-sm text-text-secondary"
                    style={{ fontFamily: font.regular }}
                  >
                    Concluidas
                  </Text>
                </View>
                <Text
                  className="text-sm text-violet-400"
                  style={{ fontFamily: font.bold }}
                >
                  {completedSets.length} / {currentExercise.target_sets ?? 3}
                </Text>
              </View>
            </View>

            {/* Progressao de carga */}
            {lastPerf?.lastWeight ? (
              <View className="bg-violet-500/5 border border-violet-500/20 rounded-3xl p-4 mb-4">
                <View className="flex-row items-center gap-1.5 mb-1">
                  <AppIcon name="trend" size={14} color="#9B40D8" strokeWidth={2} />
                  <Text
                    className="text-text-muted uppercase"
                    style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 2 }}
                  >
                    Ultima vez
                  </Text>
                </View>
                <Text
                  className="text-sm text-text-primary"
                  style={{ fontFamily: font.bold }}
                >
                  {lastPerf.lastWeight}kg x {lastPerf.lastReps} reps
                </Text>
                {lastPerf.targetRepsHit && lastPerf.suggestedWeight ? (
                  <View className="flex-row items-center gap-1.5 mt-1">
                    <AppIcon name="sparkles" size={14} color="#9B40D8" strokeWidth={2} />
                    <Text
                      className="text-xs text-violet-400"
                      style={{ fontFamily: font.bold }}
                    >
                      Sugestao: {lastPerf.suggestedWeight}kg (+2.5kg)
                    </Text>
                  </View>
                ) : null}
                <View className="flex-row items-center gap-2 mt-3">
                  <AppIcon name="scale" size={16} color="#6E6382" strokeWidth={2} />
                  <Text
                    className="text-xs text-text-secondary"
                    style={{ fontFamily: font.regular }}
                  >
                    Peso:
                  </Text>
                  <TextInput
                    className="bg-surface-card/80 border border-surface-border rounded-2xl px-3 py-2 text-sm text-text-primary w-20 text-center"
                    style={{ fontFamily: font.regular }}
                    placeholderTextColor="#6E6382"
                    placeholder={String(lastPerf.suggestedWeight ?? lastPerf.lastWeight)}
                    value={customWeight}
                    onChangeText={setCustomWeight}
                    keyboardType="numeric"
                  />
                  <Text
                    className="text-xs text-text-secondary"
                    style={{ fontFamily: font.regular }}
                  >
                    kg
                  </Text>
                </View>
              </View>
            ) : null}

            <View className="gap-2 mb-6">
              {Array.from({
                length: currentExercise.target_sets ?? 3,
              }).map((_, idx) => {
                const isCompleted = idx < completedSets.length;
                const isCurrent = idx === completedSets.length;
                return (
                  <View
                    key={idx}
                    className={`flex-row items-center justify-between p-4 rounded-2xl ${
                      isCompleted
                        ? "bg-success-500/10"
                        : isCurrent
                          ? "bg-violet-500/10 border border-violet-500/40"
                          : "bg-surface-card border border-surface-border"
                    }`}
                  >
                    <Text
                      className={isCompleted ? "text-success-600" : "text-text-secondary"}
                      style={{ fontFamily: font.semibold }}
                    >
                      Serie {idx + 1}
                    </Text>
                    {isCompleted ? (
                      <View className="flex-row items-center gap-1.5">
                        <AppIcon name="check-circle" size={16} color="#34D399" strokeWidth={2} />
                        <Text
                          className="text-success-600"
                          style={{ fontFamily: font.medium }}
                        >
                          Concluida
                        </Text>
                      </View>
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
                  style={amethystGlow}
                >
                  <LinearGradient
                    colors={
                      logSetMutation.isPending
                        ? ["#50107D", "#86169E"]
                        : amethystGradient
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.9 }}
                    className="flex-row gap-2 rounded-2xl py-4 items-center justify-center"
                  >
                    <AppIcon name="check" size={20} color="#FFFFFF" strokeWidth={2} />
                    <Text
                      className="text-white text-base"
                      style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                    >
                      Completar serie {completedSets.length + 1}
                    </Text>
                  </LinearGradient>
                </Pressable>
              ) : activeExerciseIdx >= exercises.length - 1 ? (
                <Pressable
                  onPress={handleNextExercise}
                  disabled
                  className="flex-row gap-2 rounded-2xl py-4 items-center justify-center bg-surface-border"
                >
                  <AppIcon name="check-all" size={20} color="#FFFFFF" strokeWidth={2} />
                  <Text
                    className="text-white text-base"
                    style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                  >
                    Ultimo exercicio
                  </Text>
                </Pressable>
              ) : (
                <Pressable onPress={handleNextExercise} style={amethystGlow}>
                  <LinearGradient
                    colors={amethystGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.9 }}
                    className="flex-row gap-2 rounded-2xl py-4 items-center justify-center"
                  >
                    <Text
                      className="text-white text-base"
                      style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                    >
                      Proximo exercicio
                    </Text>
                    <AppIcon name="arrow-right" size={20} color="#FFFFFF" strokeWidth={2} />
                  </LinearGradient>
                </Pressable>
              )}
            </View>
          </View>
        ) : null}
      </View>

      <RestTimer />
      <VideoPlayerModal visible={!!playingVideoUrl} videoUrl={playingVideoUrl} onClose={() => setPlayingVideoUrl(null)} />
    </SafeAreaView>
  );
}
