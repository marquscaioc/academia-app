import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useFoodSearch, lookupOpenFoodFacts } from "../../hooks/queries/useFoodSearch";
import { macrosForQuantity } from "../../lib/diet/foodCalc";
import type { Food, FoodMacros } from "../../lib/diet/foodTypes";
import { FoodImage } from "./FoodImage";
import { font } from "../../lib/design/tokens";

export interface FoodPick {
  food: Food;
  quantity: number;
  unit: string;
  macros: FoodMacros;
}

export function FoodPicker({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (p: FoodPick) => void;
}) {
  const [term, setTerm] = useState("");
  const [picked, setPicked] = useState<Food | null>(null);
  const [qty, setQty] = useState("100");
  const [unit, setUnit] = useState("g");
  const [offResults, setOffResults] = useState<Food[]>([]);
  const [offLoading, setOffLoading] = useState(false);

  const local = useFoodSearch(term);
  const list: Food[] = [...(local.data ?? []), ...offResults];

  const quantity = parseFloat(qty.replace(",", ".")) || 0;
  const preview = picked ? macrosForQuantity(picked, quantity, unit) : null;

  async function searchOff() {
    setOffLoading(true);
    try {
      setOffResults(await lookupOpenFoodFacts({ q: term }));
    } finally {
      setOffLoading(false);
    }
  }

  function reset() {
    setPicked(null);
    setTerm("");
    setOffResults([]);
    setQty("100");
    setUnit("g");
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* Backdrop — tap outside sheet to close */}
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={() => { reset(); onClose(); }} />

        <View className="bg-dark-200 border-t border-surface-border rounded-t-3xl px-6 pt-6 pb-10 max-h-[85%]">
          {/* Close handle + header */}
          <View className="items-center mb-4">
            <View className="w-10 h-1 rounded-full bg-surface-border" />
          </View>

          {!picked ? (
            <>
              {/* Search input */}
              <TextInput
                value={term}
                onChangeText={setTerm}
                placeholder="Buscar alimento…"
                placeholderTextColor="#6E6382"
                className="bg-surface-elevated rounded-2xl px-4 py-3 text-text-primary"
                style={{ fontFamily: font.regular }}
                autoFocus
              />

              {/* OFF search button */}
              <Pressable onPress={searchOff} className="mt-2 py-1">
                <Text
                  className="text-violet-400 text-sm"
                  style={{ fontFamily: font.semibold }}
                >
                  {offLoading ? "Buscando produtos…" : "Buscar em produtos embalados"}
                </Text>
              </Pressable>

              {local.isLoading ? (
                <ActivityIndicator className="mt-4" color="#781BB6" />
              ) : null}

              {/* Results list */}
              <FlatList
                data={list}
                keyExtractor={(f) => f.id}
                className="mt-3"
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => setPicked(item)}
                    className="flex-row items-center gap-3 py-2.5 active:bg-surface-hover rounded-2xl px-1"
                  >
                    <FoodImage url={item.image_url} category={item.category} />
                    <View className="flex-1">
                      <Text
                        className="text-text-primary text-[15px]"
                        style={{ fontFamily: font.medium }}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text
                        className="text-text-muted text-xs mt-0.5"
                        style={{ fontFamily: font.regular }}
                      >
                        {Math.round(item.kcal_100g)} kcal/100g ·{" "}
                        {item.source === "taco" ? "TACO" : (item.brand ?? "OFF")}
                      </Text>
                    </View>
                  </Pressable>
                )}
              />
            </>
          ) : (
            /* Quantity + macro preview view */
            <View className="gap-3">
              {/* Selected food header */}
              <View className="flex-row items-center gap-3">
                <FoodImage url={picked.image_url} category={picked.category} size={56} />
                <Text
                  className="flex-1 text-text-primary text-base"
                  style={{ fontFamily: font.semibold }}
                  numberOfLines={2}
                >
                  {picked.name}
                </Text>
              </View>

              {/* Quantity + unit selector */}
              <View className="flex-row gap-3">
                <TextInput
                  value={qty}
                  onChangeText={setQty}
                  keyboardType="numeric"
                  className="flex-1 bg-surface-elevated rounded-2xl px-4 py-3 text-text-primary"
                  style={{ fontFamily: font.regular }}
                />
                {(["g", "ml"] as const).map((u) => (
                  <Pressable
                    key={u}
                    onPress={() => setUnit(u)}
                    className={`px-4 justify-center rounded-2xl ${
                      unit === u ? "bg-violet-500" : "bg-surface-elevated"
                    }`}
                  >
                    <Text
                      className={unit === u ? "text-white" : "text-text-secondary"}
                      style={{ fontFamily: font.semibold }}
                    >
                      {u}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Live macro preview */}
              {preview ? (
                <View className="bg-surface-card border border-surface-border rounded-2xl p-4">
                  <Text
                    className="text-text-muted text-xs uppercase mb-1"
                    style={{ fontFamily: font.semibold }}
                  >
                    Prévia nutricional
                  </Text>
                  <View className="flex-row gap-3 flex-wrap mt-1">
                    <Text
                      className="text-violet-400 text-sm"
                      style={{ fontFamily: font.semibold }}
                    >
                      {preview.calories} kcal
                    </Text>
                    <Text
                      className="text-text-muted text-sm"
                      style={{ fontFamily: font.regular }}
                    >
                      P {preview.protein_g}g
                    </Text>
                    <Text
                      className="text-text-muted text-sm"
                      style={{ fontFamily: font.regular }}
                    >
                      C {preview.carbs_g}g
                    </Text>
                    <Text
                      className="text-text-muted text-sm"
                      style={{ fontFamily: font.regular }}
                    >
                      G {preview.fat_g}g
                    </Text>
                  </View>
                </View>
              ) : null}

              {/* Confirm button */}
              <Pressable
                onPress={() => {
                  if (preview) {
                    onConfirm({ food: picked, quantity, unit, macros: preview });
                    reset();
                  }
                }}
                disabled={!preview || quantity <= 0}
                className="bg-violet-500 rounded-2xl py-3.5 items-center mt-1"
              >
                <Text className="text-white" style={{ fontFamily: font.semibold }}>
                  Adicionar
                </Text>
              </Pressable>

              {/* Back to search */}
              <Pressable onPress={() => setPicked(null)} className="py-1">
                <Text
                  className="text-text-muted text-center text-sm"
                  style={{ fontFamily: font.regular }}
                >
                  Voltar à busca
                </Text>
              </Pressable>
            </View>
          )}

          {/* Close footer */}
          <Pressable
            onPress={() => { reset(); onClose(); }}
            className="mt-3 py-1"
          >
            <Text
              className="text-text-muted text-center"
              style={{ fontFamily: font.regular }}
            >
              Fechar
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
