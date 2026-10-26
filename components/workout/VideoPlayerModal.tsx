import { Modal, Pressable, Text, View } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { AppIcon } from "../ui";

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
          <AppIcon name="close" size={20} color="#6E6382" strokeWidth={2} />
        </Pressable>

        <Video
          source={{ uri: videoUrl }}
          style={{ width: "100%", aspectRatio: 9 / 16, maxHeight: "80%" }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
        />

        <View className="flex-row items-center mt-4">
          <Text className="text-text-muted text-xs">Toque </Text>
          <AppIcon name="close" size={12} color="#6E6382" strokeWidth={2} />
          <Text className="text-text-muted text-xs"> para fechar</Text>
        </View>
      </View>
    </Modal>
  );
}
