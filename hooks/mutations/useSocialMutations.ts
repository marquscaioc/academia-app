import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      author_id: string;
      content?: string;
      media_urls?: string[];
      post_type?: string;
      workout_session_id?: string;
    }) => {
      const { data, error } = await supabase
        .from("feed_posts")
        .insert({ post_type: "text", visibility: "public", ...input })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  });
}

export function useToggleReaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { post_id: string; user_id: string; reaction_type: string }) => {
      // Check if reaction exists
      const { data: existing } = await supabase
        .from("feed_reactions")
        .select("id")
        .eq("post_id", input.post_id)
        .eq("user_id", input.user_id)
        .eq("reaction_type", input.reaction_type)
        .maybeSingle();

      if (existing) {
        await supabase.from("feed_reactions").delete().eq("id", existing.id);
        return { removed: true };
      } else {
        await supabase.from("feed_reactions").insert(input);
        return { removed: false };
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed"] }),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { post_id: string; author_id: string; content: string }) => {
      const { data, error } = await supabase.from("feed_comments").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["feed", "comments", vars.post_id] });
      queryClient.invalidateQueries({ queryKey: ["feed", "posts"] });
    },
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { follower_id: string; following_id: string }) => {
      const { error } = await supabase.from("user_follows").insert(input);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      queryClient.invalidateQueries({ queryKey: ["profiles", vars.following_id] });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { follower_id: string; following_id: string }) => {
      const { error } = await supabase
        .from("user_follows")
        .delete()
        .eq("follower_id", input.follower_id)
        .eq("following_id", input.following_id);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      queryClient.invalidateQueries({ queryKey: ["profiles", vars.following_id] });
    },
  });
}
