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
import { LinearGradient } from "expo-linear-gradient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth/provider";
import { supabase } from "../../lib/supabase/client";
import { EmptyState } from "../../components/ui/EmptyState";
import { DisplayHeading } from "../../components/ui/DisplayHeading";
import { AppIcon } from "../../components/ui";
import { WebContainer } from "../../components/layout/WebContainer";
import { font, amethystGlow, amethystGradient } from "../../lib/design/tokens";

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
        <WebContainer maxWidth={1180}>
        <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
          <View className="flex-row items-center gap-3">
            <Pressable onPress={() => router.back()} className="flex-row items-center gap-1 active:opacity-70">
              <AppIcon name="arrow-left" size={16} color="#6E6382" strokeWidth={2} />
              <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Voltar</Text>
            </Pressable>
            <DisplayHeading size="sm">Comunidades.</DisplayHeading>
          </View>
          <Pressable
            onPress={() => setShowCreate(!showCreate)}
            style={amethystGlow}
            className="rounded-2xl overflow-hidden active:opacity-90"
          >
            <LinearGradient
              colors={amethystGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              className="px-3.5 py-2 flex-row items-center gap-1.5"
            >
              <AppIcon name="plus" size={14} color="#FFFFFF" strokeWidth={2} />
              <Text className="text-white text-xs" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>Criar</Text>
            </LinearGradient>
          </Pressable>
        </View>

        {showCreate ? (
          <View className="px-5 py-5 border border-surface-border bg-surface-card mx-6 rounded-3xl mb-4">
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary mb-3"
              placeholder="Nome do grupo"
              placeholderTextColor="#6E6382"
              value={newName}
              onChangeText={setNewName}
              style={{ fontFamily: font.regular }}
            />
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary mb-3"
              placeholder="Descricao (opcional)"
              placeholderTextColor="#6E6382"
              value={newDesc}
              onChangeText={setNewDesc}
              style={{ fontFamily: font.regular }}
            />
            <Pressable
              onPress={() => createGroup.mutate()}
              disabled={!newName.trim() || createGroup.isPending}
              style={newName.trim() ? amethystGlow : undefined}
              className="rounded-2xl overflow-hidden active:opacity-90"
            >
              <LinearGradient
                colors={newName.trim() ? amethystGradient : ["#201B2A", "#201B2A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                className="py-3.5 items-center"
              >
                {createGroup.isPending ? (
                  <ActivityIndicator color="#F2EEF8" size="small" />
                ) : (
                  <Text
                    className={`text-sm ${newName.trim() ? "text-white" : "text-text-muted"}`}
                    style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                  >
                    Criar grupo
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        ) : null}

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
          </View>
        ) : !groups?.length ? (
          <EmptyState
            iconName="social"
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
              <View className="bg-surface-card border border-surface-border rounded-3xl p-5">
                <Pressable
                  onPress={() => router.push(`/groups/${item.id}` as never)}
                  className="flex-row items-center gap-3 mb-3 active:opacity-70"
                >
                  <View className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center">
                    <AppIcon name="social" size={20} color="#9B40D8" strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base text-text-primary" style={{ fontFamily: font.semibold }}>{item.name}</Text>
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <AppIcon name="user" size={13} color="#6E6382" strokeWidth={2} />
                      <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>{item.member_count} membro{item.member_count !== 1 ? "s" : ""}</Text>
                    </View>
                  </View>
                  <AppIcon name="chevron-right" size={18} color="#6E6382" strokeWidth={2} />
                </Pressable>
                {item.description ? (
                  <Text className="text-xs text-text-secondary mb-3" style={{ fontFamily: font.regular }} numberOfLines={2}>{item.description}</Text>
                ) : null}
                <Pressable
                  onPress={() => joinGroup.mutate(item.id)}
                  className="flex-row items-center justify-center gap-1.5 border border-violet-400/30 rounded-2xl py-2.5 active:bg-violet-500/10"
                >
                  <AppIcon name="user-add" size={15} color="#C4B5FD" strokeWidth={2} />
                  <Text className="text-violet-300 text-xs" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>Participar</Text>
                </Pressable>
              </View>
            )}
          />
        )}
        </WebContainer>
      </View>
    </SafeAreaView>
  );
}
