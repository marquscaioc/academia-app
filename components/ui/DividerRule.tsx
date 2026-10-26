import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export function DividerRule({ accent = false }: { accent?: boolean }) {
  if (!accent) {
    return <View className="h-px bg-surface-border my-4" />;
  }
  return (
    <LinearGradient
      colors={["transparent", "#9B40D8", "#C636E0", "transparent"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ height: 1, marginVertical: 16 }}
    />
  );
}
