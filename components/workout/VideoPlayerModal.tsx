import { Modal, Pressable, Text, View } from "react-native";
import { Video, ResizeMode } from "expo-av";

interface VideoPlayerModalProps {
  visible: boolean;
  videoUrl: string | null;
  onClose: () => void;
}

export function VideoPlayerModal({ visible, videoUrl, onClose }: VideoPlayerModalProps) {
  if (!videoUrl) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent>
      <View className="flex-1 bg-black/95 items-center justify-center">
        <Pressable onPress={onClose} className="absolute top-14 right-6 z-10 w-10 h-10 bg-surface-elevated rounded-full items-center justify-center">
          <Text className="text-text-primary text-lg">✕</Text>
        </Pressable>

        <Video
          source={{ uri: videoUrl }}
          style={{ width: "100%", aspectRatio: 9 / 16, maxHeight: "80%" }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
        />

        <Text className="text-text-muted text-xs mt-4">Toque ✕ para fechar</Text>
      </View>
    </Modal>
  );
}
