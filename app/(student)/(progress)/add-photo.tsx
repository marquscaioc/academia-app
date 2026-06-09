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
import { font } from "../../../lib/design/tokens";
import { AppIcon } from "../../../components/ui";
import { WebContainer } from "../../../components/layout/WebContainer";

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
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-6">
        <WebContainer maxWidth={640}>
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text
              className="text-violet-400"
              style={{ fontFamily: font.medium }}
            >
              Cancelar
            </Text>
          </Pressable>
          <Text
            className="text-xl text-text-primary"
            style={{ fontFamily: font.display }}
          >
            Foto de progresso
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

            <Text
              className="text-text-muted mb-2"
              style={{
                fontFamily: font.semibold,
                fontSize: 11,
                letterSpacing: 2,
              }}
            >
              POSE
            </Text>
            <View className="flex-row gap-2 mb-6">
              {poses.map((p) => (
                <Pressable
                  key={p.value}
                  onPress={() => setSelectedPose(p.value)}
                  className={`flex-1 py-2.5 rounded-2xl border items-center ${
                    selectedPose === p.value
                      ? "bg-violet-500 border-violet-500"
                      : "bg-surface-card border-surface-border"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      selectedPose === p.value ? "text-white" : "text-text-secondary"
                    }`}
                    style={{ fontFamily: font.medium }}
                  >
                    {p.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View className="flex-row gap-3 mb-6">
              <Pressable
                onPress={() => setImageUri(null)}
                className="flex-1 flex-row gap-2 border border-surface-border rounded-2xl py-3 items-center justify-center"
              >
                <AppIcon name="repeat" size={18} color="#A99FBA" strokeWidth={2} />
                <Text
                  className="text-text-secondary"
                  style={{ fontFamily: font.medium }}
                >
                  Trocar
                </Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                disabled={uploading}
                className="flex-1 bg-violet-500 rounded-2xl py-3 items-center active:bg-violet-600"
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    className="text-white"
                    style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                  >
                    Salvar
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center gap-4">
            <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-4">
              <AppIcon name="camera" size={28} color="#9B40D8" strokeWidth={2} />
            </View>
            <Text
              className="text-2xl text-text-primary"
              style={{ fontFamily: font.display }}
            >
              Adicione uma foto.
            </Text>
            <Text
              className="text-sm text-text-muted text-center max-w-[280px] mb-4"
              style={{ fontFamily: font.regular }}
            >
              Tire uma foto ou selecione da galeria para registrar seu progresso.
            </Text>

            <View className="w-full max-w-[280px] gap-3">
              <Pressable
                onPress={takePhoto}
                className="flex-row gap-2 bg-violet-500 rounded-2xl py-4 items-center justify-center active:bg-violet-600"
              >
                <AppIcon name="camera" size={18} color="#FFFFFF" strokeWidth={2} />
                <Text
                  className="text-white"
                  style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
                >
                  Tirar foto
                </Text>
              </Pressable>
              <Pressable
                onPress={pickImage}
                className="flex-row gap-2 border border-surface-border rounded-2xl py-4 items-center justify-center active:bg-surface-hover"
              >
                <AppIcon name="photos" size={18} color="#A99FBA" strokeWidth={2} />
                <Text
                  className="text-text-secondary"
                  style={{ fontFamily: font.semibold }}
                >
                  Escolher da galeria
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        </WebContainer>
      </View>
    </SafeAreaView>
  );
}
