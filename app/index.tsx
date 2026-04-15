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

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-400">
        <Logo size="xl" />
        <Text
          className="text-fuchsia-400 mt-5 mb-6"
          style={{ fontFamily: "DMSans_700Bold", fontSize: 10, letterSpacing: 3 }}
        >
          ROYAL AMETHYST
        </Text>
        <ActivityIndicator size="small" color="#781BB6" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!profile?.onboarding_completed) {
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
