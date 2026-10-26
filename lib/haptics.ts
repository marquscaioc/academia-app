import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

// Haptics are a no-op on web; every call is fire-and-forget and never throws.
const enabled = Platform.OS === "ios" || Platform.OS === "android";

export const haptics = {
  tap: () => {
    if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  },
  success: () => {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  },
  warning: () => {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
  },
};
