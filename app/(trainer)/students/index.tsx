import { Link } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { Avatar } from "../../../components/ui/Avatar";
import { EmptyState } from "../../../components/ui/EmptyState";

interface StudentRelation {
  id: string;
  student_id: string;
  status: string;
  started_at: string;
  student?: { full_name: string; avatar_url: string | null; email?: string };
}

export default function StudentsScreen() {
  const { user } = useAuth();

  const { data: students, isLoading } = useQuery({
    queryKey: ["trainer", "students", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainer_students")
        .select("*, student:profiles!student_id(full_name, avatar_url)")
        .eq("trainer_id", user!.id)
        .eq("status", "active")
        .order("started_at", { ascending: false });
      if (error) throw error;
      return data as StudentRelation[];
    },
    enabled: !!user,
  });

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-black text-text-primary">Alunos</Text>
          <Link href="/(trainer)/students/invite" asChild>
            <Pressable className="bg-lime-500 px-4 py-2 rounded-xl active:bg-lime-600">
              <Text className="text-dark-400 font-black text-xs">+ Convidar</Text>
            </Pressable>
          </Link>
        </View>

        {students?.length ? (
          <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-6 flex-row items-center gap-3">
            <Text className="text-2xl font-black text-lime-500">{students.length}</Text>
            <Text className="text-xs text-text-muted uppercase tracking-wider font-bold">
              aluno{students.length !== 1 ? "s" : ""} ativo{students.length !== 1 ? "s" : ""}
            </Text>
          </View>
        ) : null}

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#BBFF00" />
          </View>
        ) : !students?.length ? (
          <EmptyState
            icon="👥"
            title="Nenhum aluno ainda"
            description="Convide seus alunos com um codigo para comecar a gerenciar treinos e acompanhar o progresso."
          />
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-2"
            renderItem={({ item }) => (
              <Pressable className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-4 active:bg-surface-hover">
                <Avatar
                  uri={item.student?.avatar_url}
                  name={item.student?.full_name}
                  size="lg"
                />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-text-primary">
                    {item.student?.full_name}
                  </Text>
                  <Text className="text-xs text-text-muted mt-0.5">
                    Desde {new Date(item.started_at).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
                <View className="bg-lime-500/10 px-2 py-1 rounded-full">
                  <Text className="text-[10px] font-bold text-lime-500">Ativo</Text>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
