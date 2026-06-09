import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { amethystGradient, amethystGlow, font } from "../../lib/design/tokens";

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

const sizeStyles = {
  sm: { container: "py-2.5 px-4 rounded-xl", text: "text-sm", pad: 10 },
  md: { container: "py-3.5 px-6 rounded-2xl", text: "text-[15px]", pad: 15 },
  lg: { container: "py-4 px-8 rounded-2xl", text: "text-base", pad: 18 },
};

const TEXT_STYLE = { fontFamily: font.semibold, letterSpacing: 0.4 } as const;

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
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;
  const widthCls = fullWidth ? "w-full" : "";

  const Label = ({ color }: { color: string }) =>
    loading ? (
      <ActivityIndicator color={color} size="small" />
    ) : (
      <View className="flex-row items-center justify-center gap-2">
        {icon}
        <Text className={s.text} style={[TEXT_STYLE, { color }]}>
          {title}
        </Text>
      </View>
    );

  // Gradient variants (primary / danger) — the signature amethyst treatment.
  if (variant === "primary" || variant === "danger") {
    const colors =
      variant === "primary" ? amethystGradient : (["#FB7185", "#F43F5E"] as const);
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className={`${widthCls} ${isDisabled ? "opacity-50" : ""}`}
        style={variant === "primary" && !isDisabled ? amethystGlow : undefined}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.9 }}
          style={{
            paddingVertical: s.pad,
            borderRadius: size === "sm" ? 12 : 16,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Label color="#FFFFFF" />
        </LinearGradient>
      </Pressable>
    );
  }

  // Flat variants
  const flat = {
    secondary: { box: "bg-surface-elevated border border-surface-border active:bg-surface-hover", color: "#F2EEF8" },
    outline: { box: "border border-surface-border bg-transparent active:bg-surface-hover", color: "#C78FEF" },
    ghost: { box: "bg-transparent active:bg-surface-hover", color: "#A99FBA" },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`flex-row items-center justify-center ${s.container} ${flat.box} ${widthCls} ${
        isDisabled ? "opacity-50" : ""
      }`}
    >
      <Label color={flat.color} />
    </Pressable>
  );
}
