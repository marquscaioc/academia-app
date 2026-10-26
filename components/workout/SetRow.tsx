import { memo, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { AppIcon } from "../ui";
import { font, palette } from "../../lib/design/tokens";
import { parseDecimal } from "../../lib/workout/metrics";
import type { SessionSet } from "../../stores/useWorkoutSessionStore";

export interface SetValues {
  weightKg: number | null;
  reps: number | null;
  isWarmup: boolean;
}

interface SetRowProps {
  setNumber: number;
  logged?: SessionSet;
  previousLabel: string;
  placeholderWeight: number | null;
  placeholderReps: number | null;
  onComplete: (values: SetValues) => void;
  onEdit: (values: SetValues) => void;
  onUncomplete: () => void;
  onRetry: () => void;
}

function numToStr(n: number | null | undefined): string {
  return n === null || n === undefined ? "" : String(n).replace(".", ",");
}

/**
 * One set line. Empty inputs fall back to the placeholder (previous load / target reps),
 * so the common case — repeating the prescription — is a single tap on ✓.
 */
export const SetRow = memo(function SetRow({
  setNumber,
  logged,
  previousLabel,
  placeholderWeight,
  placeholderReps,
  onComplete,
  onEdit,
  onUncomplete,
  onRetry,
}: SetRowProps) {
  const [weight, setWeight] = useState(numToStr(logged?.weightKg));
  const [reps, setReps] = useState(numToStr(logged?.reps));
  const [isWarmup, setIsWarmup] = useState(logged?.isWarmup ?? false);
  const [invalid, setInvalid] = useState(false);
  const completed = !!logged?.completed;

  // Server-restored or externally changed values win over stale local drafts.
  useEffect(() => {
    if (logged) {
      setWeight(numToStr(logged.weightKg));
      setReps(numToStr(logged.reps));
      setIsWarmup(logged.isWarmup);
    }
  }, [logged]);

  const resolve = (): SetValues | null => {
    const w = weight.trim() === "" ? placeholderWeight : parseDecimal(weight);
    const r = reps.trim() === "" ? placeholderReps : parseDecimal(reps);
    if (weight.trim() !== "" && w === null) return null;
    if (r === null || r < 1 || !Number.isInteger(r)) return null;
    return { weightKg: w, reps: r, isWarmup };
  };

  const handleCheck = () => {
    if (completed) {
      onUncomplete();
      return;
    }
    const values = resolve();
    if (!values) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    setWeight(numToStr(values.weightKg));
    setReps(numToStr(values.reps));
    onComplete(values);
  };

  const commitEdit = () => {
    if (!completed) return;
    const values = resolve();
    if (!values) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    if (values.weightKg !== logged?.weightKg || values.reps !== logged?.reps || values.isWarmup !== logged?.isWarmup) {
      onEdit(values);
    }
  };

  const toggleWarmup = () => {
    const next = !isWarmup;
    setIsWarmup(next);
    if (completed && logged) onEdit({ weightKg: logged.weightKg, reps: logged.reps, isWarmup: next });
  };

  const rowBg = completed ? "bg-success-500/10 border-success-500/30" : "bg-surface-card border-surface-border";
  const inputCls = `h-11 rounded-xl px-2 text-center text-base text-text-primary ${
    completed ? "bg-transparent" : "bg-surface-elevated"
  } ${invalid ? "border border-danger-500" : ""}`;

  return (
    <View className={`flex-row items-center gap-2 px-2 py-2 rounded-2xl border ${rowBg}`}>
      <Pressable
        onPress={toggleWarmup}
        accessibilityRole="button"
        accessibilityLabel={isWarmup ? `Série ${setNumber}, aquecimento. Tocar para marcar como válida` : `Série ${setNumber}. Tocar para marcar como aquecimento`}
        className="w-9 h-11 items-center justify-center"
      >
        <Text
          className={isWarmup ? "text-warning-500" : "text-text-secondary"}
          style={{ fontFamily: font.bold, fontSize: 15 }}
        >
          {isWarmup ? "A" : setNumber}
        </Text>
      </Pressable>

      <Text
        className="flex-1 text-text-muted text-xs"
        numberOfLines={1}
        style={{ fontFamily: font.medium }}
        accessibilityLabel={`Anterior: ${previousLabel}`}
      >
        {previousLabel}
      </Text>

      <TextInput
        value={weight}
        onChangeText={(t) => {
          setWeight(t);
          setInvalid(false);
        }}
        onBlur={commitEdit}
        placeholder={numToStr(placeholderWeight) || "kg"}
        placeholderTextColor={palette.textMuted}
        keyboardType="decimal-pad"
        returnKeyType="done"
        selectTextOnFocus
        accessibilityLabel={`Carga da série ${setNumber} em quilos`}
        className={`w-[72px] ${inputCls}`}
        style={{ fontFamily: font.semibold }}
      />
      <TextInput
        value={reps}
        onChangeText={(t) => {
          setReps(t);
          setInvalid(false);
        }}
        onBlur={commitEdit}
        placeholder={numToStr(placeholderReps) || "reps"}
        placeholderTextColor={palette.textMuted}
        keyboardType="number-pad"
        returnKeyType="done"
        selectTextOnFocus
        accessibilityLabel={`Repetições da série ${setNumber}`}
        className={`w-[60px] ${inputCls}`}
        style={{ fontFamily: font.semibold }}
      />

      {logged?.syncStatus === "error" ? (
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Falha ao salvar. Tocar para tentar novamente"
          className="w-11 h-11 rounded-xl items-center justify-center bg-danger-500/20"
        >
          <AppIcon name="refresh" size={18} color={palette.danger} strokeWidth={2.2} />
        </Pressable>
      ) : (
        <Pressable
          onPress={handleCheck}
          accessibilityRole="checkbox"
          aria-checked={completed}
          accessibilityLabel={completed ? `Desmarcar série ${setNumber}` : `Concluir série ${setNumber}`}
          className={`w-11 h-11 rounded-xl items-center justify-center ${
            completed ? "bg-success-500" : "bg-surface-elevated border border-surface-border"
          }`}
        >
          {logged?.syncStatus === "pending" ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <AppIcon name="check" size={20} color={completed ? "#F7F7F8" : palette.textMuted} strokeWidth={2.6} />
          )}
        </Pressable>
      )}
    </View>
  );
});
