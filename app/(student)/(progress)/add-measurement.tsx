import { router } from "expo-router";
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
import { useAuth } from "../../../lib/auth/provider";
import { useAddMeasurement } from "../../../hooks/mutations/useProgressMutations";
import { DisplayHeading } from "../../../components/ui";
import { amethystGlow, font } from "../../../lib/design/tokens";

interface MeasurementField {
  key: string;
  label: string;
  unit: string;
  placeholder: string;
}

const fields: MeasurementField[] = [
  { key: "weight_kg", label: "Peso", unit: "kg", placeholder: "75.0" },
  {
    key: "body_fat_pct",
    label: "Gordura corporal",
    unit: "%",
    placeholder: "15.0",
  },
  { key: "chest_cm", label: "Peito", unit: "cm", placeholder: "100" },
  { key: "waist_cm", label: "Cintura", unit: "cm", placeholder: "80" },
  { key: "hips_cm", label: "Quadril", unit: "cm", placeholder: "95" },
  {
    key: "bicep_left_cm",
    label: "Biceps esquerdo",
    unit: "cm",
    placeholder: "35",
  },
  {
    key: "bicep_right_cm",
    label: "Biceps direito",
    unit: "cm",
    placeholder: "35",
  },
  {
    key: "thigh_left_cm",
    label: "Coxa esquerda",
    unit: "cm",
    placeholder: "55",
  },
  {
    key: "thigh_right_cm",
    label: "Coxa direita",
    unit: "cm",
    placeholder: "55",
  },
  {
    key: "calf_left_cm",
    label: "Panturrilha esquerda",
    unit: "cm",
    placeholder: "37",
  },
  {
    key: "calf_right_cm",
    label: "Panturrilha direita",
    unit: "cm",
    placeholder: "37",
  },
  { key: "skinfold_triceps_mm", label: "Dobra tríceps", unit: "mm", placeholder: "12" },
  { key: "skinfold_subscapular_mm", label: "Dobra subescapular", unit: "mm", placeholder: "14" },
  { key: "skinfold_suprailiac_mm", label: "Dobra suprailíaca", unit: "mm", placeholder: "16" },
  { key: "skinfold_abdominal_mm", label: "Dobra abdominal", unit: "mm", placeholder: "18" },
  { key: "skinfold_thigh_mm", label: "Dobra coxa", unit: "mm", placeholder: "20" },
  { key: "skinfold_chest_mm", label: "Dobra peitoral", unit: "mm", placeholder: "10" },
];

export default function AddMeasurementScreen() {
  const { user } = useAuth();
  const addMeasurement = useAddMeasurement();
  const [values, setValues] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");

  const updateValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async () => {
    if (!user) return;

    const numericValues: Record<string, number | undefined> = {};
    for (const field of fields) {
      const raw = values[field.key];
      if (raw) {
        const num = parseFloat(raw.replace(",", "."));
        if (!isNaN(num)) {
          numericValues[field.key] = num;
        }
      }
    }

    await addMeasurement.mutateAsync({
      user_id: user.id,
      notes: notes.trim() || undefined,
      ...numericValues,
    });

    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 pt-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center justify-between mb-5">
            <Pressable onPress={() => router.back()}>
              <Text
                className="text-violet-400"
                style={{ fontFamily: font.medium }}
              >
                Cancelar
              </Text>
            </Pressable>
            <View className="w-16" />
          </View>

          <Text
            className="text-fuchsia-400 mb-2 uppercase"
            style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2 }}
          >
            Progresso
          </Text>
          <DisplayHeading size="lg" tone="primary">
            Registrar medidas.
          </DisplayHeading>

          <Text
            className="text-sm text-text-muted mt-2 mb-6"
            style={{ fontFamily: font.regular }}
          >
            Preencha apenas as medidas que deseja registrar.
          </Text>

          <View className="gap-4">
            {fields.map((field) => (
              <View key={field.key} className="flex-row items-center gap-3">
                <Text
                  className="flex-1 text-sm text-text-secondary"
                  style={{ fontFamily: font.regular }}
                >
                  {field.label}
                </Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="border border-surface-border rounded-2xl px-4 py-3 text-[15px] text-text-primary bg-surface-card/80 w-24 text-right"
                    style={{ fontFamily: font.regular }}
                    placeholder={field.placeholder}
                    placeholderTextColor="#6E6382"
                    value={values[field.key] ?? ""}
                    onChangeText={(v) => updateValue(field.key, v)}
                    keyboardType="decimal-pad"
                  />
                  <Text
                    className="text-sm text-text-muted ml-2 w-6"
                    style={{ fontFamily: font.medium }}
                  >
                    {field.unit}
                  </Text>
                </View>
              </View>
            ))}

            <View className="mt-2">
              <Text
                className="text-[11px] text-text-muted mb-2 ml-0.5 uppercase"
                style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}
              >
                Observacoes
              </Text>
              <TextInput
                className="border border-surface-border rounded-2xl px-4 py-3.5 text-[15px] text-text-primary bg-surface-card/80"
                placeholder="Notas opcionais..."
                placeholderTextColor="#6E6382"
                value={notes}
                onChangeText={setNotes}
                multiline
                style={{ fontFamily: font.regular, minHeight: 60, textAlignVertical: "top" }}
              />
            </View>

            <Pressable
              onPress={handleSave}
              disabled={addMeasurement.isPending}
              className="rounded-2xl overflow-hidden mt-4 mb-10"
              style={addMeasurement.isPending ? undefined : amethystGlow}
            >
              <LinearGradient
                colors={
                  addMeasurement.isPending
                    ? ["#50107D", "#86169E"]
                    : ["#781BB6", "#C636E0"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.9 }}
                style={{ paddingVertical: 17, alignItems: "center" }}
              >
                {addMeasurement.isPending ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text
                    className="text-white text-[15px]"
                    style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                  >
                    Salvar
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
