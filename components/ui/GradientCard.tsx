import { View, ViewProps, Pressable, PressableProps } from "react-native";
import React from "react";
import { palette } from "../../lib/design/tokens";

interface Props extends ViewProps {
  children: React.ReactNode;
  variant?: "solid" | "border" | "subtle";
  tone?: "amethyst" | "ice" | "ember";
  onPress?: PressableProps["onPress"];
  padding?: boolean;
  rounded?: "xl" | "2xl" | "3xl";
}

// Preserves the shared card API with a flat, neutral presentation.
export function GradientCard({ children, variant = "solid", tone: _tone, onPress, padding = true, rounded = "3xl", className, style, ...rest }: Props) {
  const content = (
    <View
      className={`${padding ? "p-6" : ""} ${className ?? ""}`}
      style={[{
        borderRadius: { xl: 12, "2xl": 14, "3xl": 18 }[rounded],
        backgroundColor: variant === "solid" ? palette.violet500 : palette.surface,
        borderWidth: 1,
        borderColor: variant === "solid" ? palette.violet500 : palette.border,
        overflow: "hidden",
      }, style]}
      {...rest}
    >
      {children}
    </View>
  );
  return onPress ? <Pressable accessibilityRole="button" onPress={onPress}>{content}</Pressable> : content;
}
