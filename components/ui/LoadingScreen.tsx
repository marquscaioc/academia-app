import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { font, glowWash } from "../../lib/design/tokens";
import { Logo } from "./Logo";

export function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center">
      <LinearGradient
        colors={glowWash}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 320 }}
        pointerEvents="none"
      />
      <Logo size="xl" />
      <Text
        className="text-fuchsia-400 mt-5 mb-6"
        style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 3 }}
      >
        ROYAL AMETHYST
      </Text>
      <ActivityIndicator size="small" color="#9B40D8" />
    </SafeAreaView>
  );
}
