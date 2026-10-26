import { compareSessions, summarizeByExercise, type HistorySet } from "../lib/workout/compare";

const set = (exerciseId: string, setNumber: number, weightKg: number | null, reps: number | null, isWarmup = false): HistorySet => ({
  exerciseId,
  exerciseName: exerciseId === "bench" ? "Supino" : "Remada",
  setNumber,
  weightKg,
  reps,
  isWarmup,
});

describe("summarizeByExercise", () => {
  it("groups by exercise in first-performed order and sorts sets", () => {
    const s = summarizeByExercise([set("row", 1, 30, 10), set("bench", 2, 40, 8), set("bench", 1, 40, 12)]);
    expect(s.map((e) => e.exerciseId)).toEqual(["row", "bench"]);
    expect(s[1].sets.map((x) => x.setNumber)).toEqual([1, 2]);
    expect(s[1].volume).toBe(800);
  });

  it("excludes warm-ups and empty sets from working sets and volume", () => {
    const [bench] = summarizeByExercise([set("bench", 1, 20, 15, true), set("bench", 2, 40, 10), set("bench", 3, null, null)]);
    expect(bench.workingSets).toBe(1);
    expect(bench.volume).toBe(400);
    expect(bench.best.maxWeightKg).toBe(40);
  });
});

describe("compareSessions", () => {
  it("has no baseline without a previous session", () => {
    const c = compareSessions([set("bench", 1, 40, 10)], null);
    expect(c.previousTotalVolume).toBeNull();
    expect(c.totalVolumeDelta).toBeNull();
    expect(c.exercises[0].previous).toBeNull();
  });

  it("computes per-exercise and total deltas against the previous session", () => {
    const prev = [set("bench", 1, 40, 10), set("bench", 2, 40, 8), set("row", 1, 30, 10)];
    const curr = [set("bench", 1, 42.5, 10), set("bench", 2, 42.5, 9)];
    const c = compareSessions(curr, prev);
    expect(c.totalVolume).toBe(807.5);
    expect(c.previousTotalVolume).toBe(1020);
    expect(c.totalVolumeDelta).toBe(-212.5);
    expect(c.exercises).toHaveLength(1);
    expect(c.exercises[0].volumeDelta).toBe(87.5);
    expect(c.exercises[0].maxWeightDelta).toBe(2.5);
    expect(c.exercises[0].previous).toEqual({ volume: 720, maxWeightKg: 40, workingSets: 2 });
  });

  it("marks exercises new in this session as having no baseline", () => {
    const c = compareSessions([set("row", 1, 30, 10)], [set("bench", 1, 40, 10)]);
    expect(c.exercises[0].previous).toBeNull();
    expect(c.exercises[0].volumeDelta).toBeNull();
  });
});
