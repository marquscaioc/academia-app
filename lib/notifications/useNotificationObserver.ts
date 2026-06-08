import { useEffect } from "react";
import { router } from "expo-router";
import * as Notifications from "expo-notifications";

// Mapa das chaves logicas usadas nos payloads de push -> rotas do app.
const SCREEN_ROUTES: Record<string, string> = {
  home: "/(student)/(home)",
  workouts: "/(student)/(workouts)",
  progress: "/(student)/(progress)",
  diet: "/(student)/(diet)",
  social: "/(student)/(social)",
};

function routeFor(data: unknown): string | null {
  const screen = (data as { screen?: unknown } | null)?.screen;
  if (typeof screen !== "string") return null;
  if (screen.startsWith("/")) return screen; // ja e um path completo
  return SCREEN_ROUTES[screen] ?? null;
}

// Faz o deep-link quando o usuario TOCA numa notificacao — tanto no cold start
// (app aberto pela notificacao) quanto com o app ja em execucao.
export function useNotificationObserver() {
  useEffect(() => {
    let mounted = true;

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!mounted || !response) return;
      const route = routeFor(response.notification.request.content.data);
      if (route) router.push(route as never);
    });

    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const route = routeFor(response.notification.request.content.data);
      if (route) router.push(route as never);
    });

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);
}
