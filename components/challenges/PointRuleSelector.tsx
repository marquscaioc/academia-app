import { Pressable, Text, View } from "react-native";
import { PointRule } from "../../hooks/queries/useChallengePointRules";

interface PointRuleSelectorProps {
  rules: PointRule[];
  selectedRuleId: string | null;
  onSelect: (rule: PointRule) => void;
}

export function PointRuleSelector({ rules, selectedRuleId, onSelect }: PointRuleSelectorProps) {
  if (!rules.length) return null;

  const activityIcons: Record<string, string> = {
    workout: "🏋️",
    cardio: "🏃",
    photo: "📸",
    checkin: "✅",
    steps: "👟",
    custom: "⭐",
  };

  return (
    <View className="gap-2">
      <Text className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
        Selecione a atividade
      </Text>
      {rules.map((rule) => (
        <Pressable
          key={rule.id}
          onPress={() => onSelect(rule)}
          className={`flex-row items-center justify-between p-4 rounded-2xl border ${
            selectedRuleId === rule.id
              ? "border-violet-500 bg-violet-500/10"
              : "border-surface-border bg-surface-card"
          } active:bg-surface-hover`}
        >
          <View className="flex-row items-center gap-3">
            <Text className="text-xl">{activityIcons[rule.activity_type] ?? "⭐"}</Text>
            <View>
              <Text className={`text-sm font-bold ${selectedRuleId === rule.id ? "text-violet-400" : "text-text-primary"}`}>
                {rule.label}
              </Text>
              {rule.max_per_day ? (
                <Text className="text-[10px] text-text-muted">Max {rule.max_per_day}x/dia</Text>
              ) : null}
            </View>
          </View>
          <Text className={`text-lg font-black ${selectedRuleId === rule.id ? "text-violet-400" : "text-text-muted"}`}>
            +{rule.points}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
