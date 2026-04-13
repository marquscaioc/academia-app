import { router } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { Avatar } from "../../../components/ui/Avatar";

interface CheckInWithDetails {
  id: string;
  user_id: string;
  status: string;
  submitted_at: string | null;
  created_at: string;
  trainer_notes: string | null;
  template: { title: string } | null;
  student: { full_name: string; avatar_url: string | null } | null;
  answers: { id: string; answer_text: string | null; answer_number: number | null; question: { question_text: string; question_type: string } | null }[];
}

export default function CheckInResponsesScreen() {
  const { user } = useAuth();

  const { data: checkIns, isLoading } = useQuery({
    queryKey: ["trainer", "checkin-responses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("check_ins")
        .select("*, template:questionnaire_templates(title), student:profiles!user_id(full_name, avatar_url), answers:check_in_answers(*, question:questionnaire_questions(question_text, question_type))")
        .eq("trainer_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as CheckInWithDetails[];
    },
    enabled: !!user,
  });

  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-warning-500/10", text: "text-warning-500", label: "Pendente" },
    submitted: { bg: "bg-violet-400/10", text: "text-violet-400", label: "Respondido" },
    reviewed: { bg: "bg-success-500/10", text: "text-success-500", label: "Revisado" },
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <Pressable onPress={() => router.back()}>
            <Text className="text-text-muted font-medium text-sm">← Voltar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Respostas</Text>
          <View className="w-16" />
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#A855F7" />
          </View>
        ) : !checkIns?.length ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-3xl mb-3">📋</Text>
            <Text className="text-base font-bold text-text-primary">Nenhuma resposta</Text>
            <Text className="text-sm text-text-muted text-center mt-2">
              As respostas dos check-ins dos seus alunos aparecerão aqui.
            </Text>
          </View>
        ) : (
          <FlatList
            data={checkIns}
            keyExtractor={(item) => item.id}
            contentContainerClassName="px-6 gap-3 pb-4"
            renderItem={({ item }) => {
              const st = statusColors[item.status] ?? statusColors.pending;
              return (
                <View className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  {/* Header */}
                  <View className="flex-row items-center gap-3 mb-3">
                    <Avatar uri={item.student?.avatar_url} name={item.student?.full_name} size="md" />
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-text-primary">{item.student?.full_name}</Text>
                      <Text className="text-xs text-text-muted">{item.template?.title}</Text>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${st.bg}`}>
                      <Text className={`text-[10px] font-bold ${st.text}`}>{st.label}</Text>
                    </View>
                  </View>

                  {/* Answers */}
                  {item.status !== "pending" && item.answers?.length ? (
                    <View className="bg-dark-300 rounded-xl p-3 gap-2">
                      {item.answers.map((a) => (
                        <View key={a.id}>
                          <Text className="text-[10px] text-text-muted font-bold uppercase">{a.question?.question_text}</Text>
                          <Text className="text-sm text-text-primary mt-0.5">
                            {a.answer_text ?? (a.answer_number != null ? String(a.answer_number) : "-")}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  {/* Date */}
                  <Text className="text-[10px] text-text-muted mt-3">
                    {item.submitted_at
                      ? `Respondido em ${new Date(item.submitted_at).toLocaleDateString("pt-BR")}`
                      : `Enviado em ${new Date(item.created_at).toLocaleDateString("pt-BR")}`}
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
