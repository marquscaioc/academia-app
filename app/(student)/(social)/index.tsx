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
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useFeedPosts } from "../../../hooks/queries/useFeed";
import { useCreatePost, useToggleReaction } from "../../../hooks/mutations/useSocialMutations";
import { FeedPost } from "../../../components/social/FeedPost";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Avatar } from "../../../components/ui/Avatar";

export default function SocialFeedScreen() {
  const { user, profile } = useAuth();
  const [feedMode, setFeedMode] = useState<"public" | "following">("public");
  const { data: posts, isLoading } = useFeedPosts(feedMode, user?.id);
  const createPost = useCreatePost();
  const toggleReaction = useToggleReaction();
  const [newPostContent, setNewPostContent] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [mediaUris, setMediaUris] = useState<string[]>([]);

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
    if ((!newPostContent.trim() && !mediaUris.length) || !user) return;

    // Upload media if any
    let uploadedUrls: string[] = [];
    for (const uri of mediaUris) {
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
      const response = await fetch(uri);
      const blob = await response.blob();
      const { error } = await supabase.storage.from("feed-media").upload(fileName, blob, { contentType: "image/jpeg" });
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from("feed-media").getPublicUrl(fileName);
        uploadedUrls.push(publicUrl);
      }
    }

    await createPost.mutateAsync({
      author_id: user.id,
      content: newPostContent.trim() || undefined,
      media_urls: uploadedUrls.length ? uploadedUrls : undefined,
    });
    setNewPostContent("");
    setMediaUris([]);
    setShowComposer(false);
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    toggleReaction.mutate({ post_id: postId, user_id: user.id, reaction_type: "like" });
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      {/* Header */}
      <View className="px-6 pt-6 pb-3 border-b border-surface-border">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-black text-text-primary">Feed</Text>
          <View className="flex-row gap-2">
            <Pressable onPress={() => router.push("/groups")} className="bg-surface-card border border-surface-border px-3 py-1.5 rounded-lg">
              <Text className="text-text-muted font-bold text-xs">👥 Grupos</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/challenges")} className="bg-violet-500/10 px-3 py-1.5 rounded-lg">
              <Text className="text-violet-400 font-bold text-xs">🏆 Desafios</Text>
            </Pressable>
          </View>
        </View>
        {/* Feed mode tabs */}
        <View className="flex-row gap-4">
          <Pressable onPress={() => setFeedMode("public")}>
            <Text className={`text-sm font-bold pb-1 ${feedMode === "public" ? "text-violet-400 border-b-2 border-violet-500" : "text-text-muted"}`}>
              Todos
            </Text>
          </Pressable>
          <Pressable onPress={() => setFeedMode("following")}>
            <Text className={`text-sm font-bold pb-1 ${feedMode === "following" ? "text-violet-400 border-b-2 border-violet-500" : "text-text-muted"}`}>
              Seguindo
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Composer toggle */}
      <Pressable
        onPress={() => setShowComposer(!showComposer)}
        className="px-6 py-3 flex-row items-center gap-3 border-b border-surface-border"
      >
        <Avatar uri={profile?.avatar_url} name={profile?.full_name} size="sm" />
        <Text className="text-sm text-text-muted flex-1">No que voce esta pensando?</Text>
      </Pressable>

      {/* Composer */}
      {showComposer ? (
        <View className="px-6 py-4 border-b border-surface-border bg-surface-card">
          <TextInput
            className="text-base text-text-primary min-h-[60px]"
            placeholder="Compartilhe seu treino, progresso ou motivacao..."
            placeholderTextColor="#6E6580"
            value={newPostContent}
            onChangeText={setNewPostContent}
            multiline
            autoFocus
            style={{ textAlignVertical: "top" }}
          />

          {/* Media preview */}
          {mediaUris.length > 0 ? (
            <View className="flex-row gap-2 mt-3">
              {mediaUris.map((uri, i) => (
                <View key={i} className="w-16 h-16 rounded-xl overflow-hidden">
                  <Image source={{ uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                </View>
              ))}
              <Pressable onPress={() => setMediaUris([])} className="w-16 h-16 bg-dark-300 rounded-xl items-center justify-center">
                <Text className="text-danger-500 text-xs font-bold">✕</Text>
              </Pressable>
            </View>
          ) : null}

          <View className="flex-row items-center justify-between mt-3">
            <Pressable onPress={pickMedia} className="flex-row items-center gap-2 bg-dark-300 px-3 py-2 rounded-lg">
              <Text className="text-sm">📷</Text>
              <Text className="text-text-muted text-xs font-bold">Foto</Text>
            </Pressable>
            <View className="flex-row gap-2">
              <Pressable onPress={() => { setShowComposer(false); setMediaUris([]); setNewPostContent(""); }} className="px-4 py-2">
                <Text className="text-text-muted text-sm">Cancelar</Text>
              </Pressable>
              <Pressable
                onPress={handlePost}
                disabled={(!newPostContent.trim() && !mediaUris.length) || createPost.isPending}
                className={`px-5 py-2 rounded-lg ${
                  newPostContent.trim() || mediaUris.length ? "bg-violet-500" : "bg-surface-border"
                }`}
              >
                {createPost.isPending ? (
                  <ActivityIndicator color="#0B080F" size="small" />
                ) : (
                  <Text className={`font-black text-sm ${newPostContent.trim() || mediaUris.length ? "text-white" : "text-text-muted"}`}>
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
          <ActivityIndicator size="large" color="#781BB6" />
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
              onProfile={() => router.push(`/profile/${item.author_id}`)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
