import { LinearGradient } from "expo-linear-gradient";
import { View, ViewProps, Pressable, PressableProps } from "react-native";
import React from "react";

interface Props extends ViewProps {
  children: React.ReactNode;
  variant?: "solid" | "border" | "subtle";
  tone?: "amethyst" | "ice" | "ember";
  onPress?: PressableProps["onPress"];
  padding?: boolean;
  rounded?: "xl" | "2xl" | "3xl";
}

const TONE_GRADIENTS: Record<NonNullable<Props["tone"]>, [string, string, string]> = {
  amethyst: ["#781BB6", "#9B40D8", "#C636E0"],
  ice: ["#22D3EE", "#9B40D8", "#C636E0"],
  ember: ["#C636E0", "#E06BF5", "#FBBF24"],
};

const RADIUS_MAP = { xl: 16, "2xl": 24, "3xl": 28 } as const;

export function GradientCard({
  children,
  variant = "solid",
  tone = "amethyst",
  onPress,
  padding = true,
  rounded = "3xl",
  className,
  style,
  ...rest
}: Props) {
  const colors = TONE_GRADIENTS[tone];
  const radius = RADIUS_MAP[rounded];

  if (variant === "solid") {
    const content = (
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[{ borderRadius: radius, overflow: "hidden" }, style]}
      >
        <View className={`${padding ? "p-6" : ""} ${className ?? ""}`}>{children}</View>
      </LinearGradient>
    );
    return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
  }

  if (variant === "border") {
    const content = (
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[{ borderRadius: radius, padding: 1.5 }, style]}
      >
        <View
          className={`bg-dark-400 ${padding ? "p-6" : ""} ${className ?? ""}`}
          style={{ borderRadius: radius - 1.5 }}
        >
          {children}
        </View>
      </LinearGradient>
    );
    return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
  }

  // subtle = dark background with a barely-visible gradient wash
  const content = (
    <View
      className={`bg-surface-card border border-surface-border ${padding ? "p-6" : ""} ${className ?? ""}`}
      style={[{ borderRadius: radius, overflow: "hidden" }, style]}
      {...rest}
    >
      <LinearGradient
        colors={[`${colors[0]}1A`, "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      />
      {children}
    </View>
  );
  return onPress ? <Pressable onPress={onPress}>{content}</Pressable> : content;
}
