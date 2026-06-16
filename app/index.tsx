import { Redirect } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../lib/auth/provider";
import { Logo } from "../components/ui";

function isRecoveryLink(): boolean {
  if (typeof window === "undefined") return false;
  const hash = window.location.hash ?? "";
  return hash.includes("type=recovery");
}

export default function Index() {
  const { session, profile, isLoading } = useAuth();

  // If user landed via a password-recovery email, route to the reset flow
  // before any normal session-based redirect kicks in.
  if (isRecoveryLink()) {
    return <Redirect href="/(auth)/reset-password" />;
  }

  const loader = (
    <View className="flex-1 items-center justify-center bg-dark-400">
      <Logo size="xl" />
      <View className="h-7" />
      <ActivityIndicator size="small" color="#781BB6" />
    </View>
  );

  if (isLoading) return loader;

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  // Session present but the profile hasn't resolved yet — right after login the
  // profile fetch is deferred a tick (provider releases the auth lock first), so
  // `profile` is briefly null. Wait here instead of falling through to the
  // onboarding redirect, which would strand already-onboarded users on the
  // "choose a profile" screen.
  if (!profile) return loader;

  if (!profile.onboarding_completed) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (profile.role === "admin") {
    return <Redirect href="/(admin)/overview" />;
  }

  if (profile.role === "trainer") {
    return <Redirect href="/(trainer)/dashboard" />;
  }

  return <Redirect href="/(student)/(home)" />;
}
