import { Text, View, TextProps } from "react-native";

interface Props extends TextProps {
  children: React.ReactNode;
  tone?: "muted" | "accent" | "primary";
  withRule?: boolean;
}

const TONE_MAP: Record<NonNullable<Props["tone"]>, string> = {
  muted: "text-text-muted",
  accent: "text-fuchsia-400",
  primary: "text-text-primary",
};

export function SectionLabel({ children, tone = "muted", withRule = false, className, style, ...rest }: Props) {
  if (!withRule) {
    return (
      <Text
        className={`text-[10px] uppercase ${TONE_MAP[tone]} ${className ?? ""}`}
        style={[{ fontFamily: "DMSans_700Bold", letterSpacing: 3 }, style]}
        {...rest}
      >
        {children}
      </Text>
    );
  }
  return (
    <View className="flex-row items-center gap-3">
      <Text
        className={`text-[10px] uppercase ${TONE_MAP[tone]}`}
        style={{ fontFamily: "DMSans_700Bold", letterSpacing: 3 }}
      >
        {children}
      </Text>
      <View className="flex-1 h-px bg-surface-border" />
    </View>
  );
}
