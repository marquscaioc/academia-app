import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface FeedPost {
  id: string;
  author_id: string;
  post_type: string;
  content: string | null;
  media_urls: string[] | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author?: { full_name: string; avatar_url: string | null; display_name: string | null };
  my_reaction?: string | null;
}

export interface FeedComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: { full_name: string; avatar_url: string | null };
  parent_comment_id: string | null;
}

export function useFeedPosts(mode: "public" | "following" = "public") {
  return useQuery({
    queryKey: ["feed", "posts", mode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feed_posts")
        .select("*, author:profiles!author_id(full_name, avatar_url, display_name)")
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as FeedPost[];
    },
  });
}

export function usePostComments(postId: string) {
  return useQuery({
    queryKey: ["feed", "comments", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feed_comments")
        .select("*, author:profiles!author_id(full_name, avatar_url)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as FeedComment[];
    },
    enabled: !!postId,
  });
}

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: ["profiles", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useIsFollowing(followerId?: string, followingId?: string) {
  return useQuery({
    queryKey: ["follows", followerId, followingId],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_follows")
        .select("id")
        .eq("follower_id", followerId!)
        .eq("following_id", followingId!)
        .maybeSingle();
      return !!data;
    },
    enabled: !!followerId && !!followingId && followerId !== followingId,
  });
}

export function useUserAchievements(userId?: string) {
  return useQuery({
    queryKey: ["achievements", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_achievements")
        .select("*, achievement:achievement_definitions(*)")
        .eq("user_id", userId!);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}
