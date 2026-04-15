import { useLocalSearchParams, router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useAuth } from "../../lib/auth/provider";
import { useUserProfile, useIsFollowing, useUserAchievements } from "../../hooks/queries/useFeed";
import { useFollowUser, useUnfollowUser } from "../../hooks/mutations/useSocialMutations";
import { Avatar } from "../../components/ui/Avatar";
import { LoadingScreen } from "../../components/ui/LoadingScreen";
import { BigStat, DisplayHeading, Logo, SectionLabel } from "../../components/ui";

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
    return <LoadingScreen />;
  }

  const displayName = profile.display_name ?? profile.full_name ?? "";
  const memberSince = new Date(profile.created_at).toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  }).toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      {/* Full-height ambient gradient */}
      <LinearGradient
        colors={["rgba(120,27,182,0.28)", "rgba(198,54,224,0.08)", "transparent"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 0.8 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 520 }}
        pointerEvents="none"
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-4">
          {/* Masthead */}
          <Animated.View entering={FadeIn.duration(400)} className="flex-row items-center justify-between mb-10">
            <Pressable onPress={() => router.back()} className="flex-row items-center gap-2">
              <Text className="text-text-muted text-lg">←</Text>
              <Text className="text-text-muted text-[11px]" style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}>
                VOLTAR
              </Text>
            </Pressable>
            <View className="flex-row items-center gap-2.5">
              <Logo size="sm" />
              <Text className="text-[10px] text-fuchsia-400" style={{ fontFamily: "DMSans_700Bold", letterSpacing: 3 }}>
                PERFIL · {profile.role?.toUpperCase() ?? "ALUNO"}
              </Text>
            </View>
          </Animated.View>

          {/* Portrait — asymmetric editorial layout */}
          <Animated.View entering={FadeInDown.delay(80).springify()} className="mb-4">
            <Avatar uri={profile.avatar_url} name={profile.full_name} size="xl" />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(160).springify()}>
            <DisplayHeading size="sm" italic tone="muted" className="mb-1">
              {profile.role === "trainer" ? "Coach," : "Atleta,"}
            </DisplayHeading>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220).springify()} className="mb-6">
            <Text
              className="text-text-primary"
              style={{
                fontFamily: "ArchivoBlack_400Regular",
                fontSize: 48,
                lineHeight: 48,
                letterSpacing: -2,
              }}
            >
              {displayName.toUpperCase()}
            </Text>
          </Animated.View>

          {profile.bio ? (
            <Animated.View entering={FadeInDown.delay(260).springify()}>
              <Text
                className="text-base text-text-secondary leading-7 mb-8 max-w-[90%]"
                style={{ fontFamily: "InstrumentSerif_400Regular_Italic" }}
              >
                “{profile.bio}”
              </Text>
            </Animated.View>
          ) : (
            <View className="mb-8" />
          )}

          {/* Action button */}
          <Animated.View entering={FadeInDown.delay(300).springify()} className="mb-10">
            {!isOwn ? (
              <Pressable
                onPress={handleToggleFollow}
                disabled={followUser.isPending || unfollowUser.isPending}
                className="overflow-hidden rounded-2xl"
              >
                {isFollowing ? (
                  <View className="border border-surface-border py-4 items-center">
                    <Text
                      className="text-text-secondary text-sm"
                      style={{ fontFamily: "DMSans_700Bold", letterSpacing: 1.5 }}
                    >
                      SEGUINDO
                    </Text>
                  </View>
                ) : (
                  <LinearGradient
                    colors={["#781BB6", "#C636E0"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ paddingVertical: 16, alignItems: "center" }}
                  >
                    <Text className="text-white text-sm" style={{ fontFamily: "DMSans_700Bold", letterSpacing: 1.5 }}>
                      + SEGUIR
                    </Text>
                  </LinearGradient>
                )}
              </Pressable>
            ) : (
              <Pressable
                onPress={() => router.push("/profile/edit")}
                className="border border-surface-border rounded-2xl py-4 items-center"
              >
                <Text
                  className="text-text-secondary text-sm"
                  style={{ fontFamily: "DMSans_700Bold", letterSpacing: 1.5 }}
                >
                  EDITAR PERFIL
                </Text>
              </Pressable>
            )}
          </Animated.View>

          {/* Stats — editorial split */}
          <Animated.View entering={FadeInDown.delay(360).springify()} className="mb-10">
            <SectionLabel withRule className="mb-5">
              Números
            </SectionLabel>
            <View className="flex-row items-end justify-between">
              <BigStat value={String(profile.followers_count ?? 0)} label="Seguidores" tone="primary" size="lg" />
              <View className="w-px h-12 bg-surface-border mx-3" />
              <BigStat value={String(profile.following_count ?? 0)} label="Seguindo" tone="primary" size="lg" align="center" />
              <View className="w-px h-12 bg-surface-border mx-3" />
              <BigStat value={String(achievements?.length ?? 0)} label="Badges" tone="accent" size="lg" align="center" />
            </View>
          </Animated.View>

          {/* Achievements */}
          <Animated.View entering={FadeInDown.delay(420).springify()} className="mb-8">
            <SectionLabel withRule className="mb-4">
              Conquistas
            </SectionLabel>
            {achievements?.length ? (
              <View className="flex-row flex-wrap gap-3">
                {achievements.map((a: { id: string; achievement?: { icon?: string; name?: string } }, idx: number) => (
                  <Animated.View
                    key={a.id}
                    entering={FadeInDown.delay(460 + idx * 40).springify()}
                    style={{ width: "30%" }}
                  >
                    <View className="bg-surface-card border border-surface-border rounded-2xl p-4 items-center overflow-hidden">
                      <LinearGradient
                        colors={["rgba(198,54,224,0.1)", "transparent"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                        pointerEvents="none"
                      />
                      <Text className="text-3xl mb-2">{a.achievement?.icon ?? "🏆"}</Text>
                      <Text
                        className="text-[10px] text-text-primary text-center"
                        style={{ fontFamily: "DMSans_700Bold", letterSpacing: 0.3 }}
                        numberOfLines={2}
                      >
                        {a.achievement?.name}
                      </Text>
                    </View>
                  </Animated.View>
                ))}
              </View>
            ) : (
              <View className="bg-surface-card border border-surface-border rounded-2xl p-8 items-center overflow-hidden">
                <LinearGradient
                  colors={["rgba(120,27,182,0.08)", "transparent"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
                  pointerEvents="none"
                />
                <Text className="text-4xl mb-3">🏆</Text>
                <DisplayHeading size="sm" italic tone="muted">
                  Nenhuma conquista ainda
                </DisplayHeading>
              </View>
            )}
          </Animated.View>

          {/* Colophon */}
          <View className="flex-row items-center justify-between pb-10 pt-2">
            <Text className="text-[10px] text-text-muted" style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}>
              MEMBRO · {memberSince}
            </Text>
            <View className="flex-1 h-px bg-surface-border mx-3" />
            <Text className="text-[10px] text-fuchsia-400/60" style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}>
              ROYAL AMETHYST
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
