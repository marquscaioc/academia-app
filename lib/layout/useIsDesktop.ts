import { Platform, useWindowDimensions } from "react-native";

/**
 * Desktop = a web viewport at least `lg` (1024px) wide.
 *
 * Native (iOS/Android) is NEVER desktop — it always uses the mobile layout.
 * On web, below this width we fall back to the mobile (bottom-tabs) layout
 * instead of the desktop sidebar, so the site works on phone browsers.
 *
 * Reactive: re-renders on resize / orientation change.
 */
export const DESKTOP_BREAKPOINT = 1024;

export function useIsDesktop(): boolean {
  const { width } = useWindowDimensions();
  return Platform.OS === "web" && width >= DESKTOP_BREAKPOINT;
}
