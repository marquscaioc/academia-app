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
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { font, amethystGlow } from "../../../lib/design/tokens";
import { DisplayHeading } from "../../../components/ui/DisplayHeading";
import { SectionLabel } from "../../../components/ui/SectionLabel";
import { AppIcon } from "../../../components/ui";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useExercises } from "../../../hooks/queries/useExercises";
import { useTrainerPlans } from "../../../hooks/queries/useWorkouts";
import { useCopyWorkoutPlan, useCreateWorkoutPlan } from "../../../hooks/mutations/useExerciseMutations";
import { Avatar } from "../../../components/ui/Avatar";
import { pluralize } from "../../../lib/utils/plural";
import { toast } from "../../../stores/useToastStore";
import { translateExerciseName } from "../../../lib/utils/exerciseTranslations";
import {
  WEEKDAY_SHORT,
  buildPlanPayload,
  newExercise,
  nextWorkoutName,
  toggleDay,
  toggleSuperset,
  validateDraft,
  type DraftExercise,
  type DraftWorkout,
} from "../../../lib/trainer/planDraft";

type Step = "destination" | "plan-info" | "add-exercises" | "review";
const STEPS: Step[] = ["destination", "plan-info", "add-exercises", "review"];

/** null student = template (modelo). */
interface Destination {
  studentId: string | null;
  label: string;
}

