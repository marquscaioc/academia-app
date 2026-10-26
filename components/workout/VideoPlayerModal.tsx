import { Modal, Pressable, Text, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { AppIcon } from "../ui";

interface VideoPlayerModalProps {
  visible: boolean;
  videoUrl: string | null;
  onClose: () => void;
}

/**
 * Exercise demo player (expo-video). The player is only created while the modal
 * is open, so videos are never downloaded before the user asks for them.
 */
export function VideoPlayerModal({ visible, videoUrl, onClose }: VideoPlayerModalProps) {
  if (!videoUrl || !visible) return null;

  return (
    <Modal visible animationType="fade" transparent statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 bg-black/95 items-center justify-center">
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar vídeo"
          hitSlop={12}
          className="absolute top-14 right-6 z-10 w-11 h-11 bg-surface-elevated rounded-full items-center justify-center"
        >
          <AppIcon name="close" size={20} color="#52525B" strokeWidth={2} />
        </Pressable>

        <ExerciseVideo uri={videoUrl} />

        <Text className="text-text-muted text-xs mt-4 font-sans">Toque no X para fechar</Text>
      </View>
    </Modal>
  );
}

function ExerciseVideo({ uri }: { uri: string }) {
  // Remounted per URI (keyed by parent render), so the player is released on close.
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={{ width: "100%", aspectRatio: 9 / 16, maxHeight: "80%" }}
      contentFit="contain"
      nativeControls
      allowsFullscreen
    />
  );
}
