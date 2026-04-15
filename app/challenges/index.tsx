import { Link, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChallenges } from "../../hooks/queries/useChallenges";
import { ChallengeCard } from "../../components/social/ChallengeCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { useAuth } from "../../lib/auth/provider";

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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-4">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary-600 font-medium">Voltar</Text>
          </Pressable>
          <Text className="text-xl font-bold text-gray-900">Desafios</Text>
          <Link href="/challenges/create" asChild>
            <Pressable className="bg-primary-600 px-3 py-1.5 rounded-lg">
              <Text className="text-white font-semibold text-xs">+ Novo</Text>
            </Pressable>
          </Link>
        </View>

        <View className="flex-row gap-2 mb-4">
          {filters.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full ${
                filter === f.value ? "bg-primary-600" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  filter === f.value ? "text-white" : "text-gray-600"
                }`}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : !challenges?.length ? (
          <EmptyState
            icon="🏆"
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
      </View>
    </SafeAreaView>
  );
}
