import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useShallow } from "zustand/react/shallow";
import { font, palette } from "../../../../lib/design/tokens";
import { DisplayHeading } from "../../../../components/ui/DisplayHeading";
import { AppIcon, Button, EmptyState } from "../../../../components/ui";
import { ConfirmDialog } from "../../../../components/ui/ConfirmDialog";
import { ExerciseCard } from "../../../../components/workout/ExerciseCard";
import { RestTimer } from "../../../../components/workout/RestTimer";
import { SetRow, type SetValues } from "../../../../components/workout/SetRow";
import { VideoPlayerModal } from "../../../../components/workout/VideoPlayerModal";
import { LoadingScreen } from "../../../../components/ui/LoadingScreen";
import { WebContainer } from "../../../../components/layout/WebContainer";
import { useAuth } from "../../../../lib/auth/provider";
import { useOpenSession, useWorkoutDetail, type WorkoutExercise } from "../../../../hooks/queries/useWorkouts";
import { fetchExerciseBests, useLastPerformance } from "../../../../hooks/queries/useLastPerformance";
import {
  useDeleteSet,
  useFinishSession,
  useStartSession,
  useSyncSet,
} from "../../../../hooks/mutations/useLogWorkout";
import {
  setsForExercise,
  useSessionHydrated,
  useWorkoutSessionStore,
  type SessionSet,
} from "../../../../stores/useWorkoutSessionStore";
import { useNow } from "../../../../lib/hooks/useNow";
import { haptics } from "../../../../lib/haptics";
import { uuid } from "../../../../lib/utils/uuid";
import { isPlayableVideo } from "../../../../lib/utils/media";
import { supabase } from "../../../../lib/supabase/client";
import {
  bestMarks,
  detectRecords,
  formatDuration,
  formatKg,
  parseRepTarget,
  totalVolume,
} from "../../../../lib/workout/metrics";
import { pluralize } from "../../../../lib/utils/plural";

type Dialog = null | "finish" | "finish-empty" | "discard" | "switch";

