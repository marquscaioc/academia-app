import { create } from "zustand";

interface SetLog {
  exerciseId: string;
  workoutExerciseId?: string;
  setNumber: number;
  reps?: number;
  weightKg?: number;
  rpe?: number;
  isWarmup?: boolean;
  isDropSet?: boolean;
  isFailure?: boolean;
  completed: boolean;
}

interface WorkoutSessionState {
  sessionId: string | null;
  workoutId: string | null;
  startedAt: Date | null;
  currentExerciseIndex: number;
  sets: SetLog[];
  isActive: boolean;

  startSession: (sessionId: string, workoutId?: string) => void;
  endSession: () => void;
  setCurrentExerciseIndex: (index: number) => void;
  addSet: (set: SetLog) => void;
  updateSet: (index: number, updates: Partial<SetLog>) => void;
  getCompletedSetsForExercise: (exerciseId: string) => SetLog[];
}

export const useWorkoutSessionStore = create<WorkoutSessionState>(
  (set, get) => ({
    sessionId: null,
    workoutId: null,
    startedAt: null,
    currentExerciseIndex: 0,
    sets: [],
    isActive: false,

    startSession: (sessionId: string, workoutId?: string) => {
      set({
        sessionId,
        workoutId: workoutId ?? null,
        startedAt: new Date(),
        currentExerciseIndex: 0,
        sets: [],
        isActive: true,
      });
    },

    endSession: () => {
      set({
        sessionId: null,
        workoutId: null,
        startedAt: null,
        currentExerciseIndex: 0,
        sets: [],
        isActive: false,
      });
    },

    setCurrentExerciseIndex: (index: number) => {
      set({ currentExerciseIndex: index });
    },

    addSet: (newSet: SetLog) => {
      set({ sets: [...get().sets, newSet] });
    },

    updateSet: (index: number, updates: Partial<SetLog>) => {
      const sets = [...get().sets];
      sets[index] = { ...sets[index], ...updates };
      set({ sets });
    },

    getCompletedSetsForExercise: (exerciseId: string) => {
      return get().sets.filter(
        (s) => s.exerciseId === exerciseId && s.completed,
      );
    },
  }),
);
