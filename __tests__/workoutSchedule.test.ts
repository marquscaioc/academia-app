import { recommendNextWorkout, workoutStatuses } from "../lib/workout/schedule";

const A = { id: "A", sort_order: 0, day_of_week: null };
const B = { id: "B", sort_order: 1, day_of_week: null };
const C = { id: "C", sort_order: 2, day_of_week: null };
// Wednesday 2026-10-28 10:00 local
const now = new Date(2026, 9, 28, 10, 0, 0);
const at = (d: number, h = 9) => new Date(2026, 9, d, h, 0, 0).toISOString();

describe("recommendNextWorkout", () => {
  it("returns null without workouts", () => {
    expect(recommendNextWorkout([], [], now)).toBeNull();
  });

  it("starts with the first workout when there is no history", () => {
    expect(recommendNextWorkout([C, A, B], [], now)?.id).toBe("A");
  });

  it("rotates after the most recently finished workout", () => {
    const sessions = [
      { workout_id: "A", started_at: at(25), finished_at: at(25, 10) },
      { workout_id: "B", started_at: at(27), finished_at: at(27, 10) },
    ];
    expect(recommendNextWorkout([A, B, C], sessions, now)?.id).toBe("C");
  });

  it("wraps around to the first workout", () => {
    const sessions = [{ workout_id: "C", started_at: at(27), finished_at: at(27, 10) }];
    expect(recommendNextWorkout([A, B, C], sessions, now)?.id).toBe("A");
  });

  it("ignores unfinished sessions", () => {
    const sessions = [{ workout_id: "B", started_at: at(27), finished_at: null }];
    expect(recommendNextWorkout([A, B, C], sessions, now)?.id).toBe("A");
  });

  it("prefers a workout scheduled for today unless already done today", () => {
    const Bwed = { ...B, day_of_week: [3] };
    expect(recommendNextWorkout([A, Bwed, C], [], now)?.id).toBe("B");
    const doneToday = [{ workout_id: "B", started_at: at(28, 7), finished_at: at(28, 8) }];
    expect(recommendNextWorkout([A, Bwed, C], doneToday, now)?.id).toBe("C");
  });
});

describe("workoutStatuses", () => {
  it("computes last execution, today and this week (Sunday start)", () => {
    const sessions = [
      { workout_id: "A", started_at: at(24), finished_at: at(24, 10) }, // Saturday, previous week
      { workout_id: "B", started_at: at(26), finished_at: at(26, 10) }, // Monday
      { workout_id: "C", started_at: at(28, 7), finished_at: at(28, 8) }, // today
    ];
    const s = workoutStatuses([A, B, C], sessions, now);
    expect(s.A).toEqual({ lastFinishedAt: at(24), doneToday: false, doneThisWeek: false });
    expect(s.B.doneThisWeek).toBe(true);
    expect(s.C.doneToday).toBe(true);
  });
});
