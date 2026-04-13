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
    container: "bg-primary-600 active:bg-primary-700",
    text: "text-white",
    loader: "#ffffff",
  },
  secondary: {
    container: "bg-gray-100 active:bg-gray-200",
    text: "text-gray-900",
    loader: "#111827",
  },
  outline: {
    container: "border border-gray-300 bg-transparent active:bg-gray-50",
    text: "text-gray-700",
    loader: "#374151",
  },
  ghost: {
    container: "bg-transparent active:bg-gray-100",
    text: "text-gray-700",
    loader: "#374151",
  },
  danger: {
    container: "bg-danger-500 active:bg-danger-600",
    text: "text-white",
    loader: "#ffffff",
  },
};

const sizeStyles = {
  sm: { container: "py-2 px-4 rounded-lg", text: "text-sm" },
  md: { container: "py-3 px-6 rounded-xl", text: "text-base" },
  lg: { container: "py-4 px-8 rounded-xl", text: "text-lg" },
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
          <Text className={`font-semibold ${s.text} ${v.text}`}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}
