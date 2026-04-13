import { Pressable, Text, View } from "react-native";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-20 h-20 bg-surface-card border border-surface-border rounded-3xl items-center justify-center mb-5">
        <Text className="text-3xl">{icon}</Text>
      </View>
      <Text className="text-lg font-bold text-text-primary text-center">{title}</Text>
      <Text className="text-sm text-text-muted text-center mt-2 max-w-[280px] leading-5">
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          className="bg-violet-400 rounded-xl px-6 py-3 mt-6 active:bg-violet-500"
        >
          <Text className="text-dark-400 font-black text-sm">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
