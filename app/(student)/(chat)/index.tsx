import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useConversations, Conversation } from "../../../hooks/queries/useChat";
import { Avatar } from "../../../components/ui/Avatar";
import { EmptyState } from "../../../components/ui/EmptyState";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function getConversationName(conv: Conversation, currentUserId: string): string {
  if (conv.name) return conv.name;
  const other = conv.members?.find((m) => m.user_id !== currentUserId);
  return other?.profile?.full_name ?? "Conversa";
}

function getConversationAvatar(conv: Conversation, currentUserId: string): string | null {
  if (conv.image_url) return conv.image_url;
  const other = conv.members?.find((m) => m.user_id !== currentUserId);
  return other?.profile?.avatar_url ?? null;
}

export default function ChatListScreen() {
  const { user } = useAuth();
  const { data: conversations, isLoading } = useConversations(user?.id);

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-black text-text-primary">Mensagens</Text>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#BBFF00" />
          </View>
        ) : !conversations?.length ? (
          <EmptyState
            icon="💬"
            title="Nenhuma conversa"
            description="Suas conversas com trainers e outros alunos aparecerão aqui."
          />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const name = getConversationName(item, user?.id ?? "");
              const avatar = getConversationAvatar(item, user?.id ?? "");
              const isGroup = item.conversation_type === "group";

              return (
                <Pressable
                  onPress={() => router.push(`/(student)/(chat)/${item.id}`)}
                  className="flex-row items-center gap-4 px-6 py-4 active:bg-surface-hover border-b border-surface-border"
                >
                  {isGroup ? (
                    <View className="w-12 h-12 bg-surface-elevated rounded-xl items-center justify-center">
                      <Text className="text-lg">👥</Text>
                    </View>
                  ) : (
                    <Avatar uri={avatar} name={name} size="lg" />
                  )}

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-bold text-text-primary" numberOfLines={1}>
                        {name}
                      </Text>
                      <Text className="text-[10px] text-text-muted">
                        {timeAgo(item.last_message_at)}
                      </Text>
                    </View>
                    {item.last_message_preview ? (
                      <Text className="text-xs text-text-muted mt-1" numberOfLines={1}>
                        {item.last_message_preview}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
