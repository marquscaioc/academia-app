import { Text, View } from "react-native";
import { TimelineEvent } from "../../hooks/queries/useStudentTimeline";
import { AppIcon, type IconName } from "../ui";

const typeConfig: Record<string, { icon: IconName; color: string; iconColor: string }> = {
  workout: { icon: "workout", color: "bg-violet-500/15", iconColor: "#8B5CF6" },
  checkin: { icon: "clipboard", color: "bg-ice-400/15", iconColor: "#38BDF8" },
  measurement: { icon: "ruler", color: "bg-success-500/15", iconColor: "#22C55E" },
  photo: { icon: "camera", color: "bg-warning-500/15", iconColor: "#F59E0B" },
  note: { icon: "notebook", color: "bg-fuchsia-400/15", iconColor: "#E879F9" },
};

interface TimelineItemProps {
  event: TimelineEvent;
}

export function TimelineItem({ event }: TimelineItemProps) {
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
      <View className="flex-1 pb-4">
        <Text className="text-sm font-bold text-text-primary">{event.title}</Text>
        {event.subtitle ? (
          <Text className="text-xs text-text-muted mt-0.5">{event.subtitle}</Text>
        ) : null}
        <Text className="text-[10px] text-text-muted mt-1">{date}</Text>
      </View>
    </View>
  );
}
