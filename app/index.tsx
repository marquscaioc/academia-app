import { Redirect } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../lib/auth/provider";

export default function Index() {
  const { session, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark-400">
        <View className="w-16 h-16 bg-violet-400 rounded-2xl items-center justify-center mb-5 rotate-6">
          <Text className="text-dark-400 text-3xl font-black -rotate-6">A</Text>
        </View>
        <ActivityIndicator size="large" color="#781BB6" />
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
