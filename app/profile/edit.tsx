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
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../lib/auth/provider";
import { supabase } from "../../lib/supabase/client";
import { Avatar } from "../../components/ui/Avatar";
import { DisplayHeading } from "../../components/ui/DisplayHeading";
import { AppIcon } from "../../components/ui";
import { WebContainer } from "../../components/layout/WebContainer";
import { font, amethystGlow } from "../../lib/design/tokens";

export default function EditProfileScreen() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp_number ?? "");
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setError("");
    setDeleting(true);
    const { error: delErr } = await supabase.functions.invoke("delete-account");
    if (delErr) {
      setError("Erro ao excluir a conta. Tente novamente.");
      setDeleting(false);
      return;
    }
    // Account no longer exists — clear the local session and leave.
    await signOut();
  };

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
        whatsapp_number: whatsapp.trim() || null,
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

  const pickAvatar = async () => {
    if (!user) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled) return;

    setError("");
    setUploadingAvatar(true);
    try {
      const uri = result.assets[0].uri;
      const response = await fetch(uri);
      const blob = await response.blob();
      const path = `${user.id}/${Date.now()}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, blob, { contentType: "image/jpeg", upsert: true });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      const { error: updErr } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);
      if (updErr) throw updErr;
      await refreshProfile();
    } catch (e) {
      setError("Erro ao trocar foto. Tente novamente.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <WebContainer maxWidth={640}>
        <View className="flex-row items-center justify-between mb-8">
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5">
            <AppIcon name="arrow-left" size={16} color="#6E6382" strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Cancelar</Text>
          </Pressable>
          <DisplayHeading size="sm">Editar perfil.</DisplayHeading>
          <View className="w-16" />
        </View>

        {/* Avatar */}
        <View className="items-center mb-8">
          <Avatar uri={profile?.avatar_url} name={fullName} size="xl" />
          <Pressable className="mt-3 flex-row items-center gap-1.5" onPress={pickAvatar} disabled={uploadingAvatar}>
            {uploadingAvatar ? (
              <ActivityIndicator color="#a78bfa" />
            ) : (
              <>
                <AppIcon name="camera" size={16} color="#9B40D8" strokeWidth={2} />
                <Text className="text-violet-400 text-sm" style={{ fontFamily: font.semibold }}>Trocar foto</Text>
              </>
            )}
          </Pressable>
        </View>

        {error ? (
          <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-5 flex-row items-center justify-center gap-2">
            <AppIcon name="warning" size={16} color="#FB7185" strokeWidth={2} />
            <Text className="text-danger-500 text-center text-sm" style={{ fontFamily: font.medium }}>{error}</Text>
          </View>
        ) : null}

        <View className="gap-5">
          <View>
            <Text className="text-[10px] text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, letterSpacing: 2 }}>
              Nome completo *
            </Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Seu nome"
              placeholderTextColor="#6E6382"
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <Text className="text-[10px] text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, letterSpacing: 2 }}>
              Nome de exibicao
            </Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Como quer ser chamado"
              placeholderTextColor="#6E6382"
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <Text className="text-[10px] text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, letterSpacing: 2 }}>
              Bio
            </Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              value={bio}
              onChangeText={setBio}
              placeholder="Conte um pouco sobre voce"
              placeholderTextColor="#6E6382"
              multiline
              style={{ minHeight: 100, textAlignVertical: "top", fontFamily: font.regular }}
            />
          </View>

          <View className="bg-surface-card border border-surface-border rounded-3xl p-4 mt-2">
            <View className="flex-row justify-between">
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Email</Text>
              <Text className="text-xs text-text-secondary" style={{ fontFamily: font.regular }}>{user?.email}</Text>
            </View>
            <View className="flex-row justify-between mt-3">
              <Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Perfil</Text>
              <Text className="text-xs text-violet-400 capitalize" style={{ fontFamily: font.semibold }}>{profile?.role}</Text>
            </View>
          </View>

          {/* WhatsApp */}
          <View className="bg-surface-card border border-surface-border rounded-3xl p-4 mt-4">
            <View className="flex-row items-center gap-2 mb-3">
              <AppIcon name="chat" size={16} color="#6E6382" strokeWidth={2} />
              <Text className="text-[10px] text-text-muted uppercase" style={{ fontFamily: font.semibold, letterSpacing: 2 }}>WhatsApp</Text>
            </View>
            <TextInput
              className="bg-dark-300 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary mb-3"
              placeholder="55 11 99999-9999"
              placeholderTextColor="#6E6382"
              keyboardType="phone-pad"
              value={whatsapp}
              onChangeText={setWhatsapp}
              style={{ fontFamily: font.regular }}
            />
            <Pressable
              onPress={async () => {
                if (!user) return;
                const { data: p, error: fetchErr } = await supabase
                  .from("profiles")
                  .select("whatsapp_opt_in")
                  .eq("id", user.id)
                  .maybeSingle();
                if (fetchErr || !p) { setError("Erro ao atualizar preferencia"); return; }
                const { error: updErr } = await supabase
                  .from("profiles")
                  .update({ whatsapp_opt_in: !p.whatsapp_opt_in })
                  .eq("id", user.id);
                if (updErr) { setError("Erro ao atualizar preferencia"); return; }
                refreshProfile();
              }}
              className="flex-row items-center justify-between"
            >
              <Text className="text-sm text-text-secondary" style={{ fontFamily: font.regular }}>Receber lembretes via WhatsApp</Text>
              <View className={`w-12 h-7 rounded-full p-0.5 ${profile?.whatsapp_opt_in ? "bg-violet-500" : "bg-surface-border"}`}>
                <View className={`w-6 h-6 bg-white rounded-full ${profile?.whatsapp_opt_in ? "ml-auto" : ""}`} />
              </View>
            </Pressable>
          </View>

          {/* Notification preferences */}
          <View className="bg-surface-card border border-surface-border rounded-3xl p-4 mt-4">
            <View className="flex-row items-center gap-2 mb-3">
              <AppIcon name="bell" size={16} color="#6E6382" strokeWidth={2} />
              <Text className="text-[10px] text-text-muted uppercase" style={{ fontFamily: font.semibold, letterSpacing: 2 }}>Notificacoes</Text>
            </View>
            <Pressable
              onPress={async () => {
                if (!user) return;
                const newVal = !profile?.notify_follower_workouts;
                const { error: updErr } = await supabase
                  .from("profiles")
                  .update({ notify_follower_workouts: newVal })
                  .eq("id", user.id);
                if (updErr) { setError("Erro ao atualizar notificacao"); return; }
                refreshProfile();
              }}
              className="flex-row items-center justify-between"
            >
              <Text className="text-sm text-text-secondary flex-1 mr-3" style={{ fontFamily: font.regular }}>
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
            className="rounded-2xl overflow-hidden mt-4 mb-10"
            style={amethystGlow}
          >
            <LinearGradient
              colors={loading ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              style={{ paddingVertical: 18, alignItems: "center" }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <AppIcon name="check" size={18} color="#FFFFFF" strokeWidth={2} />
                  <Text className="text-white text-base" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                    Salvar
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Pressable>

          {/* Danger zone — LGPD account deletion */}
          <View className="border border-danger-500/25 bg-danger-500/[0.04] rounded-3xl p-4 mb-12">
            <View className="flex-row items-center gap-2 mb-2">
              <AppIcon name="warning" size={16} color="#FB7185" strokeWidth={2} />
              <Text className="text-[10px] text-danger-500 uppercase" style={{ fontFamily: font.semibold, letterSpacing: 2 }}>
                Zona de perigo
              </Text>
            </View>
            {!confirmDelete ? (
              <>
                <Text className="text-sm text-text-secondary mb-3 leading-5" style={{ fontFamily: font.regular }}>
                  Excluir sua conta remove permanentemente seu perfil, treinos, dietas, fotos e histórico. Esta ação não pode ser desfeita.
                </Text>
                <Pressable
                  onPress={() => setConfirmDelete(true)}
                  className="flex-row items-center justify-center gap-2 border border-danger-500/40 rounded-2xl py-3 active:bg-danger-500/10"
                >
                  <AppIcon name="trash" size={16} color="#FB7185" strokeWidth={2} />
                  <Text className="text-danger-500 text-sm" style={{ fontFamily: font.semibold }}>Excluir minha conta</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text className="text-sm text-text-primary mb-3 leading-5" style={{ fontFamily: font.semibold }}>
                  Tem certeza? Tudo será apagado permanentemente.
                </Text>
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setConfirmDelete(false)}
                    disabled={deleting}
                    className="flex-1 border border-surface-border rounded-2xl py-3 items-center active:bg-surface-hover"
                  >
                    <Text className="text-text-secondary text-sm" style={{ fontFamily: font.semibold }}>Cancelar</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 bg-danger-500 rounded-2xl py-3 items-center active:bg-danger-600"
                  >
                    {deleting ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <Text className="text-white text-sm" style={{ fontFamily: font.semibold }}>Sim, excluir</Text>
                    )}
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
        </WebContainer>
      </ScrollView>
    </SafeAreaView>
  );
}
