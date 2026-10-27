import { useLocalSearchParams, router } from "expo-router";
import { useRef, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth/provider";
import { useConversations, useMessages } from "../../hooks/queries/useChat";
import { useTrainerContacts } from "../../hooks/queries/useProfessionalPartners";
import { whatsappContactUrl } from "../../lib/partners/contact";
import { toast } from "../../stores/useToastStore";
import { useSendMessage, useMarkConversationRead } from "../../hooks/mutations/useChatMutations";
import { useRealtimeMessages } from "../../lib/realtime/useRealtimeMessages";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { AppIcon } from "../ui";
import { font } from "../../lib/design/tokens";

/**
 * Shared conversation thread. Route-agnostic (reads conversationId from params,
 * user from auth, navigates via router.back()), so both the student
 * `(chat)/conversa/[conversationId]` and trainer `chat/[conversationId]` routes re-export it.
 */
export default function ChatThread() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const { user, profile } = useAuth();
  const { data: messages, isLoading } = useMessages(conversationId ?? "");
  const isStudent = profile?.role === "student";
  const { data: conversations } = useConversations(user?.id);
  const conversation = conversations?.find((c) => c.id === conversationId);
  const other = conversation?.conversation_type === "direct" ? conversation.members?.find((m) => m.user_id !== user?.id) : undefined;
  // Students get a WhatsApp shortcut when the other member is one of their active trainers and that trainer
  // published a contact number (trainer_profiles.contact_whatsapp, same source as the Parceiros screen).
  const { data: trainerContacts } = useTrainerContacts(isStudent && other ? user?.id : undefined, false);
  const trainerContact = trainerContacts?.find((c) => c.id === other?.user_id);
  const trainerPhone = trainerContact?.contact_whatsapp ?? null;
  // Students may not be allowed to read the trainer's profile row (RLS returns null), so fall back to the brand.
  const title = conversation?.name ?? other?.profile?.full_name ?? (trainerContact ? trainerContact.brand_name || "Seu professor" : "");
  const whatsappUrl = trainerPhone ? whatsappContactUrl(trainerPhone, "Olá! Vim pelo chat do Projeto Gaab.") : null;
  const sendMessage = useSendMessage();
  const { mutate: markRead } = useMarkConversationRead();
  const userId = user?.id;
  const flatListRef = useRef<FlatList>(null);

  useRealtimeMessages(conversationId ?? null);

  useEffect(() => {
    if (conversationId && userId) {
      markRead({ conversation_id: conversationId, user_id: userId });
    }
    // user?.id included so a late-resolving auth still marks the thread read.
  }, [conversationId, messages?.length, userId, markRead]);

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
        <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5 px-2 py-1">
          <AppIcon name="arrow-left" size={18} color="#3F3F46" strokeWidth={2} />
          <Text className="text-violet-400 text-sm" style={{ fontFamily: font.semibold }}>Voltar</Text>
        </Pressable>
        <Text className="flex-1 text-text-primary text-[15px]" numberOfLines={1} style={{ fontFamily: font.semibold }}>
          {title}
        </Text>
        {whatsappUrl ? (
          <Pressable
            onPress={() => {
              Linking.openURL(whatsappUrl).catch(() => toast.error("Não foi possível abrir o WhatsApp", "Tente novamente."));
            }}
            accessibilityRole="link"
            accessibilityLabel="Conversar pelo WhatsApp"
            className="flex-row items-center gap-1.5 rounded-xl border border-success-500/30 bg-success-500/10 px-3 py-2"
          >
            <AppIcon name="phone" size={15} color="#3F3F46" strokeWidth={2} />
            <Text className="text-success-500 text-xs" style={{ fontFamily: font.semibold }}>WhatsApp</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Messages */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#27272A" />
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
            const prevMsg = index > 0 && messages ? messages[index - 1] : null;
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
            <View className="flex-1 items-center justify-center py-20 gap-4">
              <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                <AppIcon name="chat" size={28} color="#3F3F46" strokeWidth={2} />
              </View>
              <Text className="text-text-secondary text-sm text-center" style={{ fontFamily: font.regular }}>Nenhuma mensagem ainda. Diga oi!</Text>
            </View>
          }
        />
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={sendMessage.isPending} />
    </SafeAreaView>
  );
}
