import { Text, TextProps } from "react-native";
import { font } from "../../lib/design/tokens";

type Size = "sm" | "md" | "lg" | "xl" | "2xl";

// Instrument Serif renders best with airy leading; sizes tuned for the serif metrics.
const SIZE_MAP: Record<Size, string> = {
  sm: "text-[26px] leading-[30px]",
  md: "text-4xl leading-[42px]",
  lg: "text-5xl leading-[54px]",
  xl: "text-6xl leading-[64px]",
  "2xl": "text-7xl leading-[74px]",
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
  return (
    <Text
      className={`${SIZE_MAP[size]} ${TONE_MAP[tone]} ${className ?? ""}`}
      style={[{ fontFamily: italic ? font.displayItalic : font.display, letterSpacing: -0.3 }, style]}
      {...rest}
    />
  );
}
