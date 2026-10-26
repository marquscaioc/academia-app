import {
  bestMarks,
  detectRecords,
  estimateOneRepMax,
  formatDuration,
  formatKg,
  parseDecimal,
  parseRepTarget,
  setVolume,
  suggestNextWeight,
  totalVolume,
} from "../lib/workout/metrics";

describe("parseRepTarget", () => {
  it("parses single values and ranges", () => {
    expect(parseRepTarget("10")).toEqual({ min: 10, max: 10 });
    expect(parseRepTarget("8-12")).toEqual({ min: 8, max: 12 });
    expect(parseRepTarget("12 a 8")).toEqual({ min: 8, max: 12 });
  });
  it("returns nulls for non-numeric targets", () => {
    expect(parseRepTarget("AMRAP")).toEqual({ min: null, max: null });
    expect(parseRepTarget(null)).toEqual({ min: null, max: null });
  });
});

describe("parseDecimal", () => {
  it("accepts comma and dot", () => {
    expect(parseDecimal("22,5")).toBe(22.5);
    expect(parseDecimal("22.5")).toBe(22.5);
  });
  it("rejects invalid or negative input", () => {
    expect(parseDecimal("")).toBeNull();
    expect(parseDecimal("abc")).toBeNull();
    expect(parseDecimal("-5")).toBeNull();
  });
});

describe("volume", () => {
  it("ignores warm-ups and incomplete sets", () => {
    expect(setVolume({ reps: 10, weightKg: 50 })).toBe(500);
    expect(setVolume({ reps: 10, weightKg: 50, isWarmup: true })).toBe(0);
    expect(setVolume({ reps: null, weightKg: 50 })).toBe(0);
    expect(
      totalVolume([
        { reps: 10, weightKg: 50 },
        { reps: 8, weightKg: 55 },
        { reps: 15, weightKg: 20, isWarmup: true },
      ]),
    ).toBe(940);
  });
});

describe("estimateOneRepMax", () => {
  it("uses Epley and returns weight for singles", () => {
    expect(estimateOneRepMax(100, 1)).toBe(100);
    expect(estimateOneRepMax(100, 10)).toBe(133.3);
  });
  it("returns null outside the 1–12 rep range or with missing data", () => {
    expect(estimateOneRepMax(100, 15)).toBeNull();
    expect(estimateOneRepMax(null, 5)).toBeNull();
  });
});

describe("detectRecords", () => {
  const previous = bestMarks([{ reps: 10, weightKg: 50 }]);

  it("flags strictly better marks", () => {
    const hits = detectRecords([{ reps: 8, weightKg: 55 }], previous);
    expect(hits.map((h) => h.kind)).toEqual(["max_weight", "e1rm"]);
  });
  it("does not flag equal performance or warm-ups", () => {
    expect(detectRecords([{ reps: 10, weightKg: 50 }], previous)).toEqual([]);
    expect(detectRecords([{ reps: 10, weightKg: 80, isWarmup: true }], previous)).toEqual([]);
  });
  it("never flags a first-ever performance", () => {
    expect(detectRecords([{ reps: 10, weightKg: 50 }], bestMarks([]))).toEqual([]);
  });
});

describe("suggestNextWeight", () => {
  it("increases when all top sets hit the top of the range", () => {
    expect(
      suggestNextWeight(
        [
          { reps: 12, weightKg: 40 },
          { reps: 12, weightKg: 40 },
        ],
        { min: 8, max: 12 },
      ),
    ).toEqual({ weightKg: 42.5, increase: true });
  });
  it("keeps the load otherwise", () => {
    expect(
      suggestNextWeight(
        [
          { reps: 12, weightKg: 40 },
          { reps: 9, weightKg: 40 },
        ],
        { min: 8, max: 12 },
      ),
    ).toEqual({ weightKg: 40, increase: false });
  });
  it("returns null without history", () => {
    expect(suggestNextWeight([], { min: 8, max: 12 })).toEqual({ weightKg: null, increase: false });
  });
});

describe("formatting", () => {
  it("formats durations", () => {
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(3725)).toBe("1:02:05");
    expect(formatDuration(-3)).toBe("0:00");
  });
  it("formats kg in pt-BR", () => {
    expect(formatKg(22.5)).toBe("22,5 kg");
    expect(formatKg(40)).toBe("40 kg");
    expect(formatKg(null)).toBe("—");
  });
});
