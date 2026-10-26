import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "../../../lib/auth/provider";
import { useDietPlans, useMealLogs, useWaterLogs, useFoodLogs } from "../../../hooks/queries/useDiet";
import { useLogMeal, useLogWater, useLogFood, useDeleteFoodLog } from "../../../hooks/mutations/useDietMutations";
import { AppIcon } from "../../../components/ui";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { DisplayHeading } from "../../../components/ui/DisplayHeading";
import { SectionLabel } from "../../../components/ui/SectionLabel";
import { SubstitutionSheet } from "../../../components/diet/SubstitutionSheet";
import { WebContainer } from "../../../components/layout/WebContainer";
import { TACO_FOODS, TacoFood } from "../../../lib/data/taco";
import { font } from "../../../lib/design/tokens";

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function DietScreen() {
  const { user, profile } = useAuth();
  const today = getTodayDate();
  const { data: plans, isLoading: plansLoading, isError: plansError, refetch: plansRefetch } = useDietPlans(user?.id);
  const { data: mealLogs, isLoading: mealLogsLoading, isError: mealLogsError } = useMealLogs(user?.id, today);
  const { data: waterLogs } = useWaterLogs(user?.id, today);
  const logMeal = useLogMeal();
  const logWater = useLogWater();
  const { data: foodLogs, isLoading: foodLogsLoading, isError: foodLogsError } = useFoodLogs(user?.id, today);
  const logFood = useLogFood();
  const deleteFoodLog = useDeleteFoodLog();

  const [subSheet, setSubSheet] = useState<{ itemId: string; name: string; cal?: number; prot?: number } | null>(null);
  const [showAddFood, setShowAddFood] = useState(false);
  const [fName, setFName] = useState("");
  const [fCal, setFCal] = useState("");
  const [fProt, setFProt] = useState("");
  const [fCarb, setFCarb] = useState("");
  const [fFat, setFFat] = useState("");
  const [selectedFood, setSelectedFood] = useState<TacoFood | null>(null);
  const [grams, setGrams] = useState("");

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
    setSelectedFood(null); setGrams("");
  };
  const applyFood = (food: TacoFood, gramsStr: string) => {
    const g = parseFloat(gramsStr.replace(",", ".")) || 0;
    const k = g / 100;
    setFCal(g ? String(Math.round(food.kcal * k)) : "");
    setFProt(g ? String(Math.round(food.protein * k * 10) / 10) : "");
    setFCarb(g ? String(Math.round(food.carbs * k * 10) / 10) : "");
    setFFat(g ? String(Math.round(food.fat * k * 10) / 10) : "");
  };
  const selectTacoFood = (food: TacoFood) => {
    setSelectedFood(food);
    setFName(food.name);
    setGrams("100");
    applyFood(food, "100");
  };
  const onGramsChange = (v: string) => {
    setGrams(v);
    if (selectedFood) applyFood(selectedFood, v);
  };
  const handleAddFood = () => {
    if (!user || !fName.trim()) return;
    const n = (v: string) => (v ? parseFloat(v.replace(",", ".")) : undefined);
    logFood.mutate(
      { user_id: user.id, food_name: fName.trim(), calories: n(fCal), protein_g: n(fProt), carbs_g: n(fCarb), fat_g: n(fFat) },
      { onSuccess: resetFood },
    );
  };

  // ─── META (goal) ────────────────────────────────────────────────────────────
  // Use the plan's explicit target_* fields when available, otherwise fall back
  // to summing all planned meal items.
  let planItemCal = 0, planItemProt = 0, planItemCarb = 0, planItemFat = 0;
  for (const meal of meals) {
    for (const item of meal.items ?? []) {
      planItemCal += item.calories ?? 0;
      planItemProt += item.protein_g ?? 0;
      planItemCarb += item.carbs_g ?? 0;
      planItemFat += item.fat_g ?? 0;
    }
  }
  const metaCal  = activePlan?.target_calories  ?? planItemCal;
  const metaProt = activePlan?.target_protein_g ?? planItemProt;
  const metaCarb = activePlan?.target_carbs_g   ?? planItemCarb;
  const metaFat  = activePlan?.target_fat_g     ?? planItemFat;

  // ─── CONSUMIDO (consumed today) ─────────────────────────────────────────────
  // = macros of plan meals that the student LOGGED today + free-form food_logs
  let loggedMealCal = 0, loggedMealProt = 0, loggedMealCarb = 0, loggedMealFat = 0;
  for (const meal of meals) {
    if (!loggedMealIds.has(meal.id)) continue;
    for (const item of meal.items ?? []) {
      loggedMealCal  += item.calories   ?? 0;
      loggedMealProt += item.protein_g  ?? 0;
      loggedMealCarb += item.carbs_g    ?? 0;
      loggedMealFat  += item.fat_g      ?? 0;
    }
  }
  const extraCal  = (foodLogs ?? []).reduce((s, f) => s + (f.calories   ?? 0), 0);
  const extraProt = (foodLogs ?? []).reduce((s, f) => s + (f.protein_g  ?? 0), 0);
  const extraCarb = (foodLogs ?? []).reduce((s, f) => s + (f.carbs_g    ?? 0), 0);
  const extraFat  = (foodLogs ?? []).reduce((s, f) => s + (f.fat_g      ?? 0), 0);

  const consumedCal  = loggedMealCal  + extraCal;
  const consumedProt = loggedMealProt + extraProt;
  const consumedCarb = loggedMealCarb + extraCarb;
  const consumedFat  = loggedMealFat  + extraFat;

  // Keep totalCal etc. for the existing summary cards (plan total, unchanged)
  const totalCal  = planItemCal;
  const totalProt = planItemProt;
  const totalCarb = planItemCarb;
  const totalFat  = planItemFat;

  const tacoMatches =
    showAddFood && fName.trim().length >= 2 && (!selectedFood || selectedFood.name !== fName)
      ? TACO_FOODS.filter((f) => f.name.toLowerCase().includes(fName.toLowerCase())).slice(0, 6)
      : [];

  const isLoading = plansLoading || mealLogsLoading || foodLogsLoading;
  const isError   = plansError   || mealLogsError   || foodLogsError;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center">
        <ActivityIndicator size="large" color="#9B40D8" />
        <Text className="text-text-muted text-sm mt-3" style={{ fontFamily: font.regular }}>Carregando dieta…</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center px-8">
        <AppIcon name="warning" size={32} color="#FB7185" strokeWidth={1.5} />
        <Text className="text-text-primary text-base mt-3 mb-1 text-center" style={{ fontFamily: font.semibold }}>
          Erro ao carregar dieta
        </Text>
        <Text className="text-text-muted text-sm text-center mb-5" style={{ fontFamily: font.regular }}>
          Verifique sua conexão e tente novamente.
        </Text>
        <Pressable
          onPress={() => plansRefetch()}
          className="bg-violet-500/15 border border-violet-500/30 rounded-2xl px-6 py-3"
        >
          <Text className="text-violet-400 text-sm" style={{ fontFamily: font.semibold }}>Tentar novamente</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!activePlan) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400">
        <WebContainer maxWidth={1180}>
          <View className="px-6 pt-6">
            <DisplayHeading size="md" className="mb-6">Dieta.</DisplayHeading>
          </View>
          <EmptyState
            iconName="diet"
            title="Nenhum plano alimentar"
            description="Seu nutricionista ou personal ainda nao atribuiu um plano alimentar."
          />
        </WebContainer>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <WebContainer maxWidth={1180}>
        <DisplayHeading size="md" className="mb-1">Dieta.</DisplayHeading>
        <Text className="text-sm text-text-secondary mb-6" style={{ fontFamily: font.regular }}>{activePlan.name}</Text>

        {/* Macro summary — plan totals (quick reference chips) */}
        <SectionLabel className="mb-2.5">Macros do plano</SectionLabel>
        <View className="flex-row gap-2 mb-4">
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg text-text-primary" style={{ fontFamily: font.bold }}>{Math.round(totalCal)}</Text>
            <Text className="text-[10px] uppercase text-text-muted mt-0.5" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>kcal</Text>
          </Card>
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg text-violet-400" style={{ fontFamily: font.bold }}>{Math.round(totalProt)}g</Text>
            <Text className="text-[10px] uppercase text-text-muted mt-0.5" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>Proteina</Text>
          </Card>
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg text-ice-400" style={{ fontFamily: font.bold }}>{Math.round(totalCarb)}g</Text>
            <Text className="text-[10px] uppercase text-text-muted mt-0.5" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>Carbos</Text>
          </Card>
          <Card className="flex-1 items-center py-3 px-2">
            <Text className="text-lg text-warning-500" style={{ fontFamily: font.bold }}>{Math.round(totalFat)}g</Text>
            <Text className="text-[10px] uppercase text-text-muted mt-0.5" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>Gordura</Text>
          </Card>
        </View>

        {/* Consumido vs meta — progress bars */}
        <SectionLabel className="mb-2.5">Consumido hoje</SectionLabel>
        <Card variant="outlined" className="mb-6 gap-3 py-4">
          {[
            { label: "Calorias", consumed: consumedCal,  goal: metaCal,  unit: "kcal", color: "#9B40D8", textColor: "text-violet-400" },
            { label: "Proteina", consumed: consumedProt, goal: metaProt, unit: "g",    color: "#A78BFA", textColor: "text-violet-300" },
            { label: "Carbos",   consumed: consumedCarb, goal: metaCarb, unit: "g",    color: "#67E8F9", textColor: "text-cyan-300"   },
            { label: "Gordura",  consumed: consumedFat,  goal: metaFat,  unit: "g",    color: "#FCD34D", textColor: "text-warning-400"},
          ].map(({ label, consumed, goal, unit, color, textColor }) => {
            const pct = goal > 0 ? Math.min((consumed / goal) * 100, 100) : 0;
            return (
              <View key={label}>
                <View className="flex-row justify-between items-baseline mb-1">
                  <Text className="text-xs text-text-muted" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>{label}</Text>
                  <Text className={`text-xs ${textColor}`} style={{ fontFamily: font.semibold }}>
                    {Math.round(consumed)}{unit !== "kcal" ? "g" : ""} / {Math.round(goal)}{unit !== "kcal" ? "g" : ""} {unit === "kcal" ? "kcal" : ""}
                  </Text>
                </View>
                <View className="h-2 bg-surface-border rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </View>
              </View>
            );
          })}
        </Card>

        {/* Adherence + water */}
        <View className="flex-row gap-4 mb-6">
          <Card variant="outlined" className="flex-1">
            <SectionLabel className="mb-1.5">Refeicoes</SectionLabel>
            <Text className="text-xl text-text-primary" style={{ fontFamily: font.bold }}>
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
            <SectionLabel className="mb-1.5">Agua</SectionLabel>
            <Text className="text-xl text-text-primary" style={{ fontFamily: font.bold }}>
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
          className="bg-blue-500/10 rounded-2xl py-3.5 items-center mb-6 active:bg-blue-500/20 flex-row justify-center gap-2"
        >
          <AppIcon name="water" size={18} color="#60A5FA" strokeWidth={2} />
          <Text className="text-blue-400 text-sm" style={{ fontFamily: font.semibold }}>+ 250ml de agua</Text>
        </Pressable>

        {/* Recipes link */}
        <Pressable
          onPress={() => router.push("/(student)/(diet)/recipes" as never)}
          className="bg-violet-500/10 border border-violet-500/20 rounded-2xl py-3.5 items-center mb-6 active:bg-violet-500/20 flex-row justify-center gap-2"
        >
          <AppIcon name="food" size={18} color="#9B40D8" strokeWidth={2} />
          <Text className="text-violet-400 text-sm" style={{ fontFamily: font.semibold }}>Receitas Fitness</Text>
          <View className="flex-1" />
          <AppIcon name="chevron-right" size={18} color="#9B40D8" strokeWidth={2} />
        </Pressable>

        {/* Meals */}
        <DisplayHeading size="sm" className="mb-3">Refeicoes do dia</DisplayHeading>
        <View className="flex-row flex-wrap gap-3 mb-10">
          {meals.map((meal) => {
            const isLogged = loggedMealIds.has(meal.id);
            return (
              <Pressable
                key={meal.id}
                onPress={() => handleLogMeal(meal.id)}
                disabled={isLogged}
                className={`grow basis-[360px] border rounded-3xl p-4 ${
                  isLogged ? "bg-success-500/5 border-success-500/30" : "bg-surface-card border-surface-border active:bg-surface-hover"
                }`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-base text-text-primary" style={{ fontFamily: font.semibold }}>{meal.name}</Text>
                    {meal.target_time ? (
                      <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>{meal.target_time.substring(0, 5)}</Text>
                    ) : null}
                  </View>
                  {isLogged ? (
                    <View className="bg-success-500 rounded-full w-6 h-6 items-center justify-center">
                      <AppIcon name="check" size={14} color="#FFFFFF" strokeWidth={2.5} />
                    </View>
                  ) : (
                    <View className="border border-surface-border rounded-full w-6 h-6" />
                  )}
                </View>
                {(meal.items ?? []).map((item) => (
                  <View key={item.id} className="flex-row justify-between items-center py-1">
                    <Text className="text-sm text-text-secondary flex-1" numberOfLines={1} style={{ fontFamily: font.regular }}>
                      {item.food_name}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                        {item.quantity}{item.unit} {item.calories ? `· ${Math.round(item.calories)}kcal` : ""}
                      </Text>
                      <Pressable
                        onPress={() => setSubSheet({ itemId: item.id, name: item.food_name, cal: item.calories ?? undefined, prot: item.protein_g ?? undefined })}
                      >
                        <Text className="text-[10px] text-violet-400" style={{ fontFamily: font.bold }}>Trocar</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
                {meal.notes ? (
                  <Text className="text-xs text-text-muted mt-1" style={{ fontFamily: font.regular }}>{meal.notes}</Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {/* Registro livre (alimentos fora do plano) */}
        <View className="mb-10">
          <View className="flex-row items-center justify-between mb-3">
            <DisplayHeading size="sm">Registro livre</DisplayHeading>
            <Pressable onPress={() => setShowAddFood(true)} className="bg-violet-500/10 px-3 py-1.5 rounded-full flex-row items-center gap-1">
              <AppIcon name="plus" size={14} color="#9B40D8" strokeWidth={2.5} />
              <Text className="text-violet-400 text-xs" style={{ fontFamily: font.bold }}>Alimento</Text>
            </Pressable>
          </View>
          {!foodLogs?.length ? (
            <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Logue alimentos que comeu fora do plano.</Text>
          ) : (
            <View className="gap-2">
              {foodLogs.map((f) => (
                <View key={f.id} className="bg-surface-card border border-surface-border rounded-2xl p-3 flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                    <AppIcon name="apple" size={18} color="#9B40D8" strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{f.food_name}</Text>
                    <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.regular }}>
                      {f.calories ? `${Math.round(f.calories)} kcal` : ""}{f.protein_g ? ` · ${Math.round(f.protein_g)}g P` : ""}
                    </Text>
                  </View>
                  <Pressable onPress={() => deleteFoodLog.mutate(f.id)} className="w-9 h-9 rounded-xl items-center justify-center active:bg-danger-500/10">
                    <AppIcon name="trash" size={18} color="#FB7185" strokeWidth={2} />
                  </Pressable>
                </View>
              ))}
              <Text className="text-[10px] text-text-muted mt-1" style={{ fontFamily: font.regular }}>
                Extra hoje: {Math.round(extraCal)} kcal · {Math.round(extraProt)}g proteína
              </Text>
            </View>
          )}
        </View>
        {/* Data-source attribution footer */}
        <Pressable
          onPress={() => router.push("/sobre-dados" as never)}
          className="flex-row items-center justify-center gap-1.5 py-3 mb-6"
        >
          <AppIcon name="info" size={13} color="#6E6382" strokeWidth={2} />
          <Text className="text-[11px] text-text-muted" style={{ fontFamily: font.regular }}>
            Dados: TACO (NEPA/UNICAMP) · Open Food Facts (ODbL)
          </Text>
        </Pressable>
        </WebContainer>
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
            <DisplayHeading size="sm" className="mb-4">Registrar alimento</DisplayHeading>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary mb-2"
              placeholder="Buscar alimento (TACO) ou digitar"
              placeholderTextColor="#6E6382"
              style={{ fontFamily: font.regular }}
              value={fName}
              onChangeText={(v) => { setFName(v); if (selectedFood && v !== selectedFood.name) setSelectedFood(null); }}
            />
            {tacoMatches.length > 0 ? (
              <View className="bg-surface-card border border-surface-border rounded-2xl mb-2 overflow-hidden">
                {tacoMatches.map((f) => (
                  <Pressable key={f.name} onPress={() => selectTacoFood(f)} className="px-4 py-2.5 border-b border-surface-border active:bg-surface-hover">
                    <Text className="text-sm text-text-primary" style={{ fontFamily: font.medium }}>{f.name}</Text>
                    <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.regular }}>{f.kcal} kcal · {f.protein}P · {f.carbs}C · {f.fat}G /100g</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
            {selectedFood ? (
              <View className="mb-2">
                <SectionLabel className="mb-1.5">Quantidade (g)</SectionLabel>
                <TextInput
                  className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                  placeholder="100"
                  placeholderTextColor="#6E6382"
                  style={{ fontFamily: font.regular }}
                  keyboardType="numeric"
                  value={grams}
                  onChangeText={onGramsChange}
                />
              </View>
            ) : null}
            <View className="flex-row gap-2 mb-2">
              <TextInput className="flex-1 bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary" placeholder="Kcal" placeholderTextColor="#6E6382" style={{ fontFamily: font.regular }} keyboardType="numeric" value={fCal} onChangeText={setFCal} />
              <TextInput className="flex-1 bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary" placeholder="Prot (g)" placeholderTextColor="#6E6382" style={{ fontFamily: font.regular }} keyboardType="numeric" value={fProt} onChangeText={setFProt} />
            </View>
            <View className="flex-row gap-2 mb-4">
              <TextInput className="flex-1 bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary" placeholder="Carb (g)" placeholderTextColor="#6E6382" style={{ fontFamily: font.regular }} keyboardType="numeric" value={fCarb} onChangeText={setFCarb} />
              <TextInput className="flex-1 bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary" placeholder="Gord (g)" placeholderTextColor="#6E6382" style={{ fontFamily: font.regular }} keyboardType="numeric" value={fFat} onChangeText={setFFat} />
            </View>
            <Pressable onPress={handleAddFood} disabled={!fName.trim() || logFood.isPending} className={`rounded-2xl py-4 items-center ${fName.trim() ? "bg-violet-500" : "bg-surface-border"}`}>
              <Text className={fName.trim() ? "text-white" : "text-text-muted"} style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>{logFood.isPending ? "Salvando..." : "Registrar"}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
