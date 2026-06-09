import { Link } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../lib/supabase/client";
import { DisplayHeading, Logo } from "../../components/ui";
import { amethystGlow, amethystGradient, font } from "../../lib/design/tokens";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleReset = async () => {
    if (!email) { setError("Informe seu email"); return; }
    setError(""); setLoading(true);
    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : undefined;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setLoading(false);
    if (resetError) { setError("Erro ao enviar email. Tente novamente."); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <SafeAreaView className="flex-1 bg-dark-400">
        <View className="flex-1 justify-center px-8 max-w-[440px] w-full self-center">
          <View className="items-center">
            <View className="w-20 h-20 bg-violet-500/15 border border-violet-500/25 rounded-3xl items-center justify-center mb-6">
              <Text className="text-4xl">📧</Text>
            </View>
            <DisplayHeading size="lg" tone="primary" className="text-center">
              Email enviado.
            </DisplayHeading>
            <Text className="text-sm text-text-secondary text-center mt-3 leading-5" style={{ fontFamily: font.regular }}>
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </Text>
          </View>
          <Link href="/(auth)/login" asChild>
            <Pressable className="rounded-2xl overflow-hidden mt-8" style={amethystGlow}>
              <LinearGradient colors={amethystGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.9 }} style={{ paddingVertical: 17, alignItems: "center" }}>
                <Text className="text-white text-[15px]" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>Voltar para login</Text>
              </LinearGradient>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <LinearGradient
        colors={["rgba(120,27,182,0.28)", "transparent"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 420 }}
        pointerEvents="none"
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-1 justify-center px-8 max-w-[440px] w-full self-center">
          <View className="flex-row items-center justify-between mb-10">
            <Link href="/(auth)/login" asChild>
              <Pressable className="flex-row items-center gap-2">
                <Text className="text-text-muted text-lg">←</Text>
                <Text className="text-text-muted text-[11px]" style={{ fontFamily: font.semibold, letterSpacing: 2 }}>VOLTAR</Text>
              </Pressable>
            </Link>
            <Logo size="sm" />
          </View>
          <View className="mb-10">
            <DisplayHeading size="md" italic tone="muted">Recuperar</DisplayHeading>
            <DisplayHeading size="2xl" tone="primary" className="mt-0.5">Senha.</DisplayHeading>
            <Text className="text-sm text-text-secondary mt-3" style={{ fontFamily: font.regular }}>
              Informe seu email para receber o link de recuperação.
            </Text>
          </View>
          {error ? (
            <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-5">
              <Text className="text-danger-500 text-center text-sm" style={{ fontFamily: font.medium }}>{error}</Text>
            </View>
          ) : null}
          <View className="gap-4">
            <View>
              <Text className="text-[11px] text-text-muted mb-2 ml-0.5 uppercase" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>Email</Text>
              <TextInput
                className={`rounded-2xl px-4 py-3.5 text-[15px] text-text-primary ${
                  focused ? "bg-surface-elevated border border-violet-400/80" : "bg-surface-card/80 border border-surface-border"
                }`}
                style={{ fontFamily: font.regular }}
                placeholder="seu@email.com"
                placeholderTextColor="#6E6382"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <Pressable onPress={handleReset} disabled={loading} className="rounded-2xl overflow-hidden mt-2" style={loading ? undefined : amethystGlow}>
              <LinearGradient colors={loading ? ["#50107D", "#86169E"] : amethystGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.9 }} style={{ paddingVertical: 17, alignItems: "center" }}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : (
                  <Text className="text-white text-[15px]" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>Enviar link</Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
