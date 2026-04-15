import { Image } from "expo-image";
import { Text, View } from "react-native";

const LOGO_SRC = require("../../assets/logotreino.png");

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
            fontFamily: "ArchivoBlack_400Regular",
            fontSize: dim * 0.55,
            lineHeight: dim * 0.6,
            letterSpacing: -0.8,
          }}
        >
          TREINO
        </Text>
        <Text
          className="text-fuchsia-400"
          style={{
            fontFamily: "DMSans_700Bold",
            fontSize: Math.max(8, dim * 0.18),
            letterSpacing: 3,
            marginTop: -2,
          }}
        >
          ROYAL AMETHYST
        </Text>
      </View>
    </View>
  );
}
