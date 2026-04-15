import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center">
      <ActivityIndicator size="large" color="#781BB6" />
    </SafeAreaView>
  );
}
