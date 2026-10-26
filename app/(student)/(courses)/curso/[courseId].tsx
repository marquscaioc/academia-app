import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, Text, View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../lib/auth/provider";
import { useCourseDetail } from "../../../../hooks/queries/useCourses";
import { useMarkLessonComplete } from "../../../../hooks/mutations/useCourseMutations";
import { LoadingScreen } from "../../../../components/ui/LoadingScreen";
import { AppIcon } from "../../../../components/ui";
import { font, amethystGlow } from "../../../../lib/design/tokens";
import { WebContainer } from "../../../../components/layout/WebContainer";
import { LessonVideo } from "../../../../components/courses/LessonVideo";
import { toast } from "../../../../stores/useToastStore";
import { useState } from "react";

export default function StudentCourseDetailScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { user } = useAuth();
  const { data: course, isLoading, error, refetch } = useCourseDetail(courseId ?? "", user?.id);
  const markComplete = useMarkLessonComplete();
  const [activeLessonIdx, setActiveLessonIdx] = useState<number | null>(null);

  if (isLoading) return <LoadingScreen />;
  if (error || !course) return <SafeAreaView className="flex-1 bg-dark-400 justify-center items-center gap-4 px-6">
    <Text className="text-text-primary font-sans">Não foi possível abrir este curso.</Text>
    <Pressable onPress={() => refetch()}><Text className="text-violet-400 font-sans">Tentar novamente</Text></Pressable>
    <Pressable onPress={() => router.back()}><Text className="text-text-muted font-sans">Voltar</Text></Pressable>
  </SafeAreaView>;

  const completedCount = course.lessons?.filter((l) => l.progress?.completed).length ?? 0;
  const totalCount = course.lessons?.length ?? 0;
  const activeLesson = activeLessonIdx !== null ? course.lessons?.[activeLessonIdx] : null;

  const handleComplete = () => {
    if (!user || !activeLesson) return;
    markComplete.mutate({ user_id: user.id, lesson_id: activeLesson.id }, { onSuccess: () => setActiveLessonIdx(null) });
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <WebContainer maxWidth={640}>
        <Pressable onPress={() => router.back()} className="mb-4 flex-row items-center gap-1.5 self-start">
          <AppIcon name="arrow-left" size={16} color="#6E6382" strokeWidth={2} />
          <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Voltar</Text>
        </Pressable>

        <Text
          className="text-[34px] leading-[38px] text-text-primary mb-2"
          style={{ fontFamily: font.display }}
        >
          {course.title}
        </Text>
        {course.description ? (
          <Text className="text-sm text-text-muted mb-4" style={{ fontFamily: font.regular }}>
            {course.description}
          </Text>
        ) : null}

        {!course.is_free ? <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-4">
          <Text className="text-text-muted font-sans">Este curso possui conteúdo restrito. Sua conta pode acessar as prévias gratuitas abaixo.</Text>
        </View> : null}
        {/* Progress bar */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2.5">
              <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                <AppIcon name="progress" size={18} color="#9B40D8" strokeWidth={2} />
              </View>
              <Text
                className="text-xs text-text-muted uppercase"
                style={{ fontFamily: font.semibold, letterSpacing: 2 }}
              >
                Progresso
              </Text>
            </View>
            <Text className="text-xs text-violet-400" style={{ fontFamily: font.bold }}>
              {completedCount}/{totalCount}
            </Text>
          </View>
          <View className="h-2 bg-surface-border rounded-full overflow-hidden">
            <View
              className="h-full bg-violet-500 rounded-full"
              style={{ width: totalCount ? `${(completedCount / totalCount) * 100}%` : "0%" }}
            />
          </View>
        </View>

        {/* Active video player */}
        {activeLesson ? (
          <View className="bg-black border border-surface-border rounded-3xl overflow-hidden mb-6">
            {activeLesson.video_url ? <LessonVideo key={activeLesson.id} uri={activeLesson.video_url} /> : null}
            {activeLesson.description ? <Text className="text-text-secondary bg-surface-card p-4 font-sans">{activeLesson.description}</Text> : null}
            {activeLesson.document_url ? <Pressable accessibilityRole="link" className="bg-surface-card px-4 py-4"
              onPress={async () => {
                const url = activeLesson.document_url!;
                if (!/^https?:\/\//i.test(url)) { toast.error("Documento indisponível"); return; }
                try { await Linking.openURL(url); } catch { toast.error("Não foi possível abrir o PDF", "Tente novamente."); }
              }}><Text className="text-violet-400 font-sans">Abrir e-book / PDF</Text></Pressable> : null}
            <View className="p-4 bg-surface-card flex-row items-center justify-between gap-3">
              <Text
                className="text-sm text-text-primary flex-1"
                style={{ fontFamily: font.semibold }}
              >
                {activeLesson.title}
              </Text>
              {!activeLesson.progress?.completed ? (
                <Pressable onPress={handleComplete} disabled={markComplete.isPending} style={amethystGlow} className="rounded-2xl overflow-hidden">
                  <LinearGradient
                    colors={["#781BB6", "#C636E0"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.9 }}
                    style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 16 }}
                  >
                    <Text
                      className="text-white text-xs"
                      style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                    >
                      {markComplete.isPending ? "Salvando..." : "Marcar concluída"}
                    </Text>
                  </LinearGradient>
                </Pressable>
              ) : (
                <View className="bg-success-500/15 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5">
                  <AppIcon name="check" size={14} color="#34D399" strokeWidth={2.5} />
                  <Text className="text-success-500 text-xs" style={{ fontFamily: font.bold }}>
                    Concluída
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : null}

        <Text
          className="text-[11px] text-text-muted uppercase mb-1"
          style={{ fontFamily: font.semibold, letterSpacing: 2 }}
        >
          Conteúdo
        </Text>
        <Text
          className="text-2xl text-text-primary mb-3"
          style={{ fontFamily: font.display }}
        >
          Aulas
        </Text>
        {!course.lessons?.length ? <Text className="text-text-muted mb-4 font-sans">Nenhuma aula disponível para sua conta neste momento.</Text> : null}
        <View className="gap-2 pb-10">
          {course.lessons?.map((l, idx) => {
            const isActive = activeLessonIdx === idx;
            const isDone = l.progress?.completed;
            return (
              <Pressable
                key={l.id}
                onPress={() => setActiveLessonIdx(isActive ? null : idx)}
                className={`border rounded-2xl p-4 flex-row items-center gap-3 active:bg-surface-hover ${
                  isActive ? "bg-violet-500/10 border-violet-400/40" : "bg-surface-card border-surface-border"
                }`}
              >
                <View className={`w-9 h-9 rounded-xl items-center justify-center ${
                  isDone ? "bg-success-500" : isActive ? "bg-violet-500" : "bg-surface-elevated"
                }`}>
                  {isDone ? (
                    <AppIcon name="check" size={16} color="#FFFFFF" strokeWidth={2.5} />
                  ) : (
                    <Text
                      className={`text-xs ${isActive ? "text-white" : "text-text-muted"}`}
                      style={{ fontFamily: font.bold }}
                    >
                      {idx + 1}
                    </Text>
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className={`text-sm ${isActive ? "text-violet-400" : "text-text-primary"}`}
                    style={{ fontFamily: font.semibold }}
                  >
                    {l.title}
                  </Text>
                  {l.duration_seconds ? (
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <AppIcon name="clock" size={12} color="#6E6382" strokeWidth={2} />
                      <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                        {Math.floor(l.duration_seconds / 60)}min
                      </Text>
                    </View>
                  ) : null}
                </View>
                {l.video_url || l.document_url ? (
                  <View className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                    <AppIcon name="play" size={15} color="#9B40D8" strokeWidth={2} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
