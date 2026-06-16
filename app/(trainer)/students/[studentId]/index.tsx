import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../../lib/auth/provider";
import { useStudentTimeline } from "../../../../hooks/queries/useStudentTimeline";
import { useAddStudentNote } from "../../../../hooks/mutations/useStudentNotes";
import { TimelineItem } from "../../../../components/trainer/TimelineItem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../../lib/supabase/client";
import { AppIcon, DisplayHeading, EmptyState, SectionLabel } from "../../../../components/ui";
import { font } from "../../../../lib/design/tokens";
import { useQuestionnaireTemplates } from "../../../../hooks/queries/useCheckins";
import { useSendCheckIn } from "../../../../hooks/mutations/useCheckinMutations";
import { useGetOrCreateDM } from "../../../../hooks/mutations/useChatMutations";

export default function StudentDetailScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const { user } = useAuth();
  const { data: timeline, isLoading } = useStudentTimeline(studentId);
  const addNote = useAddStudentNote();
  const [noteText, setNoteText] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const { data: templates } = useQuestionnaireTemplates(user?.id);
  const sendCheckIn = useSendCheckIn();
  const getOrCreateDM = useGetOrCreateDM();

  const { data: student } = useQuery({
    queryKey: ["profiles", studentId],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", studentId!)
        .single();
      return data;
    },
    enabled: !!studentId,
  });

  const handleAddNote = async () => {
    if (!user || !studentId || !noteText.trim()) return;
    await addNote.mutateAsync({
      trainer_id: user.id,
      student_id: studentId,
      content: noteText.trim(),
    });
    setNoteText("");
    setShowNote(false);
  };

  const handleSendCheckIn = async (templateId: string) => {
    if (!user || !studentId) return;
    try {
      await sendCheckIn.mutateAsync({ user_id: studentId, template_id: templateId, trainer_id: user.id });
      setShowCheckin(false);
      setActionMsg("Check-in enviado ao aluno!");
    } catch {
      setActionMsg("Erro ao enviar check-in. Tente novamente.");
    }
  };

  const handleOpenChat = async () => {
    if (!user || !studentId) return;
    try {
      const convId = await getOrCreateDM.mutateAsync({ user_a: user.id, user_b: studentId });
      router.push(`/(trainer)/chat/${convId}` as never);
    } catch {
      setActionMsg("Erro ao abrir conversa.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        <View className="px-6 pt-6 pb-4 border-b border-surface-border">
          <Pressable onPress={() => router.back()} className="mb-3 flex-row items-center gap-1.5">
            <AppIcon name="arrow-left" size={18} color="#9B40D8" strokeWidth={2} />
            <Text className="text-violet-400" style={{ fontFamily: font.medium }}>Voltar</Text>
          </Pressable>
          <DisplayHeading size="md">{student?.full_name ?? "Aluno"}</DisplayHeading>
          <SectionLabel className="mt-2">Prontuario e Timeline</SectionLabel>

          <View className="flex-row flex-wrap gap-3 mt-4">
            <Pressable
              onPress={() => { setShowNote(!showNote); setShowCheckin(false); }}
              className="bg-violet-500/10 px-4 py-2 rounded-full border border-violet-400/30 flex-row items-center gap-1.5"
            >
              <AppIcon name="plus" size={14} color="#9B40D8" strokeWidth={2} />
              <Text className="text-violet-400 text-xs" style={{ fontFamily: font.bold }}>Nota</Text>
            </Pressable>
            <Pressable
              onPress={() => { setShowCheckin(!showCheckin); setShowNote(false); }}
              className="bg-violet-500/10 px-4 py-2 rounded-full border border-violet-400/30 flex-row items-center gap-1.5"
            >
              <AppIcon name="clipboard-check" size={14} color="#9B40D8" strokeWidth={2} />
              <Text className="text-violet-400 text-xs" style={{ fontFamily: font.bold }}>Check-in</Text>
            </Pressable>
            <Pressable
              onPress={handleOpenChat}
              disabled={getOrCreateDM.isPending}
              className="bg-violet-500/10 px-4 py-2 rounded-full border border-violet-400/30 flex-row items-center gap-1.5"
            >
              <AppIcon name="message" size={14} color="#9B40D8" strokeWidth={2} />
              <Text className="text-violet-400 text-xs" style={{ fontFamily: font.bold }}>Conversar</Text>
            </Pressable>
          </View>

          {actionMsg ? (
            <Text className="text-xs text-violet-300 mt-3" style={{ fontFamily: font.medium }}>{actionMsg}</Text>
          ) : null}

          {showCheckin ? (
            <View className="mt-3 gap-2">
              {!templates?.length ? (
                <View className="bg-surface-card/80 border border-surface-border rounded-2xl p-4">
                  <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>
                    Você ainda não criou modelos de check-in.
                  </Text>
                  <Pressable onPress={() => router.push("/(trainer)/checkins/builder" as never)} className="mt-2">
                    <Text className="text-violet-400 text-xs" style={{ fontFamily: font.semibold }}>Criar modelo →</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <SectionLabel className="mb-1">Enviar modelo de check-in</SectionLabel>
                  {templates.map((t) => (
                    <Pressable
                      key={t.id}
                      onPress={() => handleSendCheckIn(t.id)}
                      disabled={sendCheckIn.isPending}
                      className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3 flex-row items-center justify-between active:bg-surface-hover"
                    >
                      <Text className="text-sm text-text-primary" style={{ fontFamily: font.semibold }}>{t.title}</Text>
                      <AppIcon name="send" size={16} color="#9B40D8" strokeWidth={2} />
                    </Pressable>
                  ))}
                </>
              )}
            </View>
          ) : null}

          {showNote ? (
            <View className="mt-3 gap-2">
              <TextInput
                className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
                placeholder="Escrever nota sobre o aluno..."
                placeholderTextColor="#6E6382"
                value={noteText}
                onChangeText={setNoteText}
                multiline
                style={{ minHeight: 60, textAlignVertical: "top", fontFamily: font.regular }}
              />
              <Pressable
                onPress={handleAddNote}
                disabled={addNote.isPending || !noteText.trim()}
                className="bg-violet-500 rounded-2xl py-3 items-center active:bg-violet-600"
              >
                <Text className="text-white text-xs" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                  {addNote.isPending ? "Salvando..." : "Salvar Nota"}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : (
          <FlatList
            data={timeline}
            keyExtractor={(item) => item.id}
            contentContainerClassName="px-6 pt-4 pb-10"
            renderItem={({ item }) => <TimelineItem event={item} />}
            ListEmptyComponent={
              <EmptyState
                iconName="clipboard"
                title="Prontuario vazio"
                description="Nenhum evento registrado ainda. As notas e atualizacoes do aluno aparecerao aqui."
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
