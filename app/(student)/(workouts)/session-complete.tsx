import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useCreatePost } from "../../../hooks/mutations/useSocialMutations";
import { WorkoutSummaryCard } from "../../../components/workout/WorkoutSummaryCard";
import { AppIcon } from "../../../components/ui";
import { font, amethystGlow } from "../../../lib/design/tokens";

export default function SessionCompleteScreen() {
  const params = useLocalSearchParams<{
    workoutName?: string;
    duration?: string;
    volume?: string;
    exercises?: string;
    sets?: string;
  }>();
  const { user, profile } = useAuth();
  const createPost = useCreatePost();

  const workoutName = params.workoutName ?? "Treino";
  const duration = params.duration ?? "0:00";
  const totalVolume = parseInt(params.volume ?? "0");
  const exerciseCount = parseInt(params.exercises ?? "0");
  const setsCompleted = parseInt(params.sets ?? "0");
  const streak = profile?.current_streak ?? 0;
  const date = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const handleShare = async () => {
    if (!user) return;
    await createPost.mutateAsync({
      author_id: user.id,
      post_type: "workout_completed",
      content: `Treino "${workoutName}" concluido! ${duration} | ${totalVolume}kg volume | ${setsCompleted} series`,
    });
    router.replace("/(student)/(social)");
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-400">
      <View className="flex-1 px-6 pt-10 items-center">
        <View className="w-16 h-16 rounded-3xl bg-violet-500/15 border border-violet-500/25 items-center justify-center mb-5">
          <AppIcon name="celebrate" size={28} color="#9B40D8" strokeWidth={2} />
        </View>
        <Text
          className="text-text-muted mb-2"
          style={{ fontFamily: font.semibold, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}
        >
          Treino concluido
        </Text>
        <Text
          className="text-text-primary mb-8"
          style={{ fontFamily: font.display, fontSize: 34, lineHeight: 38 }}
        >
          Parabens.
        </Text>

        <WorkoutSummaryCard
          workoutName={workoutName}
          duration={duration}
          totalVolume={totalVolume}
          exerciseCount={exerciseCount}
          setsCompleted={setsCompleted}
          streak={streak}
          date={date}
        />

        <View className="w-full gap-3 mt-8">
          <Pressable
            onPress={handleShare}
            disabled={createPost.isPending}
            style={amethystGlow}
            className="rounded-2xl overflow-hidden"
          >
            <LinearGradient
              colors={createPost.isPending ? ["#50107D", "#86169E"] : ["#781BB6", "#C636E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.9 }}
              className="py-4 items-center"
            >
              <Text
                className="text-white text-base"
                style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
              >
                {createPost.isPending ? "Publicando..." : "Compartilhar no feed"}
              </Text>
            </LinearGradient>
          </Pressable>
          <Pressable
            onPress={() => router.replace("/(student)/(home)")}
            className="bg-surface-card/80 border border-surface-border rounded-2xl py-4 items-center active:bg-surface-hover"
          >
            <Text
              className="text-text-secondary text-base"
              style={{ fontFamily: font.semibold, letterSpacing: 0.5 }}
            >
              Fechar
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
