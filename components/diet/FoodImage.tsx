import { Image, View } from "react-native";
import { AppIcon } from "../ui";
import { categoryVisual } from "../../lib/diet/foodCategories";

export function FoodImage({
  url,
  category,
  size = 44,
}: {
  url: string | null;
  category: string | null;
  size?: number;
}) {
  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={{ width: size, height: size, borderRadius: 12 }}
      />
    );
  }

  const v = categoryVisual(category);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 12,
        backgroundColor: v.color + "22",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppIcon name={v.icon} size={size * 0.5} color={v.color} strokeWidth={1.8} />
    </View>
  );
}