export default function WorkoutExecutionScreen() {
  const { workoutId = "" } = useLocalSearchParams<{ workoutId: string }>();
  const { user } = useAuth();
  const currentUserId = useRef(user?.id);
  currentUserId.current = user?.id;
  const hydrated = useSessionHydrated();
  const workoutQ = useWorkoutDetail(workoutId);
  const openSessionQ = useOpenSession(workoutId, user?.id);
  const store = useWorkoutSessionStore(
    useShallow((s) => ({
      sessionId: s.sessionId,
      ownerId: s.ownerId,
      workoutId: s.workoutId,
      workoutName: s.workoutName,
      startedAt: s.startedAt,
      currentExerciseIndex: s.currentExerciseIndex,
      sets: s.sets,
      finishing: s.finishing,
    })),
  );
  const actions = useWorkoutSessionStore.getState;

  const startM = useStartSession();
  const syncM = useSyncSet();
  const deleteM = useDeleteSet();
  const finishM = useFinishSession();

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [extraSets, setExtraSets] = useState<Record<string, number>>({});

  const exercises = useMemo(() => workoutQ.data?.exercises ?? [], [workoutQ.data]);
  const isOwned = !!user && store.ownerId === user.id;
  const isActiveHere = isOwned && !!store.sessionId && store.workoutId === workoutId;
  const otherActive = isOwned && !!store.sessionId && store.workoutId !== workoutId;
  const idx = Math.min(store.currentExerciseIndex, Math.max(0, exercises.length - 1));
  const current: WorkoutExercise | undefined = isActiveHere ? exercises[idx] : undefined;

  const lastPerfQ = useLastPerformance(current?.exercise_id, user?.id, current?.target_reps, store.sessionId);
  const now = useNow(isActiveHere);

  // ---- sync helpers -------------------------------------------------------
  const pushSet = useCallback(
    (s: SessionSet) => {
      const sessionId = actions().sessionId;
      if (!sessionId || !user || actions().ownerId !== user.id) return Promise.resolve(false);
      const stillCurrent = () => currentUserId.current === user.id && actions().sessionId === sessionId && actions().ownerId === user.id;
      actions().upsertSet({ ...s, syncStatus: "pending" });
      return syncM
        .mutateAsync({
          id: s.id,
          session_id: sessionId,
          workout_exercise_id: s.workoutExerciseId,
          exercise_id: s.exerciseId,
          set_number: s.setNumber,
          reps: s.reps,
          weight_kg: s.weightKg,
          is_warmup: s.isWarmup,
        })
        .then(() => {
          if (stillCurrent()) actions().patchSet(s.id, { syncStatus: "synced" });
          return stillCurrent();
        })
        .catch(() => {
          if (stillCurrent()) actions().patchSet(s.id, { syncStatus: "error" });
          return false;
        });
    },
    [actions, syncM, user],
  );

  // Retry anything that was not confirmed by the server before the app closed.
  const retriedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!isActiveHere || !store.sessionId || retriedFor.current === store.sessionId) return;
    retriedFor.current = store.sessionId;
    for (const s of actions().sets) if (s.syncStatus !== "synced") pushSet(s);
  }, [isActiveHere, store.sessionId, actions, pushSet]);

  // ---- derived progress ---------------------------------------------------
  const totalTargetSets = exercises.reduce((n, e) => n + (e.target_sets ?? 0), 0);
  const workingDone = store.sets.filter((s) => isActiveHere && s.completed && !s.isWarmup).length;
  const progress = totalTargetSets > 0 ? Math.min(1, workingDone / totalTargetSets) : 0;

  // ---- handlers -----------------------------------------------------------
  const beginFresh = async () => {
    if (!user || !workoutQ.data) return;
    setErrorMsg(null);
    try {
      const open = openSessionQ.data;
      if (open) {
        actions().begin({
          ownerId: user.id,
          sessionId: open.id,
          workoutId,
          workoutName: workoutQ.data.name,
          startedAt: new Date(open.started_at).getTime(),
          sets: open.sets.map((r) => ({
            id: r.id,
            workoutExerciseId: r.workout_exercise_id ?? r.exercise_id,
            exerciseId: r.exercise_id,
            setNumber: r.set_number,
            reps: r.reps,
            weightKg: r.weight_kg === null ? null : Number(r.weight_kg),
            isWarmup: !!r.is_warmup,
            completed: true,
            syncStatus: "synced",
          })),
        });
        return;
      }
      const created = await startM.mutateAsync({ user_id: user.id, workout_id: workoutId });
      if (currentUserId.current !== user.id) return;
      actions().begin({
        ownerId: user.id,
        sessionId: created.id,
        workoutId,
        workoutName: workoutQ.data.name,
        startedAt: new Date(created.started_at).getTime(),
      });
      haptics.tap();
    } catch {
      setErrorMsg("Não foi possível iniciar o treino. Verifique sua conexão e tente novamente.");
    }
  };

  const handleStart = () => {
    if (otherActive) {
      setDialog("switch");
      return;
    }
    beginFresh();
  };

  const handleComplete = (we: WorkoutExercise, setNumber: number, values: SetValues, existing?: SessionSet) => {
    if (!user || actions().ownerId !== user.id || !isActiveHere) return;
    const set: SessionSet = {
      id: existing?.id ?? uuid(),
      workoutExerciseId: we.id,
      exerciseId: we.exercise_id,
      setNumber,
      reps: values.reps,
      weightKg: values.weightKg,
      isWarmup: values.isWarmup,
      completed: true,
      syncStatus: "pending",
    };
    haptics.tap();
    pushSet(set);
    if (!existing) {
      const allDone = workingDone + (values.isWarmup ? 0 : 1) >= totalTargetSets;
      if (!allDone) actions().startRest(we.rest_seconds ?? 60);
      else actions().clearRest();
    }
  };

  const handleUncomplete = async (s: SessionSet) => {
    if (!user || actions().ownerId !== user.id) return;
    const sessionId = actions().sessionId;
    actions().removeSet(s.id);
    try {
      await deleteM.mutateAsync(s.id);
    } catch {
      if (actions().sessionId !== sessionId || actions().ownerId !== user.id) return;
      actions().upsertSet({ ...s, syncStatus: "synced" });
      setErrorMsg("Sem conexão: não foi possível desmarcar a série.");
    }
  };

  const goTo = (i: number) => {
    actions().setExerciseIndex(i);
    setShowHowTo(false);
  };

  const requestFinish = () => {
    if (store.finishing) return;
    const completedAny = store.sets.some((s) => s.completed);
    setDialog(completedAny ? "finish" : "finish-empty");
  };

  const discardSession = async () => {
    if (!user || actions().ownerId !== user.id) return;
    const sessionId = store.sessionId;
    setDialog(null);
    actions().end();
    if (sessionId) {
      // The user explicitly cancels their own in-progress session → remove it and its sets.
      await supabase.from("workout_sessions").delete().eq("id", sessionId).is("finished_at", null);
      openSessionQ.refetch();
    }
  };

  const finish = async () => {
    const st = actions();
    if (!st.sessionId || !st.startedAt || st.finishing || !user || st.ownerId !== user.id) return;
    const stillCurrent = () => currentUserId.current === user.id && actions().sessionId === st.sessionId && actions().ownerId === user.id;
    st.setFinishing(true);
    st.clearRest();
    setErrorMsg(null);
    try {
      const unsynced = st.sets.filter((s) => s.syncStatus !== "synced");
      const results = await Promise.all(unsynced.map((s) => pushSet(s)));
      if (!stillCurrent()) return;
      if (results.some((ok) => !ok)) {
        setErrorMsg("Algumas séries ainda não foram salvas. Verifique a conexão e tente finalizar novamente.");
        return;
      }

      const sessionId = st.sessionId;
      const sets = actions().sets.filter((s) => s.completed);
      const durationSeconds = Math.max(1, Math.round((Date.now() - st.startedAt) / 1000));

      // PRs are computed against all previous finished sessions (excluding this one).
      const exerciseIds = [...new Set(sets.map((s) => s.exerciseId))];
      let records: { name: string; kind: string; value: number }[] = [];
      try {
        const bests = await fetchExerciseBests(user.id, exerciseIds, sessionId);
        records = exerciseIds.flatMap((exId) => {
          const name = exercises.find((e) => e.exercise_id === exId)?.exercise?.name ?? "Exercício";
          const current = sets.filter((s) => s.exerciseId === exId);
          return detectRecords(current, bests[exId] ?? bestMarks([])).map((h) => ({ name, kind: h.kind, value: h.value }));
        });
      } catch {
        // Records are a bonus; never block finishing the session on them.
      }

      if (!stillCurrent()) return;
      await finishM.mutateAsync({ session_id: sessionId, duration_seconds: durationSeconds });
      if (!stillCurrent()) return;

      const working = sets.filter((s) => !s.isWarmup);
      const params = {
        workoutName: st.workoutName ?? workoutQ.data?.name ?? "Treino",
        duration: formatDuration(durationSeconds),
        volume: String(Math.round(totalVolume(sets))),
        exercises: String(new Set(working.map((s) => s.workoutExerciseId)).size),
        sets: String(working.length),
        plannedSets: String(totalTargetSets),
        records: JSON.stringify(records.slice(0, 10)),
      };
      haptics.success();
      actions().end();
      setDialog(null);
      router.replace({ pathname: "/(student)/(workouts)/session-complete", params } as never);
    } catch {
      setErrorMsg("Não foi possível finalizar o treino. Seus dados estão salvos — tente novamente.");
    } finally {
      if (stillCurrent()) actions().setFinishing(false);
    }
  };

  // ---- render states ------------------------------------------------------
  if (workoutQ.isLoading || !hydrated) return <LoadingScreen />;

  if (workoutQ.isError || !workoutQ.data) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400">
        <EmptyState
          iconName="warning"
          title="Treino indisponível"
          description="Não foi possível carregar este treino. Verifique sua conexão e tente novamente."
          actionLabel="Tentar novamente"
          onAction={() => workoutQ.refetch()}
        />
      </SafeAreaView>
    );
  }

  const workout = workoutQ.data;

  // ---- overview (not started) --------------------------------------------
  if (!isActiveHere) {
    const resumable = openSessionQ.data;
    return (
      <SafeAreaView className="flex-1 bg-dark-400">
        <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 40 }}>
          <WebContainer maxWidth={720}>
            <BackLink />
            <Text className="text-text-muted uppercase mb-2" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>
              Treino
            </Text>
            <DisplayHeading size="lg" className="mb-2">
              {workout.name}
            </DisplayHeading>
            <Text className="text-sm text-text-secondary mb-2" style={{ fontFamily: font.regular }}>
              {pluralize(exercises.length, "exercício", "exercícios")} · {pluralize(totalTargetSets, "série", "séries")}
              {workout.estimated_duration_minutes ? ` · ~${workout.estimated_duration_minutes} min` : ""}
            </Text>
            {workout.notes ? (
              <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mt-2 mb-2">
                <Text className="text-[11px] text-text-muted uppercase mb-1" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>
                  Notas do treinador
                </Text>
                <Text className="text-sm text-text-secondary" style={{ fontFamily: font.regular }}>
                  {workout.notes}
                </Text>
              </View>
            ) : null}

            {otherActive ? (
              <Notice
                tone="warning"
                text={`Você tem "${store.workoutName ?? "um treino"}" em andamento.`}
                actionLabel="Retomar"
                onAction={() => router.replace(`/(student)/(workouts)/treino/${store.workoutId}` as never)}
              />
            ) : resumable ? (
              <Notice
                tone="info"
                text={`Treino iniciado às ${new Date(resumable.started_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} não foi finalizado. Continue de onde parou.`}
              />
            ) : null}

            <View className="gap-3 mt-4 mb-6">
              {exercises.length === 0 ? (
                <Text className="text-text-muted text-sm" style={{ fontFamily: font.regular }}>
                  Este treino ainda não tem exercícios. Fale com seu treinador.
                </Text>
              ) : (
                exercises.map((ex) => (
                  <ExerciseCard
                    key={ex.id}
                    name={ex.exercise?.name ?? "Exercício"}
                    muscleGroup={ex.exercise?.muscle_group?.name}
                    thumbnailUrl={ex.exercise?.thumbnail_url}
                    videoUrl={ex.exercise?.video_url}
                    targetSets={ex.target_sets}
                    targetReps={ex.target_reps}
                    targetWeightKg={ex.target_weight_kg}
                    restSeconds={ex.rest_seconds}
                    onPlayVideo={() => setVideoUrl(ex.exercise?.video_url ?? null)}
                  />
                ))
              )}
            </View>

            {errorMsg ? <Notice tone="danger" text={errorMsg} /> : null}

            <Button
              title={resumable ? "Retomar treino" : "Iniciar treino"}
              size="lg"
              onPress={handleStart}
              loading={startM.isPending}
              disabled={exercises.length === 0 || openSessionQ.isLoading}
              icon={<AppIcon name="play" size={18} color="#FFFFFF" strokeWidth={2.2} />}
            />
          </WebContainer>
        </ScrollView>

        <VideoPlayerModal visible={!!videoUrl} videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />
        <ConfirmDialog
          visible={dialog === "switch"}
          title="Treino em andamento"
          message={`"${store.workoutName ?? "Outro treino"}" ainda não foi finalizado. Deseja descartá-lo e iniciar este?`}
          confirmLabel="Descartar e iniciar"
          destructive
          onCancel={() => setDialog(null)}
          onConfirm={async () => {
            await discardSession();
            beginFresh();
          }}
        />
      </SafeAreaView>
    );
  }

  // ---- execution ---------------------------------------------------------
  const elapsed = store.startedAt ? Math.round((now - store.startedAt) / 1000) : 0;
  const exerciseSets = current ? setsForExercise(store.sets, current.id) : [];
  const repTarget = parseRepTarget(current?.target_reps);
  const lastPerf = lastPerfQ.data;
  const loggedMax = exerciseSets.reduce((m, s) => Math.max(m, s.setNumber), 0);
  const rowCount = current ? Math.max(current.target_sets ?? 0, loggedMax, (current.target_sets ?? 0) + (extraSets[current.id] ?? 0), 1) : 0;
  const completedHere = exerciseSets.filter((s) => s.completed && !s.isWarmup).length;
  const exerciseDone = !!current && completedHere >= (current.target_sets ?? 0);
  const isLast = idx >= exercises.length - 1;
  const instructions = current?.exercise?.instructions || current?.exercise?.description;

  return (
    <SafeAreaView className="flex-1 bg-dark-400" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Top bar */}
        <View className="px-4 pt-2 pb-3 border-b border-surface-border">
          <WebContainer maxWidth={720}>
            <View className="flex-row items-center gap-3">
              <Pressable
                onPress={() => (router.canGoBack() ? router.back() : router.replace("/(student)/(workouts)" as never))}
                accessibilityRole="button"
                accessibilityLabel="Voltar (o treino continua em andamento)"
                hitSlop={10}
                className="w-10 h-10 rounded-full items-center justify-center bg-surface-card"
              >
                <AppIcon name="chevron-down" size={20} color={palette.textSecondary} strokeWidth={2.2} />
              </Pressable>
              <View className="flex-1">
                <Text className="text-text-primary text-base" numberOfLines={1} style={{ fontFamily: font.semibold }}>
                  {workout.name}
                </Text>
                <Text
                  className="text-violet-300 text-xs"
                  style={{ fontFamily: font.medium, fontVariant: ["tabular-nums"] }}
                  accessibilityLabel={`Tempo de treino ${formatDuration(elapsed)}`}
                >
                  {formatDuration(elapsed)} · {workingDone}/{totalTargetSets} séries
                </Text>
              </View>
              <Pressable
                onPress={requestFinish}
                disabled={store.finishing}
                accessibilityRole="button"
                accessibilityLabel="Finalizar treino"
                className="bg-success-500 px-4 h-10 rounded-full items-center justify-center"
              >
                <Text className="text-dark-400 text-sm" style={{ fontFamily: font.bold }}>
                  Finalizar
                </Text>
              </Pressable>
            </View>
            <View className="h-1.5 bg-surface-card rounded-full overflow-hidden mt-3" accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}>
              <View className="h-full bg-violet-500 rounded-full" style={{ width: `${progress * 100}%` }} />
            </View>
            {/* Exercise pager */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-3" contentContainerStyle={{ gap: 8 }}>
              {exercises.map((ex, i) => {
                const done = setsForExercise(store.sets, ex.id).filter((s) => s.completed && !s.isWarmup).length >= (ex.target_sets ?? 0);
                const active = i === idx;
                return (
                  <Pressable
                    key={ex.id}
                    onPress={() => goTo(i)}
                    accessibilityRole="tab"
                    aria-selected={active}
                    accessibilityLabel={`Exercício ${i + 1}: ${ex.exercise?.name ?? ""}${done ? ", concluído" : ""}`}
                    className={`h-9 min-w-[36px] px-3 rounded-full items-center justify-center flex-row gap-1 ${
                      active ? "bg-violet-500" : done ? "bg-success-500/15" : "bg-surface-card border border-surface-border"
                    }`}
                  >
                    {done && !active ? <AppIcon name="check" size={14} color={palette.success} strokeWidth={2.6} /> : null}
                    <Text className={active ? "text-white" : done ? "text-success-500" : "text-text-secondary"} style={{ fontFamily: font.semibold, fontSize: 13 }}>
                      {i + 1}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </WebContainer>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 160 }} keyboardShouldPersistTaps="handled">
          <WebContainer maxWidth={720}>
            {current ? (
              <>
                <Text className="text-text-muted text-[11px] uppercase mb-1" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>
                  Exercício {idx + 1} de {exercises.length}
                  {current.exercise?.muscle_group?.name ? ` · ${current.exercise.muscle_group.name}` : ""}
                </Text>
                <Text className="text-text-primary text-2xl mb-3" style={{ fontFamily: font.bold, letterSpacing: -0.3 }}>
                  {current.exercise?.name ?? "Exercício"}
                </Text>

                <View className="flex-row flex-wrap gap-2 mb-4">
                  <Chip icon="target" label={`${current.target_sets} × ${current.target_reps ?? "—"}`} />
                  {current.target_weight_kg ? <Chip icon="weight" label={formatKg(current.target_weight_kg)} /> : null}
                  <Chip icon="timer" label={`${current.rest_seconds ?? 60}s descanso`} />
                  {current.target_rpe ? <Chip icon="gauge" label={`RPE ${current.target_rpe}`} /> : null}
                  {current.tempo ? <Chip icon="clock" label={`Cadência ${current.tempo}`} /> : null}
                </View>

                <View className="flex-row gap-2 mb-4">
                  {isPlayableVideo(current.exercise?.video_url) ? (
                    <SmallAction icon="play" label="Ver vídeo" onPress={() => setVideoUrl(current.exercise?.video_url ?? null)} />
                  ) : null}
                  {instructions ? (
                    <SmallAction icon="book" label={showHowTo ? "Ocultar execução" : "Como executar"} onPress={() => setShowHowTo((v) => !v)} />
                  ) : null}
                </View>

                {showHowTo && instructions ? (
                  <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-4">
                    <Text className="text-sm text-text-secondary leading-6" style={{ fontFamily: font.regular }}>
                      {instructions}
                    </Text>
                  </View>
                ) : null}

                {current.notes ? (
                  <View className="bg-violet-500/10 border border-violet-500/25 rounded-2xl p-4 mb-4">
                    <Text className="text-[11px] text-violet-300 uppercase mb-1" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>
                      Nota do treinador
                    </Text>
                    <Text className="text-sm text-text-primary" style={{ fontFamily: font.regular }}>
                      {current.notes}
                    </Text>
                  </View>
                ) : null}

                {lastPerf && lastPerf.lastSets.length > 0 ? (
                  <View className="flex-row items-center gap-2 mb-4">
                    <AppIcon name={lastPerf.increase ? "trend" : "repeat"} size={16} color={lastPerf.increase ? palette.success : palette.textMuted} strokeWidth={2} />
                    <Text className="text-xs text-text-secondary flex-1" style={{ fontFamily: font.medium }}>
                      {lastPerf.increase
                        ? `Você completou todas as repetições na última vez. Sugestão: ${formatKg(lastPerf.suggestedWeight)}.`
                        : `Última vez${lastPerf.lastDate ? ` (${new Date(lastPerf.lastDate).toLocaleDateString("pt-BR")})` : ""}: mantenha ${formatKg(lastPerf.suggestedWeight)} e busque mais repetições.`}
                    </Text>
                  </View>
                ) : null}

                {/* Set table */}
                <View className="flex-row items-center gap-2 px-2 mb-2">
                  <HeaderCell className="w-9 text-center" label="Série" />
                  <HeaderCell className="flex-1" label="Anterior" />
                  <HeaderCell className="w-[72px] text-center" label="kg" />
                  <HeaderCell className="w-[60px] text-center" label="Reps" />
                  <View className="w-11" />
                </View>
                <View className="gap-2">
                  {Array.from({ length: rowCount }).map((_, i) => {
                    const setNumber = i + 1;
                    const logged = exerciseSets.find((s) => s.setNumber === setNumber);
                    const prev = lastPerf?.lastSets.find((s) => s.setNumber === setNumber);
                    const prevInSession = exerciseSets.find((s) => s.setNumber === setNumber - 1);
                    const placeholderWeight =
                      prevInSession?.weightKg ??
                      (lastPerf?.increase ? lastPerf.suggestedWeight : prev?.weightKg ?? lastPerf?.suggestedWeight) ??
                      current.target_weight_kg ??
                      null;
                    const placeholderReps = prev?.reps ?? repTarget.min ?? repTarget.max;
                    return (
                      <SetRow
                        key={`${current.id}-${setNumber}`}
                        setNumber={setNumber}
                        logged={logged}
                        previousLabel={prev ? `${prev.weightKg !== null ? formatKg(prev.weightKg) : "—"} × ${prev.reps ?? "—"}` : "—"}
                        placeholderWeight={placeholderWeight}
                        placeholderReps={placeholderReps}
                        onComplete={(v) => handleComplete(current, setNumber, v)}
                        onEdit={(v) => logged && handleComplete(current, setNumber, v, logged)}
                        onUncomplete={() => logged && handleUncomplete(logged)}
                        onRetry={() => logged && pushSet(logged)}
                      />
                    );
                  })}
                </View>
                <Pressable
                  onPress={() => setExtraSets((m) => ({ ...m, [current.id]: (m[current.id] ?? 0) + 1 }))}
                  accessibilityRole="button"
                  className="flex-row items-center justify-center gap-2 py-3 mt-2 rounded-2xl active:bg-surface-hover"
                >
                  <AppIcon name="plus" size={16} color={palette.violet300} strokeWidth={2.2} />
                  <Text className="text-violet-300 text-sm" style={{ fontFamily: font.semibold }}>
                    Adicionar série
                  </Text>
                </Pressable>

                {errorMsg ? <Notice tone="danger" text={errorMsg} /> : null}

                <View className="flex-row gap-3 mt-6">
                  {idx > 0 ? (
                    <View className="flex-1">
                      <Button title="Anterior" variant="secondary" onPress={() => goTo(idx - 1)} />
                    </View>
                  ) : null}
                  <View className="flex-1">
                    {isLast ? (
                      <Button title="Finalizar treino" variant={exerciseDone ? "primary" : "secondary"} onPress={requestFinish} loading={store.finishing} />
                    ) : (
                      <Button title="Próximo exercício" variant={exerciseDone ? "primary" : "secondary"} onPress={() => goTo(idx + 1)} />
                    )}
                  </View>
                </View>

                <Pressable onPress={() => setDialog("discard")} accessibilityRole="button" className="items-center py-6">
                  <Text className="text-text-muted text-xs" style={{ fontFamily: font.medium }}>
                    Cancelar treino
                  </Text>
                </Pressable>
              </>
            ) : null}
          </WebContainer>
        </ScrollView>
      </KeyboardAvoidingView>

      <RestTimer />
      <VideoPlayerModal visible={!!videoUrl} videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />
      <ConfirmDialog
        visible={dialog === "finish"}
        title="Finalizar treino?"
        message={
          workingDone < totalTargetSets
            ? `Você completou ${workingDone} de ${totalTargetSets} séries prescritas. As séries registradas serão salvas.`
            : "Todas as séries foram registradas. Bom trabalho!"
        }
        confirmLabel="Finalizar"
        loading={store.finishing}
        onCancel={() => setDialog(null)}
        onConfirm={finish}
      />
      <ConfirmDialog
        visible={dialog === "finish-empty"}
        title="Nenhuma série registrada"
        message="Marque ao menos uma série para salvar o treino, ou cancele esta sessão."
        confirmLabel="Cancelar sessão"
        cancelLabel="Continuar treinando"
        destructive
        onCancel={() => setDialog(null)}
        onConfirm={discardSession}
      />
      <ConfirmDialog
        visible={dialog === "discard"}
        title="Cancelar treino?"
        message="As séries registradas nesta sessão serão descartadas. Esta ação não pode ser desfeita."
        confirmLabel="Descartar sessão"
        cancelLabel="Voltar ao treino"
        destructive
        onCancel={() => setDialog(null)}
        onConfirm={discardSession}
      />
    </SafeAreaView>
  );
}

function BackLink() {
  return (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace("/(student)/(workouts)" as never))}
      accessibilityRole="button"
      className="flex-row items-center gap-1.5 mb-4 self-start py-1"
    >
      <AppIcon name="arrow-left" size={18} color={palette.violet400} strokeWidth={2} />
      <Text className="text-violet-400" style={{ fontFamily: font.medium }}>
        Voltar
      </Text>
    </Pressable>
  );
}

