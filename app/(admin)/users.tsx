import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import { Avatar } from "../../components/ui/Avatar";
import { font } from "../../lib/design/tokens";

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
        <Text
          className="text-3xl text-text-primary mb-4"
          style={{ fontFamily: font.display }}
        >
          Usuarios
        </Text>

        <TextInput
          className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary mb-4"
          style={{ fontFamily: font.regular }}
          placeholder="Buscar por nome..."
          placeholderTextColor="#6E6382"
          value={search}
          onChangeText={setSearch}
        />

        <View className="flex-row gap-2 mb-4">
          {filters.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setRoleFilter(f.value)}
              className={`px-3 py-1.5 rounded-full ${
                roleFilter === f.value ? "bg-violet-500" : "bg-surface-card border border-surface-border"
              }`}
            >
              <Text
                className={`text-xs ${roleFilter === f.value ? "text-white" : "text-text-muted"}`}
                style={{ fontFamily: font.semibold }}
              >
                {f.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#781BB6" />
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
                  <Text
                    className="text-sm text-text-primary"
                    style={{ fontFamily: font.semibold }}
                  >
                    {item.full_name}
                  </Text>
                  <Text
                    className="text-xs text-text-muted mt-0.5"
                    style={{ fontFamily: font.regular }}
                  >
                    {new Date(item.created_at).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${
                  item.role === "trainer" ? "bg-ice-400/10" :
                  item.role === "admin" ? "bg-danger-500/10" : "bg-violet-500/10"
                }`}>
                  <Text
                    className={`text-[10px] capitalize ${
                      item.role === "trainer" ? "text-ice-400" :
                      item.role === "admin" ? "text-danger-500" : "text-violet-400"
                    }`}
                    style={{ fontFamily: font.bold }}
                  >
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
