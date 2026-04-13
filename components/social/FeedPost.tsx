import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { Avatar } from "../ui/Avatar";

interface FeedPostProps {
  authorName: string;
  authorAvatar?: string | null;
  content?: string | null;
  mediaUrls?: string[] | null;
  postType: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  onLike?: () => void;
  onComment?: () => void;
  onProfile?: () => void;
  reactions?: { type: string; active: boolean; onPress: () => void }[];
}

const reactionEmojis: Record<string, string> = {
  like: "👍",
  fire: "🔥",
  strong: "💪",
  clap: "👏",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function FeedPost({
  authorName,
  authorAvatar,
  content,
  mediaUrls,
  postType,
  likesCount,
  commentsCount,
  createdAt,
  onLike,
  onComment,
  onProfile,
  reactions,
}: FeedPostProps) {
  return (
    <View className="bg-white border-b border-gray-100 px-6 py-5">
      {/* Header */}
      <Pressable onPress={onProfile} className="flex-row items-center gap-3 mb-3">
        <Avatar uri={authorAvatar} name={authorName} size="md" />
        <View className="flex-1">
          <Text className="text-sm font-semibold text-gray-900">{authorName}</Text>
          <Text className="text-xs text-gray-400">{timeAgo(createdAt)}</Text>
        </View>
      </Pressable>

      {/* Content */}
      {content ? (
        <Text className="text-sm text-gray-800 leading-5 mb-3">{content}</Text>
      ) : null}

      {/* Media */}
      {mediaUrls?.length ? (
        <View className="rounded-xl overflow-hidden mb-3">
          <Image
            source={{ uri: mediaUrls[0] }}
            style={{ width: "100%", height: 240, borderRadius: 12 }}
            contentFit="cover"
          />
          {mediaUrls.length > 1 ? (
            <View className="absolute top-2 right-2 bg-black/50 rounded-full px-2 py-0.5">
              <Text className="text-white text-xs font-medium">+{mediaUrls.length - 1}</Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {/* Reactions */}
      <View className="flex-row items-center gap-1 mb-2">
        {(reactions ?? [
          { type: "like", active: false, onPress: onLike ?? (() => {}) },
          { type: "fire", active: false, onPress: () => {} },
          { type: "strong", active: false, onPress: () => {} },
          { type: "clap", active: false, onPress: () => {} },
        ]).map((r) => (
          <Pressable
            key={r.type}
            onPress={r.onPress}
            className={`px-3 py-1.5 rounded-full ${r.active ? "bg-primary-100" : "bg-gray-50"}`}
          >
            <Text className="text-sm">{reactionEmojis[r.type] ?? "👍"}</Text>
          </Pressable>
        ))}
      </View>

      {/* Stats */}
      <View className="flex-row items-center gap-4">
        {likesCount > 0 ? (
          <Text className="text-xs text-gray-400">{likesCount} reacoes</Text>
        ) : null}
        <Pressable onPress={onComment}>
          <Text className="text-xs text-gray-400">
            {commentsCount > 0 ? `${commentsCount} comentarios` : "Comentar"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
