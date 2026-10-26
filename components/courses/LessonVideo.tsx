import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

/** Mounted only for the selected lesson; expo-video releases it on unmount. */
export function LessonVideo({ uri }: { uri: string }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const player = useVideoPlayer(uri, (p) => { p.loop = false; });
  useEffect(() => {
    const subscription = player.addListener("statusChange", ({ status }) => {
      setLoading(status === "loading" || status === "idle");
      setFailed(status === "error");
    });
    setLoading(player.status === "loading" || player.status === "idle");
    setFailed(player.status === "error");
    return () => subscription.remove();
  }, [player]);
  return <View>
    <VideoView player={player} style={{ width: "100%", aspectRatio: 16 / 9 }} nativeControls contentFit="contain" allowsFullscreen />
    {loading ? <ActivityIndicator accessibilityLabel="Carregando vídeo" className="my-3" /> : null}
    {failed ? <Text className="text-white px-4 py-3 font-sans">Não foi possível reproduzir o vídeo. Feche a aula e tente novamente.</Text> : null}
  </View>;
}
