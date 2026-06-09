import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, Text, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useCourseDetail } from "../../../hooks/queries/useCourses";
import { useMarkLessonComplete } from "../../../hooks/mutations/useCourseMutations";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import { font, amethystGlow } from "../../../lib/design/tokens";
import { useState } from "react";

export default function StudentCourseDetailScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { user } = useAuth();
  const { data: course, isLoading } = useCourseDetail(courseId ?? "", user?.id);
  const markComplete = useMarkLessonComplete();
  const [activeLessonIdx, setActiveLessonIdx] = useState<number | null>(null);

  if (isLoading || !course) {
    return <LoadingScreen />;
  }

  const completedCount = course.lessons?.filter((l) => l.progress?.completed).length ?? 0;
  const totalCount = course.lessons?.length ?? 0;
  const activeLesson = activeLessonIdx !== null ? course.lessons?.[activeLessonIdx] : null;

  const handleComplete = () => {
    if (!user || !activeLesson) return;
    markComplete.mutate({ user_id: user.id, lesson_id: activeLesson.id });
    setActiveLessonIdx(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>← Voltar</Text>
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

        {/* Progress bar */}
        <View className="bg-surface-card border border-surface-border rounded-3xl p-4 mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text
              className="text-xs text-text-muted uppercase"
              style={{ fontFamily: font.semibold, letterSpacing: 2 }}
            >
              Progresso
            </Text>
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
        {activeLesson?.video_url ? (
          <View className="bg-black border border-surface-border rounded-3xl overflow-hidden mb-6">
            {Platform.OS === "web" ? (
              <video
                src={activeLesson.video_url}
                controls
                autoPlay
                style={{ width: "100%", aspectRatio: "16/9" }}
              />
            ) : (
              <View className="items-center justify-center" style={{ aspectRatio: 16 / 9 }}>
                <Text className="text-white" style={{ fontFamily: font.regular }}>
                  Video player nao disponivel no web
                </Text>
              </View>
            )}
            <View className="p-4 bg-surface-card flex-row items-center justify-between gap-3">
              <Text
                className="text-sm text-text-primary flex-1"
                style={{ fontFamily: font.semibold }}
              >
                {activeLesson.title}
              </Text>
              {!activeLesson.progress?.completed ? (
                <Pressable onPress={handleComplete} style={amethystGlow} className="rounded-2xl overflow-hidden">
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
                      Marcar concluida
                    </Text>
                  </LinearGradient>
                </Pressable>
              ) : (
                <View className="bg-success-500/15 px-3 py-1.5 rounded-xl">
                  <Text className="text-success-500 text-xs" style={{ fontFamily: font.bold }}>
                    ✓ Concluida
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : null}

        <Text
          className="text-xs text-text-muted uppercase mb-3"
          style={{ fontFamily: font.semibold, letterSpacing: 2 }}
        >
          Aulas
        </Text>
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
                <View className={`w-8 h-8 rounded-xl items-center justify-center ${
                  isDone ? "bg-success-500" : isActive ? "bg-violet-500" : "bg-surface-elevated"
                }`}>
                  <Text
                    className={`text-xs ${isDone || isActive ? "text-white" : "text-text-muted"}`}
                    style={{ fontFamily: font.bold }}
                  >
                    {isDone ? "✓" : idx + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text
                    className={`text-sm ${isActive ? "text-violet-400" : "text-text-primary"}`}
                    style={{ fontFamily: font.semibold }}
                  >
                    {l.title}
                  </Text>
                  {l.duration_seconds ? (
                    <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                      {Math.floor(l.duration_seconds / 60)}min
                    </Text>
                  ) : null}
                </View>
                {l.video_url ? <Text className="text-violet-400 text-lg">▶</Text> : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
