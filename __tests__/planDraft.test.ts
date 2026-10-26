import {
  buildPlanPayload,
  newExercise,
  nextWorkoutName,
  parseDecimal,
  toggleDay,
  toggleSuperset,
  validateDraft,
  type DraftWorkout,
} from "../lib/trainer/planDraft";

const ex = (over: Partial<ReturnType<typeof newExercise>> = {}) => ({ ...newExercise({ id: "e1", name: "Supino" }), ...over });
const workout = (over: Partial<DraftWorkout> = {}): DraftWorkout => ({ name: "Treino A", days: [], exercises: [ex()], ...over });

describe("parseDecimal", () => {
  it("accepts pt-BR comma and dot, empty is null, junk is NaN", () => {
    expect(parseDecimal("42,5")).toBe(42.5);
    expect(parseDecimal(" 40.25 ")).toBe(40.25);
    expect(parseDecimal("")).toBeNull();
    expect(parseDecimal("4x")).toBeNaN();
    expect(parseDecimal("-3")).toBeNaN();
  });
});

describe("nextWorkoutName / toggleDay", () => {
  it("picks the first unused letter", () => {
    expect(nextWorkoutName([])).toBe("Treino A");
    expect(nextWorkoutName(["Treino A", "treino c"])).toBe("Treino B");
  });
  it("keeps days sorted and unique", () => {
    expect(toggleDay([5, 1], 3)).toEqual([1, 3, 5]);
    expect(toggleDay([1, 3, 5], 3)).toEqual([1, 5]);
  });
});

describe("toggleSuperset", () => {
  it("links with the exercise above and unlinks again", () => {
    const list = [ex(), ex(), ex()];
    const linked = toggleSuperset(list, 1);
    expect(linked.map((e) => e.supersetGroup)).toEqual([1, 1, null]);
    const chained = toggleSuperset(linked, 2);
    expect(chained.map((e) => e.supersetGroup)).toEqual([1, 1, 1]);
    expect(toggleSuperset(chained, 2).map((e) => e.supersetGroup)).toEqual([1, 1, null]);
    expect(toggleSuperset(list, 0)).toBe(list);
  });
});

describe("validateDraft", () => {
  it("requires a plan name, workouts and exercises", () => {
    expect(validateDraft(" ", [workout()])).toMatch(/nome ao plano/);
    expect(validateDraft("P", [])).toMatch(/pelo menos um treino/);
    expect(validateDraft("P", [workout({ exercises: [] })])).toMatch(/Treino A: adicione/);
    expect(validateDraft("P", [workout({ name: " " })])).toMatch(/precisa de um nome/);
  });
  it("rejects values the database would reject or store wrong", () => {
    expect(validateDraft("P", [workout({ exercises: [ex({ sets: 0 })] })])).toMatch(/séries/);
    expect(validateDraft("P", [workout({ exercises: [ex({ rpe: "8,5" })] })])).toMatch(/RPE/);
    expect(validateDraft("P", [workout({ exercises: [ex({ rpe: "11" })] })])).toMatch(/RPE/);
    expect(validateDraft("P", [workout({ exercises: [ex({ weight: "abc" })] })])).toMatch(/carga/);
    expect(validateDraft("P", [workout({ exercises: [ex({ reps: " " })] })])).toMatch(/repetições/);
    expect(validateDraft("P", [workout({ exercises: [ex({ weight: "42,5", rpe: "8" })] })])).toBeNull();
  });
});

describe("buildPlanPayload", () => {
  it("maps the draft to the RPC shape", () => {
    const payload = buildPlanPayload([
      workout({ name: " Treino A ", days: [5, 1], exercises: [ex({ weight: "42,5", rpe: "8", tempo: " ", reps: " 8-10 " })] }),
      workout({ name: "Treino B" }),
    ]);
    expect(payload[0]).toEqual({
      name: "Treino A",
      day_of_week: [1, 5],
      exercises: [
        {
          exercise_id: "e1",
          target_sets: 3,
          target_reps: "8-10",
          target_weight_kg: 42.5,
          target_rpe: 8,
          rest_seconds: 60,
          tempo: null,
          superset_group: null,
        },
      ],
    });
    expect(payload[1].day_of_week).toBeNull();
  });
});
