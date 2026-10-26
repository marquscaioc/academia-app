import { useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Image } from "expo-image";

interface PhotoCaptureModalProps {
  visible: boolean;
  poseVerification?: boolean;
  poseEmoji?: string;
  poseDescription?: string;
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export function PhotoCaptureModal({
  visible, poseVerification, poseEmoji, poseDescription, onCapture, onClose,
}: PhotoCaptureModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);

  if (!visible) return null;

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    if (photo?.uri) setCapturedUri(photo.uri);
  };

  const handleConfirm = () => {
    if (capturedUri) {
      onCapture(capturedUri);
      setCapturedUri(null);
    }
  };

  const handleRetake = () => setCapturedUri(null);

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View className="flex-1 bg-black">
        {!permission?.granted ? (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-white text-lg font-bold text-center mb-4">
              Precisamos acessar sua camera
            </Text>
            <Pressable onPress={requestPermission} className="bg-violet-500 px-6 py-3 rounded-xl">
              <Text className="text-white font-bold">Permitir Camera</Text>
            </Pressable>
            <Pressable onPress={onClose} className="mt-4">
              <Text className="text-text-muted">Cancelar</Text>
            </Pressable>
          </View>
        ) : capturedUri ? (
          <View className="flex-1">
            <Image source={{ uri: capturedUri }} style={{ flex: 1 }} contentFit="cover" />
            <View className="absolute bottom-10 left-0 right-0 flex-row justify-center gap-4 px-6">
              <Pressable onPress={handleRetake} className="flex-1 bg-surface-elevated rounded-2xl py-4 items-center">
                <Text className="text-text-primary font-bold">Tirar outra</Text>
              </Pressable>
              <Pressable onPress={handleConfirm} className="flex-1 bg-violet-500 rounded-2xl py-4 items-center">
                <Text className="text-white font-bold">Confirmar</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="flex-1">
            <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front">
              {/* Pose verification overlay */}
              {poseVerification && poseEmoji ? (
                <View className="absolute top-20 left-0 right-0 items-center">
                  <View className="bg-black/70 rounded-2xl px-6 py-4 items-center">
                    <Text className="text-4xl mb-2">{poseEmoji}</Text>
                    <Text className="text-white font-bold text-sm text-center">
                      Pose do dia: {poseDescription}
                    </Text>
                  </View>
                </View>
              ) : null}
            </CameraView>

            <View className="absolute bottom-10 left-0 right-0 items-center">
              <View className="flex-row items-center gap-6">
                <Pressable onPress={onClose}>
                  <Text className="text-white text-sm font-bold">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={handleCapture}
                  className="w-20 h-20 rounded-full border-4 border-white bg-white/20 items-center justify-center"
                >
                  <View className="w-14 h-14 rounded-full bg-white" />
                </Pressable>
                <View className="w-16" />
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
