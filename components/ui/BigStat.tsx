import { Text, View, ViewProps } from "react-native";
import { font } from "../../lib/design/tokens";

interface Props extends ViewProps {
  value: string | number;
  label: string;
  suffix?: string;
  tone?: "primary" | "accent" | "ice" | "success" | "warning";
  align?: "left" | "center";
  size?: "md" | "lg" | "xl";
}

const TONE_MAP: Record<NonNullable<Props["tone"]>, string> = {
  primary: "text-text-primary",
  accent: "text-fuchsia-300",
  ice: "text-ice-400",
  success: "text-success-500",
  warning: "text-warning-500",
};

// Editorial hero numerals in Instrument Serif — pull-stat feel, not data-table.
const SIZE_MAP: Record<NonNullable<Props["size"]>, { num: string; suffix: string }> = {
  md: { num: "text-5xl leading-[50px]", suffix: "text-lg" },
  lg: { num: "text-6xl leading-[62px]", suffix: "text-xl" },
  xl: { num: "text-7xl leading-[74px]", suffix: "text-2xl" },
};

export function BigStat({
  value,
  label,
  suffix,
  tone = "primary",
  align = "left",
  size = "lg",
  className,
  ...rest
}: Props) {
  const sz = SIZE_MAP[size];
  return (
    <View className={`${align === "center" ? "items-center" : "items-start"} ${className ?? ""}`} {...rest}>
      <View className="flex-row items-baseline">
        <Text className={`${sz.num} ${TONE_MAP[tone]}`} style={{ fontFamily: font.display, letterSpacing: -0.5 }}>
          {value}
        </Text>
        {suffix ? (
          <Text className={`${sz.suffix} ${TONE_MAP[tone]} ml-1 opacity-50`} style={{ fontFamily: font.display }}>
            {suffix}
          </Text>
        ) : null}
      </View>
      <Text
        className="text-[10px] text-text-muted mt-1.5 uppercase"
        style={{ fontFamily: font.semibold, letterSpacing: 2 }}
      >
        {label}
      </Text>
    </View>
  );
}
