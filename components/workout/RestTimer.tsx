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
    <View className="absolute bottom-24 left-4 right-4 bg-violet-400 rounded-3xl p-6 shadow-lg">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-dark-400/60 text-xs font-black uppercase tracking-wider">Descanso</Text>
          <Text className="text-dark-400 text-4xl font-black">{formatTime(seconds)}</Text>
        </View>
        <Pressable onPress={stop} className="bg-dark-400/20 rounded-xl px-5 py-3 active:bg-dark-400/30">
          <Text className="text-dark-400 font-black text-sm">Pular</Text>
        </Pressable>
      </View>
      <View className="mt-4 h-2 bg-dark-400/20 rounded-full overflow-hidden">
        <View className="h-full bg-dark-400 rounded-full" style={{ width: `${progress * 100}%` }} />
      </View>
    </View>
  );
}
