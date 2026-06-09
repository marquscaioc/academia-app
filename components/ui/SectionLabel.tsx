import { Text, View, TextProps } from "react-native";
import { font } from "../../lib/design/tokens";

interface Props extends TextProps {
  children: React.ReactNode;
  tone?: "muted" | "accent" | "primary";
  withRule?: boolean;
}

const TONE_MAP: Record<NonNullable<Props["tone"]>, string> = {
  muted: "text-text-muted",
  accent: "text-fuchsia-400",
  primary: "text-text-secondary",
};

const LABEL_STYLE = { fontFamily: font.semibold, letterSpacing: 2.5 } as const;

export function SectionLabel({ children, tone = "muted", withRule = false, className, style, ...rest }: Props) {
  if (!withRule) {
    return (
      <Text className={`text-[10px] uppercase ${TONE_MAP[tone]} ${className ?? ""}`} style={[LABEL_STYLE, style]} {...rest}>
        {children}
      </Text>
    );
  }
  return (
    <View className="flex-row items-center gap-3">
      <Text className={`text-[10px] uppercase ${TONE_MAP[tone]}`} style={LABEL_STYLE}>
        {children}
      </Text>
      <View className="flex-1 h-px bg-surface-border" />
    </View>
  );
}
