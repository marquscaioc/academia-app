import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export function useUnreadCount(userId?: string) {
  return useQuery({
    queryKey: ["notifications", "unread", userId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId!)
        .eq("is_read", false);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!userId,
    refetchInterval: 30000, // Poll every 30s
  });
}
