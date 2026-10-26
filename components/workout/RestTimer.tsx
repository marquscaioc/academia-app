import { Pressable, Text, View } from "react-native";
import { useTimerStore } from "../../stores/useTimerStore";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function RestTimer() {
  const { isRunning, seconds, targetSeconds, stop } = useTimerStore();
  if (!isRunning) return null;

  const progress = seconds / targetSeconds;

  return (
    <View className="absolute bottom-24 left-4 right-4 bg-violet-500 rounded-3xl p-6 shadow-lg">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-white/60 text-xs font-black uppercase tracking-wider">Descanso</Text>
          <Text className="text-white text-4xl font-black">{formatTime(seconds)}</Text>
        </View>
        <Pressable onPress={stop} className="bg-white/20 rounded-xl px-5 py-3 active:bg-white/30">
          <Text className="text-white font-black text-sm">Pular</Text>
        </Pressable>
      </View>
      <View className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
        <View className="h-full bg-white rounded-full" style={{ width: `${progress * 100}%` }} />
      </View>
    </View>
  );
}
