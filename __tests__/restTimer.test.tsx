import React from "react";
import { AppState, Platform, type AppStateStatus } from "react-native";
import { RestTimer } from "../components/workout/RestTimer";
import { haptics } from "../lib/haptics";
import { useWorkoutSessionStore } from "../stores/useWorkoutSessionStore";

const { act, create } = require("react-test-renderer");
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("../lib/haptics", () => ({ haptics: { success: jest.fn() } }));

let renderer: { unmount: () => void };
let changeState: (state: AppStateStatus) => void;
const originalState = AppState.currentState;
const originalOS = Platform.OS;

beforeEach(async () => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  await useWorkoutSessionStore.persist.rehydrate();
  useWorkoutSessionStore.getState().end();
  jest.useFakeTimers({ now: 10_000 });
  jest.clearAllMocks();
  Object.defineProperty(Platform, "OS", { configurable: true, value: "ios" });
  jest.spyOn(AppState, "addEventListener").mockImplementation((_event, listener) => {
    changeState = listener;
    return { remove: jest.fn() };
  });
});
afterEach(async () => {
  if (renderer) await act(async () => { renderer.unmount(); });
  useWorkoutSessionStore.getState().end();
  jest.useRealTimers();
  jest.restoreAllMocks();
  AppState.currentState = originalState;
  Object.defineProperty(Platform, "OS", { configurable: true, value: originalOS });
});

it("keeps an expired background deadline so the OS alert is not immediately cancelled", async () => {
  AppState.currentState = "background";
  useWorkoutSessionStore.getState().startRest(60);
  await act(async () => { renderer = create(<RestTimer />); });
  await act(async () => { jest.advanceTimersByTime(60_000); });
  expect(useWorkoutSessionStore.getState().restEndsAt).toBe(70_000);
  expect(haptics.success).not.toHaveBeenCalled();
  AppState.currentState = "active";
  await act(async () => { changeState("active"); });
  expect(useWorkoutSessionStore.getState().restEndsAt).toBeNull();
  expect(haptics.success).toHaveBeenCalledTimes(1);
});

it("completes a foreground countdown once with haptic feedback", async () => {
  AppState.currentState = "active";
  useWorkoutSessionStore.getState().startRest(15);
  await act(async () => { renderer = create(<RestTimer />); });
  await act(async () => { jest.advanceTimersByTime(15_000); });
  expect(useWorkoutSessionStore.getState().restEndsAt).toBeNull();
  expect(haptics.success).toHaveBeenCalledTimes(1);
  await act(async () => { jest.advanceTimersByTime(1_000); });
  expect(haptics.success).toHaveBeenCalledTimes(1);
});
