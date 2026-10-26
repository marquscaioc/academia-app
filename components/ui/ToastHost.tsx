import { Pressable, Text, View } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToastStore, type ToastTone } from "../../stores/useToastStore";
import { font, palette } from "../../lib/design/tokens";
import { AppIcon, type IconName } from "./Icon";

const TONE: Record<ToastTone, { icon: IconName; color: string }> = {
  error: { icon: "alert", color: palette.danger },
  success: { icon: "check", color: palette.success },
  info: { icon: "info", color: palette.violet300 },
};

/** Renders toasts from useToastStore. Mounted once in the root layout. */
export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  const insets = useSafeAreaInsets();
  if (toasts.length === 0) return null;

  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", top: insets.top + 12, left: 16, right: 16, alignItems: "center", gap: 8 }}
    >
      {toasts.map((t) => {
        const tone = TONE[t.tone];
        return (
          <Animated.View key={t.id} entering={FadeInUp} exiting={FadeOutUp} style={{ width: "100%", maxWidth: 480 }}>
            <Pressable
              onPress={() => dismiss(t.id)}
              accessibilityRole="alert"
              accessibilityLabel={t.message ? `${t.title}. ${t.message}` : t.title}
              accessibilityHint="Toque para fechar"
              className="flex-row items-start gap-3 bg-surface-elevated border rounded-2xl px-4 py-3"
              style={{ borderColor: tone.color }}
            >
              <View className="pt-0.5">
                <AppIcon name={tone.icon} size={18} color={tone.color} strokeWidth={2.2} />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{t.title}</Text>
                {t.message ? (
                  <Text className="text-xs text-text-secondary mt-0.5" style={{ fontFamily: font.regular }}>{t.message}</Text>
                ) : null}
              </View>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
}
