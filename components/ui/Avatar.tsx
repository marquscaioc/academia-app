import { Image } from "expo-image";
import { Text, View } from "react-native";

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: { container: "w-8 h-8", text: "text-xs", image: 32 },
  md: { container: "w-10 h-10", text: "text-sm", image: 40 },
  lg: { container: "w-14 h-14", text: "text-lg", image: 56 },
  xl: { container: "w-20 h-20", text: "text-2xl", image: 80 },
};

function getInitials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ uri, name, size = "md" }: AvatarProps) {
  const s = sizeMap[size];

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: s.image, height: s.image, borderRadius: s.image / 2 }}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View
      className={`${s.container} rounded-full bg-primary-100 items-center justify-center`}
    >
      <Text className={`${s.text} font-bold text-primary-700`}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
