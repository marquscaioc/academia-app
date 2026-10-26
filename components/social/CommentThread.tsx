import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Avatar } from "../ui/Avatar";
import { FeedComment } from "../../hooks/queries/useFeed";

interface CommentThreadProps {
  comments: FeedComment[];
  postId: string;
  currentUserId?: string;
  onReply: (content: string, parentId?: string) => void;
  isPending?: boolean;
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

export function CommentThread({ comments, postId, currentUserId, onReply, isPending }: CommentThreadProps) {
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Separate root comments and replies
  const rootComments = comments.filter((c) => !c.parent_comment_id);
  const repliesMap = new Map<string, FeedComment[]>();
  for (const c of comments) {
    if (c.parent_comment_id) {
      const existing = repliesMap.get(c.parent_comment_id) ?? [];
      existing.push(c);
      repliesMap.set(c.parent_comment_id, existing);
    }
  }

  const handleSend = () => {
    if (!replyText.trim()) return;
    onReply(replyText.trim(), replyingTo ?? undefined);
    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <View>
      {rootComments.map((comment) => {
        const replies = repliesMap.get(comment.id) ?? [];
        return (
          <View key={comment.id} className="mb-3">
            {/* Root comment */}
            <View className="flex-row gap-2">
              <Avatar uri={comment.author?.avatar_url} name={comment.author?.full_name} size="sm" />
              <View className="flex-1 bg-surface-card rounded-xl px-3 py-2">
                <Text className="text-xs font-bold text-text-primary">{comment.author?.full_name}</Text>
                <Text className="text-xs text-text-secondary mt-0.5">{comment.content}</Text>
              </View>
            </View>
            <View className="flex-row gap-3 ml-10 mt-1">
              <Text className="text-[10px] text-text-muted">{timeAgo(comment.created_at)}</Text>
              <Pressable onPress={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
                <Text className="text-[10px] text-violet-400 font-bold">Responder</Text>
              </Pressable>
            </View>

            {/* Replies */}
            {replies.length > 0 ? (
              <View className="ml-10 mt-2 gap-2 border-l-2 border-surface-border pl-3">
                {replies.map((reply) => (
                  <View key={reply.id} className="flex-row gap-2">
                    <Avatar uri={reply.author?.avatar_url} name={reply.author?.full_name} size="sm" />
                    <View className="flex-1 bg-surface-elevated rounded-xl px-3 py-2">
                      <Text className="text-xs font-bold text-text-primary">{reply.author?.full_name}</Text>
                      <Text className="text-xs text-text-secondary mt-0.5">{reply.content}</Text>
                      <Text className="text-[10px] text-text-muted mt-1">{timeAgo(reply.created_at)}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}

            {/* Reply input */}
            {replyingTo === comment.id ? (
              <View className="ml-10 mt-2 flex-row gap-2">
                <TextInput
                  className="flex-1 bg-surface-card border border-surface-border rounded-xl px-3 py-2 text-xs text-text-primary"
                  placeholder={`Responder ${comment.author?.full_name?.split(" ")[0]}...`}
                  placeholderTextColor="#6E6580"
                  value={replyText}
                  onChangeText={setReplyText}
                  autoFocus
                />
                <Pressable
                  onPress={handleSend}
                  disabled={!replyText.trim() || isPending}
                  className="bg-violet-500 rounded-xl px-3 items-center justify-center"
                >
                  <Text className="text-white text-xs font-bold">↑</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        );
      })}

      {/* New comment input */}
      <View className="flex-row gap-2 mt-3 pt-3 border-t border-surface-border">
        <TextInput
          className="flex-1 bg-surface-card border border-surface-border rounded-xl px-3 py-2.5 text-xs text-text-primary"
          placeholder="Comentar..."
          placeholderTextColor="#6E6580"
          value={replyingTo ? "" : replyText}
          onChangeText={(v) => { setReplyingTo(null); setReplyText(v); }}
        />
        <Pressable
          onPress={() => { if (!replyingTo) handleSend(); }}
          disabled={(!replyText.trim() && !replyingTo) || isPending}
          className="bg-violet-500 rounded-xl px-4 items-center justify-center"
        >
          <Text className="text-white text-xs font-bold">Enviar</Text>
        </Pressable>
      </View>
    </View>
  );
}
