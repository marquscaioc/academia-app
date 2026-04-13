import { Text, View } from "react-native";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "danger" | "primary";
  size?: "sm" | "md";
}

const variantStyles = {
  default: { bg: "bg-surface-elevated", text: "text-text-secondary" },
  success: { bg: "bg-success-500/15", text: "text-success-500" },
  warning: { bg: "bg-warning-500/15", text: "text-warning-500" },
  danger: { bg: "bg-danger-500/15", text: "text-danger-500" },
  primary: { bg: "bg-violet-500/15", text: "text-violet-300" },
};

export function Badge({ label, variant = "default", size = "sm" }: BadgeProps) {
  const v = variantStyles[variant];
  const padding = size === "sm" ? "px-2.5 py-1" : "px-3.5 py-1.5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <View className={`${v.bg} ${padding} rounded-full self-start`}>
      <Text className={`${v.text} ${textSize} font-bold`}>{label}</Text>
    </View>
  );
}
