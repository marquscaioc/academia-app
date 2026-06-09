import { Redirect } from "expo-router";
import { type ReactNode } from "react";
import { useAuth } from "../../lib/auth/provider";
import { LoadingScreen } from "../ui/LoadingScreen";

type Role = "student" | "trainer" | "admin";

/**
 * Gates a role's route subtree. On web/PC a user can paste any URL, so each
 * area (student/trainer/admin) must verify the session + role itself instead of
 * trusting that navigation only ever came through index.tsx.
 *
 * Redirects to "/" on mismatch — index.tsx then routes to the correct home.
 */
export function RoleGuard({ allow, children }: { allow: Role; children: ReactNode }) {
  const { isLoading, session, profile } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!session) return <Redirect href="/(auth)/login" />;
  if (!profile?.onboarding_completed) return <Redirect href="/(auth)/onboarding" />;
  if (profile.role !== allow) return <Redirect href="/" />;

  return <>{children}</>;
}
