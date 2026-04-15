import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";

const colorPresets = [
  { name: "Limao", primary: "#781BB6", secondary: "#00E5FF" },
  { name: "Roxo", primary: "#8B5CF6", secondary: "#EC4899" },
  { name: "Azul", primary: "#3B82F6", secondary: "#06B6D4" },
  { name: "Laranja", primary: "#F97316", secondary: "#EAB308" },
  { name: "Vermelho", primary: "#EF4444", secondary: "#F97316" },
  { name: "Verde", primary: "#22C55E", secondary: "#14B8A6" },
];

export default function BrandingScreen() {
  const { user } = useAuth();
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [cref, setCref] = useState("");
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [saving, setSaving] = useState(false);

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setLogoUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const preset = colorPresets[selectedPreset];
    let brandLogoUrl: string | undefined;

    if (logoUri) {
      const fileName = `${user.id}/${Date.now()}_logo.jpg`;
      const response = await fetch(logoUri);
      const blob = await response.blob();
      const { error: upErr } = await supabase.storage.from("brand-assets").upload(fileName, blob, { contentType: "image/jpeg" });
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from("brand-assets").getPublicUrl(fileName);
        brandLogoUrl = publicUrl;
      }
    }

    // Upsert trainer profile
    const { error } = await supabase
      .from("trainer_profiles")
      .upsert({
        id: user.id,
        brand_name: brandName.trim() || null,
        brand_tagline: tagline.trim() || null,
        brand_logo_url: brandLogoUrl ?? undefined,
        cref: cref.trim() || null,
        brand_primary_color: preset.primary,
        brand_secondary_color: preset.secondary,
      });

    setSaving(false);
    if (!error) router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-text-muted font-medium text-sm">← Voltar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Portal Branded</Text>
          <View className="w-16" />
        </View>

        <View className="bg-surface-card border border-violet-500/20 rounded-2xl p-5 mb-6">
          <Text className="text-xs text-violet-400 font-bold uppercase tracking-wider mb-2">Preview</Text>
          <View className="items-center py-6" style={{ backgroundColor: colorPresets[selectedPreset].primary + "10", borderRadius: 16 }}>
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={{ width: 64, height: 64, borderRadius: 16 }} contentFit="cover" className="mb-3" />
            ) : (
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                style={{ backgroundColor: colorPresets[selectedPreset].primary }}
              >
                <Text className="text-2xl font-black text-white">
                  {(brandName || "A").charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text className="text-lg font-black text-text-primary">
              {brandName || "Seu Brand"}
            </Text>
            {tagline ? <Text className="text-xs text-text-muted mt-1">{tagline}</Text> : null}
            {cref ? <Text className="text-xs text-text-muted mt-0.5">CREF: {cref}</Text> : null}
          </View>
        </View>

        <View className="gap-5">
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Nome do seu negocio</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="Ex: Fitness Pro, Coach Silva..."
              placeholderTextColor="#6E6580"
              value={brandName}
              onChangeText={setBrandName}
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Tagline</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="Ex: Transformando vidas atraves do treino"
              placeholderTextColor="#6E6580"
              value={tagline}
              onChangeText={setTagline}
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Logo</Text>
            <Pressable onPress={pickLogo} className="bg-surface-card border border-dashed border-surface-border rounded-2xl py-6 items-center active:bg-surface-hover">
              {logoUri ? (
                <View className="items-center">
                  <Image source={{ uri: logoUri }} style={{ width: 48, height: 48, borderRadius: 12 }} contentFit="cover" />
                  <Text className="text-xs text-violet-400 font-bold mt-2">Trocar logo</Text>
                </View>
              ) : (
                <View className="items-center">
                  <Text className="text-2xl mb-1">🖼️</Text>
                  <Text className="text-xs text-text-muted font-bold">Adicionar logo</Text>
                </View>
              )}
            </Pressable>
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">CREF</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="000000-G/SP"
              placeholderTextColor="#6E6580"
              value={cref}
              onChangeText={setCref}
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Cores do portal</Text>
            <View className="flex-row flex-wrap gap-3">
              {colorPresets.map((preset, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setSelectedPreset(idx)}
                  className={`rounded-2xl p-3 items-center border-2 ${
                    selectedPreset === idx ? "border-violet-500" : "border-surface-border"
                  }`}
                  style={{ width: "30%" }}
                >
                  <View className="flex-row gap-1 mb-2">
                    <View className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                    <View className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }} />
                  </View>
                  <Text className="text-[10px] font-bold text-text-muted">{preset.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={handleSave}
            disabled={saving}
            className={`rounded-2xl items-center mt-4 mb-10 ${saving ? "bg-violet-700" : "bg-violet-500 active:bg-violet-600"}`}
            style={{ paddingVertical: 18 }}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white font-black text-base tracking-wide uppercase">Salvar Branding</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
