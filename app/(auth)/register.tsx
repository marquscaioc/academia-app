import { Link, router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../lib/auth/provider";
import { AppIcon, DisplayHeading, Logo } from "../../components/ui";
import { amethystGlow, font } from "../../lib/design/tokens";

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Preencha todos os campos");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas nao conferem");
      return;
    }
    if (!accepted) {
      setError("Você precisa aceitar os Termos e a Política de Privacidade");
      return;
    }
    setError("");
    setLoading(true);
    const { error: signUpError } = await signUp(email, password, fullName);
    if (signUpError) {
      setLoading(false);
      setError("Erro ao criar conta. Tente novamente.");
      return;
    }
    // Let onAuthStateChange handle profile fetch; index.tsx will route to onboarding
    router.replace("/");
  };

  const inputClass = (field: string) =>
    `rounded-2xl px-4 py-3.5 text-[15px] text-text-primary ${
      focusedField === field
        ? "bg-surface-elevated border border-violet-400/80"
        : "bg-surface-card/80 border border-surface-border"
    }`;

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <LinearGradient
        colors={["rgba(120,27,182,0.24)", "transparent"]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 380 }}
        pointerEvents="none"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="justify-center px-8 py-12 max-w-[440px] w-full self-center"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View entering={FadeIn.duration(400)} className="flex-row items-center justify-between mb-10">
            <Link href="/(auth)/login" asChild>
              <Pressable className="flex-row items-center gap-2">
                <Text className="text-text-muted text-lg">←</Text>
                <Text
                  className="text-text-muted text-[11px]"
                  style={{ fontFamily: "Nunito_700Bold", letterSpacing: 2 }}
                >
                  VOLTAR
                </Text>
              </Pressable>
            </Link>
            <Logo size="sm" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(80).springify()} className="mb-10">
            <DisplayHeading size="md" italic tone="muted">
              Comece sua
            </DisplayHeading>
            <DisplayHeading size="2xl" tone="primary" className="mt-0.5">
              Jornada.
            </DisplayHeading>
            <Text
              className="text-fuchsia-400 mt-3"
              style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 3 }}
            >
              CADASTRO · ROYAL AMETHYST
            </Text>
          </Animated.View>

          {error ? (
            <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-5">
              <Text className="text-danger-500 text-center text-sm font-medium">{error}</Text>
            </View>
          ) : null}

          <View className="gap-4">
            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
                Nome completo
              </Text>
              <TextInput
                className={inputClass("name")}
                placeholder="Seu nome"
                placeholderTextColor="#6E6382"
                style={{ fontFamily: font.regular }}
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                autoComplete="name"
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
                Email
              </Text>
              <TextInput
                className={inputClass("email")}
                placeholder="seu@email.com"
                placeholderTextColor="#6E6382"
                style={{ fontFamily: font.regular }}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
                Senha
              </Text>
              <TextInput
                className={inputClass("password")}
                placeholder="Minimo 6 caracteres"
                placeholderTextColor="#6E6382"
                style={{ fontFamily: font.regular }}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
                Confirmar senha
              </Text>
              <TextInput
                className={inputClass("confirm")}
                placeholder="Repita a senha"
                placeholderTextColor="#6E6382"
                style={{ fontFamily: font.regular }}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedField("confirm")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <Pressable
              onPress={() => setAccepted((v) => !v)}
              className="flex-row items-start gap-3 mt-1 px-1"
            >
              <View
                className={`w-5 h-5 rounded-md border-2 items-center justify-center mt-0.5 ${
                  accepted ? "bg-violet-500 border-violet-500" : "border-surface-border"
                }`}
              >
                {accepted ? <AppIcon name="check" size={12} color="#FFFFFF" strokeWidth={3} /> : null}
              </View>
              <Text className="flex-1 text-text-muted text-xs leading-5">
                Li e aceito os{" "}
                <Link href="/termos" asChild>
                  <Text className="text-violet-300 font-bold">Termos de Uso</Text>
                </Link>{" "}
                e a{" "}
                <Link href="/privacidade" asChild>
                  <Text className="text-violet-300 font-bold">Política de Privacidade</Text>
                </Link>
                , e declaro ter 16 anos ou mais.
              </Text>
            </Pressable>

            <Pressable
              onPress={handleRegister}
              disabled={loading}
              className="rounded-2xl overflow-hidden mt-3"
              style={loading ? undefined : amethystGlow}
            >
              <LinearGradient
                colors={loading ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={{ paddingVertical: 17, alignItems: "center" }}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-white text-[15px]" style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}>
                    Criar conta
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-text-muted text-sm">Ja tem uma conta? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text className="text-violet-300 font-bold text-sm">Entrar</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
