import { setsForExercise, useWorkoutSessionStore, type SessionSet } from "../stores/useWorkoutSessionStore";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const makeSet = (over: Partial<SessionSet> = {}): SessionSet => ({
  id: "s1",
  workoutExerciseId: "we1",
  exerciseId: "e1",
  setNumber: 1,
  reps: 10,
  weightKg: 40,
  isWarmup: false,
  completed: true,
  syncStatus: "pending",
  ...over,
});

describe("useWorkoutSessionStore", () => {
  beforeEach(() => useWorkoutSessionStore.getState().end());

  it("begins a session with a clean state", () => {
    useWorkoutSessionStore.getState().begin({
      sessionId: "sess",
      workoutId: "w",
      workoutName: "Treino A",
      startedAt: 1000,
    });
    const s = useWorkoutSessionStore.getState();
    expect(s.sessionId).toBe("sess");
    expect(s.sets).toEqual([]);
    expect(s.currentExerciseIndex).toBe(0);
  });

  it("upserts sets by id without duplicating (idempotent retries)", () => {
    const st = useWorkoutSessionStore.getState();
    st.upsertSet(makeSet());
    st.upsertSet(makeSet({ reps: 12 }));
    const sets = useWorkoutSessionStore.getState().sets;
    expect(sets).toHaveLength(1);
    expect(sets[0].reps).toBe(12);
  });

  it("patches and removes sets", () => {
    const st = useWorkoutSessionStore.getState();
    st.upsertSet(makeSet());
    st.patchSet("s1", { syncStatus: "synced" });
    expect(useWorkoutSessionStore.getState().sets[0].syncStatus).toBe("synced");
    st.removeSet("s1");
    expect(useWorkoutSessionStore.getState().sets).toEqual([]);
  });

  it("orders sets per exercise", () => {
    const st = useWorkoutSessionStore.getState();
    st.upsertSet(makeSet({ id: "b", setNumber: 2 }));
    st.upsertSet(makeSet({ id: "a", setNumber: 1 }));
    st.upsertSet(makeSet({ id: "c", workoutExerciseId: "other" }));
    expect(setsForExercise(useWorkoutSessionStore.getState().sets, "we1").map((s) => s.id)).toEqual(["a", "b"]);
  });

  it("uses a timestamp-based rest timer that can be extended and cleared", () => {
    jest.spyOn(Date, "now").mockReturnValue(10_000);
    const st = useWorkoutSessionStore.getState();
    st.startRest(60);
    expect(useWorkoutSessionStore.getState().restEndsAt).toBe(70_000);
    st.extendRest(15);
    expect(useWorkoutSessionStore.getState().restEndsAt).toBe(85_000);
    st.extendRest(-500);
    expect(useWorkoutSessionStore.getState().restEndsAt).toBe(10_000);
    st.clearRest();
    expect(useWorkoutSessionStore.getState().restEndsAt).toBeNull();
    (Date.now as jest.Mock).mockRestore();
  });
});
