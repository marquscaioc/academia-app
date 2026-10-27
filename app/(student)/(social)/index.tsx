import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useAuth } from "../../../lib/auth/provider";
import { removeUnpublishedFeedMedia, uploadFeedPhoto } from "../../../lib/supabase/feedMedia";
import { useFeedPosts, usePostComments } from "../../../hooks/queries/useFeed";
import { useCreatePost, useToggleReaction, useCreateComment } from "../../../hooks/mutations/useSocialMutations";
import { FeedPost } from "../../../components/social/FeedPost";
import { CommentThread } from "../../../components/social/CommentThread";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Avatar } from "../../../components/ui/Avatar";
import { DisplayHeading } from "../../../components/ui/DisplayHeading";
import { AppIcon } from "../../../components/ui";
import { font, surfaceShadow } from "../../../lib/design/tokens";
import { WebContainer } from "../../../components/layout/WebContainer";
import { toast } from "../../../stores/useToastStore";

function CommentsSheet({ postId, userId, onClose }: { postId: string; userId?: string; onClose: () => void }) {
  const { data: comments, isLoading, isError, refetch } = usePostComments(postId);
  const createComment = useCreateComment();
  return (
    <Modal visible animationType="slide" transparent>
      <View className="flex-1 justify-end">
        <Pressable className="flex-1" onPress={onClose} />
        <View className="bg-dark-200 border-t border-surface-border rounded-t-3xl px-6 pt-6 pb-10 max-h-[80%]">
          <View className="flex-row items-center justify-between mb-4">
            <DisplayHeading size="sm" className="text-text-primary">Comentários</DisplayHeading>
            <Pressable onPress={onClose} className="w-9 h-9 rounded-2xl bg-surface-card border border-surface-border items-center justify-center">
              <AppIcon name="close" size={18} color="#71717A" strokeWidth={2} />
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            {isLoading ? (
              <View className="items-center py-5" accessibilityRole="progressbar" accessibilityLabel="Carregando comentários">
                <ActivityIndicator color="#27272A" />
                <Text className="text-text-muted text-xs mt-2" style={{ fontFamily: font.regular }}>Carregando comentários...</Text>
              </View>
            ) : isError ? (
              <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-4">
                <Text accessibilityRole="alert" className="text-text-secondary text-sm" style={{ fontFamily: font.regular }}>
                  Não foi possível carregar os comentários.
                </Text>
                <Pressable onPress={() => { void refetch(); }} accessibilityRole="button" className="self-start py-3">
                  <Text className="text-violet-400 text-sm" style={{ fontFamily: font.semibold }}>Tentar novamente</Text>
                </Pressable>
              </View>
            ) : !comments?.length ? (
              <Text className="text-text-muted text-sm mb-4" style={{ fontFamily: font.regular }}>Nenhum comentário ainda. Inicie a conversa.</Text>
            ) : null}
            <CommentThread
              comments={comments ?? []}
              postId={postId}
              currentUserId={userId}
              onReply={async (content, parentId) => {
                if (!userId) throw new Error("Entre na sua conta para comentar.");
                await createComment.mutateAsync({ post_id: postId, author_id: userId, content, parent_comment_id: parentId });
              }}
              isPending={createComment.isPending}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function SocialFeedScreen() {
  const { user, profile } = useAuth();
  const [feedMode, setFeedMode] = useState<"public" | "following">("public");
  const { data: posts, isLoading, isError, refetch, isRefetching } = useFeedPosts(feedMode, user?.id);
  const createPost = useCreatePost();
  const toggleReaction = useToggleReaction();
  const [newPostContent, setNewPostContent] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [mediaUris, setMediaUris] = useState<string[]>([]);
  const [commentsPostId, setCommentsPostId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const publishing = useRef(false);

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: 4,
      quality: 0.8,
    });
    if (!result.canceled) {
      setMediaUris(result.assets.map((a) => a.uri));
    }
  };

  const handlePost = async () => {
    if ((!newPostContent.trim() && !mediaUris.length) || !user || publishing.current) return;
    publishing.current = true;
    setIsPublishing(true);
    const uploadedPaths: string[] = [];
    try {
      for (const uri of mediaUris) {
        uploadedPaths.push(await uploadFeedPhoto(user.id, uri));
      }
      await createPost.mutateAsync({
        author_id: user.id,
        content: newPostContent.trim() || undefined,
        media_urls: uploadedPaths.length ? uploadedPaths : undefined,
      });
      setNewPostContent("");
      setMediaUris([]);
      setShowComposer(false);
    } catch {
      await removeUnpublishedFeedMedia(user.id, uploadedPaths).catch(() => {});
      toast.error("Não foi possível publicar", "Suas fotos e seu texto foram mantidos. Tente novamente.");
    } finally {
      publishing.current = false;
      setIsPublishing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <WebContainer maxWidth={1180}>
      {/* Header */}
      <View className="px-6 pt-6 pb-3 border-b border-surface-border">
        <View className="flex-row items-center justify-between mb-3">
          <DisplayHeading size="md" className="text-text-primary">Feed</DisplayHeading>
          <View className="flex-row gap-2">
            <Pressable onPress={() => router.push("/groups")} className="flex-row items-center gap-1.5 bg-surface-card border border-surface-border px-3 py-1.5 rounded-full">
              <AppIcon name="social" size={14} color="#52525B" strokeWidth={2} />
              <Text className="text-text-muted text-xs" style={{ fontFamily: font.semibold }}>Grupos</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/challenges")} className="flex-row items-center gap-1.5 bg-violet-500/10 border border-violet-500/25 px-3 py-1.5 rounded-full">
              <AppIcon name="trophy" size={14} color="#3F3F46" strokeWidth={2} />
              <Text className="text-violet-400 text-xs" style={{ fontFamily: font.semibold }}>Desafios</Text>
            </Pressable>
          </View>
        </View>
        {/* Feed mode tabs */}
        <View className="flex-row gap-4">
          <Pressable onPress={() => setFeedMode("public")}>
            <Text
              className={`text-sm pb-1 ${feedMode === "public" ? "text-violet-400 border-b-2 border-violet-500" : "text-text-muted"}`}
              style={{ fontFamily: font.semibold }}
            >
              Todos
            </Text>
          </Pressable>
          <Pressable onPress={() => setFeedMode("following")}>
            <Text
              className={`text-sm pb-1 ${feedMode === "following" ? "text-violet-400 border-b-2 border-violet-500" : "text-text-muted"}`}
              style={{ fontFamily: font.semibold }}
            >
              Seguindo
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Composer toggle */}
      <Pressable
        onPress={() => setShowComposer(!showComposer)}
        disabled={isPublishing}
        className="px-6 py-3 flex-row items-center gap-3 border-b border-surface-border"
      >
        <Avatar uri={profile?.avatar_url} name={profile?.full_name} size="sm" />
        <Text className="text-sm text-text-muted flex-1" style={{ fontFamily: font.regular }}>No que você está pensando?</Text>
      </Pressable>

      {/* Composer */}
      {showComposer ? (
        <View className="px-6 py-4 border-b border-surface-border bg-surface-card">
          <TextInput
            className="text-[15px] text-text-primary min-h-[60px]"
            placeholder="Compartilhe seu treino, progresso ou motivacao..."
            placeholderTextColor="#71717A"
            value={newPostContent}
            onChangeText={setNewPostContent}
            multiline
            editable={!isPublishing}
            autoFocus
            style={{ textAlignVertical: "top", fontFamily: font.regular }}
          />

          {/* Media preview */}
          {mediaUris.length > 0 ? (
            <View className="flex-row gap-2 mt-3">
              {mediaUris.map((uri, i) => (
                <View key={i} className="w-16 h-16 rounded-xl overflow-hidden">
                  <Image source={{ uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                </View>
              ))}
              <Pressable disabled={isPublishing} onPress={() => setMediaUris([])} className="w-16 h-16 bg-dark-300 border border-surface-border rounded-xl items-center justify-center">
                <AppIcon name="trash" size={18} color="#3F3F46" strokeWidth={2} />
              </Pressable>
            </View>
          ) : null}

          <View className="flex-row items-center justify-between mt-3">
            <Pressable disabled={isPublishing} onPress={pickMedia} className="flex-row items-center gap-2 bg-dark-300 border border-surface-border px-3 py-2 rounded-full">
              <AppIcon name="camera" size={16} color="#52525B" strokeWidth={2} />
              <Text className="text-text-muted text-xs" style={{ fontFamily: font.semibold }}>Foto</Text>
            </Pressable>
            <View className="flex-row gap-2 items-center">
              <Pressable disabled={isPublishing} onPress={() => { setShowComposer(false); setMediaUris([]); setNewPostContent(""); }} className="px-4 py-2">
                <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handlePost}
                disabled={(!newPostContent.trim() && !mediaUris.length) || isPublishing}
                style={newPostContent.trim() || mediaUris.length ? surfaceShadow : undefined}
                className={`px-5 py-2 rounded-full ${
                  newPostContent.trim() || mediaUris.length ? "bg-violet-500" : "bg-surface-border"
                }`}
              >
                {isPublishing ? (
                  <ActivityIndicator color="#F7F7F8" size="small" />
                ) : (
                  <Text
                    className={`text-sm ${newPostContent.trim() || mediaUris.length ? "text-white" : "text-text-muted"}`}
                    style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                  >
                    Publicar
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      ) : null}

      {/* Feed */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#27272A" />
        </View>
      ) : isError ? (
        <EmptyState
          iconName="warning"
          title="Feed indisponível"
          description="Não foi possível carregar as publicações. Verifique sua conexão e tente novamente."
          actionLabel="Tentar novamente"
          onAction={() => { void refetch(); }}
        />
      ) : !posts?.length ? (
        <EmptyState
          iconName="social"
          title="Nenhuma publicação"
          description={feedMode === "following" ? "Siga pessoas para acompanhar as publicações delas aqui." : "Seja o primeiro a compartilhar algo! Publique seu treino ou conquista."}
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshing={isRefetching}
          onRefresh={() => { void refetch(); }}
          renderItem={({ item }) => (
            <FeedPost
              authorName={item.author?.display_name ?? item.author?.full_name ?? "Usuario"}
              authorAvatar={item.author?.avatar_url}
              content={item.content}
              mediaUrls={item.media_urls}
              postType={item.post_type}
              likesCount={item.likes_count}
              commentsCount={item.comments_count}
              createdAt={item.created_at}
              reactions={["like", "fire", "strong", "clap"].map((type) => ({
                type,
                active: item.my_reaction === type,
                onPress: () => {
                  if (user) toggleReaction.mutate({ post_id: item.id, user_id: user.id, reaction_type: type });
                },
              }))}
              onComment={() => setCommentsPostId(item.id)}
              onProfile={() => router.push(`/profile/${item.author_id}`)}
            />
          )}
        />
      )}

      {commentsPostId ? (
        <CommentsSheet postId={commentsPostId} userId={user?.id} onClose={() => setCommentsPostId(null)} />
      ) : null}
      </WebContainer>
    </SafeAreaView>
  );
}
