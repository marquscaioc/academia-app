import { useLocalSearchParams, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../lib/auth/provider";
import { useRecipeDetail, useRecipeFavorites, useRecipeMacros } from "../../../../hooks/queries/useRecipes";
import { useToggleFavorite } from "../../../../hooks/mutations/useRecipeMutations";
import { AppIcon } from "../../../../components/ui";
import { Card } from "../../../../components/ui/Card";
import { LoadingScreen } from "../../../../components/ui/LoadingScreen";
import { WebContainer } from "../../../../components/layout/WebContainer";
import { font } from "../../../../lib/design/tokens";

export default function RecipeDetailScreen() {
  const { recipeId } = useLocalSearchParams<{ recipeId: string }>();
  const { user } = useAuth();
  const { data: recipe, isLoading } = useRecipeDetail(recipeId);
  const { data: favorites } = useRecipeFavorites(user?.id);
  const { data: rpcMacros } = useRecipeMacros(recipeId);
  const toggleFavorite = useToggleFavorite();

  if (isLoading || !recipe) {
    return <LoadingScreen />;
  }

  const isFav = favorites?.has(recipe.id);

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1">
        <WebContainer maxWidth={640}>
        {recipe.image_url ? (
          <Image source={{ uri: recipe.image_url }} style={{ width: "100%", height: 250 }} contentFit="cover" />
        ) : (
          <View className="w-full h-48 bg-surface-elevated items-center justify-center">
            <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
              <AppIcon name="food" size={28} color="#9B40D8" strokeWidth={2} />
            </View>
          </View>
        )}

        <View className="px-6 pt-6 pb-10">
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-3xl text-text-primary flex-1 mr-3" style={{ fontFamily: font.display }}>{recipe.name}</Text>
            <Pressable
              onPress={() => user && toggleFavorite.mutate({ user_id: user.id, recipe_id: recipe.id })}
              className="w-10 h-10 bg-surface-card border border-surface-border rounded-2xl items-center justify-center"
            >
              <AppIcon name="heart" size={18} color={isFav ? "#FB7185" : "#6E6382"} strokeWidth={2} />
            </Pressable>
          </View>

          {recipe.description ? (
            <Text className="text-sm text-text-muted mb-4" style={{ fontFamily: font.regular }}>{recipe.description}</Text>
          ) : null}

          {/* Macros — authoritative totals from RPC (falls back to stored per-serving values) */}
          <View className="flex-row gap-2 mb-6">
            <Card className="flex-1 items-center py-3">
              <Text className="text-lg text-violet-400" style={{ fontFamily: font.bold }}>
                {Math.round(rpcMacros?.kcal ?? recipe.calories_per_serving ?? 0)}
              </Text>
              <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.semibold, letterSpacing: 1 }}>kcal</Text>
            </Card>
            <Card className="flex-1 items-center py-3">
              <Text className="text-lg text-ice-400" style={{ fontFamily: font.bold }}>
                {Math.round(rpcMacros?.protein_g ?? recipe.protein_per_serving ?? 0)}g
              </Text>
              <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.semibold, letterSpacing: 1 }}>Prot</Text>
            </Card>
            <Card className="flex-1 items-center py-3">
              <Text className="text-lg text-warning-500" style={{ fontFamily: font.bold }}>
                {Math.round(rpcMacros?.carbs_g ?? recipe.carbs_per_serving ?? 0)}g
              </Text>
              <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.semibold, letterSpacing: 1 }}>Carbs</Text>
            </Card>
            <Card className="flex-1 items-center py-3">
              <Text className="text-lg text-text-secondary" style={{ fontFamily: font.bold }}>
                {Math.round(rpcMacros?.fat_g ?? recipe.fat_per_serving ?? 0)}g
              </Text>
              <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.semibold, letterSpacing: 1 }}>Gord</Text>
            </Card>
          </View>

          {/* Info */}
          <View className="flex-row items-center flex-wrap gap-x-4 gap-y-2 mb-6">
            {recipe.prep_time_minutes ? (
              <View className="flex-row items-center gap-1.5">
                <AppIcon name="clock" size={14} color="#6E6382" strokeWidth={2} />
                <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Preparo: {recipe.prep_time_minutes}min</Text>
              </View>
            ) : null}
            {recipe.cook_time_minutes ? (
              <View className="flex-row items-center gap-1.5">
                <AppIcon name="timer" size={14} color="#6E6382" strokeWidth={2} />
                <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Cozimento: {recipe.cook_time_minutes}min</Text>
              </View>
            ) : null}
            <View className="flex-row items-center gap-1.5">
              <AppIcon name="food" size={14} color="#6E6382" strokeWidth={2} />
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>{recipe.servings} porcao(es)</Text>
            </View>
          </View>

          {/* Ingredients */}
          {recipe.ingredients?.length ? (
            <View className="mb-6">
              <View className="flex-row items-center gap-2.5 mb-3">
                <View className="w-9 h-9 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                  <AppIcon name="list" size={18} color="#9B40D8" strokeWidth={2} />
                </View>
                <Text className="text-xl text-text-primary" style={{ fontFamily: font.display }}>Ingredientes</Text>
              </View>
              {recipe.ingredients.map((ing) => (
                <View key={ing.id} className="flex-row items-center gap-2 py-1.5 border-b border-surface-border">
                  <View className="w-2 h-2 bg-violet-500 rounded-full" />
                  <Text className="text-sm text-text-secondary flex-1" style={{ fontFamily: font.regular }}>{ing.name}</Text>
                  {ing.quantity ? (
                    <Text className="text-xs text-text-muted" style={{ fontFamily: font.medium }}>{ing.quantity} {ing.unit}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {/* Instructions */}
          {recipe.instructions ? (
            <View>
              <View className="flex-row items-center gap-2.5 mb-3">
                <View className="w-9 h-9 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                  <AppIcon name="clipboard-check" size={18} color="#9B40D8" strokeWidth={2} />
                </View>
                <Text className="text-xl text-text-primary" style={{ fontFamily: font.display }}>Modo de preparo</Text>
              </View>
              <Text className="text-sm text-text-secondary leading-6" style={{ fontFamily: font.regular }}>{recipe.instructions}</Text>
            </View>
          ) : null}

          <Pressable onPress={() => router.back()} className="mt-8 flex-row items-center justify-center gap-2">
            <AppIcon name="arrow-left" size={18} color="#9B40D8" strokeWidth={2} />
            <Text className="text-violet-400" style={{ fontFamily: font.semibold, letterSpacing: 0.3 }}>Voltar para receitas</Text>
          </Pressable>
        </View>
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
