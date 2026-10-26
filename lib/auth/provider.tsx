import { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../supabase/client";
import { registerForPushNotifications } from "../notifications/register";
import { AuthScopeToken, createAuthSessionScope } from "./sessionScope";
import { useSessionHydrated, useWorkoutSessionStore } from "../../stores/useWorkoutSessionStore";
import { toast } from "../../stores/useToastStore";

type UserRole = "student" | "trainer" | "admin" | null;

interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  onboarding_completed: boolean;
  water_goal_ml: number | null;
  current_streak: number;
  longest_streak: number;
  notify_follower_workouts: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: UserRole;
  isLoading: boolean;
  identityReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    meta?: { date_of_birth?: string; terms_version?: string },
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function clearOtherUsersWorkout(userId: string | null) {
  if (!useWorkoutSessionStore.persist.hasHydrated()) return;
  const workout = useWorkoutSessionStore.getState();
  if ((workout.sessionId || workout.restEndsAt) && (!userId || workout.ownerId !== userId)) {
    workout.end();
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [sessionScope] = useState(() => createAuthSessionScope(queryClient));
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sessionHydrated = useSessionHydrated();
  const [authIdentityReady, setAuthIdentityReady] = useState(false);

  const fetchProfile = useCallback(async function loadProfile(
    userId: string,
    token: AuthScopeToken,
    retries = 2,
  ): Promise<void> {
    if (!sessionScope.isCurrent(token)) return;
    // Try full select first, fallback to basic if new columns don't exist yet
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, full_name, display_name, avatar_url, bio, onboarding_completed, water_goal_ml, current_streak, longest_streak, notify_follower_workouts")
      .eq("id", userId)
      .maybeSingle();

    if (!sessionScope.isCurrent(token)) return;

    if (!error && data) {
      setProfile(data as Profile);
      return;
    }

    // Fallback: columns may not exist yet (migrations not applied)
    const { data: fallback, error: fbError } = await supabase
      .from("profiles")
      .select("id, role, full_name, display_name, avatar_url, bio, onboarding_completed")
      .eq("id", userId)
      .maybeSingle();

    if (!sessionScope.isCurrent(token)) return;

    if (fallback) {
      setProfile({
        ...fallback,
        water_goal_ml: null,
        current_streak: 0,
        longest_streak: 0,
        notify_follower_workouts: false,
      } as Profile);
      return;
    }

    // Row may not exist yet right after signup (race with handle_new_user trigger): retry with backoff
    if (!fbError && retries > 0) {
      await new Promise((r) => setTimeout(r, 600));
      return loadProfile(userId, token, retries - 1);
    }

    setProfile(null);
  }, [sessionScope]);

  useEffect(() => {
    let mounted = true;
    let receivedAuthEvent = false;
    const deferred = new Set<ReturnType<typeof setTimeout>>();

    // Safety timeout: never stay loading forever.
    let timeout = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 5000);

    const applySession = (nextSession: Session | null, registerPush = false) => {
      const { changed, token } = sessionScope.transition(nextSession?.user.id ?? null);
      if (changed) {
        setProfile(null);
        if (nextSession?.user) {
          setIsLoading(true);
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            if (mounted) setIsLoading(false);
          }, 5000);
        }
      }
      setAuthIdentityReady(true);
      clearOtherUsersWorkout(nextSession?.user.id ?? null);
      setSession(nextSession);

      if (!nextSession?.user) {
        clearTimeout(timeout);
        setIsLoading(false);
        return;
      }

      // Supabase holds its auth lock while notifying subscribers. Keep profile
      // reads and push registration outside that callback to avoid deadlocks.
      const uid = nextSession.user.id;
      const timer = setTimeout(() => {
        deferred.delete(timer);
        if (!mounted || !sessionScope.isCurrent(token)) return;
        void fetchProfile(uid, token)
          .catch(() => {
            if (sessionScope.isCurrent(token)) setProfile(null);
          })
          .finally(() => {
            if (mounted && sessionScope.isCurrent(token)) {
              clearTimeout(timeout);
              setIsLoading(false);
            }
          });
        if (registerPush) registerForPushNotifications(uid).catch(() => {});
      }, 0);
      deferred.add(timer);
    };

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      // A newer auth event wins over a slow initial session lookup.
      if (mounted && !receivedAuthEvent) applySession(initialSession);
    }).catch(() => {
      if (mounted && !receivedAuthEvent) {
        clearTimeout(timeout);
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      receivedAuthEvent = true;
      applySession(nextSession, true);
    });

    return () => {
      mounted = false;
      sessionScope.invalidate();
      clearTimeout(timeout);
      deferred.forEach(clearTimeout);
      subscription.unsubscribe();
    };
  }, [fetchProfile, sessionScope]);

  // Persistence can finish after auth initialization; wait for both before
  // deciding whether the restored session belongs to the signed-in user.
  useEffect(() => {
    if (sessionHydrated && authIdentityReady) clearOtherUsersWorkout(session?.user.id ?? null);
  }, [sessionHydrated, authIdentityReady, session?.user.id]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    meta?: { date_of_birth?: string; terms_version?: string },
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          ...(meta?.date_of_birth ? { date_of_birth: meta.date_of_birth } : {}),
          ...(meta?.terms_version
            ? { terms_version: meta.terms_version, terms_accepted_at: new Date().toISOString() }
            : {}),
        },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Não foi possível sair", "Sua sessão continua ativa. Verifique sua conexão e tente novamente.");
        return;
      }
    } catch {
      toast.error("Não foi possível sair", "Sua sessão continua ativa. Verifique sua conexão e tente novamente.");
      return;
    }
    // The SDK can return a network/5xx error before removing its persisted
    // session. Only publish a successful logout after it confirms completion.
    sessionScope.transition(null);
    useWorkoutSessionStore.getState().end();
    setProfile(null);
    setSession(null);
    setAuthIdentityReady(true);
    setIsLoading(false);
    if (typeof window !== "undefined" && window.location) {
      window.location.href = "/";
    }
  };

  const refreshProfile = async () => {
    if (session?.user) {
      await fetchProfile(session.user.id, sessionScope.capture(session.user.id));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        role: profile?.role ?? null,
        isLoading,
        identityReady: authIdentityReady,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
