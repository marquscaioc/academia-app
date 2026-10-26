import { Text, View } from "react-native";
import { font } from "../../lib/design/tokens";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "danger" | "primary";
  size?: "sm" | "md";
}

const variantStyles = {
  default: { bg: "bg-surface-elevated border border-surface-border", text: "text-text-secondary" },
  success: { bg: "bg-success-500/12 border border-success-500/25", text: "text-success-500" },
  warning: { bg: "bg-warning-500/12 border border-warning-500/25", text: "text-warning-500" },
  danger: { bg: "bg-danger-500/12 border border-danger-500/25", text: "text-danger-500" },
  primary: { bg: "bg-violet-500/15 border border-violet-500/30", text: "text-violet-300" },
};

export function Badge({ label, variant = "default", size = "sm" }: BadgeProps) {
  const v = variantStyles[variant];
  const padding = size === "sm" ? "px-2.5 py-1" : "px-3.5 py-1.5";
  const textSize = size === "sm" ? "text-[11px]" : "text-xs";

  return (
    <View className={`${v.bg} ${padding} rounded-full self-start`}>
      <Text className={`${v.text} ${textSize} uppercase`} style={{ fontFamily: font.semibold, letterSpacing: 0.8 }}>
        {label}
      </Text>
    </View>
  );
}
