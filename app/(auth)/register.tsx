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
import { Logo } from "../../components/ui";

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
    `rounded-2xl px-5 py-4 text-base text-text-primary ${
      focusedField === field
        ? "bg-surface-elevated border-2 border-violet-500/50"
        : "bg-surface-card border-2 border-surface-border"
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
                  style={{ fontFamily: "DMSans_700Bold", letterSpacing: 2 }}
                >
                  VOLTAR
                </Text>
              </Pressable>
            </Link>
            <Logo size="sm" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(80).springify()} className="mb-10">
            <Text
              className="text-text-muted"
              style={{ fontFamily: "InstrumentSerif_400Regular_Italic", fontSize: 28, letterSpacing: -0.5 }}
            >
              Comece sua
            </Text>
            <Text
              className="text-text-primary mt-1"
              style={{
                fontFamily: "ArchivoBlack_400Regular",
                fontSize: 44,
                lineHeight: 44,
                letterSpacing: -2,
              }}
            >
              JORNADA.
            </Text>
            <Text
              className="text-fuchsia-400 mt-3"
              style={{ fontFamily: "DMSans_700Bold", fontSize: 10, letterSpacing: 3 }}
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
                placeholderTextColor="#6E6580"
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
                placeholderTextColor="#6E6580"
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
                placeholderTextColor="#6E6580"
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
                placeholderTextColor="#6E6580"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedField("confirm")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <Pressable
              onPress={handleRegister}
              disabled={loading}
              className="rounded-2xl overflow-hidden mt-3"
            >
              <LinearGradient
                colors={loading ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
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
                    CRIAR CONTA
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
