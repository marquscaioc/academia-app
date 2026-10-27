import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useAuth } from "../../lib/auth/provider";
import { AppIcon, Button } from "../../components/ui";
import { AuthShell } from "../../components/layout/AuthShell";
import { font, palette } from "../../lib/design/tokens";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async () => {
    if (loading) return;
    if (!email.trim() || !password) {
      setError("Preencha seu e-mail e sua senha para continuar.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { error: signInError } = await signIn(email.trim(), password);
      if (signInError) {
        setError("E-mail ou senha incorretos. Confira seus dados e tente novamente.");
        return;
      }
      router.replace("/");
    } catch {
      setError("Não foi possível entrar. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <Text className="text-xs text-text-muted mb-3" style={{ fontFamily: font.medium, letterSpacing: 1.4 }}>BEM-VINDO DE VOLTA</Text>
      <Text accessibilityRole="header" className="text-text-primary" style={{ fontFamily: font.semibold, fontSize: 32, lineHeight: 40, letterSpacing: -1.1 }}>Acesse sua conta</Text>
      <Text className="text-sm text-text-secondary mt-3 mb-9 leading-6" style={{ fontFamily: font.regular }}>Seu próximo passo começa aqui. Entre para acompanhar sua rotina.</Text>

      {error ? (
        <View accessibilityRole="alert" className="flex-row gap-3 bg-surface-elevated border border-surface-border rounded-xl p-4 mb-6">
          <AppIcon name="alert" size={18} color={palette.textPrimary} />
          <Text className="flex-1 text-sm text-text-primary leading-5" style={{ fontFamily: font.regular }}>{error}</Text>
        </View>
      ) : null}

      <View className="gap-5">
        <View>
          <Text nativeID="email-label" className="text-sm text-text-primary mb-2" style={{ fontFamily: font.medium }}>E-mail</Text>
          <TextInput
            accessibilityLabel="E-mail"
            className={`border rounded-xl px-4 text-sm text-text-primary bg-white ${focusedField === "email" ? "border-primary-400" : "border-surface-border"}`}
            style={{ fontFamily: font.regular, height: 50 }}
            placeholder="seu@email.com"
            placeholderTextColor={palette.textMuted}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            autoCorrect={false}
          />
        </View>
        <View>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-text-primary" style={{ fontFamily: font.medium }}>Senha</Text>
            <Link href="/(auth)/forgot-password" asChild>
              <Pressable accessibilityRole="link" className="py-1">
                <Text className="text-xs text-text-secondary" style={{ fontFamily: font.medium }}>Esqueceu a senha?</Text>
              </Pressable>
            </Link>
          </View>
          <View className={`flex-row items-center border rounded-xl bg-white ${focusedField === "password" ? "border-primary-400" : "border-surface-border"}`}>
            <TextInput
              accessibilityLabel="Senha"
              className="flex-1 px-4 text-sm text-text-primary"
              style={{ fontFamily: font.regular, height: 50, minWidth: 0 }}
              placeholder="Digite sua senha"
              placeholderTextColor={palette.textMuted}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!showPassword}
              autoComplete="current-password"
              onSubmitEditing={handleLogin}
              returnKeyType="go"
            />
            <Pressable accessibilityRole="button" accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"} onPress={() => setShowPassword(!showPassword)} className="px-4 h-12 justify-center">
              <AppIcon name={showPassword ? "eye-off" : "eye"} size={18} color={palette.textMuted} strokeWidth={1.7} />
            </Pressable>
          </View>
        </View>
        <View className="mt-2">
          <Button title="Entrar na plataforma" onPress={handleLogin} loading={loading} size="lg" icon={<AppIcon name="arrow-right" size={17} color="#FFFFFF" />} />
        </View>
      </View>

      <View className="flex-row items-center justify-center gap-1.5 mt-7 flex-wrap">
        <Text className="text-sm text-text-muted" style={{ fontFamily: font.regular }}>Ainda não tem uma conta?</Text>
        <Link href="/(auth)/register" asChild>
          <Pressable className="py-2" accessibilityRole="link">
            <Text className="text-sm text-text-primary underline" style={{ fontFamily: font.semibold }}>Criar conta</Text>
          </Pressable>
        </Link>
      </View>
      <View className="border-t border-surface-border mt-10 pt-6 flex-row justify-center items-center gap-5">
        <Link href="/termos" asChild><Pressable accessibilityRole="link" className="py-2"><Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Termos de uso</Text></Pressable></Link>
        <View className="w-1 h-1 rounded-full bg-surface-border" />
        <Link href="/privacidade" asChild><Pressable accessibilityRole="link" className="py-2"><Text className="text-xs text-text-muted" style={{ fontFamily: font.regular }}>Privacidade</Text></Pressable></Link>
      </View>
    </AuthShell>
  );
}
