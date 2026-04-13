import { useLocalSearchParams, router } from "expo-router";
import { useRef, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useMessages } from "../../../hooks/queries/useChat";
import { useSendMessage, useMarkConversationRead } from "../../../hooks/mutations/useChatMutations";
import { useRealtimeMessages } from "../../../lib/realtime/useRealtimeMessages";
import { MessageBubble } from "../../../components/chat/MessageBubble";
import { ChatInput } from "../../../components/chat/ChatInput";

export default function ChatScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const { user } = useAuth();
  const { data: messages, isLoading } = useMessages(conversationId ?? "");
  const sendMessage = useSendMessage();
  const markRead = useMarkConversationRead();
  const flatListRef = useRef<FlatList>(null);

  useRealtimeMessages(conversationId ?? null);

  useEffect(() => {
    if (conversationId && user) {
      markRead.mutate({ conversation_id: conversationId, user_id: user.id });
    }
  }, [conversationId, messages?.length]);

  const handleSend = (content: string) => {
    if (!user || !conversationId) return;
    sendMessage.mutate({
      conversation_id: conversationId,
      sender_id: user.id,
      content,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-3 border-b border-surface-border">
        <Pressable onPress={() => router.back()} className="px-2 py-1">
          <Text className="text-violet-400 font-bold text-sm">← Voltar</Text>
        </Pressable>
      </View>

      {/* Messages */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#781BB6" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="py-4"
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item, index }) => {
            const isOwn = item.sender_id === user?.id;
            const prevMsg = index > 0 ? messages![index - 1] : null;
            const showSender = !isOwn && (!prevMsg || prevMsg.sender_id !== item.sender_id);

            return (
              <MessageBubble
                content={item.content ?? ""}
                senderName={item.sender?.full_name ?? ""}
                senderAvatar={item.sender?.avatar_url}
                isOwn={isOwn}
                timestamp={item.created_at}
                showSender={showSender}
              />
            );
          }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-text-muted text-sm">Nenhuma mensagem ainda. Diga oi!</Text>
            </View>
          }
        />
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={sendMessage.isPending} />
    </SafeAreaView>
  );
}
