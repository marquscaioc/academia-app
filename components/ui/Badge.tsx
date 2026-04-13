import { Text, View } from "react-native";

interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "danger" | "primary";
  size?: "sm" | "md";
}

const variantStyles = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-success-500/15 text-success-600",
  warning: "bg-warning-500/15 text-warning-600",
  danger: "bg-danger-500/15 text-danger-600",
  primary: "bg-primary-100 text-primary-700",
};

export function Badge({ label, variant = "default", size = "sm" }: BadgeProps) {
  const bgTextColors = variantStyles[variant].split(" ");
  const bg = bgTextColors[0];
  const textColor = bgTextColors[1];
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <View className={`${bg} ${padding} rounded-full self-start`}>
      <Text className={`${textColor} ${textSize} font-semibold`}>{label}</Text>
    </View>
  );
}
