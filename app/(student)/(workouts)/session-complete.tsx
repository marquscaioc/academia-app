import { router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../lib/auth/provider";
import { useCreatePost } from "../../../hooks/mutations/useSocialMutations";
import { WorkoutSummaryCard } from "../../../components/workout/WorkoutSummaryCard";

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
        <Text className="text-4xl mb-4">🎉</Text>
        <Text className="text-2xl font-black text-text-primary mb-8">Parabens!</Text>

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
            className="bg-violet-500 rounded-2xl py-4 items-center active:bg-violet-600"
          >
            <Text className="text-white font-black text-base">
              {createPost.isPending ? "Publicando..." : "Compartilhar no Feed"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace("/(student)/(home)")}
            className="bg-surface-elevated rounded-2xl py-4 items-center active:bg-surface-hover"
          >
            <Text className="text-text-secondary font-bold text-base">Fechar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
