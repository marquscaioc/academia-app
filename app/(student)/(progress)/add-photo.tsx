import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import {
  useAddProgressPhoto,
  uploadProgressPhoto,
} from "../../../hooks/mutations/useProgressMutations";

const poses = [
  { value: "front" as const, label: "Frente" },
  { value: "back" as const, label: "Costas" },
  { value: "side_left" as const, label: "Lado esquerdo" },
  { value: "side_right" as const, label: "Lado direito" },
];

export default function AddPhotoScreen() {
  const { user } = useAuth();
  const addPhoto = useAddProgressPhoto();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedPose, setSelectedPose] = useState<
    "front" | "back" | "side_left" | "side_right"
  >("front");
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!imageUri || !user) return;

    setUploading(true);

    try {
      const photoUrl = await uploadProgressPhoto(user.id, imageUri);
      await addPhoto.mutateAsync({
        user_id: user.id,
        photo_url: photoUrl,
        pose: selectedPose,
      });
      router.back();
    } catch {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary-600 font-medium">Cancelar</Text>
          </Pressable>
          <Text className="text-lg font-bold text-gray-900">
            Foto de Progresso
          </Text>
          <View className="w-16" />
        </View>

        {imageUri ? (
          <View className="flex-1">
            <View className="flex-1 items-center justify-center mb-4">
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: "100%",
                  height: "100%",
                  maxHeight: 400,
                  borderRadius: 16,
                }}
                contentFit="cover"
              />
            </View>

            <Text className="text-sm font-medium text-gray-700 mb-2">
              Pose
            </Text>
            <View className="flex-row gap-2 mb-6">
              {poses.map((p) => (
                <Pressable
                  key={p.value}
                  onPress={() => setSelectedPose(p.value)}
                  className={`flex-1 py-2.5 rounded-lg border items-center ${
                    selectedPose === p.value
                      ? "bg-primary-600 border-primary-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      selectedPose === p.value ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => setImageUri(null)}
                className="flex-1 border border-gray-300 rounded-xl py-3 items-center"
              >
                <Text className="text-gray-700 font-medium">Trocar</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={uploading}
                className="flex-1 bg-primary-600 rounded-xl py-3 items-center active:bg-primary-700"
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold">Salvar</Text>
                )}
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-6xl mb-4">📸</Text>
            <Text className="text-lg font-semibold text-gray-700">
              Adicione uma foto
            </Text>
            <Text className="text-sm text-gray-500 text-center max-w-[280px] mb-4">
              Tire uma foto ou selecione da galeria para registrar seu progresso.
            </Text>

            <View className="w-full max-w-[280px] gap-3">
              <Pressable
                onPress={takePhoto}
                className="bg-primary-600 rounded-xl py-4 items-center active:bg-primary-700"
              >
                <Text className="text-white font-semibold">Tirar foto</Text>
              </Pressable>
              <Pressable
                onPress={pickImage}
                className="border border-gray-300 rounded-xl py-4 items-center active:bg-gray-50"
              >
                <Text className="text-gray-700 font-semibold">
                  Escolher da galeria
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
