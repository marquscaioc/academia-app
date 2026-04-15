import { Text, View, ViewProps } from "react-native";

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
  accent: "text-fuchsia-400",
  ice: "text-ice-400",
  success: "text-success-500",
  warning: "text-warning-500",
};

const SIZE_MAP: Record<NonNullable<Props["size"]>, { num: string; suffix: string }> = {
  md: { num: "text-5xl leading-[48px]", suffix: "text-lg" },
  lg: { num: "text-6xl leading-[60px]", suffix: "text-xl" },
  xl: { num: "text-7xl leading-[72px]", suffix: "text-2xl" },
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
        <Text
          className={`${sz.num} ${TONE_MAP[tone]}`}
          style={{ fontFamily: "ArchivoBlack_400Regular", letterSpacing: -2 }}
        >
          {value}
        </Text>
        {suffix ? (
          <Text
            className={`${sz.suffix} ${TONE_MAP[tone]} ml-1 opacity-60`}
            style={{ fontFamily: "ArchivoBlack_400Regular", letterSpacing: -0.5 }}
          >
            {suffix}
          </Text>
        ) : null}
      </View>
      <Text
        className="text-[10px] text-text-muted mt-1 uppercase"
        style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}
      >
        {label}
      </Text>
    </View>
  );
}
