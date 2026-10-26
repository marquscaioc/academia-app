// Workout builder draft → create_workout_plan() payload (migration 00038). Pure; tested in __tests__/planDraft.test.ts.

export interface DraftExercise {
  exercise_id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest: number;
  rpe: string;
  tempo: string;
  supersetGroup: number | null;
}

export interface DraftWorkout {
  name: string;
  /** JS weekdays, 0 = Sunday (same convention as lib/workout/schedule.ts). */
  days: number[];
  exercises: DraftExercise[];
}

export interface PlanWorkoutPayload {
  name: string;
  day_of_week: number[] | null;
  exercises: {
    exercise_id: string;
    target_sets: number;
    target_reps: string;
    target_weight_kg: number | null;
    target_rpe: number | null;
    rest_seconds: number;
    tempo: string | null;
    superset_group: number | null;
  }[];
}

export const WEEKDAY_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

/** Accepts "42,5" (pt-BR) and "42.5". Empty → null; anything else not numeric → NaN. */
export function parseDecimal(value: string): number | null {
  const v = value.trim().replace(",", ".");
  if (!v) return null;
  return /^\d+(\.\d+)?$/.test(v) ? Number(v) : NaN;
}

export function newExercise(ex: { id: string; name: string }): DraftExercise {
  return { exercise_id: ex.id, name: ex.name, sets: 3, reps: "10-12", weight: "", rest: 60, rpe: "", tempo: "", supersetGroup: null };
}

/** "Treino A", "Treino B", … — first letter not already used. */
export function nextWorkoutName(existing: string[]): string {
  const used = new Set(existing.map((n) => n.trim().toLowerCase()));
  for (let i = 0; i < 26; i++) {
    const name = `Treino ${String.fromCharCode(65 + i)}`;
    if (!used.has(name.toLowerCase())) return name;
  }
  return `Treino ${existing.length + 1}`;
}

export function toggleDay(days: number[], day: number): number[] {
  return days.includes(day) ? days.filter((d) => d !== day) : [...days, day].sort((a, b) => a - b);
}

/** Links / unlinks exercise `idx` with the one above it in a superset (same superset_group). */
export function toggleSuperset(exercises: DraftExercise[], idx: number): DraftExercise[] {
  if (idx <= 0 || idx >= exercises.length) return exercises;
  const updated = exercises.map((e) => ({ ...e }));
  const prevGroup = updated[idx - 1].supersetGroup;
  if (updated[idx].supersetGroup && updated[idx].supersetGroup === prevGroup) {
    updated[idx].supersetGroup = null;
  } else {
    let group = prevGroup;
    if (!group) {
      group = Math.max(0, ...updated.map((e) => e.supersetGroup ?? 0)) + 1;
      updated[idx - 1].supersetGroup = group;
    }
    updated[idx].supersetGroup = group;
  }
  return updated;
}

/** First problem found, in pt-BR, or null when the draft can be saved. */
export function validateDraft(planName: string, workouts: DraftWorkout[]): string | null {
  if (!planName.trim()) return "Dê um nome ao plano.";
  if (workouts.length === 0) return "Adicione pelo menos um treino.";
  for (const w of workouts) {
    const label = w.name.trim() || "Treino sem nome";
    if (!w.name.trim()) return "Todo treino precisa de um nome.";
    if (w.exercises.length === 0) return `${label}: adicione pelo menos um exercício.`;
    for (const e of w.exercises) {
      if (!Number.isInteger(e.sets) || e.sets < 1 || e.sets > 20) return `${label} · ${e.name}: séries entre 1 e 20.`;
      if (!e.reps.trim()) return `${label} · ${e.name}: informe as repetições.`;
      const weight = parseDecimal(e.weight);
      if (weight !== null && (Number.isNaN(weight) || weight > 1000)) return `${label} · ${e.name}: carga inválida.`;
      const rpe = parseDecimal(e.rpe);
      if (rpe !== null && (Number.isNaN(rpe) || !Number.isInteger(rpe) || rpe < 1 || rpe > 10)) {
        return `${label} · ${e.name}: RPE deve ser um inteiro de 1 a 10.`;
      }
      if (!Number.isInteger(e.rest) || e.rest < 0 || e.rest > 900) return `${label} · ${e.name}: descanso entre 0 e 900 s.`;
    }
  }
  return null;
}

/** Call only after validateDraft returned null. */
export function buildPlanPayload(workouts: DraftWorkout[]): PlanWorkoutPayload[] {
  return workouts.map((w) => ({
    name: w.name.trim(),
    day_of_week: w.days.length ? [...w.days].sort((a, b) => a - b) : null,
    exercises: w.exercises.map((e) => ({
      exercise_id: e.exercise_id,
      target_sets: e.sets,
      target_reps: e.reps.trim(),
      target_weight_kg: parseDecimal(e.weight),
      target_rpe: parseDecimal(e.rpe),
      rest_seconds: e.rest,
      tempo: e.tempo.trim() || null,
      superset_group: e.supersetGroup,
    })),
  }));
}
