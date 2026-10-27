import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { cancelRestNotification, REST_NOTIFICATION_ID, syncRestNotification } from "../lib/notifications/rest";

jest.mock("expo-notifications", () => ({
  cancelScheduledNotificationAsync: jest.fn(),
  dismissNotificationAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  SchedulableTriggerInputTypes: { DATE: "date" },
  AndroidImportance: { HIGH: 4 },
  IosAuthorizationStatus: { PROVISIONAL: 3 },
}));

const cancel = Notifications.cancelScheduledNotificationAsync as jest.Mock;
const permissions = Notifications.getPermissionsAsync as jest.Mock;
const schedule = Notifications.scheduleNotificationAsync as jest.Mock;
const rest = { userId: "student", sessionId: "session", endsAt: 70_000 };
const originalOS = Platform.OS;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}
async function flush() {
  for (let n = 0; n < 15; n++) await Promise.resolve();
}

beforeEach(() => {
  jest.resetAllMocks();
  Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
  jest.spyOn(Date, "now").mockReturnValue(10_000);
  permissions.mockResolvedValue({ granted: true });
  schedule.mockResolvedValue(REST_NOTIFICATION_ID);
});
afterEach(async () => {
  await cancelRestNotification();
  jest.restoreAllMocks();
  Object.defineProperty(Platform, "OS", { configurable: true, value: originalOS });
});

it("schedules the persisted deadline with a stable id and creates the Android channel", async () => {
  Object.defineProperty(Platform, "OS", { configurable: true, value: "android" });
  await syncRestNotification(rest);
  expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith("workout-rest", expect.objectContaining({ importance: 4 }));
  expect(schedule).toHaveBeenCalledWith(expect.objectContaining({
    identifier: REST_NOTIFICATION_ID,
    content: expect.objectContaining({ data: expect.objectContaining({ userId: "student", screen: "workouts" }) }),
    trigger: { type: "date", date: 70_000, channelId: "workout-rest" },
  }));
});

it("replaces a pending permission lookup with only the latest adjusted deadline", async () => {
  const permission = deferred<{ granted: boolean }>();
  permissions.mockReturnValueOnce(permission.promise);
  const first = syncRestNotification(rest);
  await flush();
  expect(permissions).toHaveBeenCalledTimes(1);
  const replacement = syncRestNotification({ ...rest, endsAt: 85_000 });
  permission.resolve({ granted: true });
  await Promise.all([first, replacement]);
  expect(schedule).toHaveBeenCalledTimes(1);
  expect(schedule.mock.calls[0][0].trigger.date).toBe(85_000);
});

it("cancels a scheduling request that completes after a skip or logout", async () => {
  const result = deferred<string>();
  schedule.mockReturnValueOnce(result.promise);
  const first = syncRestNotification(rest);
  await flush();
  expect(schedule).toHaveBeenCalledTimes(1);
  const stop = cancelRestNotification();
  result.resolve(REST_NOTIFICATION_ID);
  await Promise.all([first, stop]);
  expect(cancel.mock.calls.filter(([id]) => id === REST_NOTIFICATION_ID).length).toBeGreaterThanOrEqual(2);
  expect(Notifications.dismissNotificationAsync).toHaveBeenLastCalledWith(REST_NOTIFICATION_ID);
});

it("does not schedule expired rests or denied permissions, and never requests push tokens", async () => {
  await syncRestNotification({ ...rest, endsAt: 9_000 });
  expect(permissions).not.toHaveBeenCalled();
  permissions.mockResolvedValue({ granted: false, ios: { status: 1 } });
  await syncRestNotification(rest);
  expect(schedule).not.toHaveBeenCalled();
});

it("accepts iOS provisional permission without requesting another prompt", async () => {
  permissions.mockResolvedValue({ granted: false, ios: { status: 3 } });
  await syncRestNotification(rest);
  expect(schedule).toHaveBeenCalledTimes(1);
});

it("recovers after an unavailable OS API rather than poisoning all later requests", async () => {
  cancel.mockRejectedValueOnce(new Error("OS unavailable"));
  await expect(syncRestNotification(rest)).rejects.toThrow("OS unavailable");
  await syncRestNotification({ ...rest, endsAt: 85_000 });
  expect(schedule).toHaveBeenCalledTimes(1);
});

it("keeps web as a complete notification API no-op", async () => {
  Object.defineProperty(Platform, "OS", { configurable: true, value: "web" });
  await syncRestNotification(rest);
  await cancelRestNotification();
  expect(cancel).not.toHaveBeenCalled();
  expect(permissions).not.toHaveBeenCalled();
  expect(schedule).not.toHaveBeenCalled();
});
