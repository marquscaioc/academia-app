import { router } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useCourses } from "../../../hooks/queries/useCourses";
import { EmptyState } from "../../../components/ui/EmptyState";
import { AppIcon, SectionLabel } from "../../../components/ui";
import { font } from "../../../lib/design/tokens";
import { WebContainer } from "../../../components/layout/WebContainer";

export default function StudentCoursesScreen() {
  const { user } = useAuth();
  const { data: courses, isLoading, error, refetch } = useCourses({ studentId: user?.id });

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <WebContainer maxWidth={1180}>
        <View className="mb-6">
          <SectionLabel>Conteúdo</SectionLabel>
          <Text className="text-3xl text-text-primary mt-1.5" style={{ fontFamily: font.display }}>Aulas</Text>
        </View>

        {isLoading ? (
          <View className="items-center py-10"><ActivityIndicator size="large" color="#27272A" /></View>
        ) : error ? (
          <View className="items-center py-10 gap-3">
            <Text className="text-text-muted font-sans">Não foi possível carregar os cursos.</Text>
            <Pressable onPress={() => refetch()}><Text className="text-violet-400 font-sans">Tentar novamente</Text></Pressable>
          </View>
        ) : !courses?.length ? (
          <EmptyState
            iconName="courses"
            title="Nenhuma aula disponível"
            description="Seu personal ainda não publicou cursos. Quando publicar, você verá aqui."
          />
        ) : (
          <View className="flex-row flex-wrap gap-3 pb-10">
            {courses.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => router.push(`/(student)/(courses)/curso/${c.id}`)}
                className="grow basis-[360px] bg-surface-card border border-surface-border rounded-3xl p-5 active:bg-surface-hover"
              >
                <View className="flex-row items-center gap-4">
                  {c.cover_url ? (
                    <Image source={{ uri: c.cover_url }} style={{ width: 80, height: 80, borderRadius: 12 }} contentFit="cover" />
                  ) : (
                    <View className="w-20 h-20 bg-violet-500/15 border border-violet-500/25 rounded-2xl items-center justify-center">
                      <AppIcon name="courses" size={28} color="#3F3F46" strokeWidth={2} />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-base text-text-primary mb-1" style={{ fontFamily: font.semibold }}>{c.title}</Text>
                    {c.description ? (
                      <Text className="text-xs text-text-muted mb-2" numberOfLines={2} style={{ fontFamily: font.regular }}>{c.description}</Text>
                    ) : null}
                    <Text className="text-xs text-violet-400" style={{ fontFamily: font.bold }}>
                      {c.lessons?.length ?? 0} aula{(c.lessons?.length ?? 0) !== 1 ? "s" : ""}
                    </Text>
                    {c.trainer?.full_name ? (
                      <Text className="text-[10px] text-text-muted mt-1" style={{ fontFamily: font.regular }}>por {c.trainer.full_name}</Text>
                    ) : null}
                  </View>
                  <AppIcon name="chevron-right" size={18} color="#71717A" strokeWidth={2} />
                </View>
              </Pressable>
            ))}
          </View>
        )}
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
