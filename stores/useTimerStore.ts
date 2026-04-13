import { create } from "zustand";

interface TimerState {
  isRunning: boolean;
  seconds: number;
  targetSeconds: number;
  intervalId: ReturnType<typeof setInterval> | null;
  start: (targetSeconds: number) => void;
  stop: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isRunning: false,
  seconds: 0,
  targetSeconds: 60,
  intervalId: null,

  start: (targetSeconds: number) => {
    const existing = get().intervalId;
    if (existing) clearInterval(existing);

    set({ targetSeconds, seconds: targetSeconds, isRunning: true });

    const id = setInterval(() => {
      const current = get().seconds;
      if (current <= 1) {
        get().stop();
        return;
      }
      set({ seconds: current - 1 });
    }, 1000);

    set({ intervalId: id });
  },

  stop: () => {
    const id = get().intervalId;
    if (id) clearInterval(id);
    set({ isRunning: false, intervalId: null, seconds: 0 });
  },

  reset: () => {
    const id = get().intervalId;
    if (id) clearInterval(id);
    set({
      isRunning: false,
      intervalId: null,
      seconds: 0,
      targetSeconds: 60,
    });
  },
}));
