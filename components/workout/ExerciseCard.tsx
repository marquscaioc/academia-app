import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

interface ExerciseCardProps {
  name: string;
  muscleGroup?: string;
  equipment?: string;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  targetSets?: number;
  targetReps?: string;
  targetWeightKg?: number | null;
  restSeconds?: number;
  onPress?: () => void;
  onPlayVideo?: () => void;
}

export function ExerciseCard({
  name, muscleGroup, equipment, thumbnailUrl, videoUrl,
  targetSets, targetReps, targetWeightKg, restSeconds, onPress, onPlayVideo,
}: ExerciseCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface-card border border-surface-border rounded-2xl p-4 flex-row gap-4 active:bg-surface-hover"
    >
      <Pressable onPress={videoUrl && onPlayVideo ? onPlayVideo : undefined} disabled={!videoUrl || !onPlayVideo}>
        {thumbnailUrl ? (
          <View>
            <Image
              source={{ uri: thumbnailUrl }}
              style={{ width: 56, height: 56, borderRadius: 14 }}
              contentFit="cover"
            />
            {videoUrl ? (
              <View className="absolute inset-0 items-center justify-center bg-black/40" style={{ borderRadius: 14 }}>
                <Text className="text-white text-lg">▶</Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View className="w-14 h-14 bg-surface-elevated rounded-xl items-center justify-center">
            {videoUrl ? <Text className="text-xl">▶️</Text> : <Text className="text-xl">🏋️</Text>}
          </View>
        )}
      </Pressable>

      <View className="flex-1">
        <Text className="text-sm font-bold text-text-primary" numberOfLines={1}>{name}</Text>
        <View className="flex-row gap-2 mt-1.5">
          {muscleGroup ? (
            <View className="bg-violet-500/10 px-2 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-violet-400">{muscleGroup}</Text>
            </View>
          ) : null}
          {equipment ? (
            <View className="bg-surface-elevated px-2 py-0.5 rounded-full">
              <Text className="text-[10px] font-bold text-text-muted">{equipment}</Text>
            </View>
          ) : null}
        </View>
        {targetSets ? (
          <View className="flex-row gap-3 mt-2">
            <Text className="text-xs text-text-muted">{targetSets} x {targetReps ?? "10-12"}</Text>
            {targetWeightKg ? <Text className="text-xs text-text-muted">{targetWeightKg}kg</Text> : null}
            {restSeconds ? <Text className="text-xs text-text-muted">{restSeconds}s desc.</Text> : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
