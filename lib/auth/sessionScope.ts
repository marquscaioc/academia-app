import type { QueryClient } from "@tanstack/react-query";

export interface AuthScopeToken {
  userId: string | null;
  revision: number;
}

/** Invalidates both cached data and outstanding work when auth identity changes. */
export function createAuthSessionScope(
  queryClient: Pick<QueryClient, "cancelQueries" | "clear">,
) {
  let userId: string | null | undefined;
  let revision = 0;

  return {
    transition(nextUserId: string | null) {
      const changed = userId !== nextUserId;
      if (changed) {
        userId = nextUserId;
        revision += 1;
        // Cancel before removing queries so late responses cannot restore old data.
        void queryClient.cancelQueries().catch(() => {});
        queryClient.clear();
      }
      return { changed, token: { userId: nextUserId, revision } };
    },
    capture(forUserId: string | null): AuthScopeToken {
      return { userId: forUserId, revision };
    },
    isCurrent(token: AuthScopeToken) {
      return userId === token.userId && revision === token.revision;
    },
    invalidate() {
      revision += 1;
    },
  };
}
