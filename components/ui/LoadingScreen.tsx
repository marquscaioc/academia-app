import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Logo } from "./Logo";

export function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center">

      <Logo size="xl" />
      <View className="h-7" />
      <ActivityIndicator size="small" color="#3F3F46" />
    </SafeAreaView>
  );
}