function Chip({ icon, label }: { icon: "target" | "weight" | "timer" | "gauge" | "clock"; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5 bg-surface-card border border-surface-border rounded-full px-3 py-1.5">
      <AppIcon name={icon} size={14} color={palette.textMuted} strokeWidth={2} />
      <Text className="text-xs text-text-secondary" style={{ fontFamily: font.medium }}>
        {label}
      </Text>
    </View>
  );
}

function SmallAction({ icon, label, onPress }: { icon: "play" | "book"; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center gap-1.5 bg-violet-500/10 border border-violet-500/25 rounded-xl px-3 py-2 active:bg-violet-500/20"
    >
      <AppIcon name={icon} size={14} color={palette.violet300} strokeWidth={2.2} />
      <Text className="text-violet-300 text-xs" style={{ fontFamily: font.semibold }}>
        {label}
      </Text>
    </Pressable>
  );
}

function HeaderCell({ label, className }: { label: string; className: string }) {
  return (
    <Text className={`text-[11px] text-text-muted uppercase ${className}`} style={{ fontFamily: font.semibold, letterSpacing: 1 }}>
      {label}
    </Text>
  );
}

function Notice({
  tone,
  text,
  actionLabel,
  onAction,
}: {
  tone: "info" | "warning" | "danger";
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const styles = {
    info: { box: "bg-violet-500/10 border-violet-500/25", color: palette.violet300, icon: "info" as const },
    warning: { box: "bg-warning-500/10 border-warning-500/30", color: palette.warning, icon: "warning" as const },
    danger: { box: "bg-danger-500/10 border-danger-500/30", color: palette.danger, icon: "alert" as const },
  }[tone];
  return (
    <View accessibilityRole={tone === "danger" ? "alert" : undefined} className={`flex-row items-center gap-3 border rounded-2xl p-4 my-3 ${styles.box}`}>
      <AppIcon name={styles.icon} size={18} color={styles.color} strokeWidth={2} />
      <Text className="flex-1 text-sm text-text-primary" style={{ fontFamily: font.regular }}>
        {text}
      </Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} accessibilityRole="button" className="px-3 py-2 rounded-xl bg-surface-elevated">
          <Text className="text-xs text-text-primary" style={{ fontFamily: font.semibold }}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
