import { AuthShell } from "../../components/layout/AuthShell";
import { Button } from "../../components/ui/Button";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useAuth } from "../../lib/auth/provider";
import { AppIcon, DisplayHeading } from "../../components/ui";
import { font } from "../../lib/design/tokens";

const TERMS_VERSION = "2026-06-16";

function parseDob(input: string): { iso: string; age: number } | null {
  const m = input.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  const now = new Date();
  let age = now.getFullYear() - year;
  const hadBirthday =
    now.getMonth() > month - 1 || (now.getMonth() === month - 1 && now.getDate() >= day);
  if (!hadBirthday) age -= 1;
  return { iso: `${m[3]}-${m[2]}-${m[1]}`, age };
}

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
  const [dob, setDob] = useState("");

  const onChangeDob = (t: string) => {
    const digits = t.replace(/\D/g, "").slice(0, 8);
    let out = digits;
    if (digits.length > 4) out = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2) out = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setDob(out);
  };

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
      setError("As senhas não conferem");
      return;
    }
    const parsedDob = parseDob(dob);
    if (!parsedDob) {
      setError("Informe uma data de nascimento válida (dd/mm/aaaa)");
      return;
    }
    if (parsedDob.age < 16) {
      setError("Você precisa ter 16 anos ou mais para usar o app.");
      return;
    }
    if (!accepted) {
      setError("Você precisa aceitar os Termos e a Política de Privacidade");
      return;
    }
    setError("");
    setLoading(true);
    const { error: signUpError } = await signUp(email, password, fullName, {
      date_of_birth: parsedDob.iso,
      terms_version: TERMS_VERSION,
    });
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
    <AuthShell>



          {/* Header */}
          <Animated.View entering={FadeIn.duration(400)} className="flex-row items-center justify-between mb-10">
            <Link href="/(auth)/login" asChild>
              <Pressable className="flex-row items-center gap-2">
                <Text className="text-text-muted text-lg font-sans">←</Text>
                <Text
                  className="text-text-muted text-[11px]"
                  style={{ fontFamily: "Geist_700Bold", letterSpacing: 2 }}
                >
                  VOLTAR
                </Text>
              </Pressable>
            </Link>

          </Animated.View>
          <Animated.View entering={FadeInDown.delay(80).springify()} className="mb-10">
            <DisplayHeading size="md">Crie sua conta</DisplayHeading>
            <Text
              className="text-fuchsia-400 mt-3"
              style={{ fontFamily: font.semibold, fontSize: 10, letterSpacing: 3 }}
            >
              CADASTRO
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
                placeholderTextColor="#71717A"
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
                placeholderTextColor="#71717A"
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
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#71717A"
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
                placeholderTextColor="#71717A"
                style={{ fontFamily: font.regular }}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                onFocus={() => setFocusedField("confirm")}
                onBlur={() => setFocusedField(null)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View>
              <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">
                Data de nascimento
              </Text>
              <TextInput
                className={inputClass("dob")}
                placeholder="dd/mm/aaaa"
                placeholderTextColor="#71717A"
                style={{ fontFamily: font.regular }}
                value={dob}
                onChangeText={onChangeDob}
                onFocus={() => setFocusedField("dob")}
                onBlur={() => setFocusedField(null)}
                keyboardType="number-pad"
                maxLength={10}
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
              <Text className="flex-1 text-text-muted text-xs leading-5 font-sans">
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

            <View className="mt-6"><Button title="Criar conta" onPress={handleRegister} loading={loading}  size="lg" /></View>
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-text-muted text-sm font-sans">Já tem uma conta? </Text>
            <Link href="/(auth)/login" asChild>
              <Pressable>
                <Text className="text-violet-300 font-bold text-sm">Entrar</Text>
              </Pressable>
            </Link>
          </View>


    </AuthShell>
  );
}
