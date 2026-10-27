import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { AuthShell } from "../../components/layout/AuthShell";
import { AppIcon, Button, DisplayHeading } from "../../components/ui";
import { supabase } from "../../lib/supabase/client";
import { font, palette } from "../../lib/design/tokens";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState(false);

  const handleReset = async () => {
    if (loading) return;
    if (!email.trim()) { setError("Informe seu e-mail para continuar."); return; }
    setError("");
    setLoading(true);
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (resetError) { setError("Não foi possível enviar o e-mail. Tente novamente."); return; }
      setSent(true);
    } catch {
      setError("Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <AuthShell>
      <View className="w-14 h-14 rounded-2xl bg-surface-elevated items-center justify-center mb-6">
        <AppIcon name="mail" size={24} color={palette.textPrimary} strokeWidth={1.7} />
      </View>
      <DisplayHeading size="md">Confira seu e-mail</DisplayHeading>
      <Text className="text-sm text-text-secondary leading-6 mt-3 mb-8" style={{ fontFamily: font.regular }}>
        Se houver uma conta associada a esse endereço, você receberá as instruções para redefinir sua senha.
      </Text>
      <Button title="Voltar para entrar" onPress={() => router.replace("/(auth)/login")} size="lg" />
    </AuthShell>
  );

  return (
    <AuthShell>
      <Link href="/(auth)/login" asChild>
        <Pressable className="flex-row items-center gap-2 self-start mb-8 py-2" accessibilityRole="link">
          <AppIcon name="arrow-left" size={16} color={palette.textSecondary} />
          <Text className="text-sm text-text-secondary" style={{ fontFamily: font.medium }}>Voltar para entrar</Text>
        </Pressable>
      </Link>
      <DisplayHeading size="md">Recupere seu acesso</DisplayHeading>
      <Text className="text-sm text-text-secondary mt-3 mb-8 leading-6" style={{ fontFamily: font.regular }}>Informe seu e-mail e enviaremos um link para você definir uma nova senha.</Text>
      {error ? <View accessibilityRole="alert" className="bg-surface-elevated border border-surface-border rounded-xl p-4 mb-5"><Text className="text-sm text-text-primary" style={{ fontFamily: font.regular }}>{error}</Text></View> : null}
      <Text className="text-sm text-text-primary mb-2" style={{ fontFamily: font.medium }}>E-mail</Text>
      <TextInput
        accessibilityLabel="E-mail"
        className={`rounded-xl border px-4 text-sm text-text-primary ${focused ? "border-primary-400" : "border-surface-border"}`}
        style={{ fontFamily: font.regular, height: 50 }}
        placeholder="seu@email.com"
        placeholderTextColor={palette.textMuted}
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        onSubmitEditing={handleReset}
        returnKeyType="send"
      />
      <View className="mt-6"><Button title="Enviar link de recuperação" onPress={handleReset} loading={loading} size="lg" /></View>
    </AuthShell>
  );
}
