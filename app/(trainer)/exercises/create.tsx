import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useAuth } from "../../../lib/auth/provider";
import { supabase } from "../../../lib/supabase/client";
import { useMuscleGroups, useEquipment } from "../../../hooks/queries/useExercises";
import { useCreateExercise } from "../../../hooks/mutations/useExerciseMutations";

export default function CreateExerciseScreen() {
  const { user } = useAuth();
  const { data: muscleGroups } = useMuscleGroups();
  const { data: equipmentList } = useEquipment();
  const createExercise = useCreateExercise();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("intermediate");
  const [exerciseType, setExerciseType] = useState("strength");
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbUri, setThumbUri] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setVideoUri(result.assets[0].uri);
  };

  const pickThumbnail = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setThumbUri(result.assets[0].uri);
  };

  const handleCreate = async () => {
    if (!name.trim()) { setError("Informe o nome do exercicio"); return; }
    if (!user) return;

    setError("");
    setSaving(true);

    let videoUrl: string | undefined;
    let thumbnailUrl: string | undefined;

    if (videoUri) {
      const fileName = `${user.id}/${Date.now()}.mp4`;
      const response = await fetch(videoUri);
      const blob = await response.blob();
      const { error: upErr } = await supabase.storage.from("exercise-videos").upload(fileName, blob, { contentType: "video/mp4" });
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from("exercise-videos").getPublicUrl(fileName);
        videoUrl = publicUrl;
      }
    }

    if (thumbUri) {
      const fileName = `${user.id}/${Date.now()}_thumb.jpg`;
      const response = await fetch(thumbUri);
      const blob = await response.blob();
      const { error: upErr } = await supabase.storage.from("exercise-videos").upload(fileName, blob, { contentType: "image/jpeg" });
      if (!upErr) {
        const { data: { publicUrl } } = supabase.storage.from("exercise-videos").getPublicUrl(fileName);
        thumbnailUrl = publicUrl;
      }
    }

    await createExercise.mutateAsync({
      name: name.trim(),
      description: description.trim() || undefined,
      instructions: instructions.trim() || undefined,
      primary_muscle_group_id: selectedMuscleGroup ?? undefined,
      equipment_id: selectedEquipment ?? undefined,
      difficulty: difficulty as "beginner" | "intermediate" | "advanced",
      exercise_type: exerciseType as "strength" | "cardio" | "flexibility" | "calisthenics",
      created_by: user.id,
    });

    setSaving(false);
    router.back();
  };

  const difficulties = [
    { value: "beginner", label: "Iniciante" },
    { value: "intermediate", label: "Intermediario" },
    { value: "advanced", label: "Avancado" },
  ];

  const types = [
    { value: "strength", label: "Forca" },
    { value: "cardio", label: "Cardio" },
    { value: "flexibility", label: "Flex." },
    { value: "calisthenics", label: "Calist." },
  ];

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <ScrollView className="flex-1 px-6 pt-6" keyboardShouldPersistTaps="handled">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-text-muted font-medium text-sm">← Cancelar</Text>
          </Pressable>
          <Text className="text-lg font-black text-text-primary">Novo Exercicio</Text>
          <View className="w-16" />
        </View>

        {error ? (
          <View className="bg-danger-500/10 border border-danger-500/20 rounded-2xl p-4 mb-4">
            <Text className="text-danger-500 text-center text-sm font-medium">{error}</Text>
          </View>
        ) : null}

        <View className="gap-5">
          {/* Name */}
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Nome *</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="Ex: Supino reto com barra"
              placeholderTextColor="#6E6580"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Video + Thumbnail */}
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Midia</Text>
            <View className="flex-row gap-3">
              <Pressable onPress={pickVideo} className="flex-1 bg-surface-card border border-dashed border-surface-border rounded-2xl py-6 items-center active:bg-surface-hover">
                {videoUri ? (
                  <View className="items-center">
                    <Text className="text-2xl mb-1">🎬</Text>
                    <Text className="text-xs text-violet-400 font-bold">Video selecionado</Text>
                    <Text className="text-[10px] text-text-muted mt-1">Toque para trocar</Text>
                  </View>
                ) : (
                  <View className="items-center">
                    <Text className="text-2xl mb-1">📹</Text>
                    <Text className="text-xs text-text-muted font-bold">Adicionar video</Text>
                  </View>
                )}
              </Pressable>
              <Pressable onPress={pickThumbnail} className="flex-1 bg-surface-card border border-dashed border-surface-border rounded-2xl py-6 items-center active:bg-surface-hover overflow-hidden">
                {thumbUri ? (
                  <Image source={{ uri: thumbUri }} style={{ width: "100%", height: "100%", position: "absolute", borderRadius: 16 }} contentFit="cover" />
                ) : (
                  <View className="items-center">
                    <Text className="text-2xl mb-1">🖼️</Text>
                    <Text className="text-xs text-text-muted font-bold">Thumbnail</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* Description */}
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Descricao</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="Descricao breve"
              placeholderTextColor="#6E6580"
              value={description}
              onChangeText={setDescription}
              multiline
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />
          </View>

          {/* Instructions */}
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Instrucoes</Text>
            <TextInput
              className="bg-surface-card border-2 border-surface-border rounded-2xl px-5 py-4 text-base text-text-primary"
              placeholder="Passo a passo da execucao"
              placeholderTextColor="#6E6580"
              value={instructions}
              onChangeText={setInstructions}
              multiline
              style={{ minHeight: 100, textAlignVertical: "top" }}
            />
          </View>

          {/* Muscle Group */}
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Grupo Muscular</Text>
            <View className="flex-row flex-wrap gap-2">
              {muscleGroups?.map((mg) => (
                <Pressable
                  key={mg.id}
                  onPress={() => setSelectedMuscleGroup(selectedMuscleGroup === mg.id ? null : mg.id)}
                  className={`px-3 py-2 rounded-xl ${
                    selectedMuscleGroup === mg.id ? "bg-violet-500" : "bg-surface-card border border-surface-border"
                  }`}
                >
                  <Text className={`text-xs font-bold ${selectedMuscleGroup === mg.id ? "text-white" : "text-text-muted"}`}>
                    {mg.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Equipment */}
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Equipamento</Text>
            <View className="flex-row flex-wrap gap-2">
              {equipmentList?.map((eq) => (
                <Pressable
                  key={eq.id}
                  onPress={() => setSelectedEquipment(selectedEquipment === eq.id ? null : eq.id)}
                  className={`px-3 py-2 rounded-xl ${
                    selectedEquipment === eq.id ? "bg-violet-500" : "bg-surface-card border border-surface-border"
                  }`}
                >
                  <Text className={`text-xs font-bold ${selectedEquipment === eq.id ? "text-white" : "text-text-muted"}`}>
                    {eq.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Difficulty */}
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Dificuldade</Text>
            <View className="flex-row gap-2">
              {difficulties.map((d) => (
                <Pressable key={d.value} onPress={() => setDifficulty(d.value)}
                  className={`flex-1 py-2.5 rounded-xl items-center ${difficulty === d.value ? "bg-violet-500" : "bg-surface-card border border-surface-border"}`}>
                  <Text className={`text-xs font-bold ${difficulty === d.value ? "text-white" : "text-text-muted"}`}>{d.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Type */}
          <View>
            <Text className="text-xs font-bold text-text-muted mb-2 ml-1 tracking-wider uppercase">Tipo</Text>
            <View className="flex-row gap-2">
              {types.map((t) => (
                <Pressable key={t.value} onPress={() => setExerciseType(t.value)}
                  className={`flex-1 py-2.5 rounded-xl items-center ${exerciseType === t.value ? "bg-violet-500" : "bg-surface-card border border-surface-border"}`}>
                  <Text className={`text-xs font-bold ${exerciseType === t.value ? "text-white" : "text-text-muted"}`}>{t.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Save */}
          <Pressable
            onPress={handleCreate}
            disabled={saving}
            className={`rounded-2xl items-center mt-4 mb-10 ${saving ? "bg-violet-700" : "bg-violet-500 active:bg-violet-600"}`}
            style={{ paddingVertical: 18 }}
          >
            {saving ? <ActivityIndicator color="#FFFFFF" /> : (
              <Text className="text-white font-black text-base tracking-wide uppercase">Criar Exercicio</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
