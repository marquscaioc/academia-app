import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SyncStatus = "pending" | "synced" | "error";

export interface SessionSet {
  /** Client-generated UUID, also the DB primary key → retries are idempotent upserts. */
  id: string;
  workoutExerciseId: string;
  exerciseId: string;
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  isWarmup: boolean;
  completed: boolean;
  syncStatus: SyncStatus;
}

interface BeginInput {
  ownerId: string;
  sessionId: string;
  workoutId: string;
  workoutName: string;
  /** epoch ms */
  startedAt: number;
  sets?: SessionSet[];
}

interface WorkoutSessionState {
  /** Auth identity owning this persisted draft (legacy ownerless drafts are discarded). */
  ownerId: string | null;
  sessionId: string | null;
  workoutId: string | null;
  workoutName: string | null;
  startedAt: number | null;
  currentExerciseIndex: number;
  sets: SessionSet[];
  /** Rest timer is timestamp-based so it survives backgrounding and app restarts. */
  restEndsAt: number | null;
  restDuration: number;
  finishing: boolean;

  begin: (input: BeginInput) => void;
  end: () => void;
  setExerciseIndex: (index: number) => void;
  upsertSet: (set: SessionSet) => void;
  patchSet: (id: string, patch: Partial<SessionSet>) => void;
  removeSet: (id: string) => void;
  startRest: (seconds: number) => void;
  extendRest: (seconds: number) => void;
  clearRest: () => void;
  setFinishing: (finishing: boolean) => void;
}

const initial = {
  ownerId: null,
  sessionId: null,
  workoutId: null,
  workoutName: null,
  startedAt: null,
  currentExerciseIndex: 0,
  sets: [] as SessionSet[],
  restEndsAt: null,
  restDuration: 0,
  finishing: false,
};

export const useWorkoutSessionStore = create<WorkoutSessionState>()(
  persist(
    (set, get) => ({
      ...initial,

      begin: ({ ownerId, sessionId, workoutId, workoutName, startedAt, sets }) =>
        set({ ...initial, ownerId, sessionId, workoutId, workoutName, startedAt, sets: sets ?? [] }),

      end: () => set({ ...initial }),

      setExerciseIndex: (index) => set({ currentExerciseIndex: Math.max(0, index) }),

      upsertSet: (s) => {
        const others = get().sets.filter((x) => x.id !== s.id);
        set({ sets: [...others, s] });
      },

      patchSet: (id, patch) =>
        set({ sets: get().sets.map((x) => (x.id === id ? { ...x, ...patch } : x)) }),

      removeSet: (id) => set({ sets: get().sets.filter((x) => x.id !== id) }),

      startRest: (seconds) =>
        set({ restEndsAt: Date.now() + seconds * 1000, restDuration: seconds }),

      extendRest: (seconds) => {
        const { restEndsAt, restDuration } = get();
        if (!restEndsAt) return;
        const next = Math.max(Date.now(), restEndsAt + seconds * 1000);
        set({ restEndsAt: next, restDuration: Math.max(1, restDuration + seconds) });
      },

      clearRest: () => set({ restEndsAt: null, restDuration: 0 }),

      setFinishing: (finishing) => set({ finishing }),
    }),
    {
      name: "workout-session-v2",
      storage: createJSONStorage(() => AsyncStorage),
      // `finishing` is transient UI state; never restore a stuck spinner.
      partialize: ({ finishing: _f, ...rest }) => rest,
    },
  ),
);

/** Sets for one prescribed exercise, ordered by set number. */
export function setsForExercise(sets: SessionSet[], workoutExerciseId: string): SessionSet[] {
  return sets
    .filter((s) => s.workoutExerciseId === workoutExerciseId)
    .sort((a, b) => a.setNumber - b.setNumber);
}

/** True once the persisted session has been restored from storage. */
export function useSessionHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useWorkoutSessionStore.persist.hasHydrated());
  useEffect(() => {
    const unsub = useWorkoutSessionStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useWorkoutSessionStore.persist.hasHydrated());
    return unsub;
  }, []);
  return hydrated;
}
