import { Image } from "expo-image";
import { Text, View } from "react-native";
import { font } from "../../lib/design/tokens";

const LOGO_SRC = require("../../assets/logosemfundo.png");

type Size = "xs" | "sm" | "md" | "lg" | "xl";

const SIZE_MAP: Record<Size, number> = {
  xs: 20,
  sm: 28,
  md: 40,
  lg: 64,
  xl: 120,
};

interface Props {
  size?: Size;
  withWordmark?: boolean;
  wordmarkTone?: "primary" | "muted";
  className?: string;
}

export function Logo({ size = "md", withWordmark = false, wordmarkTone = "primary", className }: Props) {
  const dim = SIZE_MAP[size];

  if (!withWordmark) {
    return (
      <Image
        source={LOGO_SRC}
        style={{ width: dim, height: dim }}
        contentFit="contain"
      />
    );
  }

  return (
    <View className={`flex-row items-center gap-2.5 ${className ?? ""}`}>
      <Image source={LOGO_SRC} style={{ width: dim, height: dim }} contentFit="contain" />
      <View>
        <Text
          className={wordmarkTone === "primary" ? "text-text-primary" : "text-text-muted"}
          style={{
            fontFamily: font.display,
            fontSize: dim * 0.62,
            lineHeight: dim * 0.64,
            letterSpacing: -0.5,
          }}
        >
          Academia
        </Text>
        <Text
          className="text-fuchsia-400"
          style={{
            fontFamily: font.semibold,
            fontSize: Math.max(8, dim * 0.16),
            letterSpacing: 3,
            marginTop: 1,
          }}
        >
          ROYAL AMETHYST
        </Text>
      </View>
    </View>
  );
}
