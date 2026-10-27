// Workout builder draft → create_workout_plan() payload (migration 00038). Pure; tested in __tests__/planDraft.test.ts.

export interface DraftExercise {
  id?: string;
  exercise_id: string;
  name: string;
  sets: number;
  reps: string;
  weight: string;
  rest: number;
  rpe: string;
  tempo: string;
  notes: string;
  supersetGroup: number | null;
}

export interface DraftWorkout {
  id?: string;
  name: string;
  notes?: string | null;
  estimatedDurationMinutes?: number | null;
  /** JS weekdays, 0 = Sunday (same convention as lib/workout/schedule.ts). */
  days: number[];
  exercises: DraftExercise[];
}

export interface PlanWorkoutPayload {
  id?: string;
  name: string;
  notes: string | null;
  estimated_duration_minutes: number | null;
  day_of_week: number[] | null;
  exercises: {
    id?: string;
    exercise_id: string;
    target_sets: number;
    target_reps: string;
    target_weight_kg: number | null;
    target_rpe: number | null;
    rest_seconds: number;
    tempo: string | null;
    notes: string | null;
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
  return { exercise_id: ex.id, name: ex.name, sets: 3, reps: "10-12", weight: "", rest: 60, rpe: "", tempo: "", notes: "", supersetGroup: null };
}

/** Preserve prescription IDs and metadata when opening a saved plan. */
export function planToDraft(workouts: {
  id: string; name: string; day_of_week: number[] | null; sort_order: number;
  notes: string | null; estimated_duration_minutes: number | null;
  exercises?: {
    id: string; exercise_id: string; sort_order: number; target_sets: number; target_reps: string;
    target_weight_kg: number | null; target_rpe: number | null; rest_seconds: number;
    tempo: string | null; notes: string | null; superset_group: number | null;
    exercise?: { name: string } | null;
  }[];
}[]): DraftWorkout[] {
  return [...workouts].sort((a, b) => a.sort_order - b.sort_order).map((w) => ({
    id: w.id, name: w.name, days: [...(w.day_of_week ?? [])], notes: w.notes,
    estimatedDurationMinutes: w.estimated_duration_minutes,
    exercises: [...(w.exercises ?? [])].sort((a, b) => a.sort_order - b.sort_order).map((e) => ({
      id: e.id, exercise_id: e.exercise_id, name: e.exercise?.name ?? "Exercício",
      sets: e.target_sets ?? 3, reps: e.target_reps ?? "10-12", weight: e.target_weight_kg == null ? "" : String(e.target_weight_kg),
      rest: e.rest_seconds ?? 60, rpe: e.target_rpe == null ? "" : String(e.target_rpe),
      tempo: e.tempo ?? "", notes: e.notes ?? "", supersetGroup: e.superset_group,
    })),
  }));
}

/** Moves one prescription without changing its ID, notes or superset assignment. */
export function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from === to) return items;
  const result = [...items];
  result.splice(to, 0, result.splice(from, 1)[0]);
  return result;
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
    ...(w.id ? { id: w.id } : {}),
    name: w.name.trim(),
    notes: w.notes?.trim() || null,
    estimated_duration_minutes: w.estimatedDurationMinutes ?? null,
    day_of_week: w.days.length ? [...w.days].sort((a, b) => a - b) : null,
    exercises: w.exercises.map((e) => ({
      ...(e.id ? { id: e.id } : {}),
      exercise_id: e.exercise_id,
      target_sets: e.sets,
      target_reps: e.reps.trim(),
      target_weight_kg: parseDecimal(e.weight),
      target_rpe: parseDecimal(e.rpe),
      rest_seconds: e.rest,
      tempo: e.tempo.trim() || null,
      notes: e.notes.trim() || null,
      superset_group: e.supersetGroup,
    })),
  }));
}
