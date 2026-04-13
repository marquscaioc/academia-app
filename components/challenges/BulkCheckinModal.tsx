import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { PointRule } from "../../hooks/queries/useChallengePointRules";

interface BulkCheckinModalProps {
  visible: boolean;
  rules: PointRule[];
  onSubmit: (selectedRules: PointRule[]) => void;
  onClose: () => void;
}

const activityIcons: Record<string, string> = {
  workout: "🏋️",
  cardio: "🏃",
  photo: "📸",
  checkin: "✅",
  steps: "👟",
  custom: "⭐",
};

export function BulkCheckinModal({ visible, rules, onSubmit, onClose }: BulkCheckinModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (ruleId: string) => {
    const next = new Set(selected);
    if (next.has(ruleId)) next.delete(ruleId);
    else next.add(ruleId);
    setSelected(next);
  };

  const totalPoints = rules.filter((r) => selected.has(r.id)).reduce((sum, r) => sum + r.points, 0);

  const handleSubmit = () => {
    const selectedRules = rules.filter((r) => selected.has(r.id));
    onSubmit(selectedRules);
    setSelected(new Set());
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-dark-200 border-t border-surface-border rounded-t-3xl px-6 pt-6 pb-10 max-h-[70%]">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-lg font-black text-text-primary">Registrar Atividades</Text>
            <Pressable onPress={onClose}>
              <Text className="text-text-muted text-lg">✕</Text>
            </Pressable>
          </View>

          <Text className="text-xs text-text-muted mb-4">
            Selecione todas as atividades realizadas hoje:
          </Text>

          <ScrollView className="mb-4">
            {rules.map((rule) => (
              <Pressable
                key={rule.id}
                onPress={() => toggle(rule.id)}
                className={`flex-row items-center justify-between p-4 mb-2 rounded-2xl border ${
                  selected.has(rule.id) ? "border-violet-500 bg-violet-500/10" : "border-surface-border bg-surface-card"
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <View className={`w-6 h-6 rounded-lg items-center justify-center ${
                    selected.has(rule.id) ? "bg-violet-500" : "bg-surface-elevated"
                  }`}>
                    {selected.has(rule.id) ? (
                      <Text className="text-white text-xs">✓</Text>
                    ) : null}
                  </View>
                  <Text className="text-xl">{activityIcons[rule.activity_type] ?? "⭐"}</Text>
                  <Text className={`text-sm font-bold ${selected.has(rule.id) ? "text-violet-400" : "text-text-primary"}`}>
                    {rule.label}
                  </Text>
                </View>
                <Text className="text-sm font-black text-text-muted">+{rule.points}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm text-text-muted">Total</Text>
            <Text className="text-lg font-black text-violet-400">+{totalPoints} pts</Text>
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={selected.size === 0}
            className={`rounded-2xl py-4 items-center ${
              selected.size > 0 ? "bg-violet-500 active:bg-violet-600" : "bg-surface-border"
            }`}
          >
            <Text className={`font-black text-base ${selected.size > 0 ? "text-white" : "text-text-muted"}`}>
              Registrar {selected.size} atividade{selected.size !== 1 ? "s" : ""}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
