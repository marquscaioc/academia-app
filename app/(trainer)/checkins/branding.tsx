import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { font, surfaceShadow } from "../../../lib/design/tokens";
import { AppIcon } from "../../../components/ui";

const colorPresets = [
  { name: "Grafite", primary: "#27272A", secondary: "#71717A" },
  { name: "Carvão", primary: "#3F3F46", secondary: "#A1A1AA" },
  { name: "Cinza", primary: "#52525B", secondary: "#D4D4D8" },
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
          <Pressable onPress={() => router.back()} className="flex-row items-center gap-1.5 active:opacity-70">
            <AppIcon name="arrow-left" size={16} color="#71717A" strokeWidth={2} />
            <Text className="text-text-muted text-sm" style={{ fontFamily: font.medium }}>Voltar</Text>
          </Pressable>
          <Text className="text-2xl text-text-primary" style={{ fontFamily: font.display }}>Perfil profissional</Text>
          <View className="w-16" />
        </View>

        <View className="bg-surface-card border border-surface-border rounded-3xl p-5 mb-6">
          <Text className="text-violet-400 uppercase mb-2" style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 2 }}>Prévia</Text>
          <View className="items-center py-6" style={{ backgroundColor: colorPresets[selectedPreset].primary + "10", borderRadius: 16 }}>
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={{ width: 64, height: 64, borderRadius: 16 }} contentFit="cover" className="mb-3" />
            ) : (
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center mb-3"
                style={{ backgroundColor: colorPresets[selectedPreset].primary }}
              >
                <Text className="text-2xl text-white" style={{ fontFamily: font.bold }}>
                  {(brandName || "A").charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text className="text-xl text-text-primary" style={{ fontFamily: font.display }}>
              {brandName || "Seu nome profissional"}
            </Text>
            {tagline ? <Text className="text-xs text-text-muted mt-1" style={{ fontFamily: font.regular }}>{tagline}</Text> : null}
            {cref ? <Text className="text-xs text-text-muted mt-0.5" style={{ fontFamily: font.regular }}>CREF: {cref}</Text> : null}
          </View>
        </View>

        <View className="gap-5">
          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 2 }}>Nome profissional</Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Ex: Fitness Pro, Coach Silva..."
              placeholderTextColor="#71717A"
              value={brandName}
              onChangeText={setBrandName}
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 2 }}>Tagline</Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="Ex: Transformando vidas atraves do treino"
              placeholderTextColor="#71717A"
              value={tagline}
              onChangeText={setTagline}
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 2 }}>Logo</Text>
            <Pressable onPress={pickLogo} className="bg-surface-card/80 border border-dashed border-surface-border rounded-2xl py-6 items-center active:bg-surface-hover">
              {logoUri ? (
                <View className="items-center">
                  <Image source={{ uri: logoUri }} style={{ width: 48, height: 48, borderRadius: 12 }} contentFit="cover" />
                  <View className="flex-row items-center gap-1.5 mt-2">
                    <AppIcon name="refresh" size={14} color="#3F3F46" strokeWidth={2} />
                    <Text className="text-xs text-violet-400" style={{ fontFamily: font.semibold }}>Trocar logo</Text>
                  </View>
                </View>
              ) : (
                <View className="items-center">
                  <View className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-2">
                    <AppIcon name="image" size={20} color="#3F3F46" strokeWidth={2} />
                  </View>
                  <Text className="text-xs text-text-muted" style={{ fontFamily: font.semibold }}>Adicionar logo</Text>
                </View>
              )}
            </Pressable>
          </View>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 2 }}>CREF</Text>
            <TextInput
              className="bg-surface-card/80 border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary"
              placeholder="000000-G/SP"
              placeholderTextColor="#71717A"
              value={cref}
              onChangeText={setCref}
              style={{ fontFamily: font.regular }}
            />
          </View>

          <View>
            <Text className="text-text-muted mb-2 ml-1 uppercase" style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 2 }}>Cores do portal</Text>
            <View className="flex-row flex-wrap gap-3">
              {colorPresets.map((preset, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setSelectedPreset(idx)}
                  className={`rounded-2xl p-3 items-center border ${
                    selectedPreset === idx ? "border-violet-400/80" : "border-surface-border"
                  }`}
                  style={{ width: "30%" }}
                >
                  <View className="flex-row gap-1 mb-2">
                    <View className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                    <View className="w-6 h-6 rounded-full" style={{ backgroundColor: preset.secondary }} />
                  </View>
                  <View className="flex-row items-center gap-1">
                    {selectedPreset === idx ? (
                      <AppIcon name="check-circle" size={12} color="#3F3F46" strokeWidth={2} />
                    ) : null}
                    <Text className="text-[10px] text-text-muted" style={{ fontFamily: font.semibold }}>{preset.name}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            onPress={handleSave}
            disabled={saving}
            className="rounded-2xl overflow-hidden mt-4 mb-10"
            style={surfaceShadow}
          >
            <LinearGradient
              colors={saving ? ["#18181B", "#3F3F46"] : ["#27272A", "#27272A"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              style={{ paddingVertical: 18, alignItems: "center" }}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <AppIcon name="sparkles" size={18} color="#FFFFFF" strokeWidth={2} />
                  <Text className="text-white text-base" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>Salvar perfil</Text>
                </View>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
