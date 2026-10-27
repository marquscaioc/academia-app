import { router } from "expo-router";
import type { NotificationResponse } from "expo-notifications";
import { navigateForResponse } from "../lib/notifications/useNotificationObserver";
import { supabase } from "../lib/supabase/client";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));
jest.mock("expo-notifications", () => ({}));
jest.mock("../lib/supabase/client", () => ({ supabase: { auth: { getSession: jest.fn() } } }));

beforeEach(() => jest.clearAllMocks());
const rest = { notification: { request: { content: { data: { kind: "workout_rest", screen: "workouts", userId: "alice" } } } } } as unknown as NotificationResponse;

it("opens the workout list for the rest notification's authenticated owner", async () => {
  (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: "alice" } } } });
  await navigateForResponse(rest);
  expect(router.push).toHaveBeenCalledWith("/(student)/(workouts)");
});

it("ignores a previous account's rest notification", async () => {
  (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: { user: { id: "bob" } } } });
  await navigateForResponse(rest);
  expect(router.push).not.toHaveBeenCalled();
});

it("ignores a rest notification while signed out", async () => {
  (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });
  await navigateForResponse(rest);
  expect(router.push).not.toHaveBeenCalled();
});
