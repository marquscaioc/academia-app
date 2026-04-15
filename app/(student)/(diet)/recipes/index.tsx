import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../lib/auth/provider";
import { useRecipes, useRecipeFavorites } from "../../../../hooks/queries/useRecipes";
import { RecipeCard } from "../../../../components/diet/RecipeCard";

const tagFilters = [
  { value: "low_carb", label: "Low Carb" },
  { value: "high_protein", label: "High Protein" },
  { value: "vegan", label: "Vegano" },
  { value: "gluten_free", label: "Sem Gluten" },
  { value: "quick", label: "Rapido" },
];

export default function RecipesScreen() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: recipes, isLoading } = useRecipes({
    tags: selectedTags.length ? selectedTags : undefined,
    search: search.trim() || undefined,
  });
  const { data: favorites } = useRecipeFavorites(user?.id);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        <View className="px-6 pt-6 pb-3">
          <View className="flex-row items-center justify-between mb-4">
            <Pressable onPress={() => router.back()}>
              <Text className="text-violet-400 font-medium">← Voltar</Text>
            </Pressable>
            <Text className="text-lg font-black text-text-primary">Receitas</Text>
            <View className="w-16" />
          </View>

          <TextInput
            className="bg-surface-card border border-surface-border rounded-2xl px-4 py-3 text-sm text-text-primary mb-3"
            placeholder="Buscar receita..."
            placeholderTextColor="#6E6580"
            value={search}
            onChangeText={setSearch}
          />

          <View className="flex-row flex-wrap gap-2">
            {tagFilters.map((t) => (
              <Pressable
                key={t.value}
                onPress={() => toggleTag(t.value)}
                className={`px-3 py-1.5 rounded-full ${
                  selectedTags.includes(t.value) ? "bg-violet-500" : "bg-surface-card border border-surface-border"
                }`}
              >
                <Text className={`text-xs font-bold ${
                  selectedTags.includes(t.value) ? "text-white" : "text-text-muted"
                }`}>
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerClassName="px-6 gap-3 pb-10"
            columnWrapperClassName="gap-3"
            renderItem={({ item }) => (
              <View style={{ flex: 1 }}>
                <RecipeCard
                  name={item.name}
                  imageUrl={item.image_url}
                  calories={item.calories_per_serving}
                  protein={item.protein_per_serving}
                  prepTime={item.prep_time_minutes}
                  isFavorite={favorites?.has(item.id)}
                  onPress={() => router.push(`/(student)/(diet)/recipes/${item.id}` as never)}
                />
              </View>
            )}
            ListEmptyComponent={
              <View className="items-center py-10">
                <Text className="text-3xl mb-3">🍽️</Text>
                <Text className="text-text-muted text-sm">Nenhuma receita encontrada</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
