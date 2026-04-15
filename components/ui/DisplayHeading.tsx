import { Text, TextProps } from "react-native";

type Size = "sm" | "md" | "lg" | "xl" | "2xl";

const SIZE_MAP: Record<Size, string> = {
  sm: "text-2xl leading-[28px]",
  md: "text-4xl leading-[40px]",
  lg: "text-5xl leading-[52px]",
  xl: "text-6xl leading-[64px]",
  "2xl": "text-7xl leading-[72px]",
};

interface Props extends TextProps {
  size?: Size;
  italic?: boolean;
  tone?: "primary" | "accent" | "muted";
}

const TONE_MAP: Record<NonNullable<Props["tone"]>, string> = {
  primary: "text-text-primary",
  accent: "text-fuchsia-300",
  muted: "text-text-secondary",
};

export function DisplayHeading({ size = "lg", italic = false, tone = "primary", className, style, ...rest }: Props) {
  const fontFamily = italic ? "InstrumentSerif_400Regular_Italic" : "InstrumentSerif_400Regular";
  return (
    <Text
      className={`${SIZE_MAP[size]} ${TONE_MAP[tone]} ${className ?? ""}`}
      style={[{ fontFamily, letterSpacing: -0.8 }, style]}
      {...rest}
    />
  );
}
