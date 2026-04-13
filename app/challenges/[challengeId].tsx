import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth/provider";
import { useChallengeDetail, useLeaderboard, useChallengeEntries, useMyParticipation } from "../../hooks/queries/useChallenges";
import { useJoinChallenge, useSubmitChallengeEntry } from "../../hooks/mutations/useChallengeMutations";
import { LeaderboardRow } from "../../components/social/LeaderboardRow";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { useState } from "react";

export default function ChallengeDetailScreen() {
  const { challengeId } = useLocalSearchParams<{ challengeId: string }>();
  const { user } = useAuth();
  const { data: challenge, isLoading } = useChallengeDetail(challengeId ?? "");
  const { data: leaderboard } = useLeaderboard(challengeId ?? "");
  const { data: entries } = useChallengeEntries(challengeId ?? "");
  const { data: participation } = useMyParticipation(challengeId ?? "", user?.id);
  const joinChallenge = useJoinChallenge();
  const submitEntry = useSubmitChallengeEntry();
  const [tab, setTab] = useState<"leaderboard" | "feed">("leaderboard");

  if (isLoading || !challenge) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </SafeAreaView>
    );
  }

  const isJoined = !!participation;
  const isActive = challenge.status === "active";

  const handleJoin = () => {
    if (!user) return;
    joinChallenge.mutate({ challenge_id: challenge.id, user_id: user.id });
  };

  const handleCheckIn = () => {
    if (!user) return;
    submitEntry.mutate({
      challenge_id: challenge.id,
      user_id: user.id,
      caption: "Check-in!",
      points: 1,
    });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(challenge.ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6">
          <Pressable onPress={() => router.back()} className="mb-4">
            <Text className="text-primary-600 font-medium">Voltar</Text>
          </Pressable>

          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-2xl font-bold text-gray-900 flex-1 mr-3">
              {challenge.title}
            </Text>
            <Badge
              label={challenge.status === "active" ? "Ativo" : challenge.status === "upcoming" ? "Em breve" : "Encerrado"}
              variant={challenge.status === "active" ? "success" : "default"}
              size="md"
            />
          </View>

          {challenge.description ? (
            <Text className="text-sm text-gray-500 mb-4">{challenge.description}</Text>
          ) : null}

          {/* Stats */}
          <View className="flex-row gap-3 mb-6">
            <Card className="flex-1 items-center py-3">
              <Text className="text-xl font-bold text-gray-900">{leaderboard?.length ?? 0}</Text>
              <Text className="text-[10px] text-gray-500">Participantes</Text>
            </Card>
            <Card className="flex-1 items-center py-3">
              <Text className="text-xl font-bold text-primary-600">{daysLeft}</Text>
              <Text className="text-[10px] text-gray-500">Dias restantes</Text>
            </Card>
            {isJoined ? (
              <Card className="flex-1 items-center py-3">
                <Text className="text-xl font-bold text-accent-600">{participation?.total_score ?? 0}</Text>
                <Text className="text-[10px] text-gray-500">Meu score</Text>
              </Card>
            ) : null}
          </View>

          {/* Join / Check-in */}
          {!isJoined && isActive ? (
            <Pressable
              onPress={handleJoin}
              disabled={joinChallenge.isPending}
              className="bg-primary-600 rounded-xl py-4 items-center mb-6 active:bg-primary-700"
            >
              {joinChallenge.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Participar do Desafio</Text>
              )}
            </Pressable>
          ) : isJoined && isActive ? (
            <Pressable
              onPress={handleCheckIn}
              disabled={submitEntry.isPending}
              className="bg-success-500 rounded-xl py-4 items-center mb-6 active:bg-success-600"
            >
              {submitEntry.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Fazer Check-in</Text>
              )}
            </Pressable>
          ) : null}

          {/* Tabs */}
          <View className="flex-row border-b border-gray-200 mb-4">
            <Pressable
              onPress={() => setTab("leaderboard")}
              className={`flex-1 py-3 items-center border-b-2 ${
                tab === "leaderboard" ? "border-primary-600" : "border-transparent"
              }`}
            >
              <Text className={`font-semibold text-sm ${tab === "leaderboard" ? "text-primary-600" : "text-gray-500"}`}>
                Ranking
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTab("feed")}
              className={`flex-1 py-3 items-center border-b-2 ${
                tab === "feed" ? "border-primary-600" : "border-transparent"
              }`}
            >
              <Text className={`font-semibold text-sm ${tab === "feed" ? "text-primary-600" : "text-gray-500"}`}>
                Atividade
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pb-10">
          {tab === "leaderboard" ? (
            leaderboard?.length ? (
              <View className="gap-1">
                {leaderboard.map((entry, idx) => (
                  <LeaderboardRow
                    key={entry.user_id}
                    rank={idx + 1}
                    name={entry.profile?.full_name ?? "Usuario"}
                    avatarUrl={entry.profile?.avatar_url}
                    score={entry.total_score}
                    checkIns={entry.check_in_count}
                    isCurrentUser={entry.user_id === user?.id}
                  />
                ))}
              </View>
            ) : (
              <Text className="text-sm text-gray-500 text-center py-8">
                Nenhum participante ainda.
              </Text>
            )
          ) : entries?.length ? (
            <View className="gap-3">
              {entries.map((entry) => (
                <Card key={entry.id} variant="outlined">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Text className="text-sm font-semibold text-gray-900">
                      {entry.profile?.full_name ?? "Usuario"}
                    </Text>
                    <Text className="text-xs text-gray-400">
                      +{entry.points} pts
                    </Text>
                  </View>
                  {entry.caption ? (
                    <Text className="text-sm text-gray-600">{entry.caption}</Text>
                  ) : null}
                  {entry.photo_url ? (
                    <Image
                      source={{ uri: entry.photo_url }}
                      style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 8 }}
                      contentFit="cover"
                    />
                  ) : null}
                  <Text className="text-xs text-gray-400 mt-2">
                    {new Date(entry.created_at).toLocaleString("pt-BR")}
                  </Text>
                </Card>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-gray-500 text-center py-8">
              Nenhuma atividade ainda.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
