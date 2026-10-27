import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

// A stable identifier lets a restarted app cancel an earlier OS request without
// trusting a separately persisted notification id. Other notifications are untouched.
export const REST_NOTIFICATION_ID = "workout-rest-complete";
export const REST_CHANNEL_ID = "workout-rest";

export interface RestNotification {
  userId: string;
  sessionId: string;
  endsAt: number;
}

let revision = 0;
let pending: Promise<void> = Promise.resolve();

export async function ensureRestNotificationChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(REST_CHANNEL_ID, {
    name: "Descanso entre séries",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [0, 200, 150, 200],
  });
}

/** Native-only. Serializes replacement/cancellation, including a skip or logout
 * that happens while permissions or an OS scheduling request are still pending. */
export function syncRestNotification(rest: RestNotification | null): Promise<void> {
  if (Platform.OS === "web") return Promise.resolve();
  const current = ++revision;
  pending = pending.catch(() => {}).then(async () => {
    await Notifications.cancelScheduledNotificationAsync(REST_NOTIFICATION_ID);
    await Notifications.dismissNotificationAsync(REST_NOTIFICATION_ID);
    if (!rest || current !== revision || !Number.isFinite(rest.endsAt) || rest.endsAt <= Date.now()) return;

    await ensureRestNotificationChannel();
    const permission = await Notifications.getPermissionsAsync();
    const allowed = permission.granted || permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    // Permission is requested by the existing registration flow; restored timers
    // never display a permission prompt or block a workout when permission is denied.
    if (!allowed || current !== revision || rest.endsAt <= Date.now()) return;
    await Notifications.scheduleNotificationAsync({
      identifier: REST_NOTIFICATION_ID,
      content: {
        title: "Descanso concluído",
        body: "Quando estiver pronto, continue a próxima série.",
        sound: true,
        data: { kind: "workout_rest", screen: "workouts", userId: rest.userId, sessionId: rest.sessionId },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: rest.endsAt,
        ...(Platform.OS === "android" ? { channelId: REST_CHANNEL_ID } : {}),
      },
    });
    if (current !== revision) {
      await Notifications.cancelScheduledNotificationAsync(REST_NOTIFICATION_ID);
      await Notifications.dismissNotificationAsync(REST_NOTIFICATION_ID);
    }
  });
  return pending;
}

export function cancelRestNotification(): Promise<void> {
  return syncRestNotification(null);
}
