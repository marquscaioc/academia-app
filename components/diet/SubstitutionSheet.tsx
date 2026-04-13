import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useSubstitutions } from "../../hooks/queries/useSubstitutions";

interface SubstitutionSheetProps {
  visible: boolean;
  mealItemId: string | null;
  originalName: string;
  originalCalories?: number;
  originalProtein?: number;
  onSelect: (substitutionId: string, foodName: string) => void;
  onClose: () => void;
}

export function SubstitutionSheet({
  visible, mealItemId, originalName, originalCalories, originalProtein,
  onSelect, onClose,
}: SubstitutionSheetProps) {
  const { data: subs } = useSubstitutions(mealItemId ?? undefined);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-dark-200 border-t border-surface-border rounded-t-3xl px-6 pt-6 pb-10 max-h-[70%]">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-lg font-black text-text-primary">Substituicoes</Text>
            <Pressable onPress={onClose}>
              <Text className="text-text-muted text-lg">✕</Text>
            </Pressable>
          </View>

          <View className="bg-surface-card rounded-2xl p-4 mb-4">
            <Text className="text-xs text-text-muted uppercase mb-1">Original</Text>
            <Text className="text-sm font-bold text-text-primary">{originalName}</Text>
            {originalCalories ? (
              <Text className="text-xs text-text-muted mt-1">
                {originalCalories} kcal | {originalProtein ?? 0}g prot
              </Text>
            ) : null}
          </View>

          {!subs || subs.length === 0 ? (
            <View className="items-center py-8">
              <Text className="text-text-muted text-sm">Nenhuma substituicao disponivel</Text>
            </View>
          ) : (
            <ScrollView className="gap-3">
              {subs.map((sub) => (
                <Pressable
                  key={sub.id}
                  onPress={() => onSelect(sub.id, sub.substitute_food_name)}
                  className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-3 active:bg-surface-hover"
                >
                  <Text className="text-sm font-bold text-text-primary">{sub.substitute_food_name}</Text>
                  <View className="flex-row gap-3 mt-2">
                    <Text className="text-xs text-text-muted">
                      {sub.substitute_quantity}{sub.substitute_unit}
                    </Text>
                    <Text className="text-xs text-violet-400">
                      {sub.substitute_calories} kcal
                    </Text>
                    <Text className="text-xs text-text-muted">
                      P: {sub.substitute_protein_g}g
                    </Text>
                    <Text className="text-xs text-text-muted">
                      C: {sub.substitute_carbs_g}g
                    </Text>
                    <Text className="text-xs text-text-muted">
                      G: {sub.substitute_fat_g}g
                    </Text>
                  </View>
                  {sub.notes ? (
                    <Text className="text-xs text-text-muted mt-2 italic">{sub.notes}</Text>
                  ) : null}
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
