import { AuthShell } from "../../components/layout/AuthShell";
import { Button } from "../../components/ui/Button";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { supabase } from "../../lib/supabase/client";
import { AppIcon, DisplayHeading } from "../../components/ui";
import { font } from "../../lib/design/tokens";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  // Supabase SDK auto-picks up the recovery token from the URL hash (web)
  // when detectSessionInUrl is enabled. We just confirm a session exists.
  useEffect(() => {
    let unsub: (() => void) | undefined;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setSessionReady(true);
      }
    });
    unsub = () => data.subscription.unsubscribe();

    return () => {
      unsub?.();
    };
  }, []);

  const handleSubmit = async () => {
    if (!password || !confirmPassword) {
      setError("Preencha os dois campos");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }
    setError("");
    setLoading(true);
    const { error: updErr } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updErr) {
      setError(
        updErr.message.includes("expired") || updErr.message.includes("invalid")
          ? "Link de recuperação expirado ou inválido. Solicite um novo."
          : "Erro ao atualizar senha. Tente novamente.",
      );
      return;
    }
    setSuccess(true);
    // Deixa o usuário ver o sucesso, depois faz logout forçado + volta pro login
    setTimeout(async () => {
      await supabase.auth.signOut();
      router.replace("/(auth)/login");
    }, 2000);
  };

  if (success) {
    return (
      <AuthShell>

          <Animated.View entering={FadeIn.duration(400)} className="items-center">
            <View className="w-20 h-20 bg-success-500/15 border border-success-500/25 rounded-3xl items-center justify-center mb-6">
              <AppIcon name="check-circle" size={32} color="#52525B" strokeWidth={1.8} />
            </View>
            <DisplayHeading size="lg" tone="primary" className="text-center">
              Senha atualizada.
            </DisplayHeading>
            <Text className="text-text-secondary text-sm text-center mt-4" style={{ fontFamily: font.regular }}>
              Redirecionando para o login...
            </Text>
          </Animated.View>

      </AuthShell>
    );
  }

  return (
    <AuthShell>





          <Animated.View entering={FadeInDown.delay(80).springify()} className="mb-8">
            <DisplayHeading size="md">Defina sua nova senha</DisplayHeading>
            <Text
              className="text-fuchsia-400 mt-3"
              style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 3 }}
            >
              RECUPERAÇÃO DE ACESSO
            </Text>
          </Animated.View>

          {!sessionReady ? (
            <View className="bg-warning-500/10 border border-warning-500/20 rounded-2xl p-4 mb-5">
              <Text className="text-warning-500 text-sm text-center" style={{ fontFamily: font.medium }}>
                Validando link de recuperação...
              </Text>
            </View>
          ) : null}

          {error ? (
            <Animated.View
              entering={FadeIn.duration(200)}
              className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-5"
            >
              <Text className="text-danger-500 text-center text-sm" style={{ fontFamily: font.medium }}>
                {error}
              </Text>
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.delay(160).springify()} className="gap-4">
            <View>
              <Text
                className="text-[11px] text-text-muted mb-2 ml-0.5 uppercase"
                style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}
              >
                Nova senha
              </Text>
              <TextInput
                className={`rounded-2xl px-4 py-3.5 text-[15px] text-text-primary ${
                  focused === "pwd"
                    ? "bg-surface-elevated border border-violet-400/80"
                    : "bg-surface-card/80 border border-surface-border"
                }`}
                style={{ fontFamily: font.regular }}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#71717A"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocused("pwd")}
                onBlur={() => setFocused(null)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View>
              <Text
                className="text-[11px] text-text-muted mb-2 ml-0.5 uppercase"
                style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}
              >
                Confirmar senha
              </Text>
              <TextInput
                className={`rounded-2xl px-4 py-3.5 text-[15px] text-text-primary ${
                  focused === "confirm"
                    ? "bg-surface-elevated border border-violet-400/80"
                    : "bg-surface-card/80 border border-surface-border"
                }`}
                style={{ fontFamily: font.regular }}
                placeholder="Repita a senha"
                placeholderTextColor="#71717A"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocused("confirm")}
                onBlur={() => setFocused(null)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View className="mt-6"><Button title="Salvar nova senha" onPress={handleSubmit} loading={loading} disabled={!sessionReady} size="lg" /></View>
          </Animated.View>


    </AuthShell>
  );
}
