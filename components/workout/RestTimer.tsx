import { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useWorkoutSessionStore } from "../../stores/useWorkoutSessionStore";
import { useNow } from "../../lib/hooks/useNow";
import { haptics } from "../../lib/haptics";
import { formatDuration } from "../../lib/workout/metrics";
import { font } from "../../lib/design/tokens";

/**
 * Floating rest countdown. Driven by an absolute `restEndsAt` timestamp, so it stays
 * correct after the app is backgrounded, the screen locks, or the app is restarted.
 */
export function RestTimer() {
  const restEndsAt = useWorkoutSessionStore((s) => s.restEndsAt);
  const restDuration = useWorkoutSessionStore((s) => s.restDuration);
  const extendRest = useWorkoutSessionStore((s) => s.extendRest);
  const clearRest = useWorkoutSessionStore((s) => s.clearRest);
  const now = useNow(!!restEndsAt, 250);
  const notifiedFor = useRef<number | null>(null);

  const remaining = restEndsAt ? Math.max(0, Math.ceil((restEndsAt - now) / 1000)) : 0;

  useEffect(() => {
    if (restEndsAt && remaining === 0 && notifiedFor.current !== restEndsAt) {
      notifiedFor.current = restEndsAt;
      haptics.success();
      clearRest();
    }
  }, [remaining, restEndsAt, clearRest]);

  if (!restEndsAt || remaining === 0) return null;

  const progress = restDuration > 0 ? Math.min(1, remaining / restDuration) : 0;

  return (
    <View
      accessibilityRole="timer"
      accessibilityLabel={`Descanso: ${remaining} segundos restantes`}
      className="absolute bottom-6 left-4 right-4 bg-violet-600 rounded-3xl p-5"
      style={{ shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 16 }}
    >
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-white/70 text-[11px] uppercase" style={{ fontFamily: font.semibold, letterSpacing: 1.5 }}>
            Descanso
          </Text>
          <Text className="text-white text-4xl" style={{ fontFamily: font.bold, fontVariant: ["tabular-nums"] }}>
            {formatDuration(remaining)}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <TimerButton label="−15s" onPress={() => extendRest(-15)} />
          <TimerButton label="+15s" onPress={() => extendRest(15)} />
          <TimerButton label="Pular" onPress={clearRest} strong />
        </View>
      </View>
      <View className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <View className="h-full bg-white rounded-full" style={{ width: `${progress * 100}%` }} />
      </View>
    </View>
  );
}

function TimerButton({ label, onPress, strong }: { label: string; onPress: () => void; strong?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label === "Pular" ? "Pular descanso" : `Ajustar descanso ${label}`}
      className={`rounded-xl px-3 py-3 min-w-[52px] items-center ${strong ? "bg-white" : "bg-white/15 active:bg-white/25"}`}
    >
      <Text className={strong ? "text-violet-700 text-sm" : "text-white text-sm"} style={{ fontFamily: font.semibold }}>
        {label}
      </Text>
    </Pressable>
  );
}
