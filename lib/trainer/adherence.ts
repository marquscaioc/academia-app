// Trainer dashboard derivations from trainer_student_overview() rows. Pure; tested in __tests__/trainerAdherence.test.ts.
// No invented targets: adherence is only computed when the plan schedules training days.

export interface StudentOverview {
  student_id: string;
  full_name: string | null;
  avatar_url: string | null;
  sessions_7d: number;
  sessions_30d: number;
  last_session_at: string | null;
  plan_name: string | null;
  plan_ends_at: string | null;
  planned_days_per_week: number | null;
  pending_checkins: number;
  last_checkin_score: number | string | null;
  subscription_status: string | null;
  subscription_period_end: string | null;
}

export type ActivityStatus = "active" | "slipping" | "inactive" | "never";

const DAY = 24 * 60 * 60 * 1000;

/** Sessions in the last 30 days vs. sessions scheduled by the plan in the same window. */
export function workoutAdherence(sessions30d: number, plannedDaysPerWeek: number | null): number | null {
  if (!plannedDaysPerWeek || plannedDaysPerWeek <= 0) return null;
  const expected = plannedDaysPerWeek * (30 / 7);
  return Math.min(100, Math.round((sessions30d / expected) * 100));
}

/** active: trained in the last 7 days · slipping: 8–14 days · inactive: > 14 days · never: no session. */
export function activityStatus(lastSessionAt: string | null, now: Date = new Date()): ActivityStatus {
  if (!lastSessionAt) return "never";
  const days = (now.getTime() - new Date(lastSessionAt).getTime()) / DAY;
  if (days <= 7) return "active";
  if (days <= 14) return "slipping";
  return "inactive";
}

export function daysSince(iso: string | null, now: Date = new Date()): number | null {
  if (!iso) return null;
  return Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / DAY));
}

function withinNextDays(iso: string | null, days: number, now: Date): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return t >= start.getTime() && t <= now.getTime() + days * DAY;
}

export interface DashboardSummary {
  activeStudents: number;
  trainedLast7d: number;
  withoutRecentWorkout: number;
  sessionsLast7d: number;
  pendingCheckins: number;
  plansEndingSoon: number;
  subscriptionsNeedingAttention: number;
}

export function dashboardSummary(rows: StudentOverview[], now: Date = new Date()): DashboardSummary {
  let trainedLast7d = 0;
  let sessionsLast7d = 0;
  let pendingCheckins = 0;
  let plansEndingSoon = 0;
  let subscriptionsNeedingAttention = 0;
  for (const r of rows) {
    if (r.sessions_7d > 0) trainedLast7d++;
    sessionsLast7d += r.sessions_7d;
    pendingCheckins += r.pending_checkins;
    if (withinNextDays(r.plan_ends_at, 7, now)) plansEndingSoon++;
    if (r.subscription_status === "past_due" || (r.subscription_status === "active" && withinNextDays(r.subscription_period_end, 7, now))) {
      subscriptionsNeedingAttention++;
    }
  }
  return {
    activeStudents: rows.length,
    trainedLast7d,
    withoutRecentWorkout: rows.length - trainedLast7d,
    sessionsLast7d,
    pendingCheckins,
    plansEndingSoon,
    subscriptionsNeedingAttention,
  };
}

/** Students needing attention first: never trained, inactive, slipping, then by fewest recent sessions. */
export function sortByAttention(rows: StudentOverview[], now: Date = new Date()): StudentOverview[] {
  const rank: Record<ActivityStatus, number> = { never: 0, inactive: 1, slipping: 2, active: 3 };
  return rows.slice().sort((a, b) => {
    const r = rank[activityStatus(a.last_session_at, now)] - rank[activityStatus(b.last_session_at, now)];
    if (r !== 0) return r;
    if (b.pending_checkins !== a.pending_checkins) return b.pending_checkins - a.pending_checkins;
    return a.sessions_7d - b.sessions_7d;
  });
}
