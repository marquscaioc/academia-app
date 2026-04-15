import { useLocalSearchParams, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../lib/auth/provider";
import { useRecipeDetail, useRecipeFavorites } from "../../../../hooks/queries/useRecipes";
import { useToggleFavorite } from "../../../../hooks/mutations/useRecipeMutations";
import { Card } from "../../../../components/ui/Card";
import { LoadingScreen } from "../../../../components/ui/LoadingScreen";

export default function RecipeDetailScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { user } = useAuth();
  const { data: recipe, isLoading } = useRecipeDetail(recipeId);
  const { data: favorites } = useRecipeFavorites(user?.id);
  const toggleFavorite = useToggleFavorite();

  if (isLoading || !recipe) {
    return <LoadingScreen />;
  }

  const isFav = favorites?.has(recipe.id);

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1">
        {recipe.image_url ? (
          <Image source={{ uri: recipe.image_url }} style={{ width: "100%", height: 250 }} contentFit="cover" />
        ) : (
          <View className="w-full h-48 bg-surface-elevated items-center justify-center">
            <Text className="text-5xl">🍽️</Text>
          </View>
        )}

        <View className="px-6 pt-6 pb-10">
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-2xl font-black text-text-primary flex-1 mr-3">{recipe.name}</Text>
            <Pressable
              onPress={() => user && toggleFavorite.mutate({ user_id: user.id, recipe_id: recipe.id })}
              className="w-10 h-10 bg-surface-card border border-surface-border rounded-xl items-center justify-center"
            >
              <Text className="text-lg">{isFav ? "❤️" : "🤍"}</Text>
            </Pressable>
          </View>

          {recipe.description ? (
            <Text className="text-sm text-text-muted mb-4">{recipe.description}</Text>
          ) : null}

          {/* Macros */}
          <View className="flex-row gap-2 mb-6">
            <Card className="flex-1 items-center py-3">
              <Text className="text-lg font-black text-violet-400">{Math.round(recipe.calories_per_serving ?? 0)}</Text>
              <Text className="text-[10px] text-text-muted">kcal</Text>
            </Card>
            <Card className="flex-1 items-center py-3">
              <Text className="text-lg font-black text-ice-400">{Math.round(recipe.protein_per_serving ?? 0)}g</Text>
              <Text className="text-[10px] text-text-muted">Prot</Text>
            </Card>
            <Card className="flex-1 items-center py-3">
              <Text className="text-lg font-black text-warning-500">{Math.round(recipe.carbs_per_serving ?? 0)}g</Text>
              <Text className="text-[10px] text-text-muted">Carbs</Text>
            </Card>
            <Card className="flex-1 items-center py-3">
              <Text className="text-lg font-black text-text-secondary">{Math.round(recipe.fat_per_serving ?? 0)}g</Text>
              <Text className="text-[10px] text-text-muted">Gord</Text>
            </Card>
          </View>

          {/* Info */}
          <View className="flex-row gap-4 mb-6">
            {recipe.prep_time_minutes ? (
              <Text className="text-xs text-text-muted">Preparo: {recipe.prep_time_minutes}min</Text>
            ) : null}
            {recipe.cook_time_minutes ? (
              <Text className="text-xs text-text-muted">Cozimento: {recipe.cook_time_minutes}min</Text>
            ) : null}
            <Text className="text-xs text-text-muted">{recipe.servings} porcao(es)</Text>
          </View>

          {/* Ingredients */}
          {recipe.ingredients?.length ? (
            <View className="mb-6">
              <Text className="text-sm font-black text-text-primary mb-3">Ingredientes</Text>
              {recipe.ingredients.map((ing) => (
                <View key={ing.id} className="flex-row items-center gap-2 py-1.5 border-b border-surface-border">
                  <View className="w-2 h-2 bg-violet-500 rounded-full" />
                  <Text className="text-sm text-text-secondary flex-1">{ing.name}</Text>
                  {ing.quantity ? (
                    <Text className="text-xs text-text-muted">{ing.quantity} {ing.unit}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {/* Instructions */}
          {recipe.instructions ? (
            <View>
              <Text className="text-sm font-black text-text-primary mb-3">Modo de Preparo</Text>
              <Text className="text-sm text-text-secondary leading-6">{recipe.instructions}</Text>
            </View>
          ) : null}

          <Pressable onPress={() => router.back()} className="mt-8 items-center">
            <Text className="text-violet-400 font-bold">← Voltar para receitas</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
