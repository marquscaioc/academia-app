import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "../lib/auth/provider";
import { supabase } from "../lib/supabase/client";
import { registerForPushNotifications } from "../lib/notifications/register";
import { useWorkoutSessionStore } from "../stores/useWorkoutSessionStore";
import { toast } from "../stores/useToastStore";

const { act, create } = require("react-test-renderer");

jest.mock("../lib/supabase/client", () => ({
  supabase: {
    auth: { getSession: jest.fn(), onAuthStateChange: jest.fn(), signOut: jest.fn() },
    from: jest.fn(),
  },
}));
jest.mock("../stores/useToastStore", () => ({ toast: { error: jest.fn() } }));
jest.mock("../lib/notifications/register", () => ({ registerForPushNotifications: jest.fn() }));
jest.mock("../stores/useWorkoutSessionStore", () => ({
  useSessionHydrated: () => true,
  useWorkoutSessionStore: {
    persist: { hasHydrated: () => true },
    getState: jest.fn(),
  },
}));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

let latest: ReturnType<typeof useAuth>;
let listener: (event: string, session: unknown) => void;
let renderer: { unmount: () => void };
let client: QueryClient;
const initial = () => deferred<{ data: { session: unknown } }>();
let initialSession: ReturnType<typeof initial>;
const profile = (id: string) => ({ data: { id, role: "student", full_name: id }, error: null });
const session = (id: string) => ({ user: { id }, access_token: id });

function Probe() {
  latest = useAuth();
  return null;
}

beforeEach(async () => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  (useWorkoutSessionStore.getState as jest.Mock).mockReturnValue({ sessionId: null, restEndsAt: null, ownerId: null, end: jest.fn() });
  initialSession = initial();
  (supabase.auth.getSession as jest.Mock).mockReturnValue(initialSession.promise);
  (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
    listener = callback;
    return { data: { subscription: { unsubscribe: jest.fn() } } };
  });
  (registerForPushNotifications as jest.Mock).mockResolvedValue(null);
  client = new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });
  await act(async () => {
    renderer = create(<QueryClientProvider client={client}><AuthProvider><Probe /></AuthProvider></QueryClientProvider>);
  });
});

afterEach(async () => {
  await act(async () => { renderer.unmount(); });
  client.clear();
  jest.useRealTimers();
});

async function emit(nextSession: unknown) {
  await act(async () => { listener("SIGNED_IN", nextSession); });
}

async function tick() {
  await act(async () => { jest.advanceTimersByTime(0); });
}

it("defers profile reads outside the auth callback and discards a response after logout", async () => {
  const response = deferred<ReturnType<typeof profile>>();
  (supabase.from as jest.Mock).mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle: () => response.promise }) }) });
  await emit(session("alice"));
  expect(supabase.from).not.toHaveBeenCalled();
  await tick();
  client.setQueryData(["feed"], ["https://signed/alice?token=private"]);
  await emit(null);
  await act(async () => { response.resolve(profile("alice")); });
  expect(latest.user).toBeNull();
  expect(latest.profile).toBeNull();
  expect(client.getQueryCache().getAll()).toHaveLength(0);
});

it("keeps the new user's profile when an earlier user's lookup finishes last", async () => {
  const alice = deferred<ReturnType<typeof profile>>();
  (supabase.from as jest.Mock).mockReturnValue({
    select: () => ({ eq: (_column: string, id: string) => ({
      maybeSingle: () => id === "alice" ? alice.promise : Promise.resolve(profile("bob")),
    }) }),
  });
  await emit(session("alice"));
  await tick();
  await emit(session("bob"));
  await tick();
  expect(latest.profile?.id).toBe("bob");
  await act(async () => { alice.resolve(profile("alice")); });
  expect(latest.user?.id).toBe("bob");
  expect(latest.profile?.id).toBe("bob");
});

it("does not restore a stale initial session or run its deferred work after a newer logout", async () => {
  await emit(session("alice"));
  await emit(null);
  await act(async () => { initialSession.resolve({ data: { session: session("alice") } }); });
  await tick();
  expect(latest.user).toBeNull();
  expect(latest.isLoading).toBe(false);
  expect(supabase.from).not.toHaveBeenCalled();
  expect(registerForPushNotifications).not.toHaveBeenCalled();
});

it("preserves a restored workout until auth is known, then clears it for a different account", async () => {
  const end = jest.fn();
  (useWorkoutSessionStore.getState as jest.Mock).mockReturnValue({
    sessionId: "active", restEndsAt: Date.now() + 30000, ownerId: "alice", end,
  });
  await act(async () => { jest.advanceTimersByTime(5000); });
  expect(end).not.toHaveBeenCalled();
  await act(async () => { initialSession.resolve({ data: { session: session("alice") } }); });
  expect(end).not.toHaveBeenCalled();
  await emit(session("bob"));
  expect(end).toHaveBeenCalled();
});

it("clears private cache and ends the workout after the SDK confirms sign-out", async () => {
  await emit(session("alice"));
  const end = jest.fn();
  (useWorkoutSessionStore.getState as jest.Mock).mockReturnValue({
    sessionId: "active", restEndsAt: null, ownerId: "alice", end,
  });
  const logout = deferred<{ error: null }>();
  (supabase.auth.signOut as jest.Mock).mockReturnValue(logout.promise);
  client.setQueryData(["feed"], ["private media"]);
  await act(async () => { void latest.signOut(); });
  expect(latest.user?.id).toBe("alice");
  expect(end).not.toHaveBeenCalled();
  await act(async () => { logout.resolve({ error: null }); });
  expect(end).toHaveBeenCalled();
  expect(latest.user).toBeNull();
  expect(client.getQueryCache().getAll()).toHaveLength(0);
});

it.each(["returned", "thrown"])("preserves the active session and workout on %s sign-out failure", async (kind) => {
  (supabase.from as jest.Mock).mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve(profile("alice")) }) }) });
  await emit(session("alice"));
  await tick();
  const end = jest.fn();
  (useWorkoutSessionStore.getState as jest.Mock).mockReturnValue({
    sessionId: "active", restEndsAt: null, ownerId: "alice", end,
  });
  if (kind === "returned") (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: new Error("Service unavailable") });
  else (supabase.auth.signOut as jest.Mock).mockRejectedValue(new Error("Offline"));
  await act(async () => { await latest.signOut(); });
  expect(latest.user?.id).toBe("alice");
  expect(latest.profile?.id).toBe("alice");
  expect(end).not.toHaveBeenCalled();
  expect(toast.error).toHaveBeenCalledWith("Não foi possível sair", expect.stringContaining("continua ativa"));
});
