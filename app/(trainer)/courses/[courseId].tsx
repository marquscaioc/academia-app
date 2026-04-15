import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useCourseDetail } from "../../../hooks/queries/useCourses";
import { useAddLesson } from "../../../hooks/mutations/useCourseMutations";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";

export default function CourseDetailScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { user } = useAuth();
  const { data: course, isLoading } = useCourseDetail(courseId ?? "");
  const addLesson = useAddLesson();

  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 0.7,
    });
    if (!result.canceled) setVideoUri(result.assets[0].uri);
  };

  const handleAdd = async () => {
    if (!user || !title.trim() || !course) return;
    setUploading(true);

    let videoUrl: string | undefined;
    if (videoUri) {
      const fileName = `${user.id}/${Date.now()}.mp4`;
      const response = await fetch(videoUri);
      const blob = await response.blob();
      const { error: upErr } = await supabase.storage.from("exercise-videos").upload(fileName, blob, { contentType: "video/mp4" });
      if (upErr) {
        setUploading(false);
        Alert.alert("Erro no upload", upErr.message || "Não foi possível enviar o vídeo. Tente novamente.");
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from("exercise-videos").getPublicUrl(fileName);
      videoUrl = publicUrl;
    }

    await addLesson.mutateAsync({
      course_id: course.id,
      title: title.trim(),
      video_url: videoUrl,
      sort_order: course.lessons?.length ?? 0,
    });

    setTitle("");
    setVideoUri(null);
    setShowNew(false);
    setUploading(false);
  };

  if (isLoading || !course) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-text-muted font-medium text-sm">← Voltar</Text>
        </Pressable>

        <Text className="text-2xl font-black text-text-primary mb-2">{course.title}</Text>
        {course.description ? (
          <Text className="text-sm text-text-muted mb-6">{course.description}</Text>
        ) : null}

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Aulas ({course.lessons?.length ?? 0})
          </Text>
          <Pressable onPress={() => setShowNew(!showNew)} className="bg-violet-500/10 px-3 py-1.5 rounded-lg">
            <Text className="text-violet-400 font-bold text-xs">+ Adicionar</Text>
          </Pressable>
        </View>

        {showNew ? (
          <View className="bg-surface-card border border-violet-500/30 rounded-2xl p-4 mb-4">
            <TextInput
              className="bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary mb-3"
              placeholder="Titulo da aula"
              placeholderTextColor="#6E6580"
              value={title}
              onChangeText={setTitle}
            />
            <Pressable
              onPress={pickVideo}
              className="bg-dark-300 border border-dashed border-surface-border rounded-xl py-3 items-center mb-3"
            >
              <Text className="text-text-muted text-xs font-bold">
                {videoUri ? "🎬 Video selecionado (toque para trocar)" : "📹 Selecionar video"}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleAdd}
              disabled={!title.trim() || uploading}
              className={`rounded-xl py-3 items-center ${title.trim() ? "bg-violet-500" : "bg-surface-border"}`}
            >
              {uploading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className={`font-black text-sm ${title.trim() ? "text-white" : "text-text-muted"}`}>Salvar Aula</Text>
              )}
            </Pressable>
          </View>
        ) : null}

        <View className="gap-2 pb-10">
          {course.lessons?.map((l, idx) => (
            <View key={l.id} className="bg-surface-card border border-surface-border rounded-xl p-4 flex-row items-center gap-3">
              <View className="w-8 h-8 bg-surface-elevated rounded-lg items-center justify-center">
                <Text className="text-xs font-bold text-text-muted">{idx + 1}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-text-primary">{l.title}</Text>
                {l.duration_seconds ? (
                  <Text className="text-xs text-text-muted">
                    {Math.floor(l.duration_seconds / 60)}min
                  </Text>
                ) : null}
              </View>
              {l.video_url ? <Text className="text-violet-400">▶</Text> : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
