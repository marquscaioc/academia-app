import { useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../../lib/auth/provider";
import { useEntryComments, useAddEntryComment, useDeleteEntryComment } from "../../hooks/mutations/useEntryComments";
import { Avatar } from "../ui/Avatar";

interface EntryCommentsProps {
  entryId: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function EntryComments({ entryId }: EntryCommentsProps) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { data: comments, isLoading } = useEntryComments(entryId);
  const addComment = useAddEntryComment();
  const deleteComment = useDeleteEntryComment();

  const handleSend = () => {
    if (!user || !text.trim()) return;
    addComment.mutate({ entry_id: entryId, author_id: user.id, content: text.trim() });
    setText("");
  };

  const visible = showAll ? comments : comments?.slice(-2);
  const hasMore = (comments?.length ?? 0) > 2;

  return (
    <View className="mt-3 pt-3 border-t border-surface-border">
      {isLoading ? (
        <ActivityIndicator size="small" color="#781BB6" />
      ) : (
        <>
          {hasMore && !showAll ? (
            <Pressable onPress={() => setShowAll(true)} className="mb-2">
              <Text className="text-xs text-violet-400 font-bold">
                Ver todos os {comments?.length} comentarios
              </Text>
            </Pressable>
          ) : null}

          <View className="gap-2 mb-3">
            {visible?.map((c) => (
              <View key={c.id} className="flex-row gap-2 items-start">
                <Avatar uri={c.author?.avatar_url} name={c.author?.full_name} size="sm" />
                <View className="flex-1 bg-dark-300 rounded-xl px-3 py-2">
                  <View className="flex-row items-center justify-between mb-0.5">
                    <Text className="text-[10px] font-bold text-violet-400">
                      {c.author?.full_name ?? "Usuario"}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-[9px] text-text-muted">{timeAgo(c.created_at)}</Text>
                      {c.author_id === user?.id ? (
                        <Pressable onPress={() => deleteComment.mutate({ id: c.id, entry_id: entryId })}>
                          <Text className="text-danger-500 text-[9px] font-bold">✕</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                  <Text className="text-xs text-text-primary leading-4">{c.content}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Input */}
          <View className="flex-row gap-2">
            <TextInput
              className="flex-1 bg-dark-300 border border-surface-border rounded-xl px-3 py-2 text-xs text-text-primary"
              placeholder="Comentar..."
              placeholderTextColor="#6E6580"
              value={text}
              onChangeText={setText}
              multiline
            />
            <Pressable
              onPress={handleSend}
              disabled={!text.trim() || addComment.isPending}
              className={`w-9 h-9 rounded-xl items-center justify-center ${
                text.trim() ? "bg-violet-500" : "bg-surface-border"
              }`}
            >
              <Text className={`text-xs font-bold ${text.trim() ? "text-white" : "text-text-muted"}`}>↑</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
