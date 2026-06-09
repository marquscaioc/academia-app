import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "../../../lib/auth/provider";
import { useDietPlans, useMealLogs, useWaterLogs, useFoodLogs } from "../../../hooks/queries/useDiet";
import { useLogMeal, useLogWater, useLogFood, useDeleteFoodLog } from "../../../hooks/mutations/useDietMutations";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { SubstitutionSheet } from "../../../components/diet/SubstitutionSheet";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function DietScreen() {
  const { user, profile } = useAuth();
  const today = getTodayDate();
  const { data: plans } = useDietPlans(user?.id);
  const { data: mealLogs } = useMealLogs(user?.id, today);
  const { data: waterLogs } = useWaterLogs(user?.id, today);
  const logMeal = useLogMeal();
  const logWater = useLogWater();
  const { data: foodLogs } = useFoodLogs(user?.id, today);
  const logFood = useLogFood();
  const deleteFoodLog = useDeleteFoodLog();

  const [subSheet, setSubSheet] = useState<{ itemId: string; name: string; cal?: number; prot?: number } | null>(null);
  const [showAddFood, setShowAddFood] = useState(false);
  const [fName, setFName] = useState("");
  const [fCal, setFCal] = useState("");
  const [fProt, setFProt] = useState("");
  const [fCarb, setFCarb] = useState("");
  const [fFat, setFFat] = useState("");

  const activePlan = plans?.[0];
  const meals = activePlan?.meals ?? [];
  const loggedMealIds = new Set(mealLogs?.map((l) => l.meal_id) ?? []);
  const totalWaterMl = waterLogs?.reduce((sum, l) => sum + l.amount_ml, 0) ?? 0;
  const waterGoalMl = profile?.water_goal_ml ?? 2500;

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

  const resetFood = () => {
    setShowAddFood(false);
    setFName(""); setFCal(""); setFProt(""); setFCarb(""); setFFat("");
  };
  const handleAddFood = () => {
    if (!user || !fName.trim()) return;
    const n = (v: string) => (v ? parseFloat(v.replace(",", ".")) : undefined);
    logFood.mutate(
      { user_id: user.id, food_name: fName.trim(), calories: n(fCal), protein_g: n(fProt), carbs_g: n(fCarb), fat_g: n(fFat) },
      { onSuccess: resetFood },
    );
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

  const extraCal = (foodLogs ?? []).reduce((s, f) => s + (f.calories ?? 0), 0);
  const extraProt = (foodLogs ?? []).reduce((s, f) => s + (f.protein_g ?? 0), 0);

  if (!activePlan) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400">
        <View className="px-6 pt-6">
          <Text className="text-2xl font-black text-text-primary mb-6">Dieta</Text>
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
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-black text-text-primary mb-1">Dieta</Text>
        <Text className="text-sm text-text-muted mb-6">{activePlan.name}</Text>

        {/* Macro summary */}
        <View className="flex-row gap-2 mb-6">
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg font-bold text-text-primary">{Math.round(totalCal)}</Text>
            <Text className="text-[10px] text-text-muted">kcal</Text>
          </Card>
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg font-bold text-violet-400">{Math.round(totalProt)}g</Text>
            <Text className="text-[10px] text-text-muted">Proteina</Text>
          </Card>
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg font-bold text-ice-400">{Math.round(totalCarb)}g</Text>
            <Text className="text-[10px] text-text-muted">Carbos</Text>
          </Card>
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg font-bold text-warning-500">{Math.round(totalFat)}g</Text>
            <Text className="text-[10px] text-text-muted">Gordura</Text>
          </Card>
        </View>

        {/* Adherence + water */}
        <View className="flex-row gap-4 mb-6">
          <Card variant="outlined" className="flex-1">
            <Text className="text-xs text-text-muted mb-1">Refeicoes</Text>
            <Text className="text-xl font-bold text-text-primary">
              {completedMeals}/{totalMeals}
            </Text>
            <View className="h-1.5 bg-surface-border rounded-full mt-2 overflow-hidden">
              <View
                className="h-full bg-success-500 rounded-full"
                style={{ width: `${totalMeals ? (completedMeals / totalMeals) * 100 : 0}%` }}
              />
            </View>
          </Card>
          <Card variant="outlined" className="flex-1">
            <Text className="text-xs text-text-muted mb-1">Agua</Text>
            <Text className="text-xl font-bold text-text-primary">
              {(totalWaterMl / 1000).toFixed(1)}L
            </Text>
            <View className="h-1.5 bg-surface-border rounded-full mt-2 overflow-hidden">
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
          className="bg-blue-500/10 rounded-xl py-3 items-center mb-6 active:bg-blue-500/20 flex-row justify-center gap-2"
        >
          <Text className="text-lg">💧</Text>
          <Text className="text-blue-400 font-semibold text-sm">+ 250ml de agua</Text>
        </Pressable>

        {/* Recipes link */}
        <Pressable
          onPress={() => router.push("/(student)/(diet)/recipes" as never)}
          className="bg-violet-500/10 border border-violet-500/20 rounded-xl py-3 items-center mb-6 active:bg-violet-500/20 flex-row justify-center gap-2"
        >
          <Text className="text-lg">🍽️</Text>
          <Text className="text-violet-400 font-semibold text-sm">Receitas Fitness</Text>
        </Pressable>

        {/* Meals */}
        <Text className="text-lg font-bold text-text-primary mb-3">Refeicoes do dia</Text>
        <View className="gap-3 mb-10">
          {meals.map((meal) => {
            const isLogged = loggedMealIds.has(meal.id);
            return (
              <Pressable
                key={meal.id}
                onPress={() => handleLogMeal(meal.id)}
                disabled={isLogged}
                className={`border rounded-2xl p-4 ${
                  isLogged ? "bg-success-500/5 border-success-500/30" : "bg-surface-card border-surface-border active:bg-surface-hover"
                }`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base font-semibold text-text-primary">{meal.name}</Text>
                    {meal.target_time ? (
                      <Text className="text-xs text-text-muted">{meal.target_time.substring(0, 5)}</Text>
                    ) : null}
                  </View>
                  {isLogged ? (
                    <View className="bg-success-500 rounded-full w-6 h-6 items-center justify-center">
                      <Text className="text-white text-xs">✓</Text>
                    </View>
                  ) : (
                    <View className="border border-surface-border rounded-full w-6 h-6" />
                  )}
                </View>
                {(meal.items ?? []).map((item) => (
                  <View key={item.id} className="flex-row justify-between items-center py-1">
                    <Text className="text-sm text-text-secondary flex-1" numberOfLines={1}>
                      {item.food_name}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs text-text-muted">
                        {item.quantity}{item.unit} {item.calories ? `· ${Math.round(item.calories)}kcal` : ""}
                      </Text>
                      <Pressable
                        onPress={() => setSubSheet({ itemId: item.id, name: item.food_name, cal: item.calories ?? undefined, prot: item.protein_g ?? undefined })}
                      >
                        <Text className="text-[10px] text-violet-400 font-bold">Trocar</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
                {meal.notes ? (
                  <Text className="text-xs text-text-muted mt-1 italic">{meal.notes}</Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* Registro livre (alimentos fora do plano) */}
        <View className="mb-10">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-text-primary">Registro livre</Text>
            <Pressable onPress={() => setShowAddFood(true)} className="bg-violet-500/10 px-3 py-1.5 rounded-lg">
              <Text className="text-violet-400 font-bold text-xs">+ Alimento</Text>
            </Pressable>
          </View>
          {!foodLogs?.length ? (
            <Text className="text-xs text-text-muted">Logue alimentos que comeu fora do plano.</Text>
          ) : (
            <View className="gap-2">
              {foodLogs.map((f) => (
                <View key={f.id} className="bg-surface-card border border-surface-border rounded-xl p-3 flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-text-primary">{f.food_name}</Text>
                    <Text className="text-[10px] text-text-muted">
                      {f.calories ? `${Math.round(f.calories)} kcal` : ""}{f.protein_g ? ` · ${Math.round(f.protein_g)}g P` : ""}
                    </Text>
                  </View>
                  <Pressable onPress={() => deleteFoodLog.mutate(f.id)}>
                    <Text className="text-danger-500 text-xs font-bold">Remover</Text>
                  </Pressable>
                </View>
              ))}
              <Text className="text-[10px] text-text-muted mt-1">
                Extra hoje: {Math.round(extraCal)} kcal · {Math.round(extraProt)}g proteína
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <SubstitutionSheet
        visible={!!subSheet}
        mealItemId={subSheet?.itemId ?? null}
        originalName={subSheet?.name ?? ""}
        originalCalories={subSheet?.cal ?? undefined}
        originalProtein={subSheet?.prot ?? undefined}
        onSelect={(_subId, _foodName) => {
          setSubSheet(null);
        }}
        onClose={() => setSubSheet(null)}
      />

      <Modal visible={showAddFood} animationType="slide" transparent>
        <View className="flex-1 justify-end">
          <Pressable className="flex-1" onPress={resetFood} />
          <View className="bg-dark-200 border-t border-surface-border rounded-t-3xl px-6 pt-6 pb-10">
            <Text className="text-lg font-black text-text-primary mb-4">Registrar alimento</Text>
            <TextInput className="bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary mb-2" placeholder="Alimento" placeholderTextColor="#6E6580" value={fName} onChangeText={setFName} />
            <View className="flex-row gap-2 mb-2">
              <TextInput className="flex-1 bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary" placeholder="Kcal" placeholderTextColor="#6E6580" keyboardType="numeric" value={fCal} onChangeText={setFCal} />
              <TextInput className="flex-1 bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary" placeholder="Prot (g)" placeholderTextColor="#6E6580" keyboardType="numeric" value={fProt} onChangeText={setFProt} />
            </View>
            <View className="flex-row gap-2 mb-4">
              <TextInput className="flex-1 bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary" placeholder="Carb (g)" placeholderTextColor="#6E6580" keyboardType="numeric" value={fCarb} onChangeText={setFCarb} />
              <TextInput className="flex-1 bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary" placeholder="Gord (g)" placeholderTextColor="#6E6580" keyboardType="numeric" value={fFat} onChangeText={setFFat} />
            </View>
            <Pressable onPress={handleAddFood} disabled={!fName.trim() || logFood.isPending} className={`rounded-2xl py-4 items-center ${fName.trim() ? "bg-violet-500" : "bg-surface-border"}`}>
              <Text className={`font-black ${fName.trim() ? "text-white" : "text-text-muted"}`}>{logFood.isPending ? "Salvando..." : "Registrar"}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
