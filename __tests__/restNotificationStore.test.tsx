import React from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useRestNotifications } from "../lib/notifications/useRestNotifications";
import { syncRestNotification } from "../lib/notifications/rest";
import { useWorkoutSessionStore } from "../stores/useWorkoutSessionStore";

const { act, create } = require("react-test-renderer");
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);
jest.mock("../lib/notifications/rest", () => ({ syncRestNotification: jest.fn().mockResolvedValue(undefined) }));

function Probe({ userId, ready = true }: { userId: string | null; ready?: boolean }) {
  useRestNotifications(userId, ready);
  return null;
}
let renderer: { unmount: () => void; update: (element: React.ReactElement) => void };
const sync = syncRestNotification as jest.Mock;
let resume: (state: AppStateStatus) => void;

beforeEach(async () => {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  await useWorkoutSessionStore.persist.rehydrate();
  useWorkoutSessionStore.getState().end();
  jest.spyOn(Date, "now").mockReturnValue(10_000);
  jest.spyOn(AppState, "addEventListener").mockImplementation((_event, callback) => {
    resume = callback;
    return { remove: jest.fn() };
  });
  sync.mockClear();
});
afterEach(async () => {
  if (renderer) await act(async () => { renderer.unmount(); });
  useWorkoutSessionStore.getState().end();
  jest.restoreAllMocks();
});
function begin(ownerId = "alice") {
  useWorkoutSessionStore.getState().begin({ ownerId, sessionId: "session", workoutId: "workout", workoutName: "A", startedAt: 1_000 });
}

it("restores only the authenticated owner's timer and reacts immediately to adjust, skip and session finish", async () => {
  begin();
  useWorkoutSessionStore.getState().startRest(60);
  await act(async () => { renderer = create(<Probe userId="alice" />); });
  expect(sync).toHaveBeenLastCalledWith({ userId: "alice", sessionId: "session", endsAt: 70_000 });
  await act(async () => { useWorkoutSessionStore.getState().extendRest(15); });
  expect(sync).toHaveBeenLastCalledWith({ userId: "alice", sessionId: "session", endsAt: 85_000 });
  await act(async () => { useWorkoutSessionStore.getState().clearRest(); });
  expect(sync).toHaveBeenLastCalledWith(null);
  await act(async () => { useWorkoutSessionStore.getState().startRest(60); useWorkoutSessionStore.getState().end(); });
  expect(sync).toHaveBeenLastCalledWith(null);
});

it("waits for auth readiness, ignores another account's draft and cancels on logout", async () => {
  begin();
  useWorkoutSessionStore.getState().startRest(60);
  await act(async () => { renderer = create(<Probe userId="alice" ready={false} />); });
  expect(sync).not.toHaveBeenCalled();
  await act(async () => { renderer.update(<Probe userId="bob" />); });
  expect(sync).toHaveBeenLastCalledWith(null);
  await act(async () => { renderer.update(<Probe userId="alice" />); });
  expect(sync).toHaveBeenLastCalledWith(expect.objectContaining({ userId: "alice" }));
  await act(async () => { renderer.update(<Probe userId={null} />); });
  expect(sync).toHaveBeenLastCalledWith(null);
});

it("reconciles after backgrounding while preserving the scheduled alert on screen-independent unmount", async () => {
  begin();
  useWorkoutSessionStore.getState().startRest(60);
  await act(async () => { renderer = create(<Probe userId="alice" />); });
  sync.mockClear();
  await act(async () => { resume("active"); });
  expect(sync).toHaveBeenCalledTimes(1);
  sync.mockClear();
  await act(async () => { renderer.unmount(); });
  expect(sync).not.toHaveBeenCalled();
});
