import { create } from "zustand";

export type ToastTone = "error" | "success" | "info";

export interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  message?: string;
}

interface ToastState {
  toasts: Toast[];
  show: (tone: ToastTone, title: string, message?: string) => void;
  dismiss: (id: number) => void;
}

const VISIBLE_MS = 4500;
const MAX_TOASTS = 3;
let nextId = 1;

/**
 * Cross-platform feedback. Replaces Alert.alert for non-blocking messages: on react-native-web
 * Alert.alert is a no-op, so errors reported through it were invisible to web users.
 */
export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (tone, title, message) => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, tone, title, message }].slice(-MAX_TOASTS) }));
    setTimeout(() => get().dismiss(id), VISIBLE_MS);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  error: (title: string, message?: string) => useToastStore.getState().show("error", title, message),
  success: (title: string, message?: string) => useToastStore.getState().show("success", title, message),
  info: (title: string, message?: string) => useToastStore.getState().show("info", title, message),
};
