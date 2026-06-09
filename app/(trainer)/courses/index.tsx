import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useCourses } from "../../../hooks/queries/useCourses";
import { useCreateCourse, useTogglePublishCourse } from "../../../hooks/mutations/useCourseMutations";
import { EmptyState } from "../../../components/ui/EmptyState";
import { AppIcon } from "../../../components/ui";
import { font } from "../../../lib/design/tokens";

export default function TrainerCoursesScreen() {
  const { user } = useAuth();
  const { data: courses, isLoading } = useCourses({ trainerId: user?.id });
  const create = useCreateCourse();
  const togglePublish = useTogglePublishCourse();
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!user || !title.trim()) return;
    await create.mutateAsync({
      trainer_id: user.id,
      title: title.trim(),
      description: description.trim() || undefined,
    });
    setTitle("");
    setDescription("");
    setShowNew(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-4">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <AppIcon name="chevron-left" size={18} color="#6E6382" strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Voltar</Text>
          </Pressable>
          <View className="items-center">
            <Text className="text-text-muted uppercase mb-0.5" style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 2 }}>Conteudo</Text>
            <Text className="text-2xl text-text-primary" style={{ fontFamily: font.display }}>Aulas</Text>
          </View>
          <Pressable onPress={() => setShowNew(!showNew)} className="flex-row items-center gap-1.5 bg-violet-500 px-3 py-1.5 rounded-xl">
            <AppIcon name="plus" size={16} color="#FFFFFF" strokeWidth={2} />
            <Text className="text-white text-xs" style={{ fontFamily: font.bold }}>Curso</Text>
          </Pressable>
        </View>

        {showNew ? (
          <View className="bg-surface-card border border-surface-border rounded-3xl p-5 mb-4">
            <Text className="text-violet-400 mb-3 uppercase" style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}>Novo curso</Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary mb-3"
              placeholder="Titulo do curso"
              placeholderTextColor="#6E6382"
              value={title}
              onChangeText={setTitle}
              style={{ fontFamily: font.regular }}
            />
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary mb-3"
              placeholder="Descricao"
              placeholderTextColor="#6E6382"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 60, textAlignVertical: "top", fontFamily: font.regular }}
            />
            <Pressable
              onPress={handleCreate}
              disabled={!title.trim() || create.isPending}
              className={`rounded-2xl py-3 items-center ${title.trim() ? "bg-violet-500" : "bg-surface-border"}`}
            >
              {create.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className={`text-sm ${title.trim() ? "text-white" : "text-text-muted"}`} style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>Criar curso</Text>
              )}
            </Pressable>
          </View>
        ) : null}

        {isLoading ? (
          <View className="items-center py-10"><ActivityIndicator size="large" color="#781BB6" /></View>
        ) : !courses?.length ? (
          <EmptyState
            iconName="courses"
            title="Nenhum curso ainda"
            description="Crie cursos com videoaulas para seus alunos assistirem. Inclua tecnicas, dicas de execucao, ou conteudo teorico."
          />
        ) : (
          <View className="gap-3 pb-10">
            {courses.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => router.push(`/(trainer)/courses/${c.id}`)}
                className="bg-surface-card border border-surface-border rounded-2xl p-5 active:bg-surface-hover"
              >
                <View className="flex-row items-start gap-4">
                  {c.cover_url ? (
                    <Image source={{ uri: c.cover_url }} style={{ width: 64, height: 64, borderRadius: 16 }} contentFit="cover" />
                  ) : (
                    <View className="w-16 h-16 bg-violet-500/15 border border-violet-500/25 rounded-2xl items-center justify-center">
                      <AppIcon name="courses" size={24} color="#9B40D8" strokeWidth={2} />
                    </View>
                  )}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-base text-text-primary flex-1" style={{ fontFamily: font.semibold }}>{c.title}</Text>
                      <View className={`px-2 py-1 rounded-full ${c.is_published ? "bg-success-500/15" : "bg-surface-elevated"}`}>
                        <Text className={`text-[10px] ${c.is_published ? "text-success-500" : "text-text-muted"}`} style={{ fontFamily: font.bold }}>
                          {c.is_published ? "Publicado" : "Rascunho"}
                        </Text>
                      </View>
                    </View>
                    {c.description ? (
                      <Text className="text-xs text-text-muted mb-2" numberOfLines={2} style={{ fontFamily: font.regular }}>{c.description}</Text>
                    ) : null}
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-1.5">
                        <AppIcon name="video" size={14} color="#6E6382" strokeWidth={2} />
                        <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>
                          {c.lessons?.length ?? 0} aula{(c.lessons?.length ?? 0) !== 1 ? "s" : ""}
                        </Text>
                      </View>
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          togglePublish.mutate({ id: c.id, is_published: !c.is_published });
                        }}
                        className="bg-violet-500/10 px-3 py-1 rounded-lg"
                      >
                        <Text className="text-violet-400 text-xs" style={{ fontFamily: font.bold }}>
                          {c.is_published ? "Despublicar" : "Publicar"}
                        </Text>
                      </Pressable>
                    </View>
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
