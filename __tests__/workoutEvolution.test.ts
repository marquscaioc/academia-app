import { evolutionSummary, exerciseEvolution, trainedExercises, type EvolutionSetRow } from "../lib/workout/evolution";

const row = (over: Partial<EvolutionSetRow>): EvolutionSetRow => ({
  sessionId: "s1",
  startedAt: "2026-10-01T10:00:00Z",
  exerciseId: "bench",
  exerciseName: "Supino",
  weightKg: 40,
  reps: 10,
  isWarmup: false,
  ...over,
});

const rows: EvolutionSetRow[] = [
  // session 2 listed first to prove sorting
  row({ sessionId: "s2", startedAt: "2026-10-08T10:00:00Z", weightKg: 42.5, reps: 8 }),
  row({ sessionId: "s2", startedAt: "2026-10-08T10:00:00Z", weightKg: 42.5, reps: 7 }),
  row({ sessionId: "s1", weightKg: 20, reps: 15, isWarmup: true }),
  row({ sessionId: "s1", weightKg: 40, reps: 10 }),
  row({ sessionId: "s1", weightKg: 40, reps: 9 }),
  row({ sessionId: "s1", weightKg: null, reps: 10 }),
  row({ sessionId: "s3", startedAt: "2026-10-15T10:00:00Z", weightKg: 30, reps: 20 }),
  row({ sessionId: "w", startedAt: "2026-10-02T10:00:00Z", exerciseId: "squat", exerciseName: "Agachamento", weightKg: 0, reps: 10 }),
];

describe("exerciseEvolution", () => {
  const bench = exerciseEvolution(rows.filter((r) => r.exerciseId === "bench"));
  it("one point per session, oldest first, warm-ups and empty sets ignored", () => {
    expect(bench.map((p) => p.sessionId)).toEqual(["s1", "s2", "s3"]);
    expect(bench[0]).toMatchObject({ maxWeightKg: 40, volumeKg: 760, workingSets: 2, bestE1rmKg: 53.3 });
    expect(bench[1]).toMatchObject({ maxWeightKg: 42.5, volumeKg: 637.5, bestE1rmKg: 53.8 });
  });
  it("leaves e1RM null when no set is in the 1–12 rep range", () => {
    expect(bench[2].bestE1rmKg).toBeNull();
  });
  it("skips sessions with no working set", () => {
    expect(exerciseEvolution(rows.filter((r) => r.exerciseId === "squat"))).toEqual([]);
  });
});

describe("evolutionSummary", () => {
  const bench = exerciseEvolution(rows.filter((r) => r.exerciseId === "bench"));
  it("first/last/best/change for the chosen metric, skipping missing values", () => {
    expect(evolutionSummary(bench, "maxWeightKg")).toEqual({ sessions: 3, first: 40, last: 30, best: 42.5, change: -10 });
    expect(evolutionSummary(bench, "bestE1rmKg")).toEqual({ sessions: 3, first: 53.3, last: 53.8, best: 53.8, change: 0.5 });
  });
  it("no change with a single value; nulls with no data", () => {
    expect(evolutionSummary(bench.slice(0, 1), "volumeKg").change).toBeNull();
    expect(evolutionSummary([], "volumeKg")).toEqual({ sessions: 0, first: null, last: null, best: null, change: null });
  });
});

describe("trainedExercises", () => {
  it("lists exercises with working sets, most recent first, counting distinct sessions", () => {
    expect(trainedExercises(rows)).toEqual([
      { exerciseId: "bench", name: "Supino", sessions: 3, lastDate: "2026-10-15T10:00:00Z", maxWeightKg: 42.5 },
    ]);
  });
});
