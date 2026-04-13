import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth/provider";
import { supabase } from "../../lib/supabase/client";
import { EmptyState } from "../../components/ui/EmptyState";

interface Group {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_public: boolean;
  member_count: number;
  created_by: string;
}

export default function GroupsScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups", "list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("is_public", true)
        .order("member_count", { ascending: false });
      if (error) throw error;
      return data as Group[];
    },
  });

  const createGroup = useMutation({
    mutationFn: async () => {
      if (!user || !newName.trim()) return;
      const { data, error } = await supabase
        .from("groups")
        .insert({ created_by: user.id, name: newName.trim(), description: newDesc.trim() || null })
        .select()
        .single();
      if (error) throw error;
      // Auto-join as admin
      await supabase.from("group_members").insert({ group_id: data.id, user_id: user.id, role: "admin" });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
    },
  });

  const joinGroup = useMutation({
    mutationFn: async (groupId: string) => {
      if (!user) return;
      await supabase.from("group_members").insert({ group_id: groupId, user_id: user.id });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["groups"] }),
  });

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => router.back()}>
              <Text className="text-text-muted font-medium text-sm">← Voltar</Text>
            </Pressable>
            <Text className="text-xl font-black text-text-primary">Comunidades</Text>
          </View>
          <Pressable
            onPress={() => setShowCreate(!showCreate)}
            className="bg-violet-400 px-3 py-1.5 rounded-xl active:bg-violet-500"
          >
            <Text className="text-dark-400 font-black text-xs">+ Criar</Text>
          </Pressable>
        </View>

        {showCreate ? (
          <View className="px-6 py-4 border-b border-surface-border bg-surface-card mx-6 rounded-2xl mb-4">
            <TextInput
              className="bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary mb-3"
              placeholder="Nome do grupo"
              placeholderTextColor="#6B6B73"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              className="bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary mb-3"
              placeholder="Descricao (opcional)"
              placeholderTextColor="#6B6B73"
              value={newDesc}
              onChangeText={setNewDesc}
            />
            <Pressable
              onPress={() => createGroup.mutate()}
              disabled={!newName.trim() || createGroup.isPending}
              className={`rounded-xl py-3 items-center ${newName.trim() ? "bg-violet-400" : "bg-surface-border"}`}
            >
              {createGroup.isPending ? (
                <ActivityIndicator color="#0A0A0B" size="small" />
              ) : (
                <Text className={`font-black text-sm ${newName.trim() ? "text-dark-400" : "text-text-muted"}`}>Criar Grupo</Text>
              )}
            </Pressable>
          </View>
        ) : null}

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#A855F7" />
          </View>
        ) : !groups?.length ? (
          <EmptyState
            icon="👥"
            title="Nenhuma comunidade"
            description="Crie uma comunidade para reunir alunos com interesses em comum!"
          />
        ) : (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            contentContainerClassName="px-6 gap-3 pb-4"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <View className="flex-row items-center gap-3 mb-3">
                  <View className="w-12 h-12 bg-surface-elevated rounded-xl items-center justify-center">
                    <Text className="text-xl">👥</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-text-primary">{item.name}</Text>
                    <Text className="text-xs text-text-muted">{item.member_count} membro{item.member_count !== 1 ? "s" : ""}</Text>
                  </View>
                </View>
                {item.description ? (
                  <Text className="text-xs text-text-muted mb-3" numberOfLines={2}>{item.description}</Text>
                ) : null}
                <Pressable
                  onPress={() => joinGroup.mutate(item.id)}
                  className="border border-violet-400/30 rounded-xl py-2.5 items-center active:bg-violet-400/10"
                >
                  <Text className="text-violet-400 font-bold text-xs">Participar</Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
