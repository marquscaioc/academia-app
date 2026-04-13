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

export default function StudentDetailScreen() {
  const { studentId } = useLocalSearchParams<{ studentId: string }>();
  const { user } = useAuth();
  const { data: timeline, isLoading } = useStudentTimeline(studentId);
  const addNote = useAddStudentNote();
  const [noteText, setNoteText] = useState("");
  const [showNote, setShowNote] = useState(false);

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

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        <View className="px-6 pt-6 pb-4 border-b border-surface-border">
          <Pressable onPress={() => router.back()} className="mb-3">
            <Text className="text-violet-400 font-medium">← Voltar</Text>
          </Pressable>
          <Text className="text-2xl font-black text-text-primary">{student?.full_name ?? "Aluno"}</Text>
          <Text className="text-xs text-text-muted mt-1">Prontuario e Timeline</Text>

          <View className="flex-row gap-3 mt-4">
            <Pressable
              onPress={() => setShowNote(!showNote)}
              className="bg-violet-500/10 px-4 py-2 rounded-xl"
            >
              <Text className="text-violet-400 font-bold text-xs">+ Nota</Text>
            </Pressable>
          </View>

          {showNote ? (
            <View className="mt-3 gap-2">
              <TextInput
                className="bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary"
                placeholder="Escrever nota sobre o aluno..."
                placeholderTextColor="#6E6382"
                value={noteText}
                onChangeText={setNoteText}
                multiline
                style={{ minHeight: 60, textAlignVertical: "top" }}
              />
              <Pressable
                onPress={handleAddNote}
                disabled={addNote.isPending || !noteText.trim()}
                className="bg-violet-500 rounded-xl py-2.5 items-center active:bg-violet-600"
              >
                <Text className="text-white font-bold text-xs">
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
              <View className="items-center py-10">
                <Text className="text-3xl mb-3">📋</Text>
                <Text className="text-text-muted text-sm">Nenhum evento registrado</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
