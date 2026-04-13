import { ActivityIndicator, Pressable, Text, View } from "react-native";

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

const variantStyles = {
  primary: {
    container: "bg-violet-500 active:bg-violet-600",
    text: "text-white",
    loader: "#ffffff",
  },
  secondary: {
    container: "bg-surface-elevated active:bg-surface-hover",
    text: "text-text-primary",
    loader: "#F2EEF8",
  },
  outline: {
    container: "border border-surface-border bg-transparent active:bg-surface-hover",
    text: "text-text-secondary",
    loader: "#A99FBA",
  },
  ghost: {
    container: "bg-transparent active:bg-surface-hover",
    text: "text-text-secondary",
    loader: "#A99FBA",
  },
  danger: {
    container: "bg-danger-500 active:bg-danger-600",
    text: "text-white",
    loader: "#ffffff",
  },
};

const sizeStyles = {
  sm: { container: "py-2.5 px-4 rounded-xl", text: "text-sm" },
  md: { container: "py-3.5 px-6 rounded-2xl", text: "text-base" },
  lg: { container: "py-4.5 px-8 rounded-2xl", text: "text-lg" },
};

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
}: ButtonProps) {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${s.container} ${v.container} ${
        fullWidth ? "w-full" : ""
      } ${isDisabled ? "opacity-50" : ""}`}
    >
      {loading ? (
        <ActivityIndicator color={v.loader} size="small" />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className={`font-bold tracking-wide ${s.text} ${v.text}`}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}
