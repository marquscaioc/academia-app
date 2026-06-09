import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { font, amethystGlow } from "../../../lib/design/tokens";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useCourseDetail } from "../../../hooks/queries/useCourses";
import { useAddLesson } from "../../../hooks/mutations/useCourseMutations";
import { LoadingScreen } from "../../../components/ui/LoadingScreen";
import { AppIcon } from "../../../components/ui";

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
        <Pressable onPress={() => router.back()} className="mb-4 flex-row items-center gap-1.5 self-start">
          <AppIcon name="arrow-left" size={18} color="#6E6382" strokeWidth={2} />
          <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Voltar</Text>
        </Pressable>

        <Text className="text-3xl text-text-primary mb-2" style={{ fontFamily: font.display }}>{course.title}</Text>
        {course.description ? (
          <Text className="text-sm text-text-secondary mb-6" style={{ fontFamily: font.regular }}>{course.description}</Text>
        ) : null}

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xs text-text-muted uppercase" style={{ fontFamily: font.semibold, letterSpacing: 2 }}>
            Aulas ({course.lessons?.length ?? 0})
          </Text>
          <Pressable onPress={() => setShowNew(!showNew)} className="flex-row items-center gap-1.5 bg-violet-500/10 border border-violet-500/25 px-3 py-1.5 rounded-full">
            <AppIcon name="plus" size={14} color="#9B40D8" strokeWidth={2} />
            <Text className="text-violet-400 text-xs" style={{ fontFamily: font.semibold }}>Adicionar</Text>
          </Pressable>
        </View>

        {showNew ? (
          <View className="bg-surface-card border border-surface-border rounded-3xl p-4 mb-4">
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary mb-3"
              placeholder="Titulo da aula"
              placeholderTextColor="#6E6382"
              value={title}
              onChangeText={setTitle}
              style={{ fontFamily: font.regular }}
            />
            <Pressable
              onPress={pickVideo}
              className="flex-row items-center justify-center gap-2 bg-surface-card/80 border border-dashed border-surface-border rounded-2xl py-3 mb-3"
            >
              <AppIcon name="video" size={18} color={videoUri ? "#9B40D8" : "#6E6382"} strokeWidth={2} />
              <Text className={`text-xs ${videoUri ? "text-violet-400" : "text-text-muted"}`} style={{ fontFamily: font.semibold }}>
                {videoUri ? "Video selecionado (toque para trocar)" : "Selecionar video"}
              </Text>
            </Pressable>
            <Pressable
              onPress={handleAdd}
              disabled={!title.trim() || uploading}
              style={title.trim() ? amethystGlow : undefined}
            >
              <LinearGradient
                colors={title.trim() ? ["#781BB6", "#C636E0"] : ["#2A2435", "#2A2435"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                className="rounded-2xl py-3 items-center"
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text
                    className={`text-sm ${title.trim() ? "text-white" : "text-text-muted"}`}
                    style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                  >
                    Salvar aula
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        ) : null}

        <View className="gap-2 pb-10">
          {course.lessons?.map((l, idx) => (
            <View key={l.id} className="bg-surface-card border border-surface-border rounded-3xl p-4 flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-2xl bg-surface-elevated border border-surface-border items-center justify-center">
                <Text className="text-xs text-text-muted" style={{ fontFamily: font.bold }}>{idx + 1}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{l.title}</Text>
                {l.duration_seconds ? (
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <AppIcon name="clock" size={14} color="#6E6382" strokeWidth={2} />
                    <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                      {Math.floor(l.duration_seconds / 60)}min
                    </Text>
                  </View>
                ) : null}
              </View>
              {l.video_url ? (
                <View className="w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                  <AppIcon name="play" size={18} color="#9B40D8" strokeWidth={2} />
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
