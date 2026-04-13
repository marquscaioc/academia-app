import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useFeedPosts } from "../../../hooks/queries/useFeed";
import { useCreatePost, useToggleReaction } from "../../../hooks/mutations/useSocialMutations";
import { FeedPost } from "../../../components/social/FeedPost";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Avatar } from "../../../components/ui/Avatar";

export default function SocialFeedScreen() {
  const { user, profile } = useAuth();
  const { data: posts, isLoading } = useFeedPosts("public");
  const createPost = useCreatePost();
  const toggleReaction = useToggleReaction();
  const [newPostContent, setNewPostContent] = useState("");
  const [showComposer, setShowComposer] = useState(false);

  const handlePost = async () => {
    if (!newPostContent.trim() || !user) return;
    await createPost.mutateAsync({
      author_id: user.id,
      content: newPostContent.trim(),
    });
    setNewPostContent("");
    setShowComposer(false);
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    toggleReaction.mutate({ post_id: postId, user_id: user.id, reaction_type: "like" });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 pt-6 pb-3 flex-row items-center justify-between border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-900">Feed</Text>
        <Pressable
          onPress={() => router.push("/challenges")}
          className="bg-accent-50 px-3 py-1.5 rounded-lg"
        >
          <Text className="text-accent-700 font-semibold text-xs">🏆 Desafios</Text>
        </Pressable>
      </View>

      {/* Composer toggle */}
      <Pressable
        onPress={() => setShowComposer(!showComposer)}
        className="px-6 py-3 flex-row items-center gap-3 border-b border-gray-100"
      >
        <Avatar uri={profile?.avatar_url} name={profile?.full_name} size="sm" />
        <Text className="text-sm text-gray-400 flex-1">
          {showComposer ? "Publicar algo..." : "No que voce esta pensando?"}
        </Text>
      </Pressable>

      {/* Composer */}
      {showComposer ? (
        <View className="px-6 py-3 border-b border-gray-100 bg-gray-50">
          <TextInput
            className="text-base text-gray-900 min-h-[60px]"
            placeholder="Compartilhe seu treino, progresso ou motivacao..."
            placeholderTextColor="#9ca3af"
            value={newPostContent}
            onChangeText={setNewPostContent}
            multiline
            autoFocus
            style={{ textAlignVertical: "top" }}
          />
          <View className="flex-row justify-end mt-2">
            <Pressable
              onPress={() => setShowComposer(false)}
              className="px-4 py-2 mr-2"
            >
              <Text className="text-gray-500 text-sm">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handlePost}
              disabled={!newPostContent.trim() || createPost.isPending}
              className={`px-5 py-2 rounded-lg ${
                newPostContent.trim() ? "bg-primary-600" : "bg-gray-300"
              }`}
            >
              {createPost.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white font-semibold text-sm">Publicar</Text>
              )}
            </Pressable>
          </View>
        </View>
      ) : null}

      {/* Feed */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : !posts?.length ? (
        <EmptyState
          icon="👥"
          title="Nenhuma publicacao"
          description="Seja o primeiro a compartilhar algo! Publique seu treino ou conquista."
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
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
              onLike={() => handleLike(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
