import { router } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useCourses } from "../../../hooks/queries/useCourses";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function StudentCoursesScreen() {
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses({ studentId: user?.id });

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-black text-text-primary mb-6">Aulas</Text>

        {isLoading ? (
          <View className="items-center py-10"><ActivityIndicator size="large" color="#781BB6" /></View>
        ) : !courses?.length ? (
          <EmptyState
            icon="🎓"
            title="Nenhuma aula disponivel"
            description="Seu personal ainda nao publicou cursos. Quando publicar, voce vera aqui."
          />
        ) : (
          <View className="gap-3 pb-10">
            {courses.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => router.push(`/(student)/(courses)/${c.id}`)}
                className="bg-surface-card border border-surface-border rounded-2xl p-5 active:bg-surface-hover"
              >
                <View className="flex-row gap-4">
                  {c.cover_url ? (
                    <Image source={{ uri: c.cover_url }} style={{ width: 80, height: 80, borderRadius: 12 }} contentFit="cover" />
                  ) : (
                    <View className="w-20 h-20 bg-violet-500/10 rounded-xl items-center justify-center">
                      <Text className="text-3xl">🎓</Text>
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-base font-bold text-text-primary mb-1">{c.title}</Text>
                    {c.description ? (
                      <Text className="text-xs text-text-muted mb-2" numberOfLines={2}>{c.description}</Text>
                    ) : null}
                    <Text className="text-xs text-violet-400 font-bold">
                      {c.lessons?.length ?? 0} aula{(c.lessons?.length ?? 0) !== 1 ? "s" : ""}
                    </Text>
                    {c.trainer?.full_name ? (
                      <Text className="text-[10px] text-text-muted mt-1">por {c.trainer.full_name}</Text>
                    ) : null}
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
