import { Text, TextProps } from "react-native";
import { font } from "../../lib/design/tokens";

type Size = "sm" | "md" | "lg" | "xl" | "2xl";

// Compact Geist Sans headings keep the hierarchy clear on small screens.
const SIZE_MAP: Record<Size, string> = {
  sm: "text-[22px] leading-[29px]",
  md: "text-[28px] leading-[36px]",
  lg: "text-[36px] leading-[44px]",
  xl: "text-[44px] leading-[52px]",
  "2xl": "text-[48px] leading-[56px]",
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
