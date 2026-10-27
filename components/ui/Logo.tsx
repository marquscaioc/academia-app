import { Text } from "react-native";
import { font, palette } from "../../lib/design/tokens";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
interface Props {
  size?: Size;
  withWordmark?: boolean;
  wordmarkTone?: "primary" | "muted";
  className?: string;
}

// Text-only application name, without an image or monogram.
export function Logo({ size = "md", wordmarkTone = "primary", className }: Props) {
  const fontSize = { xs: 12, sm: 14, md: 17, lg: 20, xl: 24 }[size];
  return (
    <Text className={className} style={{
      fontFamily: font.semibold, fontSize, lineHeight: fontSize * 1.4,
      letterSpacing: -0.5,
      color: wordmarkTone === "muted" ? palette.textMuted : palette.textPrimary,
    }}>
      Projeto Academia
    </Text>
  );
}
