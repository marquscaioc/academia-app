import { supabase } from "../supabase/client";

type ShoutoutType = "pr" | "streak_milestone" | "challenge_complete";

const messages: Record<ShoutoutType, (meta: Record<string, unknown>) => string> = {
  pr: (meta) => `Novo recorde pessoal! ${meta.exerciseName}: ${meta.weight}kg x ${meta.reps} reps 🏆`,
  streak_milestone: (meta) => `${meta.days} dias consecutivos de treino! 🔥🔥🔥`,
  challenge_complete: (meta) => `Desafio "${meta.challengeTitle}" concluido! 🎉`,
};

export async function createAutoShoutout(
  userId: string,
  type: ShoutoutType,
  metadata: Record<string, unknown>,
) {
  try {
    const content = messages[type](metadata);

    await supabase.from("feed_posts").insert({
      author_id: userId,
      post_type: "milestone",
      content,
      visibility: "public",
    });
  } catch {
    // Silent fail
  }
}
