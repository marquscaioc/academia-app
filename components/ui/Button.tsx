import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { font, palette } from "../../lib/design/tokens";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({ title, onPress, variant = "primary", size = "md", loading = false, disabled = false, icon, fullWidth = true }: ButtonProps) {
  const isDisabled = disabled || loading;
  const filled = variant === "primary" || variant === "danger";
  const color = filled ? "#FFFFFF" : palette.textPrimary;
  const height = { sm: 40, md: 46, lg: 52 }[size];
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={`${fullWidth ? "w-full" : ""} rounded-xl px-5 items-center justify-center ${filled ? "bg-primary-500 active:bg-primary-700" : variant === "ghost" ? "bg-transparent active:bg-surface-hover" : "border border-surface-border bg-white active:bg-surface-hover"} ${isDisabled ? "opacity-50" : ""}`}
      style={{ minHeight: height }}
    >
      {loading ? <ActivityIndicator color={color} size="small" /> : (
        <View className="flex-row items-center justify-center gap-2.5">
          <Text style={{ fontFamily: font.semibold, fontSize: size === "sm" ? 13 : 14, color }}>{title}</Text>
          {icon}
        </View>
      )}
    </Pressable>
  );
}
