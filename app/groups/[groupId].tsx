import { useLocalSearchParams, router } from "expo-router";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth/provider";
import { supabase } from "../../lib/supabase/client";
import { FeedPost } from "../../components/social/FeedPost";
import { Avatar } from "../../components/ui/Avatar";
import { useToggleReaction } from "../../hooks/mutations/useSocialMutations";

export default function GroupDetailScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toggleReaction = useToggleReaction();
  const [tab, setTab] = useState<"feed" | "members">("feed");
  const [newPost, setNewPost] = useState("");

  const { data: group } = useQuery({
    queryKey: ["groups", "detail", groupId],
    queryFn: async () => {
      const { data, error } = await supabase.from("groups").select("*").eq("id", groupId!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["feed", "group", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feed_posts")
        .select("*, author:profiles!author_id(full_name, avatar_url, display_name)")
        .eq("group_id", groupId!)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });

  const { data: members } = useQuery({
    queryKey: ["groups", "members", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select("*, profile:profiles!user_id(full_name, avatar_url)")
        .eq("group_id", groupId!);
      if (error) throw error;
      return data;
    },
    enabled: !!groupId && tab === "members",
  });

  const createPost = useMutation({
    mutationFn: async (content: string) => {
      const { error } = await supabase.from("feed_posts").insert({
        author_id: user!.id,
        content,
        post_type: "text",
        visibility: "public",
        group_id: groupId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed", "group", groupId] });
      setNewPost("");
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 border-b border-surface-border">
          <View className="flex-row items-center gap-3 mb-3">
            <Pressable onPress={() => router.back()}>
              <Text className="text-violet-400 font-medium">← Voltar</Text>
            </Pressable>
          </View>
          <Text className="text-2xl font-black text-text-primary">{group?.name ?? "Grupo"}</Text>
          {group?.description ? (
            <Text className="text-xs text-text-muted mt-1">{group.description}</Text>
          ) : null}
          <Text className="text-[10px] text-text-muted mt-1">{group?.member_count ?? 0} membros</Text>

          {/* Tabs */}
          <View className="flex-row gap-4 mt-4">
            <Pressable onPress={() => setTab("feed")}>
              <Text className={`text-sm font-bold pb-1 ${tab === "feed" ? "text-violet-400 border-b-2 border-violet-500" : "text-text-muted"}`}>
                Feed
              </Text>
            </Pressable>
            <Pressable onPress={() => setTab("members")}>
              <Text className={`text-sm font-bold pb-1 ${tab === "members" ? "text-violet-400 border-b-2 border-violet-500" : "text-text-muted"}`}>
                Membros
              </Text>
            </Pressable>
          </View>
        </View>

        {tab === "feed" ? (
          <View className="flex-1">
            {/* Composer */}
            <View className="px-6 py-3 flex-row gap-2 border-b border-surface-border">
              <TextInput
                className="flex-1 bg-surface-card border border-surface-border rounded-xl px-4 py-2.5 text-sm text-text-primary"
                placeholder="Escrever no grupo..."
                placeholderTextColor="#6E6580"
                value={newPost}
                onChangeText={setNewPost}
              />
              <Pressable
                onPress={() => newPost.trim() && createPost.mutate(newPost.trim())}
                disabled={!newPost.trim() || createPost.isPending}
                className="bg-violet-500 rounded-xl px-4 items-center justify-center"
              >
                <Text className="text-white font-bold text-xs">Postar</Text>
              </Pressable>
            </View>

            {postsLoading ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#781BB6" />
              </View>
            ) : (
              <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <FeedPost
                    authorName={item.author?.full_name ?? "Usuario"}
                    authorAvatar={item.author?.avatar_url}
                    content={item.content}
                    mediaUrls={item.media_urls}
                    postType={item.post_type}
                    likesCount={item.likes_count ?? 0}
                    commentsCount={item.comments_count ?? 0}
                    createdAt={item.created_at}
                    onLike={() => user && toggleReaction.mutate({ post_id: item.id, user_id: user.id, reaction_type: "like" })}
                  />
                )}
                ListEmptyComponent={
                  <View className="items-center py-10">
                    <Text className="text-3xl mb-3">💬</Text>
                    <Text className="text-text-muted text-sm">Nenhuma publicacao no grupo</Text>
                  </View>
                }
              />
            )}
          </View>
        ) : (
          <FlatList
            data={members}
            keyExtractor={(item) => item.id}
            contentContainerClassName="px-6 pt-4 gap-2 pb-10"
            renderItem={({ item }) => {
              const profile = item.profile as unknown as { full_name: string; avatar_url: string | null } | null;
              return (
                <View className="flex-row items-center gap-3 bg-surface-card border border-surface-border rounded-2xl p-4">
                  <Avatar uri={profile?.avatar_url} name={profile?.full_name} size="md" />
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-text-primary">{profile?.full_name}</Text>
                    <Text className="text-[10px] text-text-muted capitalize">{item.role}</Text>
                  </View>
                </View>
              );
            }}
            ListEmptyComponent={
              <View className="items-center py-10">
                <Text className="text-text-muted text-sm">Nenhum membro</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
