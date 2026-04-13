import { Text, View } from "react-native";
import { Avatar } from "../ui/Avatar";

interface MessageBubbleProps {
  content: string;
  senderName: string;
  senderAvatar?: string | null;
  isOwn: boolean;
  timestamp: string;
  showSender?: boolean;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export function MessageBubble({
  content,
  senderName,
  senderAvatar,
  isOwn,
  timestamp,
  showSender = false,
}: MessageBubbleProps) {
  return (
    <View className={`flex-row gap-2 px-4 mb-1 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && showSender ? (
        <View className="mt-auto">
          <Avatar uri={senderAvatar} name={senderName} size="sm" />
        </View>
      ) : !isOwn ? (
        <View className="w-8" />
      ) : null}

      <View className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && showSender ? (
          <Text className="text-[10px] text-text-muted font-bold ml-2 mb-1">{senderName}</Text>
        ) : null}
        <View
          className={`rounded-2xl px-4 py-3 ${
            isOwn
              ? "bg-violet-400 rounded-br-md"
              : "bg-surface-elevated rounded-bl-md"
          }`}
        >
          <Text className={`text-sm leading-5 ${isOwn ? "text-dark-400" : "text-text-primary"}`}>
            {content}
          </Text>
        </View>
        <Text className={`text-[10px] mt-1 mx-2 ${isOwn ? "text-text-muted" : "text-text-muted"}`}>
          {formatTime(timestamp)}
        </Text>
      </View>
    </View>
  );
}
