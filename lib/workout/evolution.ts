// Per-exercise evolution from logged sets. Pure; tested in __tests__/workoutEvolution.test.ts.
// Only real logged sets count: warm-ups and sets without weight/reps are ignored, nothing is interpolated.
import { estimateOneRepMax } from "./metrics";

export interface EvolutionSetRow {
  sessionId: string;
  startedAt: string;
  exerciseId: string;
  exerciseName: string;
  weightKg: number | null;
  reps: number | null;
  isWarmup: boolean;
}

export interface EvolutionPoint {
  sessionId: string;
  date: string;
  maxWeightKg: number;
  /** null when no set had 1–12 reps (Epley is not meaningful outside that range). */
  bestE1rmKg: number | null;
  volumeKg: number;
  workingSets: number;
}

export type EvolutionMetric = "maxWeightKg" | "bestE1rmKg" | "volumeKg";

const working = (r: EvolutionSetRow) => !r.isWarmup && !!r.weightKg && r.weightKg > 0 && !!r.reps && r.reps > 0;

/** One point per finished session that has at least one working set, oldest first. */
export function exerciseEvolution(rows: EvolutionSetRow[]): EvolutionPoint[] {
  const bySession = new Map<string, EvolutionPoint>();
  for (const r of rows) {
    if (!working(r)) continue;
    const w = r.weightKg as number;
    const reps = r.reps as number;
    const p = bySession.get(r.sessionId) ?? {
      sessionId: r.sessionId,
      date: r.startedAt,
      maxWeightKg: 0,
      bestE1rmKg: null,
      volumeKg: 0,
      workingSets: 0,
    };
    p.maxWeightKg = Math.max(p.maxWeightKg, w);
    const e1rm = estimateOneRepMax(w, reps);
    if (e1rm !== null) p.bestE1rmKg = Math.max(p.bestE1rmKg ?? 0, e1rm);
    p.volumeKg = Math.round((p.volumeKg + w * reps) * 10) / 10;
    p.workingSets += 1;
    bySession.set(r.sessionId, p);
  }
  return [...bySession.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export interface EvolutionSummary {
  sessions: number;
  first: number | null;
  last: number | null;
  best: number | null;
  /** last − first; null with fewer than two sessions that have the metric. */
  change: number | null;
}

export function evolutionSummary(points: EvolutionPoint[], metric: EvolutionMetric): EvolutionSummary {
  const values = points.map((p) => p[metric]).filter((v): v is number => v !== null);
  if (values.length === 0) return { sessions: points.length, first: null, last: null, best: null, change: null };
  const first = values[0];
  const last = values[values.length - 1];
  return {
    sessions: points.length,
    first,
    last,
    best: Math.max(...values),
    change: values.length > 1 ? Math.round((last - first) * 10) / 10 : null,
  };
}

export interface TrainedExercise {
  exerciseId: string;
  name: string;
  sessions: number;
  lastDate: string;
  maxWeightKg: number;
}

/** Exercises with at least one working set, most recently trained first. */
export function trainedExercises(rows: EvolutionSetRow[]): TrainedExercise[] {
  const byExercise = new Map<string, TrainedExercise & { sessionIds: Set<string> }>();
  for (const r of rows) {
    if (!working(r)) continue;
    const e = byExercise.get(r.exerciseId) ?? {
      exerciseId: r.exerciseId,
      name: r.exerciseName,
      sessions: 0,
      lastDate: r.startedAt,
      maxWeightKg: 0,
      sessionIds: new Set<string>(),
    };
    e.sessionIds.add(r.sessionId);
    e.sessions = e.sessionIds.size;
    if (r.startedAt > e.lastDate) e.lastDate = r.startedAt;
    e.maxWeightKg = Math.max(e.maxWeightKg, r.weightKg as number);
    byExercise.set(r.exerciseId, e);
  }
  return [...byExercise.values()]
    .map(({ sessionIds: _ids, ...rest }) => rest)
    .sort((a, b) => b.lastDate.localeCompare(a.lastDate));
}
