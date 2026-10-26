import { Platform, View, type StyleProp, type ViewStyle } from "react-native";
import { type ReactNode } from "react";

/**
 * Constrains + centers screen content on web so it doesn't stretch edge-to-edge
 * on wide desktop viewports. No-op on native. Place it inside a ScrollView's
 * content (wrapping the screen body), or pass className="flex-1" when used as a
 * direct flex child that must fill height.
 */
export function WebContainer({
  children,
  maxWidth = 1180,
  className,
  style,
}: {
  children: ReactNode;
  maxWidth?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) {
  if (Platform.OS !== "web") return <>{children}</>;
  return (
    <View className={className} style={[{ width: "100%", maxWidth, marginHorizontal: "auto" }, style]}>
      {children}
    </View>
  );
}