function GradientButton({ label, onPress, enabled, loading }: { label: string; onPress: () => void; enabled: boolean; loading?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!enabled || loading}
      accessibilityRole="button"
      aria-disabled={!enabled || !!loading}
      className="rounded-2xl overflow-hidden"
      style={enabled ? amethystGlow : undefined}
    >
      <LinearGradient
        colors={enabled ? ["#781BB6", "#C636E0"] : ["#201B2A", "#201B2A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.9 }}
        style={{ paddingVertical: 16, alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8 }}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text className={enabled ? "text-white" : "text-text-muted"} style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
              {label}
            </Text>
            <AppIcon name="arrow-right" size={18} color={enabled ? "#FFFFFF" : "#6E6382"} strokeWidth={2} />
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

function NumberField({ label, value, onChange, keyboard = "number-pad", placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  keyboard?: "number-pad" | "decimal-pad" | "default";
  placeholder?: string;
}) {
  return (
    <View className="flex-1">
      <Text className="text-[10px] text-text-muted mb-1" style={{ fontFamily: font.medium }}>{label}</Text>
      <TextInput
        className="bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-sm text-text-primary text-center"
        value={value}
        onChangeText={onChange}
        keyboardType={keyboard}
        placeholder={placeholder}
        placeholderTextColor="#6E6382"
        accessibilityLabel={label}
        style={{ fontFamily: font.regular }}
      />
    </View>
  );
}

export default function WorkoutBuilderScreen() {
  const { user, role } = useAuth();
  const [step, setStep] = useState<Step>("destination");
  const [destination, setDestination] = useState<Destination | null>(null);
  const [mode, setMode] = useState<"scratch" | "copy">("scratch");
  const [copySourceId, setCopySourceId] = useState<string | null>(null);
  const [planName, setPlanName] = useState("");
  const [planDescription, setPlanDescription] = useState("");
  const [workouts, setWorkouts] = useState<DraftWorkout[]>([{ name: "Treino A", days: [], exercises: [] }]);
  const [active, setActive] = useState(0);
  const [searchExercise, setSearchExercise] = useState("");

  const createPlan = useCreateWorkoutPlan();
  const copyPlan = useCopyWorkoutPlan();
  const saving = createPlan.isPending || copyPlan.isPending;

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
  const { data: plans } = useTrainerPlans(user?.id);
  const { data: exerciseList } = useExercises({ search: searchExercise || undefined, userId: user?.id, role });

  const current = workouts[active];
  const draftError = validateDraft(planName, workouts);

  const updateWorkout = (patch: Partial<DraftWorkout>) =>
    setWorkouts((ws) => ws.map((w, i) => (i === active ? { ...w, ...patch } : w)));
  const updateExercise = (idx: number, patch: Partial<DraftExercise>) =>
    updateWorkout({ exercises: current.exercises.map((e, i) => (i === idx ? { ...e, ...patch } : e)) });

  const addWorkout = () => {
    setWorkouts((ws) => [...ws, { name: nextWorkoutName(ws.map((w) => w.name)), days: [], exercises: [] }]);
    setActive(workouts.length);
    setSearchExercise("");
  };
  const removeWorkout = () => {
    if (workouts.length === 1) return;
    setWorkouts((ws) => ws.filter((_, i) => i !== active));
    setActive(Math.max(0, active - 1));
  };

  const chooseDestination = (d: Destination) => {
    setDestination(d);
    setStep("plan-info");
  };

  const finish = (message: string) => {
    toast.success(message);
    router.back();
  };

  const handleCopy = async () => {
    if (!copySourceId || !destination || !planName.trim()) return;
    try {
      await copyPlan.mutateAsync({ source_plan_id: copySourceId, student_id: destination.studentId, name: planName.trim() });
      finish(destination.studentId ? "Plano duplicado para o aluno." : "Modelo salvo.");
    } catch {
      toast.error("Erro", "Não foi possível duplicar o plano. Tente novamente.");
    }
  };

  const handleSave = async () => {
    if (!destination || draftError) return;
    try {
      await createPlan.mutateAsync({
        student_id: destination.studentId,
        name: planName.trim(),
        description: planDescription.trim() || undefined,
        workouts: buildPlanPayload(workouts),
      });
      finish(destination.studentId ? "Plano criado. O aluno já pode treinar." : "Modelo salvo.");
    } catch {
      // Atomic on the server: nothing was saved, the draft stays here.
      toast.error("Erro", "Não foi possível salvar o plano. Nada foi gravado; tente novamente.");
    }
  };

  const title =
    step === "destination" ? "Para quem?" : step === "plan-info" ? "Info do plano" : step === "add-exercises" ? "Treinos" : "Revisar";

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-surface-border">
        <Pressable
          onPress={() => (step === "destination" ? router.back() : setStep(STEPS[STEPS.indexOf(step) - 1]))}
          accessibilityRole="button"
          className="flex-row items-center gap-1.5"
        >
          <AppIcon name="arrow-left" size={16} color="#6E6382" strokeWidth={2} />
          <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>
            {step === "destination" ? "Cancelar" : "Voltar"}
          </Text>
        </Pressable>
        <DisplayHeading size="sm" className="text-text-primary">{title}</DisplayHeading>
        <View className="w-16" />
      </View>

      {/* Step indicator */}
      <View className="flex-row px-6 py-3 gap-2">
        {STEPS.map((s, i) => (
          <View key={s} className={`flex-1 h-1 rounded-full ${STEPS.indexOf(step) >= i ? "bg-violet-500" : "bg-surface-border"}`} />
        ))}
      </View>

      {/* Step: destination */}
      {step === "destination" ? (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-6 py-4 gap-2"
          ListHeaderComponent={
            <Pressable
              onPress={() => chooseDestination({ studentId: null, label: "Modelo (sem aluno)" })}
              accessibilityRole="button"
              className="bg-surface-card border border-fuchsia-400/30 rounded-3xl p-4 flex-row items-center gap-4 mb-2 active:bg-surface-hover"
            >
              <View className="w-12 h-12 rounded-2xl bg-fuchsia-400/15 items-center justify-center">
                <AppIcon name="clipboard" size={22} color="#C636E0" strokeWidth={2} />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] text-text-primary" style={{ fontFamily: font.semibold }}>Salvar como modelo</Text>
                <Text className="text-text-secondary text-xs mt-0.5" style={{ fontFamily: font.regular }}>
                  Sem aluno — reutilize depois para vários alunos
                </Text>
              </View>
              <AppIcon name="chevron-right" size={18} color="#6E6382" strokeWidth={2} />
            </Pressable>
          }
          ListEmptyComponent={
            <View className="items-center py-10">
              <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-4">
                <AppIcon name="user-add" size={28} color="#9B40D8" strokeWidth={2} />
              </View>
              <Text className="text-text-muted text-sm" style={{ fontFamily: font.regular }}>Nenhum aluno ativo. Convide um primeiro.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => chooseDestination({ studentId: item.student?.id, label: item.student?.full_name ?? "Aluno" })}
              accessibilityRole="button"
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

      {/* Step: plan info (from scratch or duplicate) */}
      {step === "plan-info" && destination ? (
        <ScrollView className="flex-1 px-6 py-6" keyboardShouldPersistTaps="handled">
          <View className="bg-surface-card border border-surface-border rounded-3xl p-4 flex-row items-center gap-3 mb-6">
            <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
              <AppIcon name={destination.studentId ? "user" : "clipboard"} size={18} color="#9B40D8" strokeWidth={2} />
            </View>
            <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>{destination.studentId ? "Aluno:" : "Destino:"}</Text>
            <Text className="text-sm text-violet-400 flex-1" style={{ fontFamily: font.semibold }}>{destination.label}</Text>
          </View>

          <View className="flex-row bg-surface-card border border-surface-border rounded-2xl p-1 mb-6">
            {([
              ["scratch", "Do zero"],
              ["copy", "Duplicar existente"],
            ] as const).map(([m, label]) => (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                accessibilityRole="tab"
                aria-selected={mode === m}
                className={`flex-1 py-2.5 rounded-xl items-center ${mode === m ? "bg-violet-500" : ""}`}
              >
                <Text className={`text-sm ${mode === m ? "text-white" : "text-text-muted"}`} style={{ fontFamily: font.semibold }}>{label}</Text>
              </Pressable>
            ))}
          </View>

          {mode === "copy" ? (
            <View className="gap-2 mb-6">
              <SectionLabel className="mb-1 ml-1">Plano de origem</SectionLabel>
              {(plans ?? []).length === 0 ? (
                <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>
                  Você ainda não tem planos para duplicar. Crie um do zero.
                </Text>
              ) : (
                (plans ?? []).map((p) => {
                  const exerciseCount = p.workouts.reduce((n, w) => n + (w.exercises[0]?.count ?? 0), 0);
                  const selected = copySourceId === p.id;
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() => {
                        setCopySourceId(p.id);
                        setPlanName(p.name);
                      }}
                      accessibilityRole="radio"
                      aria-checked={selected}
                      className={`rounded-2xl p-4 border ${selected ? "bg-violet-500/10 border-violet-500" : "bg-surface-card border-surface-border"}`}
                    >
                      <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{p.name}</Text>
                      <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: font.regular }}>
                        {p.student_id ? p.student?.full_name ?? "Aluno" : "Modelo"} · {pluralize(p.workouts.length, "treino", "treinos")} ·{" "}
                        {pluralize(exerciseCount, "exercício", "exercícios")}
                      </Text>
                    </Pressable>
                  );
                })
              )}
            </View>
          ) : null}

          <View className="gap-5">
            <View>
              <SectionLabel className="mb-2 ml-1">Nome do plano *</SectionLabel>
              <TextInput
                className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                placeholder="Ex: Hipertrofia - Março 2026"
                placeholderTextColor="#6E6382"
                value={planName}
                onChangeText={setPlanName}
                accessibilityLabel="Nome do plano"
                style={{ fontFamily: font.regular }}
              />
            </View>
            {mode === "scratch" ? (
              <View>
                <SectionLabel className="mb-2 ml-1">Descrição</SectionLabel>
                <TextInput
                  className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                  placeholder="Observações do plano"
                  placeholderTextColor="#6E6382"
                  value={planDescription}
                  onChangeText={setPlanDescription}
                  accessibilityLabel="Descrição"
                  multiline
                  style={{ minHeight: 60, textAlignVertical: "top", fontFamily: font.regular }}
                />
              </View>
            ) : null}
          </View>

          <View className="mt-8 mb-10">
            {mode === "scratch" ? (
              <GradientButton label="Próximo: treinos" enabled={!!planName.trim()} onPress={() => setStep("add-exercises")} />
            ) : (
              <GradientButton
                label={destination.studentId ? "Duplicar para o aluno" : "Duplicar como modelo"}
                enabled={!!copySourceId && !!planName.trim()}
                loading={copyPlan.isPending}
                onPress={handleCopy}
              />
            )}
          </View>
        </ScrollView>
      ) : null}

      {/* Step: workouts and exercises */}
      {step === "add-exercises" && current ? (
        <View className="flex-1">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-6 gap-2" className="grow-0">
            {workouts.map((w, i) => (
              <Pressable
                key={i}
                onPress={() => setActive(i)}
                accessibilityRole="tab"
                aria-selected={i === active}
                className={`px-4 py-2 rounded-xl border ${i === active ? "bg-violet-500 border-violet-500" : "bg-surface-card border-surface-border"}`}
              >
                <Text className={`text-xs ${i === active ? "text-white" : "text-text-secondary"}`} style={{ fontFamily: font.semibold }}>
                  {w.name.trim() || "Sem nome"} · {w.exercises.length}
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={addWorkout}
              accessibilityRole="button"
              accessibilityLabel="Adicionar treino"
              className="px-4 py-2 rounded-xl border border-dashed border-violet-500/50 flex-row items-center gap-1"
            >
              <AppIcon name="plus" size={14} color="#9B40D8" strokeWidth={2} />
              <Text className="text-xs text-violet-400" style={{ fontFamily: font.semibold }}>Treino</Text>
            </Pressable>
          </ScrollView>

          <View className="px-6 pt-3 gap-3">
            <View className="flex-row items-center gap-2">
              <TextInput
                className="flex-1 bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3 text-[15px] text-text-primary"
                value={current.name}
                onChangeText={(v) => updateWorkout({ name: v })}
                placeholder="Nome do treino"
                placeholderTextColor="#6E6382"
                accessibilityLabel="Nome do treino"
                style={{ fontFamily: font.regular }}
              />
              {workouts.length > 1 ? (
                <Pressable onPress={removeWorkout} accessibilityRole="button" accessibilityLabel={`Remover ${current.name}`} className="p-3">
                  <AppIcon name="trash" size={16} color="#FB7185" strokeWidth={2} />
                </Pressable>
              ) : null}
            </View>
            <View>
              <Text className="text-[10px] text-text-muted mb-1.5 ml-1" style={{ fontFamily: font.medium }}>
                Dias de treino (opcional — usados na recomendação do dia e na aderência)
              </Text>
              <View className="flex-row gap-1.5">
                {WEEKDAY_SHORT.map((d, i) => {
                  const on = current.days.includes(i);
                  return (
                    <Pressable
                      key={d}
                      onPress={() => updateWorkout({ days: toggleDay(current.days, i) })}
                      accessibilityRole="checkbox"
                      aria-checked={on}
                      accessibilityLabel={d}
                      className={`flex-1 py-2 rounded-lg items-center border ${on ? "bg-violet-500 border-violet-500" : "bg-surface-card border-surface-border"}`}
                    >
                      <Text className={`text-[11px] ${on ? "text-white" : "text-text-muted"}`} style={{ fontFamily: font.semibold }}>{d}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Buscar exercício para adicionar..."
              placeholderTextColor="#6E6382"
              value={searchExercise}
              onChangeText={setSearchExercise}
              accessibilityLabel="Buscar exercício"
              style={{ fontFamily: font.regular }}
            />
          </View>

          {searchExercise.trim() ? (
            <FlatList
              data={exerciseList?.slice(0, 5)}
              keyExtractor={(item) => item.id}
              contentContainerClassName="px-6 pt-2 gap-1"
              className="max-h-48 grow-0"
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <Text className="text-xs text-text-muted py-2" style={{ fontFamily: font.regular }}>Nenhum exercício encontrado.</Text>
              }
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    updateWorkout({ exercises: [...current.exercises, newExercise({ id: item.id, name: translateExerciseName(item.name) })] });
                    setSearchExercise("");
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`Adicionar ${translateExerciseName(item.name)}`}
                  className="bg-surface-elevated rounded-2xl p-3 flex-row items-center gap-3"
                >
                  <View className="w-9 h-9 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                    <AppIcon name="workout" size={18} color="#9B40D8" strokeWidth={2} />
                  </View>
                  <Text className="text-sm text-text-primary flex-1" style={{ fontFamily: font.regular }}>{translateExerciseName(item.name)}</Text>
                  <View className="flex-row items-center gap-1">
                    <AppIcon name="plus" size={14} color="#9B40D8" strokeWidth={2} />
                    <Text className="text-violet-400 text-xs" style={{ fontFamily: font.semibold }}>Adicionar</Text>
                  </View>
                </Pressable>
              )}
            />
          ) : null}

          <ScrollView className="flex-1 px-6 py-4" keyboardShouldPersistTaps="handled">
            {current.exercises.length === 0 ? (
              <View className="items-center py-10">
                <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-4">
                  <AppIcon name="search" size={28} color="#9B40D8" strokeWidth={2} />
                </View>
                <Text className="text-text-muted text-sm" style={{ fontFamily: font.regular }}>Busque e adicione exercícios acima</Text>
              </View>
            ) : (
              <View className="gap-3 pb-4">
                {current.exercises.map((ex, idx) => {
                  const linked = idx > 0 && !!ex.supersetGroup && current.exercises[idx - 1].supersetGroup === ex.supersetGroup;
                  return (
                    <View key={`${ex.exercise_id}-${idx}`} className="bg-surface-card border border-surface-border rounded-3xl p-4">
                      <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-[15px] text-text-primary flex-1" style={{ fontFamily: font.semibold }}>
                          {idx + 1}. {ex.name}
                        </Text>
                        <Pressable
                          onPress={() => updateWorkout({ exercises: current.exercises.filter((_, i) => i !== idx) })}
                          accessibilityRole="button"
                          accessibilityLabel={`Remover ${ex.name}`}
                          className="flex-row items-center gap-1"
                        >
                          <AppIcon name="trash" size={14} color="#FB7185" strokeWidth={2} />
                          <Text className="text-danger-500 text-xs" style={{ fontFamily: font.semibold }}>Remover</Text>
                        </Pressable>
                      </View>
                      <View className="flex-row gap-2">
                        <NumberField label="Séries" value={String(ex.sets || "")} onChange={(v) => updateExercise(idx, { sets: parseInt(v) || 0 })} />
                        <NumberField label="Reps" value={ex.reps} keyboard="default" onChange={(v) => updateExercise(idx, { reps: v })} />
                        <NumberField label="Peso (kg)" value={ex.weight} keyboard="decimal-pad" placeholder="-" onChange={(v) => updateExercise(idx, { weight: v })} />
                        <NumberField label="Desc. (s)" value={String(ex.rest)} onChange={(v) => updateExercise(idx, { rest: parseInt(v) || 0 })} />
                      </View>
                      <View className="flex-row gap-2 mt-2">
                        <NumberField label="RPE" value={ex.rpe} placeholder="-" onChange={(v) => updateExercise(idx, { rpe: v })} />
                        <View style={{ flex: 2 }}>
                          <NumberField label="Tempo (cadência)" value={ex.tempo} keyboard="default" placeholder="2-0-1-0" onChange={(v) => updateExercise(idx, { tempo: v })} />
                        </View>
                      </View>
                      {idx > 0 ? (
                        <Pressable
                          onPress={() => updateWorkout({ exercises: toggleSuperset(current.exercises, idx) })}
                          accessibilityRole="checkbox"
                          aria-checked={linked}
                          className="mt-2 flex-row items-center gap-2"
                        >
                          <View className={`w-5 h-5 rounded items-center justify-center ${linked ? "bg-violet-500" : "bg-surface-elevated border border-surface-border"}`}>
                            {linked ? <AppIcon name="check" size={12} color="#FFFFFF" strokeWidth={2} /> : null}
                          </View>
                          <AppIcon name="link" size={14} color="#6E6382" strokeWidth={2} />
                          <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Superset com o exercício acima</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>

          <View className="px-6 py-4 border-t border-surface-border">
            <GradientButton
              label={`Revisar (${pluralize(workouts.length, "treino", "treinos")})`}
              enabled={workouts.some((w) => w.exercises.length > 0)}
              onPress={() => setStep("review")}
            />
          </View>
        </View>
      ) : null}

      {/* Step: review */}
      {step === "review" && destination ? (
        <ScrollView className="flex-1 px-6 py-6">
          <View className="bg-surface-card border border-violet-500/20 rounded-3xl p-5 mb-4">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                <AppIcon name="clipboard" size={18} color="#9B40D8" strokeWidth={2} />
              </View>
              <SectionLabel tone="accent">{destination.studentId ? "Plano" : "Modelo"}</SectionLabel>
            </View>
            <DisplayHeading size="sm" className="text-text-primary">{planName}</DisplayHeading>
            <View className="flex-row items-center gap-1.5 mt-1">
              <AppIcon name="user" size={14} color="#6E6382" strokeWidth={2} />
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Para: {destination.label}</Text>
            </View>
          </View>

          {workouts.map((w, wi) => (
            <View key={wi} className="mb-5">
              <SectionLabel className="mb-2">
                {w.name.trim() || "Sem nome"} — {pluralize(w.exercises.length, "exercício", "exercícios")}
                {w.days.length ? ` · ${w.days.map((d) => WEEKDAY_SHORT[d]).join(", ")}` : ""}
              </SectionLabel>
              <View className="gap-2">
                {w.exercises.map((ex, idx) => (
                  <View key={idx} className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-3">
                    <View className="w-8 h-8 bg-surface-elevated rounded-xl items-center justify-center">
                      <Text className="text-xs text-text-muted" style={{ fontFamily: font.bold }}>{idx + 1}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{ex.name}</Text>
                      <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: font.regular }}>
                        {ex.sets}x{ex.reps}
                        {ex.weight.trim() ? ` @ ${ex.weight.trim()} kg` : ""} · {ex.rest}s desc.
                        {ex.rpe.trim() ? ` · RPE ${ex.rpe.trim()}` : ""}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {draftError ? (
            <View className="bg-danger-500/10 border border-danger-500/30 rounded-2xl p-4 mb-4" accessibilityRole="alert">
              <Text className="text-sm text-danger-500" style={{ fontFamily: font.semibold }}>{draftError}</Text>
            </View>
          ) : null}

          <View className="flex-row gap-3 mb-10">
            <Pressable
              onPress={() => setStep("add-exercises")}
              accessibilityRole="button"
              className="flex-1 border border-surface-border rounded-2xl py-4 flex-row items-center justify-center gap-2"
            >
              <AppIcon name="pencil" size={16} color="#A99FBA" strokeWidth={2} />
              <Text className="text-text-secondary text-sm" style={{ fontFamily: font.semibold }}>Editar</Text>
            </Pressable>
            <View className="flex-1">
              <GradientButton label={destination.studentId ? "Salvar plano" : "Salvar modelo"} enabled={!draftError} loading={saving} onPress={handleSave} />
            </View>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
