import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

interface PhotoComparisonProps {
  beforeUrl: string;
  afterUrl: string;
  beforeDate: string;
  afterDate: string;
}

export function PhotoComparison({ beforeUrl, afterUrl, beforeDate, afterDate }: PhotoComparisonProps) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <View className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
      {/* Image */}
      <View className="aspect-[3/4] relative">
        <Image
          source={{ uri: showAfter ? afterUrl : beforeUrl }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={300}
        />

        {/* Labels */}
        <View className="absolute top-3 left-3 bg-dark-400/70 rounded-lg px-3 py-1.5">
          <Text className="text-white text-xs font-black">
            {showAfter ? "DEPOIS" : "ANTES"}
          </Text>
        </View>

        <View className="absolute bottom-3 left-3 bg-dark-400/70 rounded-lg px-3 py-1.5">
          <Text className="text-white text-[10px] font-medium">
            {showAfter ? afterDate : beforeDate}
          </Text>
        </View>
      </View>

      {/* Toggle */}
      <View className="flex-row">
        <Pressable
          onPress={() => setShowAfter(false)}
          className={`flex-1 py-3 items-center ${!showAfter ? "bg-violet-400" : "bg-surface-elevated"}`}
        >
          <Text className={`text-xs font-black ${!showAfter ? "text-dark-400" : "text-text-muted"}`}>
            ANTES
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setShowAfter(true)}
          className={`flex-1 py-3 items-center ${showAfter ? "bg-violet-400" : "bg-surface-elevated"}`}
        >
          <Text className={`text-xs font-black ${showAfter ? "text-dark-400" : "text-text-muted"}`}>
            DEPOIS
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
