import { QueryClient } from "@tanstack/react-query";
import { createAuthSessionScope } from "../lib/auth/sessionScope";

it("removes cached signed media on identity changes, preserving it on token refresh", () => {
  const client = new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });
  const scope = createAuthSessionScope(client);
  scope.transition("alice");
  client.setQueryData(["feed"], [{ media_urls: ["https://signed/alice?token=private"] }]);
  scope.transition("alice");
  expect(client.getQueryData(["feed"])).toBeDefined();
  scope.transition("bob");
  expect(client.getQueryCache().getAll()).toHaveLength(0);
  client.setQueryData(["profile"], { id: "bob" });
  scope.transition(null);
  expect(client.getQueryCache().getAll()).toHaveLength(0);
});

it("cancels in-flight queries so a late response cannot restore a previous user's data", async () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  const scope = createAuthSessionScope(client);
  scope.transition("alice");
  let resolve!: (value: string) => void;
  const pending = client.fetchQuery({
    queryKey: ["private-media"],
    queryFn: () => new Promise<string>((done) => { resolve = done; }),
  }).catch(() => undefined);
  scope.transition(null);
  resolve("https://signed/alice?token=private");
  await pending;
  await Promise.resolve();
  expect(client.getQueryData(["private-media"])).toBeUndefined();
  expect(client.getQueryCache().getAll()).toHaveLength(0);
});

it("rejects profile/deferred-work tokens after logout, switching back, and unmount", () => {
  const client = new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });
  const scope = createAuthSessionScope(client);
  const alice = scope.transition("alice").token;
  expect(scope.isCurrent(alice)).toBe(true);
  scope.transition(null);
  expect(scope.isCurrent(alice)).toBe(false);
  const secondAlice = scope.transition("alice").token;
  expect(scope.isCurrent(alice)).toBe(false);
  expect(scope.isCurrent(secondAlice)).toBe(true);
  scope.invalidate();
  expect(scope.isCurrent(secondAlice)).toBe(false);
});
