import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../lib/auth/provider";
import { supabase } from "../../lib/supabase/client";
import { Avatar } from "../../components/ui/Avatar";

export default function EditProfileScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!fullName.trim()) { setError("Nome e obrigatorio"); return; }
    if (!user) return;

    setError("");
    setLoading(true);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
      })
      .eq("id", user.id);

    if (updateError) {
      setError("Erro ao salvar. Tente novamente.");
      setLoading(false);
      return;
    }

    await refreshProfile();
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-8">
          <Pressable onPress={() => router.back()}>
            <Text className="text-text-muted font-medium text-sm">← Cancelar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Editar Perfil</Text>
          <View className="w-16" />
        </View>

        {/* Avatar */}
        <View className="items-center mb-8">
          <Avatar uri={profile?.avatar_url} name={fullName} size="xl" />
          <Pressable className="mt-3">
            <Text className="text-violet-400 font-bold text-sm">Trocar foto</Text>
          </Pressable>
        </View>

        {error ? (
          <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-5">
            <Text className="text-danger-500 text-center text-sm font-medium">{error}</Text>
          </View>
        ) : null}

        <View className="gap-5">
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
              Nome completo *
            </Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Seu nome"
              placeholderTextColor="#6B6B73"
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
              Nome de exibicao
            </Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Como quer ser chamado"
              placeholderTextColor="#6B6B73"
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
              Bio
            </Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              value={bio}
              onChangeText={setBio}
              placeholder="Conte um pouco sobre voce"
              placeholderTextColor="#6B6B73"
              multiline
              style={{ minHeight: 100, textAlignVertical: "top" }}
            />
          </View>

          <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mt-2">
            <View className="flex-row justify-between">
              <Text className="text-xs text-text-muted">Email</Text>
              <Text className="text-xs text-text-secondary">{user?.email}</Text>
            </View>
            <View className="flex-row justify-between mt-3">
              <Text className="text-xs text-text-muted">Perfil</Text>
              <Text className="text-xs text-violet-400 font-bold capitalize">{profile?.role}</Text>
            </View>
          </View>

          {/* WhatsApp */}
          <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mt-4">
            <Text className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">WhatsApp</Text>
            <TextInput
              className="bg-dark-300 border border-surface-border rounded-xl px-4 py-3 text-sm text-text-primary mb-3"
              placeholder="55 11 99999-9999"
              placeholderTextColor="#6E6382"
              keyboardType="phone-pad"
              onEndEditing={(e) => {
                if (user && e.nativeEvent.text.trim()) {
                  supabase.from("profiles").update({ whatsapp_number: e.nativeEvent.text.trim() }).eq("id", user.id);
                }
              }}
            />
            <Pressable
              onPress={async () => {
                if (!user) return;
                const { data: p } = await supabase.from("profiles").select("whatsapp_opt_in").eq("id", user.id).single();
                await supabase.from("profiles").update({ whatsapp_opt_in: !(p?.whatsapp_opt_in) }).eq("id", user.id);
                refreshProfile();
              }}
              className="flex-row items-center justify-between"
            >
              <Text className="text-sm text-text-secondary">Receber lembretes via WhatsApp</Text>
              <View className={`w-12 h-7 rounded-full p-0.5 ${false ? "bg-violet-500" : "bg-surface-border"}`}>
                <View className="w-6 h-6 bg-white rounded-full" />
              </View>
            </Pressable>
          </View>

          {/* Notification preferences */}
          <View className="bg-surface-card border border-surface-border rounded-2xl p-4 mt-4">
            <Text className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Notificacoes</Text>
            <Pressable
              onPress={async () => {
                if (!user) return;
                const newVal = !profile?.notify_follower_workouts;
                await supabase.from("profiles").update({ notify_follower_workouts: newVal }).eq("id", user.id);
                refreshProfile();
              }}
              className="flex-row items-center justify-between"
            >
              <Text className="text-sm text-text-secondary flex-1 mr-3">
                Notificar quando quem sigo treinar
              </Text>
              <View className={`w-12 h-7 rounded-full p-0.5 ${profile?.notify_follower_workouts ? "bg-violet-500" : "bg-surface-border"}`}>
                <View className={`w-6 h-6 bg-white rounded-full ${profile?.notify_follower_workouts ? "ml-auto" : ""}`} />
              </View>
            </Pressable>
          </View>

          <Pressable
            onPress={handleSave}
            disabled={loading}
            className={`rounded-2xl items-center mt-4 mb-10 ${
              loading ? "bg-violet-700" : "bg-violet-500 active:bg-violet-600"
            }`}
            style={{ paddingVertical: 18 }}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-black text-base tracking-wide uppercase">
                Salvar
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
