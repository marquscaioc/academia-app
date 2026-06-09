import { Platform, View } from "react-native";
import { type ReactNode } from "react";

/**
 * Centers a mobile-first screen on wide (PC/desktop) browsers instead of letting
 * it stretch edge-to-edge. No-op on native and on narrow web viewports.
 */
export function WebFrame({ children, maxWidth = 480 }: { children: ReactNode; maxWidth?: number }) {
  if (Platform.OS !== "web") return <>{children}</>;
  return (
    <View style={{ flex: 1, width: "100%", maxWidth, alignSelf: "center" }}>
      {children}
    </View>
  );
}
