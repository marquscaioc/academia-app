import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../lib/auth/provider";
import { useRecipes, useRecipeFavorites } from "../../../../hooks/queries/useRecipes";
import { RecipeCard } from "../../../../components/diet/RecipeCard";
import { AppIcon } from "../../../../components/ui";
import { font } from "../../../../lib/design/tokens";
import { WebContainer } from "../../../../components/layout/WebContainer";

const tagFilters = [
  { value: "low_carb", label: "Low Carb" },
  { value: "high_protein", label: "High Protein" },
  { value: "vegan", label: "Vegano" },
  { value: "gluten_free", label: "Sem Gluten" },
  { value: "quick", label: "Rapido" },
];

export default function RecipesScreen() {
  const { user, role } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: recipes, isLoading } = useRecipes({
    tags: selectedTags.length ? selectedTags : undefined,
    search: search.trim() || undefined,
    userId: user?.id,
    role,
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
        <WebContainer maxWidth={1180}>
        <View className="flex-1">
        <View className="px-6 pt-6 pb-3">
          <View className="flex-row items-center justify-between mb-4">
            <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
              <AppIcon name="arrow-left" size={18} color="#9B40D8" strokeWidth={2} />
              <Text className="text-violet-400" style={{ fontFamily: font.medium }}>Voltar</Text>
            </Pressable>
            <Text className="text-[28px] text-text-primary" style={{ fontFamily: font.display }}>Receitas.</Text>
            <View className="w-16" />
          </View>

          <View className="mb-3">
            <View className="absolute left-4 top-0 bottom-0 z-10 justify-center">
              <AppIcon name="search" size={18} color="#6E6382" strokeWidth={2} />
            </View>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl pl-11 pr-4 py-3.5 text-[15px] text-text-primary"
              style={{ fontFamily: font.regular }}
              placeholder="Buscar receita..."
              placeholderTextColor="#6E6382"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <View className="flex-row flex-wrap gap-2">
            {tagFilters.map((t) => (
              <Pressable
                key={t.value}
                onPress={() => toggleTag(t.value)}
                className={`px-3 py-1.5 rounded-full ${
                  selectedTags.includes(t.value) ? "bg-violet-500" : "bg-surface-card border border-surface-border"
                }`}
              >
                <Text
                  className={`text-xs ${
                    selectedTags.includes(t.value) ? "text-white" : "text-text-muted"
                  }`}
                  style={{ fontFamily: font.semibold }}
                >
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
              <View className="items-center px-8 py-16">
                <View className="w-16 h-16 rounded-3xl bg-surface-elevated border border-surface-border items-center justify-center mb-5">
                  <AppIcon name="food" size={28} color="#9B40D8" strokeWidth={2} />
                </View>
                <Text
                  className="text-2xl text-text-primary text-center"
                  style={{ fontFamily: font.display, letterSpacing: -0.3 }}
                >
                  Nenhuma receita encontrada
                </Text>
                <Text
                  className="text-text-secondary text-sm text-center mt-2 max-w-[280px] leading-5"
                  style={{ fontFamily: font.regular }}
                >
                  Ajuste a busca ou os filtros para descobrir novas receitas.
                </Text>
              </View>
            }
          />
        )}
        </View>
        </WebContainer>
      </View>
    </SafeAreaView>
  );
}
