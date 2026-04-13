import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useDietPlans, useMealLogs, useWaterLogs } from "../../../hooks/queries/useDiet";
import { useLogMeal, useLogWater } from "../../../hooks/mutations/useDietMutations";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function DietScreen() {
  const { user } = useAuth();
  const today = getTodayDate();
  const { data: plans } = useDietPlans(user?.id);
  const { data: mealLogs } = useMealLogs(user?.id, today);
  const { data: waterLogs } = useWaterLogs(user?.id, today);
  const logMeal = useLogMeal();
  const logWater = useLogWater();

  const activePlan = plans?.[0];
  const meals = activePlan?.meals ?? [];
  const loggedMealIds = new Set(mealLogs?.map((l) => l.meal_id) ?? []);
  const totalWaterMl = waterLogs?.reduce((sum, l) => sum + l.amount_ml, 0) ?? 0;
  const waterGoalMl = 2500;

  const completedMeals = meals.filter((m) => loggedMealIds.has(m.id)).length;
  const totalMeals = meals.length;

  const handleLogMeal = (mealId: string) => {
    if (!user || loggedMealIds.has(mealId)) return;
    logMeal.mutate({ user_id: user.id, meal_id: mealId });
  };

  const handleLogWater = () => {
    if (!user) return;
    logWater.mutate({ user_id: user.id, amount_ml: 250 });
  };

  // Calculate daily macros
  let totalCal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;
  for (const meal of meals) {
    for (const item of meal.items ?? []) {
      totalCal += item.calories ?? 0;
      totalProt += item.protein_g ?? 0;
      totalCarb += item.carbs_g ?? 0;
      totalFat += item.fat_g ?? 0;
    }
  }

  if (!activePlan) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="px-6 pt-6">
          <Text className="text-2xl font-bold text-gray-900 mb-6">Dieta</Text>
        </View>
        <EmptyState
          icon="🥗"
          title="Nenhum plano alimentar"
          description="Seu nutricionista ou personal ainda nao atribuiu um plano alimentar."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-bold text-gray-900 mb-1">Dieta</Text>
        <Text className="text-sm text-gray-500 mb-6">{activePlan.name}</Text>

        {/* Macro summary */}
        <View className="flex-row gap-2 mb-6">
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg font-bold text-gray-900">{Math.round(totalCal)}</Text>
            <Text className="text-[10px] text-gray-500">kcal</Text>
          </Card>
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg font-bold text-primary-600">{Math.round(totalProt)}g</Text>
            <Text className="text-[10px] text-gray-500">Proteina</Text>
          </Card>
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg font-bold text-accent-600">{Math.round(totalCarb)}g</Text>
            <Text className="text-[10px] text-gray-500">Carbos</Text>
          </Card>
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg font-bold text-warning-600">{Math.round(totalFat)}g</Text>
            <Text className="text-[10px] text-gray-500">Gordura</Text>
          </Card>
        </View>

        {/* Adherence + water */}
        <View className="flex-row gap-4 mb-6">
          <Card variant="outlined" className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">Refeicoes</Text>
            <Text className="text-xl font-bold text-gray-900">
              {completedMeals}/{totalMeals}
            </Text>
            <View className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <View
                className="h-full bg-success-500 rounded-full"
                style={{ width: `${totalMeals ? (completedMeals / totalMeals) * 100 : 0}%` }}
              />
            </View>
          </Card>
          <Card variant="outlined" className="flex-1">
            <Text className="text-xs text-gray-500 mb-1">Agua</Text>
            <Text className="text-xl font-bold text-gray-900">
              {(totalWaterMl / 1000).toFixed(1)}L
            </Text>
            <View className="h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <View
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${Math.min((totalWaterMl / waterGoalMl) * 100, 100)}%` }}
              />
            </View>
          </Card>
        </View>

        {/* Water button */}
        <Pressable
          onPress={handleLogWater}
          className="bg-blue-50 rounded-xl py-3 items-center mb-6 active:bg-blue-100 flex-row justify-center gap-2"
        >
          <Text className="text-lg">💧</Text>
          <Text className="text-blue-700 font-semibold text-sm">+ 250ml de agua</Text>
        </Pressable>

        {/* Meals */}
        <Text className="text-lg font-bold text-gray-900 mb-3">Refeicoes do dia</Text>
        <View className="gap-3 mb-10">
          {meals.map((meal) => {
            const isLogged = loggedMealIds.has(meal.id);
            return (
              <Pressable
                key={meal.id}
                onPress={() => handleLogMeal(meal.id)}
                disabled={isLogged}
                className={`border rounded-2xl p-4 ${
                  isLogged ? "bg-success-500/5 border-success-500/30" : "bg-white border-gray-200 active:bg-gray-50"
                }`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-semibold text-gray-900">{meal.name}</Text>
                    {meal.target_time ? (
                      <Text className="text-xs text-gray-400">{meal.target_time.substring(0, 5)}</Text>
                    ) : null}
                  </View>
                  {isLogged ? (
                    <View className="bg-success-500 rounded-full w-6 h-6 items-center justify-center">
                      <Text className="text-white text-xs">✓</Text>
                    </View>
                  ) : (
                    <View className="border border-gray-300 rounded-full w-6 h-6" />
                  )}
                </View>
                {(meal.items ?? []).map((item) => (
                  <View key={item.id} className="flex-row justify-between py-1">
                    <Text className="text-sm text-gray-600 flex-1" numberOfLines={1}>
                      {item.food_name}
                    </Text>
                    <Text className="text-xs text-gray-400 ml-2">
                      {item.quantity}{item.unit} {item.calories ? `· ${Math.round(item.calories)}kcal` : ""}
                    </Text>
                  </View>
                ))}
                {meal.notes ? (
                  <Text className="text-xs text-gray-400 mt-1 italic">{meal.notes}</Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
