import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { supabase } from "../../lib/supabase/client";
import { Logo } from "../../components/ui";

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
      <SafeAreaView className="flex-1 bg-dark-400">
        <View className="flex-1 justify-center items-center px-8 max-w-[440px] w-full self-center">
          <Animated.View entering={FadeIn.duration(400)} className="items-center">
            <View className="w-20 h-20 bg-success-500/15 rounded-3xl items-center justify-center mb-6">
              <Text className="text-4xl">✅</Text>
            </View>
            <Text
              className="text-text-primary text-center"
              style={{ fontFamily: "ArchivoBlack_400Regular", fontSize: 32, letterSpacing: -1.5 }}
            >
              SENHA{"\n"}ATUALIZADA.
            </Text>
            <Text
              className="text-text-muted text-sm text-center mt-4"
              style={{ fontFamily: "DMSans_400Regular" }}
            >
              Redirecionando para o login...
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <LinearGradient
        colors={["rgba(120,27,182,0.24)", "transparent"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 400 }}
        pointerEvents="none"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-8 max-w-[440px] w-full self-center">
          <Animated.View entering={FadeIn.duration(400)} className="items-center mb-8">
            <Logo size="lg" />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(80).springify()} className="mb-8">
            <Text
              className="text-text-muted"
              style={{ fontFamily: "InstrumentSerif_400Regular_Italic", fontSize: 26, letterSpacing: -0.5 }}
            >
              Defina sua
            </Text>
            <Text
              className="text-text-primary mt-1"
              style={{
                fontFamily: "ArchivoBlack_400Regular",
                fontSize: 40,
                lineHeight: 40,
                letterSpacing: -2,
              }}
            >
              NOVA SENHA.
            </Text>
            <Text
              className="text-fuchsia-400 mt-3"
              style={{ fontFamily: "DMSans_700Bold", fontSize: 10, letterSpacing: 3 }}
            >
              RECUPERAÇÃO DE ACESSO
            </Text>
          </Animated.View>

          {!sessionReady ? (
            <View className="bg-warning-500/10 border border-warning-500/20 rounded-2xl p-4 mb-5">
              <Text className="text-warning-500 text-sm text-center" style={{ fontFamily: "DMSans_500Medium" }}>
                Validando link de recuperação...
              </Text>
            </View>
          ) : null}

          {error ? (
            <Animated.View
              entering={FadeIn.duration(200)}
              className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-5"
            >
              <Text className="text-danger-500 text-center text-sm" style={{ fontFamily: "DMSans_500Medium" }}>
                {error}
              </Text>
            </Animated.View>
          ) : null}

          <Animated.View entering={FadeInDown.delay(160).springify()} className="gap-4">
            <View>
              <Text
                className="text-[10px] text-text-muted mb-2 ml-1 uppercase"
                style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}
              >
                Nova senha
              </Text>
              <TextInput
                className={`rounded-2xl px-5 py-4 text-base text-text-primary ${
                  focused === "pwd"
                    ? "bg-surface-elevated border-2 border-violet-500/50"
                    : "bg-surface-card border-2 border-surface-border"
                }`}
                style={{ fontFamily: "DMSans_500Medium" }}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#6E6580"
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
                className="text-[10px] text-text-muted mb-2 ml-1 uppercase"
                style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}
              >
                Confirmar senha
              </Text>
              <TextInput
                className={`rounded-2xl px-5 py-4 text-base text-text-primary ${
                  focused === "confirm"
                    ? "bg-surface-elevated border-2 border-violet-500/50"
                    : "bg-surface-card border-2 border-surface-border"
                }`}
                style={{ fontFamily: "DMSans_500Medium" }}
                placeholder="Repita a senha"
                placeholderTextColor="#6E6580"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocused("confirm")}
                onBlur={() => setFocused(null)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={loading || !sessionReady}
              className="rounded-2xl overflow-hidden mt-2"
            >
              <LinearGradient
                colors={loading || !sessionReady ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 18, alignItems: "center" }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text
                    className="text-white text-base"
                    style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}
                  >
                    ATUALIZAR SENHA
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
