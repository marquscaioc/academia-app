import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { amethystGradient, font } from "../../lib/design/tokens";
import { AppIcon, type IconName } from "./Icon";

interface EmptyStateProps {
  /** Lucide icon name (preferred). */
  iconName?: IconName;
  /** Legacy emoji fallback (used only when iconName is not given). */
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ iconName, icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="w-20 h-20 bg-surface-elevated border border-surface-border rounded-3xl items-center justify-center mb-6">
        {iconName ? (
          <AppIcon name={iconName} size={28} color="#9B40D8" strokeWidth={2} />
        ) : (
          <Text className="text-3xl">{icon}</Text>
        )}
      </View>
      <Text className="text-3xl text-text-primary text-center" style={{ fontFamily: font.display, letterSpacing: -0.3 }}>
        {title}
      </Text>
      <Text
        className="text-sm text-text-secondary text-center mt-2.5 max-w-[300px] leading-5"
        style={{ fontFamily: font.regular }}
      >
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} className="mt-7 rounded-2xl overflow-hidden">
          <LinearGradient
            colors={amethystGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.9 }}
            style={{ paddingVertical: 13, paddingHorizontal: 26 }}
          >
            <Text className="text-white text-sm" style={{ fontFamily: font.semibold, letterSpacing: 0.4 }}>
              {actionLabel}
            </Text>
          </LinearGradient>
        </Pressable>
      ) : null}
    </View>
  );
}
