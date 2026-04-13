import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth/provider";
import { useUserProfile, useIsFollowing, useUserAchievements } from "../../hooks/queries/useFeed";
import { useFollowUser, useUnfollowUser } from "../../hooks/mutations/useSocialMutations";
import { Avatar } from "../../components/ui/Avatar";

export default function PublicProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user } = useAuth();
  const { data: profile, isLoading } = useUserProfile(userId ?? "");
  const { data: isFollowing } = useIsFollowing(user?.id, userId);
  const { data: achievements } = useUserAchievements(userId);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const isOwn = user?.id === userId;

  const handleToggleFollow = () => {
    if (!user || !userId) return;
    if (isFollowing) {
      unfollowUser.mutate({ follower_id: user.id, following_id: userId });
    } else {
      followUser.mutate({ follower_id: user.id, following_id: userId });
    }
  };

  if (isLoading || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center">
        <ActivityIndicator size="large" color="#A855F7" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6">
          <Pressable onPress={() => router.back()} className="mb-6">
            <Text className="text-text-muted font-medium text-sm">← Voltar</Text>
          </Pressable>

          {/* Profile header */}
          <View className="items-center mb-8">
            <Avatar uri={profile.avatar_url} name={profile.full_name} size="xl" />
            <Text className="text-2xl font-black text-text-primary mt-4">
              {profile.display_name ?? profile.full_name}
            </Text>
            {profile.bio ? (
              <Text className="text-sm text-text-muted mt-2 text-center max-w-[300px] leading-5">
                {profile.bio}
              </Text>
            ) : null}

            {/* Stats row */}
            <View className="flex-row gap-8 mt-6">
              <View className="items-center">
                <Text className="text-xl font-black text-text-primary">{profile.followers_count ?? 0}</Text>
                <Text className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Seguidores</Text>
              </View>
              <View className="items-center">
                <Text className="text-xl font-black text-text-primary">{profile.following_count ?? 0}</Text>
                <Text className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Seguindo</Text>
              </View>
              <View className="items-center">
                <Text className="text-xl font-black text-violet-400">{achievements?.length ?? 0}</Text>
                <Text className="text-[10px] text-text-muted uppercase tracking-wider font-bold">Badges</Text>
              </View>
            </View>

            {/* Follow button */}
            {!isOwn ? (
              <Pressable
                onPress={handleToggleFollow}
                disabled={followUser.isPending || unfollowUser.isPending}
                className={`mt-6 px-8 rounded-2xl ${
                  isFollowing ? "border border-surface-border" : "bg-violet-400 active:bg-violet-500"
                }`}
                style={{ paddingVertical: 14 }}
              >
                <Text className={`font-black text-sm ${isFollowing ? "text-text-secondary" : "text-dark-400"}`}>
                  {isFollowing ? "Seguindo" : "Seguir"}
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => router.push("/profile/edit")}
                className="mt-6 px-8 border border-surface-border rounded-2xl"
                style={{ paddingVertical: 14 }}
              >
                <Text className="text-text-secondary font-black text-sm">Editar perfil</Text>
              </Pressable>
            )}
          </View>

          {/* Achievements */}
          {achievements?.length ? (
            <View className="mb-8">
              <Text className="text-xs font-bold text-text-muted tracking-wider uppercase mb-4">
                Conquistas
              </Text>
              <View className="flex-row flex-wrap gap-3">
                {achievements.map((a: any) => (
                  <View
                    key={a.id}
                    className="bg-surface-card border border-surface-border rounded-2xl p-4 items-center"
                    style={{ width: "30%" }}
                  >
                    <Text className="text-3xl mb-2">{a.achievement?.icon ?? "🏆"}</Text>
                    <Text className="text-[10px] font-bold text-text-primary text-center" numberOfLines={2}>
                      {a.achievement?.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="bg-surface-card border border-surface-border rounded-2xl p-6 items-center mb-8">
              <Text className="text-3xl mb-2">🏆</Text>
              <Text className="text-sm text-text-muted">Nenhuma conquista ainda</Text>
            </View>
          )}

          {/* Role badge */}
          <View className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-3 mb-10">
            <Text className="text-lg">
              {profile.role === "trainer" ? "📋" : profile.role === "admin" ? "🛡️" : "💪"}
            </Text>
            <Text className="text-sm font-bold text-text-primary capitalize">{profile.role}</Text>
            <Text className="text-xs text-text-muted ml-auto">
              Desde {new Date(profile.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
