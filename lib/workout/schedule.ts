// Pure scheduling helpers for A/B/C splits. Unit-tested in __tests__/workoutSchedule.test.ts.

export interface ScheduledWorkout {
  id: string;
  sort_order: number;
  day_of_week: number[] | null;
}

export interface SessionLike {
  workout_id: string | null;
  started_at: string;
  finished_at: string | null;
}

export interface WorkoutStatus {
  lastFinishedAt: string | null;
  doneToday: boolean;
  doneThisWeek: boolean;
}

function startOfDay(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

/** Week starts on Sunday, matching the existing calendar component. */
function startOfWeek(d: Date): number {
  const x = new Date(d);
  x.setDate(x.getDate() - x.getDay());
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

export function workoutStatuses(
  workouts: ScheduledWorkout[],
  sessions: SessionLike[],
  now: Date = new Date(),
): Record<string, WorkoutStatus> {
  const today = startOfDay(now);
  const week = startOfWeek(now);
  const result: Record<string, WorkoutStatus> = {};
  for (const w of workouts) result[w.id] = { lastFinishedAt: null, doneToday: false, doneThisWeek: false };
  for (const s of sessions) {
    if (!s.finished_at || !s.workout_id || !result[s.workout_id]) continue;
    const st = result[s.workout_id];
    const t = new Date(s.started_at).getTime();
    if (!st.lastFinishedAt || t > new Date(st.lastFinishedAt).getTime()) st.lastFinishedAt = s.started_at;
    if (t >= today) st.doneToday = true;
    if (t >= week) st.doneThisWeek = true;
  }
  return result;
}

/**
 * Recommends the next workout:
 *  1. a workout scheduled for today's weekday that was not done today;
 *  2. otherwise the workout following the most recently finished one (rotation A→B→C→A);
 *  3. otherwise the first workout of the plan.
 */
export function recommendNextWorkout<T extends ScheduledWorkout>(
  workouts: T[],
  sessions: SessionLike[],
  now: Date = new Date(),
): T | null {
  if (workouts.length === 0) return null;
  const ordered = workouts.slice().sort((a, b) => a.sort_order - b.sort_order);
  const status = workoutStatuses(ordered, sessions, now);
  const dow = now.getDay();

  const scheduledToday = ordered.find((w) => w.day_of_week?.includes(dow) && !status[w.id].doneToday);
  if (scheduledToday) return scheduledToday;

  let lastIdx = -1;
  let lastTime = -Infinity;
  ordered.forEach((w, i) => {
    const at = status[w.id].lastFinishedAt;
    if (at && new Date(at).getTime() > lastTime) {
      lastTime = new Date(at).getTime();
      lastIdx = i;
    }
  });
  if (lastIdx === -1) return ordered[0];
  return ordered[(lastIdx + 1) % ordered.length];
}
