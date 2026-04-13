import { useLocalSearchParams, router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth/provider";
import { useChallengeDetail, useLeaderboard, useChallengeEntries, useMyParticipation } from "../../hooks/queries/useChallenges";
import { useChallengePointRules } from "../../hooks/queries/useChallengePointRules";
import { useChallengeTeams } from "../../hooks/queries/useChallengeTeams";
import { useDailyPose } from "../../hooks/queries/useDailyPose";
import { useJoinChallenge, useSubmitChallengeEntry } from "../../hooks/mutations/useChallengeMutations";
import { useCreateTeam, useJoinTeam } from "../../hooks/mutations/useTeamMutations";
import { useConvertToGroup } from "../../hooks/mutations/useChallengeToGroup";
import { LeaderboardRow } from "../../components/social/LeaderboardRow";
import { TeamLeaderboard } from "../../components/challenges/TeamLeaderboard";
import { TeamSelector } from "../../components/challenges/TeamSelector";
import { PhotoCaptureModal } from "../../components/challenges/PhotoCaptureModal";
import { PointRuleSelector } from "../../components/challenges/PointRuleSelector";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { shareLeaderboardCard } from "../../lib/utils/generateLeaderboardCard";
import { supabase } from "../../lib/supabase/client";
import { useState } from "react";
import { PointRule } from "../../hooks/queries/useChallengePointRules";

export default function ChallengeDetailScreen() {
  const { challengeId } = useLocalSearchParams<{ challengeId: string }>();
  const { user } = useAuth();
  const { data: challenge, isLoading } = useChallengeDetail(challengeId ?? "");
  const { data: leaderboard } = useLeaderboard(challengeId ?? "");
  const { data: entries } = useChallengeEntries(challengeId ?? "");
  const { data: participation } = useMyParticipation(challengeId ?? "", user?.id);
  const { data: pointRules } = useChallengePointRules(challengeId ?? "");
  const { data: teams } = useChallengeTeams(challenge?.team_mode ? challengeId : undefined);
  const { data: dailyPose } = useDailyPose();
  const joinChallenge = useJoinChallenge();
  const submitEntry = useSubmitChallengeEntry();
  const createTeam = useCreateTeam();
  const joinTeam = useJoinTeam();
  const convertToGroup = useConvertToGroup();

  const [tab, setTab] = useState<"leaderboard" | "feed">("leaderboard");
  const [showCamera, setShowCamera] = useState(false);
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [selectedRule, setSelectedRule] = useState<PointRule | null>(null);
  const [showPointSelector, setShowPointSelector] = useState(false);

  if (isLoading || !challenge) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center">
        <ActivityIndicator size="large" color="#781BB6" />
      </SafeAreaView>
    );
  }

  const isJoined = !!participation;
  const isActive = challenge.status === "active";
  const isEnded = challenge.status === "ended";
  const isCreator = challenge.created_by === user?.id;
  const hasCustomPoints = challenge.scoring_mode === "custom_points" && pointRules && pointRules.length > 0;

  const handleJoin = () => {
    if (!user) return;
    if (challenge.team_mode) {
      // Join challenge first, then show team selector
      joinChallenge.mutate({ challenge_id: challenge.id, user_id: user.id }, {
        onSuccess: () => setShowTeamSelector(true),
      });
    } else {
      joinChallenge.mutate({ challenge_id: challenge.id, user_id: user.id });
    }
  };

  const handleCheckIn = () => {
    if (!user) return;
    if (hasCustomPoints) {
      setShowPointSelector(true);
      return;
    }
    if (challenge.require_photo_proof) {
      setShowCamera(true);
    } else {
      submitEntry.mutate({
        challenge_id: challenge.id,
        user_id: user.id,
        caption: "Check-in!",
        points: 1,
      });
    }
  };

  const handlePhotoCapture = async (uri: string) => {
    if (!user) return;
    setShowCamera(false);

    // Upload photo
    const fileName = `${user.id}/${Date.now()}.jpg`;
    const response = await fetch(uri);
    const blob = await response.blob();
    const { error } = await supabase.storage.from("feed-media").upload(fileName, blob, { contentType: "image/jpeg" });

    let photoUrl: string | undefined;
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("feed-media").getPublicUrl(fileName);
      photoUrl = publicUrl;
    }

    submitEntry.mutate({
      challenge_id: challenge.id,
      user_id: user.id,
      photo_url: photoUrl,
      caption: "Check-in com foto!",
      points: selectedRule?.points ?? 1,
    });
    setSelectedRule(null);
  };

  const handlePointRuleSelect = (rule: PointRule) => {
    setSelectedRule(rule);
    setShowPointSelector(false);
    if (challenge.require_photo_proof) {
      setShowCamera(true);
    } else {
      submitEntry.mutate({
        challenge_id: challenge.id,
        user_id: user!.id,
        caption: rule.label,
        points: rule.points,
      });
    }
  };

  const handleShareLeaderboard = () => {
    if (!leaderboard) return;
    shareLeaderboardCard({
      challengeTitle: challenge.title,
      entries: leaderboard.map((e, idx) => ({
        rank: idx + 1,
        name: e.profile?.full_name ?? "Usuario",
        score: e.total_score,
      })),
      userRank: leaderboard.findIndex((e) => e.user_id === user?.id) + 1,
      userName: user?.email,
      userScore: participation?.total_score,
    });
  };

  const handleConvertToGroup = () => {
    if (!user) return;
    convertToGroup.mutate({ challengeId: challenge.id, userId: user.id });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(challenge.ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6">
          <Pressable onPress={() => router.back()} className="mb-4">
            <Text className="text-violet-400 font-medium">← Voltar</Text>
          </Pressable>

          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-2xl font-black text-text-primary flex-1 mr-3">
              {challenge.title}
            </Text>
            <Badge
              label={isActive ? "Ativo" : isEnded ? "Encerrado" : "Em breve"}
              variant={isActive ? "success" : "default"}
              size="md"
            />
          </View>

          {challenge.description ? (
            <Text className="text-sm text-text-muted mb-4">{challenge.description}</Text>
          ) : null}

          {/* Stats */}
          <View className="flex-row gap-3 mb-6">
            <Card className="flex-1 items-center py-3">
              <Text className="text-xl font-black text-text-primary">{leaderboard?.length ?? 0}</Text>
              <Text className="text-[10px] text-text-muted">Participantes</Text>
            </Card>
            <Card className="flex-1 items-center py-3">
              <Text className="text-xl font-black text-violet-400">{daysLeft}</Text>
              <Text className="text-[10px] text-text-muted">Dias restantes</Text>
            </Card>
            {isJoined ? (
              <Card className="flex-1 items-center py-3">
                <Text className="text-xl font-black text-ice-400">{participation?.total_score ?? 0}</Text>
                <Text className="text-[10px] text-text-muted">Meu score</Text>
              </Card>
            ) : null}
          </View>

          {/* Join / Check-in / Convert */}
          {!isJoined && isActive ? (
            <Pressable
              onPress={handleJoin}
              disabled={joinChallenge.isPending}
              className="bg-violet-500 rounded-2xl py-4 items-center mb-4 active:bg-violet-600"
            >
              {joinChallenge.isPending ? <ActivityIndicator color="#fff" /> : (
                <Text className="text-white font-black text-base">Participar do Desafio</Text>
              )}
            </Pressable>
          ) : isJoined && isActive ? (
            <Pressable
              onPress={handleCheckIn}
              disabled={submitEntry.isPending}
              className="bg-success-500 rounded-2xl py-4 items-center mb-4 active:bg-success-600"
            >
              {submitEntry.isPending ? <ActivityIndicator color="#fff" /> : (
                <Text className="text-white font-black text-base">
                  {hasCustomPoints ? "Registrar Atividade" : "Fazer Check-in"}
                </Text>
              )}
            </Pressable>
          ) : null}

          {/* Convert to group (ended + creator) */}
          {isEnded && isCreator ? (
            <Pressable
              onPress={handleConvertToGroup}
              disabled={convertToGroup.isPending}
              className="bg-violet-500/10 border border-violet-500/30 rounded-2xl py-3.5 items-center mb-4"
            >
              <Text className="text-violet-400 font-bold text-sm">
                {convertToGroup.isPending ? "Convertendo..." : "Converter em Grupo"}
              </Text>
            </Pressable>
          ) : null}

          {/* Share leaderboard */}
          {leaderboard && leaderboard.length > 0 ? (
            <Pressable onPress={handleShareLeaderboard} className="mb-4">
              <Text className="text-violet-400 text-xs font-bold text-center">Compartilhar Ranking</Text>
            </Pressable>
          ) : null}

          {/* Tabs */}
          <View className="flex-row border-b border-surface-border mb-4">
            <Pressable
              onPress={() => setTab("leaderboard")}
              className={`flex-1 py-3 items-center border-b-2 ${tab === "leaderboard" ? "border-violet-500" : "border-transparent"}`}
            >
              <Text className={`font-bold text-sm ${tab === "leaderboard" ? "text-violet-400" : "text-text-muted"}`}>
                {challenge.team_mode ? "Equipes" : "Ranking"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTab("feed")}
              className={`flex-1 py-3 items-center border-b-2 ${tab === "feed" ? "border-violet-500" : "border-transparent"}`}
            >
              <Text className={`font-bold text-sm ${tab === "feed" ? "text-violet-400" : "text-text-muted"}`}>
                Atividade
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <View className="px-6 pb-10">
          {tab === "leaderboard" ? (
            challenge.team_mode && teams ? (
              <TeamLeaderboard teams={teams} />
            ) : leaderboard?.length ? (
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
              <Text className="text-sm text-text-muted text-center py-8">Nenhum participante ainda.</Text>
            )
          ) : entries?.length ? (
            <View className="gap-3">
              {entries.map((entry) => (
                <Card key={entry.id} variant="outlined">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Text className="text-sm font-bold text-text-primary">
                      {entry.profile?.full_name ?? "Usuario"}
                    </Text>
                    <Text className="text-xs text-violet-400 font-bold">+{entry.points} pts</Text>
                  </View>
                  {entry.caption ? (
                    <Text className="text-sm text-text-secondary">{entry.caption}</Text>
                  ) : null}
                  {entry.photo_url ? (
                    <Image
                      source={{ uri: entry.photo_url }}
                      style={{ width: "100%", height: 200, borderRadius: 12, marginTop: 8 }}
                      contentFit="cover"
                    />
                  ) : null}
                  <Text className="text-xs text-text-muted mt-2">
                    {new Date(entry.created_at).toLocaleString("pt-BR")}
                  </Text>
                </Card>
              ))}
            </View>
          ) : (
            <Text className="text-sm text-text-muted text-center py-8">Nenhuma atividade ainda.</Text>
          )}
        </View>
      </ScrollView>

      {/* Photo capture modal */}
      <PhotoCaptureModal
        visible={showCamera}
        poseVerification={challenge.pose_verification}
        poseEmoji={dailyPose?.pose_emoji}
        poseDescription={dailyPose?.pose_description}
        onCapture={handlePhotoCapture}
        onClose={() => setShowCamera(false)}
      />

      {/* Team selector modal */}
      <TeamSelector
        visible={showTeamSelector}
        teams={teams ?? []}
        onJoinTeam={(teamId) => {
          if (!user || !challengeId) return;
          joinTeam.mutate({ challenge_id: challengeId, team_id: teamId, user_id: user.id });
          setShowTeamSelector(false);
        }}
        onCreateTeam={(name) => {
          if (!user || !challengeId) return;
          createTeam.mutate({ challenge_id: challengeId, name, user_id: user.id });
          setShowTeamSelector(false);
        }}
        onClose={() => setShowTeamSelector(false)}
      />

      {/* Point rule selector (bottom sheet style) */}
      {showPointSelector && hasCustomPoints ? (
        <View className="absolute bottom-0 left-0 right-0 bg-dark-200 border-t border-surface-border rounded-t-3xl px-6 pt-6 pb-10">
          <PointRuleSelector
            rules={pointRules!}
            selectedRuleId={selectedRule?.id ?? null}
            onSelect={handlePointRuleSelect}
          />
          <Pressable onPress={() => setShowPointSelector(false)} className="mt-4 items-center">
            <Text className="text-text-muted font-bold">Cancelar</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
