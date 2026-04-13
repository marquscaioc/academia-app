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
import { useAuth } from "../../../lib/auth/provider";
import { useAddMeasurement } from "../../../hooks/mutations/useProgressMutations";

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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6 pt-6"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-row items-center justify-between mb-6">
            <Pressable onPress={() => router.back()}>
              <Text className="text-primary-600 font-medium">Cancelar</Text>
            </Pressable>
            <Text className="text-lg font-bold text-gray-900">
              Registrar Medidas
            </Text>
            <View className="w-16" />
          </View>

          <Text className="text-sm text-gray-500 mb-6">
            Preencha apenas as medidas que deseja registrar.
          </Text>

          <View className="gap-4">
            {fields.map((field) => (
              <View key={field.key} className="flex-row items-center gap-3">
                <Text className="flex-1 text-sm text-gray-700">
                  {field.label}
                </Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-900 bg-gray-50 w-24 text-right"
                    placeholder={field.placeholder}
                    placeholderTextColor="#d1d5db"
                    value={values[field.key] ?? ""}
                    onChangeText={(v) => updateValue(field.key, v)}
                    keyboardType="decimal-pad"
                  />
                  <Text className="text-sm text-gray-500 ml-2 w-6">
                    {field.unit}
                  </Text>
                </View>
              </View>
            ))}

            <View className="mt-2">
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Observacoes
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
                placeholder="Notas opcionais..."
                placeholderTextColor="#9ca3af"
                value={notes}
                onChangeText={setNotes}
                multiline
                style={{ minHeight: 60, textAlignVertical: "top" }}
              />
            </View>

            <Pressable
              onPress={handleSave}
              disabled={addMeasurement.isPending}
              className="bg-primary-600 rounded-xl py-4 items-center mt-4 mb-10 active:bg-primary-700"
            >
              {addMeasurement.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">Salvar</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
