import { Pressable, Text, View } from "react-native";
import { TimelineEvent } from "../../hooks/queries/useStudentTimeline";
import { AppIcon, type IconName } from "../ui";

const typeConfig: Record<string, { icon: IconName; color: string; iconColor: string }> = {
  workout: { icon: "workout", color: "bg-violet-500/15", iconColor: "#52525B" },
  checkin: { icon: "clipboard", color: "bg-ice-400/15", iconColor: "#52525B" },
  measurement: { icon: "ruler", color: "bg-success-500/15", iconColor: "#52525B" },
  photo: { icon: "camera", color: "bg-warning-500/15", iconColor: "#52525B" },
  note: { icon: "notebook", color: "bg-fuchsia-400/15", iconColor: "#52525B" },
};

interface TimelineItemProps {
  event: TimelineEvent;
  onPress?: () => void;
}

export function TimelineItem({ event, onPress }: TimelineItemProps) {
  const config = typeConfig[event.type] ?? typeConfig.note;
  const date = new Date(event.date).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });

  return (
    <View className="flex-row gap-3">
      {/* Timeline line + icon */}
      <View className="items-center w-10">
        <View className={`w-10 h-10 rounded-xl items-center justify-center ${config.color}`}>
          <AppIcon name={config.icon} size={20} color={config.iconColor} strokeWidth={2} />
        </View>
        <View className="w-0.5 flex-1 bg-surface-border mt-1" />
      </View>

      {/* Content */}
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? "button" : undefined}
        accessibilityLabel={onPress ? `Ver detalhes: ${event.title}` : undefined}
        className="flex-1 pb-4 active:opacity-70"
      >
        <Text className="text-sm font-bold text-text-primary">{event.title}</Text>
        {event.subtitle ? (
          <Text className="text-xs text-text-muted mt-0.5 font-sans">{event.subtitle}</Text>
        ) : null}
        <Text className="text-[10px] text-text-muted mt-1 font-sans">{date}</Text>
      </Pressable>
    </View>
  );
}
