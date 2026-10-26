// Pure workout math — no React, no Supabase. Unit-tested in __tests__/workoutMetrics.test.ts.

export interface LoggedSet {
  reps: number | null;
  weightKg: number | null;
  isWarmup?: boolean;
}

export interface RepTarget {
  min: number | null;
  max: number | null;
}

/** Parses prescriptions such as "10", "8-12", "8 a 12", "AMRAP" (→ nulls). */
export function parseRepTarget(target: string | null | undefined): RepTarget {
  if (!target) return { min: null, max: null };
  const nums = String(target).match(/\d+/g)?.map(Number) ?? [];
  if (nums.length === 0) return { min: null, max: null };
  if (nums.length === 1) return { min: nums[0], max: nums[0] };
  return { min: Math.min(nums[0], nums[1]), max: Math.max(nums[0], nums[1]) };
}

/** Parses user-typed numbers accepting both "," and "." as decimal separator. */
export function parseDecimal(input: string): number | null {
  const normalized = input.trim().replace(",", ".");
  if (normalized === "") return null;
  const n = Number(normalized);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Volume of one set (kg × reps). Warm-up sets and incomplete data count as 0. */
export function setVolume(set: LoggedSet): number {
  if (set.isWarmup) return 0;
  if (!set.reps || !set.weightKg) return 0;
  return set.reps * set.weightKg;
}

export function totalVolume(sets: LoggedSet[]): number {
  return sets.reduce((sum, s) => sum + setVolume(s), 0);
}

/**
 * Estimated one-rep max (Epley). Only meaningful for 1–12 reps; returns null outside
 * that range so very high-rep sets don't produce misleading records.
 */
export function estimateOneRepMax(weightKg: number | null, reps: number | null): number | null {
  if (!weightKg || !reps || reps < 1 || reps > 12) return null;
  if (reps === 1) return weightKg;
  return round1(weightKg * (1 + reps / 30));
}

export interface BestMarks {
  maxWeightKg: number | null;
  bestE1rmKg: number | null;
  bestSetVolume: number | null;
}

export function bestMarks(sets: LoggedSet[]): BestMarks {
  const working = sets.filter((s) => !s.isWarmup);
  let maxWeightKg: number | null = null;
  let bestE1rmKg: number | null = null;
  let bestSetVolume: number | null = null;
  for (const s of working) {
    if (s.weightKg && s.reps && (maxWeightKg === null || s.weightKg > maxWeightKg)) maxWeightKg = s.weightKg;
    const e1rm = estimateOneRepMax(s.weightKg, s.reps);
    if (e1rm !== null && (bestE1rmKg === null || e1rm > bestE1rmKg)) bestE1rmKg = e1rm;
    const vol = setVolume(s);
    if (vol > 0 && (bestSetVolume === null || vol > bestSetVolume)) bestSetVolume = vol;
  }
  return { maxWeightKg, bestE1rmKg, bestSetVolume };
}

export type RecordKind = "max_weight" | "e1rm" | "set_volume";

export interface PersonalRecordHit {
  kind: RecordKind;
  value: number;
  previous: number | null;
}

/**
 * Explicit PR criteria: a working set (not warm-up, reps ≥ 1, weight > 0) that strictly
 * beats the best previous mark. A first-ever performance is NOT a PR (no baseline),
 * which avoids celebrating every exercise in a user's first session.
 */
export function detectRecords(current: LoggedSet[], previous: BestMarks): PersonalRecordHit[] {
  const now = bestMarks(current);
  const hits: PersonalRecordHit[] = [];
  const check = (kind: RecordKind, value: number | null, prev: number | null) => {
    if (value !== null && prev !== null && value > prev) hits.push({ kind, value, previous: prev });
  };
  check("max_weight", now.maxWeightKg, previous.maxWeightKg);
  check("e1rm", now.bestE1rmKg, previous.bestE1rmKg);
  check("set_volume", now.bestSetVolume, previous.bestSetVolume);
  return hits;
}

/**
 * Double-progression suggestion: if every working set of the last session reached the
 * top of the rep range, suggest +increment; otherwise keep the load.
 */
export function suggestNextWeight(
  lastSets: LoggedSet[],
  repTarget: RepTarget,
  incrementKg = 2.5,
): { weightKg: number | null; increase: boolean } {
  const working = lastSets.filter((s) => !s.isWarmup && s.weightKg && s.reps);
  if (working.length === 0) return { weightKg: null, increase: false };
  const topWeight = Math.max(...working.map((s) => s.weightKg as number));
  const goal = repTarget.max ?? repTarget.min;
  const atTop = working.filter((s) => s.weightKg === topWeight);
  const increase = goal !== null && atTop.every((s) => (s.reps ?? 0) >= goal);
  return { weightKg: increase ? round1(topWeight + incrementKg) : topWeight, increase };
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mmss = `${String(m).padStart(h ? 2 : 1, "0")}:${String(sec).padStart(2, "0")}`;
  return h ? `${h}:${mmss}` : mmss;
}

export function formatKg(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${Number.isInteger(value) ? value : value.toFixed(1).replace(".", ",")} kg`;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
