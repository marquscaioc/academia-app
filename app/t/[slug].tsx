import { useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import { LoadingScreen } from "../../components/ui/LoadingScreen";

export default function TrainerPublicPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const { data: trainer, isLoading } = useQuery({
    queryKey: ["trainer-public", slug],
    queryFn: async () => {
      // slug can be trainer_id or brand_name (lowercased, no spaces)
      const { data, error } = await supabase
        .from("trainer_profiles")
        .select("*, profile:profiles!id(full_name, avatar_url, bio)")
        .or(`id.eq.${slug},brand_name.ilike.${slug?.replace(/-/g, " ")}`)
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!trainer) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400 items-center justify-center px-8">
        <Text className="text-4xl mb-4">🔍</Text>
        <Text className="text-lg font-black text-text-primary">Profissional nao encontrado</Text>
        <Text className="text-sm text-text-muted text-center mt-2">Verifique o link e tente novamente.</Text>
      </SafeAreaView>
    );
  }

  const profile = trainer.profile as unknown as { full_name: string; avatar_url: string | null; bio: string | null } | null;
  const primaryColor = trainer.brand_primary_color ?? "#781BB6";

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1">
        {/* Hero */}
        <View className="items-center pt-12 pb-8 px-6" style={{ backgroundColor: primaryColor + "15" }}>
          {trainer.brand_logo_url ? (
            <Image source={{ uri: trainer.brand_logo_url }} style={{ width: 80, height: 80, borderRadius: 20 }} contentFit="cover" />
          ) : (
            <View className="w-20 h-20 rounded-2xl items-center justify-center" style={{ backgroundColor: primaryColor }}>
              <Text className="text-3xl font-black text-white">
                {(trainer.brand_name ?? profile?.full_name ?? "T").charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text className="text-2xl font-black text-text-primary mt-4">
            {trainer.brand_name ?? profile?.full_name}
          </Text>
          {trainer.brand_tagline ? (
            <Text className="text-sm text-text-muted mt-1 text-center">{trainer.brand_tagline}</Text>
          ) : null}
          {trainer.cref ? (
            <Text className="text-xs text-text-muted mt-2">CREF: {trainer.cref}</Text>
          ) : null}
        </View>

        <View className="px-6 pt-6 pb-10">
          {/* Bio */}
          {profile?.bio ? (
            <View className="bg-surface-card border border-surface-border rounded-2xl p-5 mb-6">
              <Text className="text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Sobre</Text>
              <Text className="text-sm text-text-secondary leading-5">{profile.bio}</Text>
            </View>
          ) : null}

          {/* Specialties */}
          {trainer.specializations?.length ? (
            <View className="mb-6">
              <Text className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">Especialidades</Text>
              <View className="flex-row flex-wrap gap-2">
                {(trainer.specializations as string[]).map((s: string) => (
                  <View key={s} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: primaryColor + "20" }}>
                    <Text className="text-xs font-bold" style={{ color: primaryColor }}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* CTA */}
          <View className="bg-surface-card border border-surface-border rounded-3xl p-6 items-center">
            <Text className="text-lg font-black text-text-primary mb-2">Quer treinar comigo?</Text>
            <Text className="text-sm text-text-muted text-center mb-5">
              Baixe o app e use o codigo de convite do seu personal.
            </Text>
            <View className="rounded-2xl py-4 px-8 items-center" style={{ backgroundColor: primaryColor }}>
              <Text className="text-white font-black text-base">Comecar Agora</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
