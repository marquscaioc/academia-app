import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useCreateDietPlan, useAddMeal, useAddMealItem } from "../../../hooks/mutations/useDietMutations";
import { Avatar } from "../../../components/ui/Avatar";

interface MealDraft {
  name: string;
  targetTime: string;
  items: MealItemDraft[];
}

interface MealItemDraft {
  food_name: string;
  quantity: string;
  unit: string;
  calories: string;
  protein_g: string;
  carbs_g: string;
  fat_g: string;
}

const emptyItem = (): MealItemDraft => ({
  food_name: "", quantity: "", unit: "g", calories: "", protein_g: "", carbs_g: "", fat_g: "",
});

type Step = "student" | "macros" | "meals" | "review";

export default function DietBuilderScreen() {
  const { user } = useAuth();
  const createPlan = useCreateDietPlan();
  const addMeal = useAddMeal();
  const addMealItem = useAddMealItem();

  const [step, setStep] = useState<Step>("student");
  const [studentId, setStudentId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [planName, setPlanName] = useState("");
  const [targetCal, setTargetCal] = useState("");
  const [targetProt, setTargetProt] = useState("");
  const [targetCarb, setTargetCarb] = useState("");
  const [targetFat, setTargetFat] = useState("");
  const [meals, setMeals] = useState<MealDraft[]>([
    { name: "Cafe da manha", targetTime: "07:00", items: [emptyItem()] },
    { name: "Almoco", targetTime: "12:00", items: [emptyItem()] },
    { name: "Lanche", targetTime: "16:00", items: [emptyItem()] },
    { name: "Jantar", targetTime: "20:00", items: [emptyItem()] },
  ]);
  const [saving, setSaving] = useState(false);
  const [editingMealIdx, setEditingMealIdx] = useState<number | null>(null);

  const { data: students } = useQuery({
    queryKey: ["trainer", "students", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_students")
        .select("*, student:profiles!student_id(id, full_name, avatar_url)")
        .eq("trainer_id", user!.id)
        .eq("status", "active");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addItemToMeal = (mealIdx: number) => {
    const updated = [...meals];
    updated[mealIdx].items.push(emptyItem());
    setMeals(updated);
  };

  const removeItem = (mealIdx: number, itemIdx: number) => {
    const updated = [...meals];
    updated[mealIdx].items = updated[mealIdx].items.filter((_, i) => i !== itemIdx);
    setMeals(updated);
  };

  const updateItem = (mealIdx: number, itemIdx: number, field: keyof MealItemDraft, value: string) => {
    const updated = [...meals];
    updated[mealIdx].items[itemIdx] = { ...updated[mealIdx].items[itemIdx], [field]: value };
    setMeals(updated);
  };

  const addNewMeal = () => {
    setMeals([...meals, { name: `Refeicao ${meals.length + 1}`, targetTime: "12:00", items: [emptyItem()] }]);
  };

  const removeMeal = (idx: number) => {
    setMeals(meals.filter((_, i) => i !== idx));
  };

  const totalMacros = meals.reduce(
    (acc, meal) => {
      for (const item of meal.items) {
        acc.cal += parseFloat(item.calories) || 0;
        acc.prot += parseFloat(item.protein_g) || 0;
        acc.carb += parseFloat(item.carbs_g) || 0;
        acc.fat += parseFloat(item.fat_g) || 0;
      }
      return acc;
    },
    { cal: 0, prot: 0, carb: 0, fat: 0 },
  );

  // Parse number with bounds validation (non-negative, undefined if invalid/empty)
  const parseNonNegative = (v: string, max = 10000): number | undefined => {
    const n = parseFloat(v);
    if (isNaN(n) || n < 0 || n > max) return undefined;
    return n;
  };

  const handleSave = async () => {
    if (!user || !studentId || !planName.trim()) return;
    setSaving(true);

    const plan = await createPlan.mutateAsync({
      trainer_id: user.id,
      student_id: studentId,
      name: planName.trim(),
      target_calories: parseNonNegative(targetCal, 20000),
      target_protein_g: parseNonNegative(targetProt, 1000),
      target_carbs_g: parseNonNegative(targetCarb, 1000),
      target_fat_g: parseNonNegative(targetFat, 1000),
    });

    for (let mi = 0; mi < meals.length; mi++) {
      const meal = meals[mi];
      const mealData = await addMeal.mutateAsync({
        diet_plan_id: plan.id,
        name: meal.name,
        sort_order: mi,
        target_time: meal.targetTime || undefined,
      });

      for (let ii = 0; ii < meal.items.length; ii++) {
        const item = meal.items[ii];
        if (!item.food_name.trim()) continue;
        await addMealItem.mutateAsync({
          meal_id: mealData.id,
          food_name: item.food_name.trim(),
          quantity: parseNonNegative(item.quantity, 10000),
          unit: item.unit || "g",
          calories: parseNonNegative(item.calories, 10000),
          protein_g: parseNonNegative(item.protein_g, 1000),
          carbs_g: parseNonNegative(item.carbs_g, 1000),
          fat_g: parseNonNegative(item.fat_g, 1000),
          sort_order: ii,
        });
      }
    }

    setSaving(false);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-surface-border">
        <Pressable onPress={() => router.back()}>
          <Text className="text-text-muted font-medium text-sm">← Cancelar</Text>
        </Pressable>
        <Text className="text-lg font-black text-text-primary">
          {step === "student" ? "Selecionar Aluno" : step === "macros" ? "Metas Nutricionais" : step === "meals" ? "Refeicoes" : "Revisar"}
        </Text>
        <View className="w-16" />
      </View>

      <View className="flex-row px-6 py-3 gap-2">
        {(["student", "macros", "meals", "review"] as Step[]).map((s, i) => (
          <View key={s} className={`flex-1 h-1 rounded-full ${
            (["student", "macros", "meals", "review"] as Step[]).indexOf(step) >= i ? "bg-violet-500" : "bg-surface-border"
          }`} />
        ))}
      </View>

      {/* Step: Student */}
      {step === "student" ? (
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-6 py-4 gap-2"
          ListEmptyComponent={<View className="items-center py-10"><Text className="text-text-muted text-sm">Nenhum aluno. Convide um primeiro.</Text></View>}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => { setStudentId(item.student?.id); setStudentName(item.student?.full_name ?? ""); setStep("macros"); }}
              className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-4 active:bg-surface-hover"
            >
              <Avatar uri={item.student?.avatar_url} name={item.student?.full_name} size="lg" />
              <Text className="text-sm font-bold text-text-primary flex-1">{item.student?.full_name}</Text>
              <Text className="text-violet-400 text-xs font-bold">Selecionar →</Text>
            </Pressable>
          )}
        />
      ) : null}

      {/* Step: Macros */}
      {step === "macros" ? (
        <ScrollView className="flex-1 px-6 py-6" keyboardShouldPersistTaps="handled">
          <View className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-3 mb-6">
            <Text className="text-sm text-text-muted">Aluno:</Text>
            <Text className="text-sm font-bold text-violet-400">{studentName}</Text>
          </View>

          <View className="gap-5">
            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Nome do plano *</Text>
              <TextInput className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary" placeholder="Ex: Cutting - Abril 2026" placeholderTextColor="#6E6580" value={planName} onChangeText={setPlanName} />
            </View>

            <Text className="text-xs font-bold text-text-muted tracking-wider uppercase">Metas diarias (opcional)</Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-[10px] text-text-muted mb-1 text-center">Calorias</Text>
                <TextInput className="bg-surface-card border border-surface-border rounded-xl px-3 py-3 text-sm text-text-primary text-center" placeholder="2000" placeholderTextColor="#6E6580" value={targetCal} onChangeText={setTargetCal} keyboardType="number-pad" />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] text-violet-400 mb-1 text-center">Prot (g)</Text>
                <TextInput className="bg-surface-card border border-surface-border rounded-xl px-3 py-3 text-sm text-text-primary text-center" placeholder="150" placeholderTextColor="#6E6580" value={targetProt} onChangeText={setTargetProt} keyboardType="decimal-pad" />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] text-fuchsia-400 mb-1 text-center">Carb (g)</Text>
                <TextInput className="bg-surface-card border border-surface-border rounded-xl px-3 py-3 text-sm text-text-primary text-center" placeholder="200" placeholderTextColor="#6E6580" value={targetCarb} onChangeText={setTargetCarb} keyboardType="decimal-pad" />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] text-warning-500 mb-1 text-center">Gord (g)</Text>
                <TextInput className="bg-surface-card border border-surface-border rounded-xl px-3 py-3 text-sm text-text-primary text-center" placeholder="60" placeholderTextColor="#6E6580" value={targetFat} onChangeText={setTargetFat} keyboardType="decimal-pad" />
              </View>
            </View>

            <Pressable
              onPress={() => planName.trim() && setStep("meals")}
              disabled={!planName.trim()}
              className={`rounded-2xl items-center mt-6 ${planName.trim() ? "bg-violet-500 active:bg-violet-600" : "bg-surface-border"}`}
              style={{ paddingVertical: 18 }}
            >
              <Text className={`font-black text-base tracking-wide uppercase ${planName.trim() ? "text-white" : "text-text-muted"}`}>Proximo: Refeicoes</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : null}

      {/* Step: Meals */}
      {step === "meals" ? (
        <ScrollView className="flex-1 px-6 py-4" keyboardShouldPersistTaps="handled">
          <View className="gap-4">
            {meals.map((meal, mi) => (
              <View key={mi} className="bg-surface-card border border-surface-border rounded-2xl p-4">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-2 flex-1">
                    <TextInput
                      className="text-base font-bold text-text-primary flex-1"
                      value={meal.name}
                      onChangeText={(v) => { const u = [...meals]; u[mi].name = v; setMeals(u); }}
                      placeholder="Nome da refeicao"
                      placeholderTextColor="#6E6580"
                    />
                    <TextInput
                      className="text-xs text-text-muted w-14 text-center bg-dark-300 rounded-lg py-1"
                      value={meal.targetTime}
                      onChangeText={(v) => { const u = [...meals]; u[mi].targetTime = v; setMeals(u); }}
                      placeholder="12:00"
                      placeholderTextColor="#6E6580"
                    />
                  </View>
                  <Pressable onPress={() => removeMeal(mi)} className="ml-2">
                    <Text className="text-danger-500 text-xs font-bold">✕</Text>
                  </Pressable>
                </View>

                {meal.items.map((item, ii) => (
                  <View key={ii} className="mb-3 bg-dark-300 rounded-xl p-3">
                    <View className="flex-row items-center gap-2 mb-2">
                      <TextInput
                        className="flex-1 text-sm text-text-primary bg-surface-elevated rounded-lg px-3 py-2"
                        value={item.food_name}
                        onChangeText={(v) => updateItem(mi, ii, "food_name", v)}
                        placeholder="Alimento (ex: Arroz integral)"
                        placeholderTextColor="#6E6580"
                      />
                      <Pressable onPress={() => removeItem(mi, ii)}>
                        <Text className="text-danger-500 text-xs">✕</Text>
                      </Pressable>
                    </View>
                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <Text className="text-[8px] text-text-muted mb-0.5 text-center">Qtd</Text>
                        <TextInput className="bg-surface-elevated rounded-lg px-2 py-1.5 text-xs text-text-primary text-center" value={item.quantity} onChangeText={(v) => updateItem(mi, ii, "quantity", v)} placeholder="100" placeholderTextColor="#6E6580" keyboardType="decimal-pad" />
                      </View>
                      <View className="w-12">
                        <Text className="text-[8px] text-text-muted mb-0.5 text-center">Un.</Text>
                        <TextInput className="bg-surface-elevated rounded-lg px-2 py-1.5 text-xs text-text-primary text-center" value={item.unit} onChangeText={(v) => updateItem(mi, ii, "unit", v)} placeholder="g" placeholderTextColor="#6E6580" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[8px] text-text-muted mb-0.5 text-center">kcal</Text>
                        <TextInput className="bg-surface-elevated rounded-lg px-2 py-1.5 text-xs text-text-primary text-center" value={item.calories} onChangeText={(v) => updateItem(mi, ii, "calories", v)} placeholder="0" placeholderTextColor="#6E6580" keyboardType="decimal-pad" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[8px] text-violet-400 mb-0.5 text-center">P</Text>
                        <TextInput className="bg-surface-elevated rounded-lg px-2 py-1.5 text-xs text-text-primary text-center" value={item.protein_g} onChangeText={(v) => updateItem(mi, ii, "protein_g", v)} placeholder="0" placeholderTextColor="#6E6580" keyboardType="decimal-pad" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[8px] text-fuchsia-400 mb-0.5 text-center">C</Text>
                        <TextInput className="bg-surface-elevated rounded-lg px-2 py-1.5 text-xs text-text-primary text-center" value={item.carbs_g} onChangeText={(v) => updateItem(mi, ii, "carbs_g", v)} placeholder="0" placeholderTextColor="#6E6580" keyboardType="decimal-pad" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[8px] text-warning-500 mb-0.5 text-center">G</Text>
                        <TextInput className="bg-surface-elevated rounded-lg px-2 py-1.5 text-xs text-text-primary text-center" value={item.fat_g} onChangeText={(v) => updateItem(mi, ii, "fat_g", v)} placeholder="0" placeholderTextColor="#6E6580" keyboardType="decimal-pad" />
                      </View>
                    </View>
                  </View>
                ))}

                <Pressable onPress={() => addItemToMeal(mi)} className="border border-dashed border-surface-border rounded-xl py-2.5 items-center">
                  <Text className="text-text-muted text-xs font-bold">+ Adicionar alimento</Text>
                </Pressable>
              </View>
            ))}

            <Pressable onPress={addNewMeal} className="border border-dashed border-violet-500/30 rounded-2xl py-4 items-center">
              <Text className="text-violet-400 font-bold text-sm">+ Nova refeicao</Text>
            </Pressable>

            {/* Macro totals bar */}
            <View className="bg-surface-elevated rounded-2xl p-4 flex-row justify-around">
              <View className="items-center"><Text className="text-lg font-black text-text-primary">{Math.round(totalMacros.cal)}</Text><Text className="text-[9px] text-text-muted">kcal</Text></View>
              <View className="items-center"><Text className="text-lg font-black text-violet-400">{Math.round(totalMacros.prot)}g</Text><Text className="text-[9px] text-text-muted">Prot</Text></View>
              <View className="items-center"><Text className="text-lg font-black text-fuchsia-400">{Math.round(totalMacros.carb)}g</Text><Text className="text-[9px] text-text-muted">Carb</Text></View>
              <View className="items-center"><Text className="text-lg font-black text-warning-500">{Math.round(totalMacros.fat)}g</Text><Text className="text-[9px] text-text-muted">Gord</Text></View>
            </View>

            <Pressable
              onPress={() => setStep("review")}
              className="bg-violet-500 rounded-2xl items-center active:bg-violet-600 mb-6"
              style={{ paddingVertical: 18 }}
            >
              <Text className="text-white font-black text-base tracking-wide uppercase">Revisar Plano</Text>
            </Pressable>
          </View>
        </ScrollView>
      ) : null}

      {/* Step: Review */}
      {step === "review" ? (
        <ScrollView className="flex-1 px-6 py-6">
          <View className="bg-surface-card border border-violet-500/20 rounded-2xl p-5 mb-4">
            <Text className="text-xs text-violet-400 font-bold uppercase tracking-wider mb-2">Plano Alimentar</Text>
            <Text className="text-xl font-black text-text-primary">{planName}</Text>
            <Text className="text-xs text-text-muted mt-1">Para: {studentName}</Text>
          </View>

          {targetCal ? (
            <View className="bg-surface-elevated rounded-2xl p-4 flex-row justify-around mb-4">
              <View className="items-center"><Text className="text-sm font-black text-text-primary">{targetCal}</Text><Text className="text-[9px] text-text-muted">Meta kcal</Text></View>
              {targetProt ? <View className="items-center"><Text className="text-sm font-black text-violet-400">{targetProt}g</Text><Text className="text-[9px] text-text-muted">Prot</Text></View> : null}
              {targetCarb ? <View className="items-center"><Text className="text-sm font-black text-fuchsia-400">{targetCarb}g</Text><Text className="text-[9px] text-text-muted">Carb</Text></View> : null}
              {targetFat ? <View className="items-center"><Text className="text-sm font-black text-warning-500">{targetFat}g</Text><Text className="text-[9px] text-text-muted">Gord</Text></View> : null}
            </View>
          ) : null}

          {meals.map((meal, mi) => (
            <View key={mi} className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-bold text-text-primary">{meal.name}</Text>
                <Text className="text-xs text-text-muted">{meal.targetTime}</Text>
              </View>
              {meal.items.filter((i) => i.food_name.trim()).map((item, ii) => (
                <View key={ii} className="flex-row justify-between py-1.5 border-b border-surface-border last:border-0">
                  <Text className="text-xs text-text-secondary flex-1">{item.food_name}</Text>
                  <Text className="text-xs text-text-muted">{item.quantity}{item.unit} · {item.calories || 0}kcal</Text>
                </View>
              ))}
            </View>
          ))}

          <View className="flex-row gap-3 mt-4 mb-10">
            <Pressable onPress={() => setStep("meals")} className="flex-1 border border-surface-border rounded-2xl py-4 items-center">
              <Text className="text-text-secondary font-bold text-sm">Editar</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={saving}
              className={`flex-1 rounded-2xl py-4 items-center ${saving ? "bg-violet-700" : "bg-violet-500 active:bg-violet-600"}`}
            >
              {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text className="text-white font-black text-sm uppercase">Salvar Plano</Text>}
            </Pressable>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
