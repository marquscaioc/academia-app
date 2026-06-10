import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../../lib/auth/provider";
import { useCreateRecipe } from "../../../hooks/mutations/useRecipeMutations";
import type { CreateRecipeIngredientInput } from "../../../hooks/mutations/useRecipeMutations";
import { FoodPicker } from "../../../components/diet/FoodPicker";
import type { FoodPick } from "../../../components/diet/FoodPicker";
import { WebContainer } from "../../../components/layout/WebContainer";
import { AppIcon } from "../../../components/ui";
import { font, amethystGlow } from "../../../lib/design/tokens";
import { SectionLabel } from "../../../components/ui/SectionLabel";

const TAG_OPTIONS = [
  { value: "high_protein", label: "High Protein" },
  { value: "low_carb", label: "Low Carb" },
  { value: "vegan", label: "Vegano" },
  { value: "gluten_free", label: "Sem Gluten" },
  { value: "quick", label: "Rapido" },
];

export default function NewRecipeScreen() {
  const { user } = useAuth();
  const createRecipe = useCreateRecipe();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [servings, setServings] = useState("1");
  const [ingredients, setIngredients] = useState<CreateRecipeIngredientInput[]>([]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleFoodPicked = (pick: FoodPick) => {
    const ing: CreateRecipeIngredientInput = {
      food_id: pick.food.id,
      name: pick.food.name,
      quantity: pick.quantity,
      unit: pick.unit,
      calories: pick.macros.calories,
      protein_g: pick.macros.protein_g,
      carbs_g: pick.macros.carbs_g,
      fat_g: pick.macros.fat_g,
      sort_order: ingredients.length,
    };
    setIngredients((prev) => [...prev, ing]);
    setPickerVisible(false);
  };

  const removeIngredient = (idx: number) => {
    setIngredients((prev) =>
      prev
        .filter((_, i) => i !== idx)
        .map((ing, i) => ({ ...ing, sort_order: i })),
    );
  };

  const totalMacros = ingredients.reduce(
    (acc, ing) => ({
      calories: acc.calories + ing.calories,
      protein_g: acc.protein_g + ing.protein_g,
      carbs_g: acc.carbs_g + ing.carbs_g,
      fat_g: acc.fat_g + ing.fat_g,
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );

  const canSave = name.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!user || !canSave) return;
    setSaving(true);
    try {
      await createRecipe.mutateAsync({
        name: name.trim(),
        description: description.trim() || null,
        instructions: instructions.trim() || null,
        tags: selectedTags,
        servings: Math.max(1, parseInt(servings) || 1),
        created_by: user.id,
        trainer_id: user.id,
        is_public: false,
        ingredients,
      });
      router.back();
    } catch {
      Alert.alert("Erro", "Nao foi possivel salvar a receita. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4 border-b border-surface-border">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-1.5"
        >
          <AppIcon name="arrow-left" size={16} color="#6E6382" strokeWidth={2} />
          <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>
            Cancelar
          </Text>
        </Pressable>
        <Text className="text-text-primary text-base" style={{ fontFamily: font.semibold }}>
          Nova receita
        </Text>
        <View className="w-16" />
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <WebContainer maxWidth={640}>
          <View className="px-6 py-6 gap-5">

            {/* Nome */}
            <View>
              <SectionLabel className="mb-2 ml-1">Nome da receita *</SectionLabel>
              <TextInput
                className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                style={{ fontFamily: font.regular }}
                placeholder="Ex: Frango grelhado com batata doce"
                placeholderTextColor="#6E6382"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Descricao */}
            <View>
              <SectionLabel className="mb-2 ml-1">Descricao (opcional)</SectionLabel>
              <TextInput
                className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                style={{ fontFamily: font.regular }}
                placeholder="Breve descricao da receita..."
                placeholderTextColor="#6E6382"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={2}
              />
            </View>

            {/* Porcoes */}
            <View className="flex-row items-center gap-4">
              <View className="flex-1">
                <SectionLabel className="mb-2 ml-1">Porcoes</SectionLabel>
                <TextInput
                  className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                  style={{ fontFamily: font.regular }}
                  placeholder="1"
                  placeholderTextColor="#6E6382"
                  value={servings}
                  onChangeText={setServings}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* Tags */}
            <View>
              <SectionLabel className="mb-2 ml-1">Tags</SectionLabel>
              <View className="flex-row flex-wrap gap-2">
                {TAG_OPTIONS.map((t) => (
                  <Pressable
                    key={t.value}
                    onPress={() => toggleTag(t.value)}
                    className={`px-3 py-1.5 rounded-full ${
                      selectedTags.includes(t.value)
                        ? "bg-violet-500"
                        : "bg-surface-card border border-surface-border"
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

            {/* Ingredientes */}
            <View>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <View className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                    <AppIcon name="list" size={15} color="#9B40D8" strokeWidth={2} />
                  </View>
                  <SectionLabel>Ingredientes</SectionLabel>
                </View>
                <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                  {ingredients.length} item(s)
                </Text>
              </View>

              {ingredients.length > 0 ? (
                <View className="bg-surface-card border border-surface-border rounded-2xl mb-3 overflow-hidden">
                  {ingredients.map((ing, idx) => (
                    <View
                      key={idx}
                      className="flex-row items-center gap-3 px-4 py-3 border-b border-surface-border last:border-0"
                    >
                      <View className="w-2 h-2 bg-violet-500 rounded-full" />
                      <View className="flex-1">
                        <Text
                          className="text-sm text-text-primary"
                          style={{ fontFamily: font.medium }}
                          numberOfLines={1}
                        >
                          {ing.name}
                        </Text>
                        <Text
                          className="text-xs text-text-muted mt-0.5"
                          style={{ fontFamily: font.regular }}
                        >
                          {ing.quantity}{ing.unit} · {Math.round(ing.calories)} kcal
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => removeIngredient(idx)}
                        className="w-7 h-7 rounded-lg bg-danger-500/10 items-center justify-center"
                      >
                        <AppIcon name="close" size={14} color="#FB7185" strokeWidth={2} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : null}

              <Pressable
                onPress={() => setPickerVisible(true)}
                className="border border-dashed border-violet-500/40 rounded-2xl py-3 flex-row items-center justify-center gap-2"
              >
                <AppIcon name="plus" size={16} color="#9B40D8" strokeWidth={2} />
                <Text className="text-violet-400 text-sm" style={{ fontFamily: font.semibold }}>
                  Adicionar ingrediente
                </Text>
              </Pressable>
            </View>

            {/* Macro total ao vivo */}
            {ingredients.length > 0 ? (
              <View className="bg-surface-elevated border border-surface-border rounded-3xl p-4">
                <Text
                  className="text-[10px] text-text-muted text-center mb-3"
                  style={{ fontFamily: font.semibold, letterSpacing: 1 }}
                >
                  TOTAL DA RECEITA
                </Text>
                <View className="flex-row justify-around">
                  <View className="items-center">
                    <Text className="text-lg text-violet-400" style={{ fontFamily: font.bold }}>
                      {Math.round(totalMacros.calories)}
                    </Text>
                    <Text
                      className="text-[9px] text-text-muted"
                      style={{ fontFamily: font.regular }}
                    >
                      kcal
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-lg text-ice-400" style={{ fontFamily: font.bold }}>
                      {Math.round(totalMacros.protein_g)}g
                    </Text>
                    <Text
                      className="text-[9px] text-text-muted"
                      style={{ fontFamily: font.regular }}
                    >
                      Prot
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-lg text-fuchsia-400" style={{ fontFamily: font.bold }}>
                      {Math.round(totalMacros.carbs_g)}g
                    </Text>
                    <Text
                      className="text-[9px] text-text-muted"
                      style={{ fontFamily: font.regular }}
                    >
                      Carb
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text
                      className="text-lg text-warning-500"
                      style={{ fontFamily: font.bold }}
                    >
                      {Math.round(totalMacros.fat_g)}g
                    </Text>
                    <Text
                      className="text-[9px] text-text-muted"
                      style={{ fontFamily: font.regular }}
                    >
                      Gord
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}

            {/* Modo de preparo */}
            <View>
              <SectionLabel className="mb-2 ml-1">Modo de preparo (opcional)</SectionLabel>
              <TextInput
                className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                style={{ fontFamily: font.regular }}
                placeholder="Descreva o passo a passo..."
                placeholderTextColor="#6E6382"
                value={instructions}
                onChangeText={setInstructions}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Salvar */}
            <Pressable
              onPress={handleSave}
              disabled={!canSave}
              className="rounded-2xl overflow-hidden mb-4"
              style={canSave ? amethystGlow : undefined}
            >
              <LinearGradient
                colors={canSave ? ["#781BB6", "#C636E0"] : ["#2E2740", "#2E2740"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={{
                  paddingVertical: 18,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <AppIcon
                      name="check-circle"
                      size={18}
                      color={canSave ? "#FFFFFF" : "#6E6382"}
                      strokeWidth={2}
                    />
                    <Text
                      className={canSave ? "text-white" : "text-text-muted"}
                      style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                    >
                      Salvar receita
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>

          </View>
        </WebContainer>
      </ScrollView>

      <FoodPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onConfirm={handleFoodPicked}
      />
    </SafeAreaView>
  );
}
