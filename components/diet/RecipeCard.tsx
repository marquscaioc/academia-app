import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { AppIcon } from "../ui";

interface RecipeCardProps {
  name: string;
  imageUrl?: string | null;
  calories?: number | null;
  protein?: number | null;
  prepTime?: number | null;
  isFavorite?: boolean;
  onPress?: () => void;
}

export function RecipeCard({
  name, imageUrl, calories, protein, prepTime, isFavorite, onPress,
}: RecipeCardProps) {
  return (
    <Pressable onPress={onPress} className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden active:bg-surface-hover">
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: "100%", height: 120 }} contentFit="cover" />
      ) : (
        <View className="w-full h-24 bg-surface-elevated items-center justify-center">
          <AppIcon name="food" size={32} color="#6E6382" strokeWidth={2} />
        </View>
      )}
      <View className="p-3">
        <View className="flex-row items-start justify-between">
          <Text className="text-sm font-bold text-text-primary flex-1 mr-2" numberOfLines={2}>{name}</Text>
          {isFavorite ? <AppIcon name="heart" size={16} fill="#FB7185" color="#FB7185" strokeWidth={2} /> : null}
        </View>
        <View className="flex-row gap-2 mt-2">
          {calories ? (
            <Text className="text-[10px] text-violet-400 font-bold">{Math.round(calories)} kcal</Text>
          ) : null}
          {protein ? (
            <Text className="text-[10px] text-text-muted">{Math.round(protein)}g prot</Text>
          ) : null}
          {prepTime ? (
            <Text className="text-[10px] text-text-muted">{prepTime}min</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}
