import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useCourseDetail } from "../../../hooks/queries/useCourses";
import { useMarkLessonComplete } from "../../../hooks/mutations/useCourseMutations";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
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
          <Text className="text-text-muted font-medium text-sm">← Voltar</Text>
        </Pressable>

        <Text className="text-2xl font-black text-text-primary mb-2">{course.title}</Text>
        {course.description ? (
          <Text className="text-sm text-text-muted mb-4">{course.description}</Text>
        ) : null}

        {/* Progress bar */}
        <View className="bg-surface-card rounded-xl p-3 mb-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs font-bold text-text-muted uppercase tracking-wider">Progresso</Text>
            <Text className="text-xs font-black text-violet-400">{completedCount}/{totalCount}</Text>
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
          <View className="bg-black rounded-2xl overflow-hidden mb-6">
            {Platform.OS === "web" ? (
              <video
                src={activeLesson.video_url}
                controls
                autoPlay
                style={{ width: "100%", aspectRatio: "16/9" }}
              />
            ) : (
              <View className="items-center justify-center" style={{ aspectRatio: 16 / 9 }}>
                <Text className="text-white">Video player nao disponivel no web</Text>
              </View>
            )}
            <View className="p-4 bg-surface-card flex-row items-center justify-between">
              <Text className="text-sm font-bold text-text-primary flex-1">{activeLesson.title}</Text>
              {!activeLesson.progress?.completed ? (
                <Pressable
                  onPress={handleComplete}
                  className="bg-violet-500 px-4 py-2 rounded-lg active:bg-violet-600"
                >
                  <Text className="text-white font-bold text-xs">Marcar concluida</Text>
                </Pressable>
              ) : (
                <View className="bg-success-500/15 px-3 py-1.5 rounded-lg">
                  <Text className="text-success-500 font-bold text-xs">✓ Concluida</Text>
                </View>
              )}
            </View>
          </View>
        ) : null}

        <Text className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Aulas</Text>
        <View className="gap-2 pb-10">
          {course.lessons?.map((l, idx) => {
            const isActive = activeLessonIdx === idx;
            const isDone = l.progress?.completed;
            return (
              <Pressable
                key={l.id}
                onPress={() => setActiveLessonIdx(isActive ? null : idx)}
                className={`border rounded-xl p-4 flex-row items-center gap-3 active:bg-surface-hover ${
                  isActive ? "bg-violet-500/10 border-violet-500/30" : "bg-surface-card border-surface-border"
                }`}
              >
                <View className={`w-8 h-8 rounded-lg items-center justify-center ${
                  isDone ? "bg-success-500" : isActive ? "bg-violet-500" : "bg-surface-elevated"
                }`}>
                  <Text className={`text-xs font-bold ${
                    isDone || isActive ? "text-white" : "text-text-muted"
                  }`}>
                    {isDone ? "✓" : idx + 1}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className={`text-sm font-bold ${isActive ? "text-violet-400" : "text-text-primary"}`}>
                    {l.title}
                  </Text>
                  {l.duration_seconds ? (
                    <Text className="text-xs text-text-muted">{Math.floor(l.duration_seconds / 60)}min</Text>
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
