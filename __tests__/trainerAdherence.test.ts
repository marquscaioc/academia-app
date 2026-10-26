import {
  activityStatus,
  checkinAdherence,
  overallAdherence,
  plannedDaysPerWeek,
  dashboardSummary,
  daysSince,
  sortByAttention,
  workoutAdherence,
  type StudentOverview,
} from "../lib/trainer/adherence";

const now = new Date(2026, 9, 28, 12, 0, 0);
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const inDays = (d: number) => new Date(now.getTime() + d * 86400000).toISOString();

const row = (over: Partial<StudentOverview>): StudentOverview => ({
  student_id: "s",
  full_name: "Aluno",
  avatar_url: null,
  sessions_7d: 0,
  sessions_30d: 0,
  last_session_at: null,
  plan_name: null,
  plan_ends_at: null,
  planned_days_per_week: null,
  pending_checkins: 0,
  last_checkin_score: null,
  subscription_status: null,
  subscription_period_end: null,
  ...over,
});

describe("workoutAdherence", () => {
  it("is unknown without scheduled days (no invented target)", () => {
    expect(workoutAdherence(10, null)).toBeNull();
    expect(workoutAdherence(10, 0)).toBeNull();
  });
  it("compares 30-day sessions with the plan schedule, capped at 100", () => {
    expect(workoutAdherence(6, 3)).toBe(47); // 6 / 12.86
    expect(workoutAdherence(13, 3)).toBe(100);
    expect(workoutAdherence(0, 4)).toBe(0);
  });
});

describe("activityStatus / daysSince", () => {
  it("classifies by days since the last finished session", () => {
    expect(activityStatus(null, now)).toBe("never");
    expect(activityStatus(daysAgo(2), now)).toBe("active");
    expect(activityStatus(daysAgo(10), now)).toBe("slipping");
    expect(activityStatus(daysAgo(20), now)).toBe("inactive");
    expect(daysSince(daysAgo(3), now)).toBe(3);
    expect(daysSince(null, now)).toBeNull();
  });
});

describe("dashboardSummary", () => {
  it("aggregates real counts only", () => {
    const s = dashboardSummary(
      [
        row({ sessions_7d: 2, pending_checkins: 1, plan_ends_at: inDays(3) }),
        row({ sessions_7d: 0, subscription_status: "past_due" }),
        row({ sessions_7d: 1, subscription_status: "active", subscription_period_end: inDays(5), plan_ends_at: inDays(30) }),
        row({ subscription_status: "active", subscription_period_end: inDays(20), plan_ends_at: daysAgo(2) }),
      ],
      now,
    );
    expect(s).toEqual({
      activeStudents: 4,
      trainedLast7d: 2,
      withoutRecentWorkout: 2,
      sessionsLast7d: 3,
      pendingCheckins: 1,
      plansEndingSoon: 1,
      subscriptionsNeedingAttention: 2,
    });
  });
});

describe("sortByAttention", () => {
  it("puts students who never trained or stopped first", () => {
    const sorted = sortByAttention(
      [
        row({ student_id: "active", last_session_at: daysAgo(1), sessions_7d: 3 }),
        row({ student_id: "never" }),
        row({ student_id: "inactive", last_session_at: daysAgo(30) }),
        row({ student_id: "slipping", last_session_at: daysAgo(9) }),
      ],
      now,
    );
    expect(sorted.map((r) => r.student_id)).toEqual(["never", "inactive", "slipping", "active"]);
  });
});

describe("student adherence helpers", () => {
  it("counts distinct scheduled weekdays", () => {
    expect(plannedDaysPerWeek([{ day_of_week: [1, 3] }, { day_of_week: [3, 5] }, { day_of_week: null }])).toBe(3);
    expect(plannedDaysPerWeek([{ day_of_week: null }])).toBeNull();
    expect(plannedDaysPerWeek([])).toBeNull();
  });
  it("check-in adherence is unknown when nothing was requested", () => {
    expect(checkinAdherence(0, 0)).toBeNull();
    expect(checkinAdherence(1, 4)).toBe(25);
    expect(checkinAdherence(5, 4)).toBe(100);
  });
  it("overall averages only known scores", () => {
    expect(overallAdherence([40, null])).toBe(40);
    expect(overallAdherence([40, 61])).toBe(51);
    expect(overallAdherence([null, null])).toBeNull();
  });
});
