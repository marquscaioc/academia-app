import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import { Avatar } from "../../components/ui/Avatar";

type RoleFilter = "all" | "student" | "trainer" | "admin";

export default function AdminUsersScreen() {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users", roleFilter, search],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (roleFilter !== "all") query = query.eq("role", roleFilter);
      if (search.trim()) query = query.ilike("full_name", `%${search}%`);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filters: { value: RoleFilter; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "trainer", label: "Trainers" },
    { value: "student", label: "Alunos" },
    { value: "admin", label: "Admins" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        <Text className="text-2xl font-black text-text-primary mb-4">Usuarios</Text>

        <TextInput
          className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-3 text-sm text-text-primary mb-4"
          placeholder="Buscar por nome..."
          placeholderTextColor="#6B6B73"
          value={search}
          onChangeText={setSearch}
        />

        <View className="flex-row gap-2 mb-4">
          {filters.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setRoleFilter(f.value)}
              className={`px-3 py-1.5 rounded-full ${
                roleFilter === f.value ? "bg-lime-500" : "bg-surface-card border border-surface-border"
              }`}
            >
              <Text className={`text-xs font-bold ${roleFilter === f.value ? "text-dark-400" : "text-text-muted"}`}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#BBFF00" />
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-2 pb-4"
            renderItem={({ item }) => (
              <View className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row items-center gap-4">
                <Avatar uri={item.avatar_url} name={item.full_name} size="md" />
                <View className="flex-1">
                  <Text className="text-sm font-bold text-text-primary">{item.full_name}</Text>
                  <Text className="text-xs text-text-muted mt-0.5">
                    {new Date(item.created_at).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${
                  item.role === "trainer" ? "bg-electric-400/10" :
                  item.role === "admin" ? "bg-danger-500/10" : "bg-lime-500/10"
                }`}>
                  <Text className={`text-[10px] font-bold capitalize ${
                    item.role === "trainer" ? "text-electric-400" :
                    item.role === "admin" ? "text-danger-500" : "text-lime-500"
                  }`}>
                    {item.role}
                  </Text>
                </View>
                <View className={`w-2 h-2 rounded-full ${item.is_active ? "bg-success-500" : "bg-text-muted"}`} />
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
