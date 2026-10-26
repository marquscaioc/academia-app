// Session-vs-session comparison for the history detail. Pure; unit-tested in __tests__/workoutCompare.test.ts.
import { bestMarks, totalVolume, type BestMarks, type LoggedSet } from "./metrics";

export interface HistorySet extends LoggedSet {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
}

export interface ExerciseSummary {
  exerciseId: string;
  exerciseName: string;
  sets: HistorySet[];
  workingSets: number;
  volume: number;
  best: BestMarks;
}

export interface ExerciseComparison extends ExerciseSummary {
  /** null when the exercise was not done in the previous session (no baseline). */
  previous: { volume: number; maxWeightKg: number | null; workingSets: number } | null;
  volumeDelta: number | null;
  maxWeightDelta: number | null;
}

export interface SessionComparison {
  exercises: ExerciseComparison[];
  totalVolume: number;
  previousTotalVolume: number | null;
  totalVolumeDelta: number | null;
}

/** Groups sets by exercise, keeping the order in which exercises were first performed. */
export function summarizeByExercise(sets: HistorySet[]): ExerciseSummary[] {
  const groups = new Map<string, HistorySet[]>();
  for (const s of sets) {
    const list = groups.get(s.exerciseId);
    if (list) list.push(s);
    else groups.set(s.exerciseId, [s]);
  }
  return Array.from(groups.values()).map((list) => {
    const ordered = list.slice().sort((a, b) => a.setNumber - b.setNumber);
    return {
      exerciseId: ordered[0].exerciseId,
      exerciseName: ordered[0].exerciseName,
      sets: ordered,
      workingSets: ordered.filter((s) => !s.isWarmup && (s.reps ?? 0) > 0).length,
      volume: totalVolume(ordered),
      best: bestMarks(ordered),
    };
  });
}

/** Compares a session with the previous session of the same workout (or none). */
export function compareSessions(current: HistorySet[], previous: HistorySet[] | null): SessionComparison {
  const prevByExercise = new Map(previous ? summarizeByExercise(previous).map((e) => [e.exerciseId, e]) : []);
  const exercises = summarizeByExercise(current).map<ExerciseComparison>((e) => {
    const p = prevByExercise.get(e.exerciseId);
    if (!p) return { ...e, previous: null, volumeDelta: null, maxWeightDelta: null };
    const maxWeightDelta =
      e.best.maxWeightKg !== null && p.best.maxWeightKg !== null ? round1(e.best.maxWeightKg - p.best.maxWeightKg) : null;
    return {
      ...e,
      previous: { volume: p.volume, maxWeightKg: p.best.maxWeightKg, workingSets: p.workingSets },
      volumeDelta: round1(e.volume - p.volume),
      maxWeightDelta,
    };
  });
  const total = totalVolume(current);
  const previousTotal = previous ? totalVolume(previous) : null;
  return {
    exercises,
    totalVolume: total,
    previousTotalVolume: previousTotal,
    totalVolumeDelta: previousTotal === null ? null : round1(total - previousTotal),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
