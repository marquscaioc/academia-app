import { useEffect } from "react";
import { AppState } from "react-native";
import { useSessionHydrated, useWorkoutSessionStore } from "../../stores/useWorkoutSessionStore";
import { syncRestNotification } from "./rest";

/** Mount once inside AuthProvider. Store subscription remains active while the
 * workout screen is closed; OS scheduling does not depend on a JS interval. */
export function useRestNotifications(userId: string | null, ready: boolean): void {
  const hydrated = useSessionHydrated();
  useEffect(() => {
    if (!ready || !hydrated) return;
    const sync = () => {
      const state = useWorkoutSessionStore.getState();
      const rest = userId && state.ownerId === userId && state.sessionId && state.restEndsAt
        ? { userId, sessionId: state.sessionId, endsAt: state.restEndsAt }
        : null;
      syncRestNotification(rest).catch(() => {
        // OS notification availability must not interrupt set logging or persistence.
      });
    };
    const unsubscribe = useWorkoutSessionStore.subscribe((state, previous) => {
      if (state.ownerId !== previous.ownerId || state.sessionId !== previous.sessionId || state.restEndsAt !== previous.restEndsAt) sync();
    });
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") sync();
    });
    sync();
    return () => {
      unsubscribe();
      subscription.remove();
      // Keep the OS request if JS unmounts; a valid rest must survive app closure.
    };
  }, [userId, ready, hydrated]);
}
