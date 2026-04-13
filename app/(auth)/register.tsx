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
import { useAuth } from "../../lib/auth/provider";

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
      setError("Erro ao criar conta. Tente novamente.");
      setLoading(false);
      return;
    }
    router.replace("/(auth)/onboarding");
  };

  const inputClass = (field: string) =>
    `rounded-2xl px-5 py-4 text-base text-text-primary ${
      focusedField === field
        ? "bg-surface-elevated border-2 border-violet-500/50"
        : "bg-surface-card border-2 border-surface-border"
    }`;

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
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
          <View className="mb-10">
            <Link href="/(auth)/login" asChild>
              <Pressable className="mb-8">
                <Text className="text-text-muted text-sm font-medium">← Voltar</Text>
              </Pressable>
            </Link>
            <Text className="text-3xl font-black text-text-primary tracking-tight">
              Criar conta
            </Text>
            <Text className="text-sm text-text-muted mt-2">
              Comece sua jornada fitness agora
            </Text>
          </View>

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
                placeholderTextColor="#6B6B73"
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
                placeholderTextColor="#6B6B73"
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
                placeholderTextColor="#6B6B73"
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
                placeholderTextColor="#6B6B73"
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
              className={`rounded-2xl items-center mt-3 ${
                loading ? "bg-violet-700" : "bg-violet-500 active:bg-violet-600"
              }`}
              style={{ paddingVertical: 18 }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white font-black text-base tracking-wide uppercase">
                  Criar conta
                </Text>
              )}
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
