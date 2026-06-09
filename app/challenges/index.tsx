import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useChallenges } from "../../hooks/queries/useChallenges";
import { ChallengeCard } from "../../components/social/ChallengeCard";
import { AppIcon, SectionLabel } from "../../components/ui";
import { DisplayHeading } from "../../components/ui/DisplayHeading";
import { EmptyState } from "../../components/ui/EmptyState";
import { useAuth } from "../../lib/auth/provider";
import { amethystGlow, font } from "../../lib/design/tokens";
import { WebContainer } from "../../components/layout/WebContainer";

type Filter = "active" | "upcoming" | "ended";

const filters: { value: Filter; label: string }[] = [
  { value: "active", label: "Ativos" },
  { value: "upcoming", label: "Em breve" },
  { value: "ended", label: "Encerrados" },
];

export default function ChallengesScreen() {
  const { user, role } = useAuth();
  const [filter, setFilter] = useState<Filter>("active");
  const { data: challenges, isLoading } = useChallenges({ filter, userId: user?.id, role });

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        <WebContainer maxWidth={1180}>
        <View className="flex-row items-center justify-between mb-2">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5 py-1">
            <AppIcon name="arrow-left" size={18} color="#6E6382" strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>
              Voltar
            </Text>
          </Pressable>
          <Link href="/challenges/create" asChild>
            <Pressable className="rounded-full overflow-hidden" style={amethystGlow}>
              <LinearGradient
                colors={["#781BB6", "#C636E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={{ paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <AppIcon name="plus" size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text
                  className="text-white text-xs"
                  style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                >
                  Novo
                </Text>
              </LinearGradient>
            </Pressable>
          </Link>
        </View>

        <SectionLabel className="mb-2">Comunidade</SectionLabel>
        <DisplayHeading size="md" className="mb-6">
          Desafios.
        </DisplayHeading>

        <View className="flex-row gap-2 mb-5">
          {filters.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full border ${
                filter === f.value
                  ? "bg-violet-500 border-violet-400/80"
                  : "bg-surface-card/80 border-surface-border"
              }`}
            >
              <Text
                className={`text-sm ${
                  filter === f.value ? "text-white" : "text-text-secondary"
                }`}
                style={{ fontFamily: font.semibold }}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#9B40D8" />
          </View>
        ) : !challenges?.length ? (
          <EmptyState
            iconName="trophy"
            title="Nenhum desafio encontrado"
            description="Crie um desafio e convide seus amigos para competir!"
          />
        ) : (
          <FlatList
            data={challenges}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-3 pb-4"
            renderItem={({ item }) => (
              <ChallengeCard
                title={item.title}
                description={item.description}
                status={item.status}
                scoringMode={item.scoring_mode}
                startsAt={item.starts_at}
                endsAt={item.ends_at}
                creatorName={item.creator?.full_name}
                requirePhoto={item.require_photo_proof}
                onPress={() => router.push(`/challenges/${item.id}`)}
              />
            )}
          />
        )}
        </WebContainer>
      </View>
    </SafeAreaView>
  );
}
