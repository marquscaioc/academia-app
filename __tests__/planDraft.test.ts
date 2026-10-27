import {
  buildPlanPayload,
  planToDraft,
  moveItem,
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
      notes: null,
      estimated_duration_minutes: null,
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
          notes: null,
          superset_group: null,
        },
      ],
    });
    expect(payload[1].day_of_week).toBeNull();
  });
});

describe("editing an existing prescription", () => {
  it("round-trips saved IDs, order and coach metadata without mutating query data", () => {
    const source = [{ id: "w1", name: "B", day_of_week: [5], sort_order: 1, notes: "Orientação", estimated_duration_minutes: 45,
      exercises: [{ id: "we1", exercise_id: "e1", sort_order: 0, target_sets: 4, target_reps: "6-8",
        target_weight_kg: 42.5, target_rpe: 8, rest_seconds: 90, tempo: "3-0-1", notes: "Sem impulso",
        superset_group: 2, exercise: { name: "Supino" } }],
    }, { id: "w2", name: "A", day_of_week: null, sort_order: 0, notes: null, estimated_duration_minutes: null, exercises: [] }];
    const draft = planToDraft(source);
    expect(draft.map((w) => w.id)).toEqual(["w2", "w1"]);
    expect(source[0].id).toBe("w1");
    const payload = buildPlanPayload([draft[1]])[0];
    expect(payload).toMatchObject({ id: "w1", notes: "Orientação", estimated_duration_minutes: 45,
      exercises: [{ id: "we1", exercise_id: "e1", notes: "Sem impulso", target_weight_kg: 42.5, superset_group: 2 }] });
  });
  it("reorders duplicate exercises by prescription identity and respects boundaries", () => {
    const list = [ex({ id: "we1", notes: "Primeiro" }), ex({ id: "we2", notes: "Segundo" })];
    expect(moveItem(list, 1, 0).map((e) => [e.id, e.notes])).toEqual([["we2", "Segundo"], ["we1", "Primeiro"]]);
    expect(list[0].id).toBe("we1");
    expect(moveItem(list, 0, -1)).toBe(list);
    expect(moveItem(list, 1, 2)).toBe(list);
  });
});
