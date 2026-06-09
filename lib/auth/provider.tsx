import { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../supabase/client";
import { registerForPushNotifications } from "../notifications/register";

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
  whatsapp_number: string | null;
  whatsapp_opt_in: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: UserRole;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string, retries = 2) => {
    // Try full select first, fallback to basic if new columns don't exist yet
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, full_name, display_name, avatar_url, bio, onboarding_completed, water_goal_ml, current_streak, longest_streak, notify_follower_workouts, whatsapp_number, whatsapp_opt_in")
      .eq("id", userId)
      .maybeSingle();

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

    if (fallback) {
      setProfile({
        ...fallback,
        water_goal_ml: null,
        current_streak: 0,
        longest_streak: 0,
        notify_follower_workouts: false,
        whatsapp_number: null,
        whatsapp_opt_in: false,
      } as Profile);
      return;
    }

    // Row may not exist yet right after signup (race with handle_new_user trigger): retry with backoff
    if (!fbError && retries > 0) {
      await new Promise((r) => setTimeout(r, 600));
      return fetchProfile(userId, retries - 1);
    }

    setProfile(null);
  };

  useEffect(() => {
    // Safety timeout: never stay loading forever
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      if (s?.user) {
        fetchProfile(s.user.id).finally(() => {
          clearTimeout(timeout);
          setIsLoading(false);
        });
      } else {
        clearTimeout(timeout);
        setIsLoading(false);
      }
    }).catch(() => {
      clearTimeout(timeout);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s?.user) {
        await fetchProfile(s.user.id);
        registerForPushNotifications(s.user.id).catch(() => {});
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    setProfile(null);
    setSession(null);
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const refreshProfile = async () => {
    if (session?.user) {
      await fetchProfile(session.user.id);
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
