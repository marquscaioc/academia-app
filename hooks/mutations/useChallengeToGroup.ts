import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export function useConvertToGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { challengeId: string; userId: string }) => {
      // Get challenge details
      const { data: challenge } = await supabase
        .from("challenges")
        .select("title, description")
        .eq("id", input.challengeId)
        .single();

      if (!challenge) throw new Error("Desafio nao encontrado");

      // Create group
      const { data: group, error: groupErr } = await supabase
        .from("groups")
        .insert({
          name: challenge.title,
          description: challenge.description ?? `Grupo criado do desafio "${challenge.title}"`,
          created_by: input.userId,
          is_public: true,
        })
        .select()
        .single();
      if (groupErr) throw groupErr;

      // Copy participants as group members
      const { data: participants } = await supabase
        .from("challenge_participants")
        .select("user_id")
        .eq("challenge_id", input.challengeId);

      if (participants?.length) {
        const members = participants.map((p) => ({
          group_id: group.id,
          user_id: p.user_id,
          role: p.user_id === input.userId ? "admin" : "member",
        }));
        await supabase.from("group_members").insert(members);
      }

      // Create group conversation
      const { data: conversation } = await supabase
        .from("conversations")
        .insert({
          conversation_type: "group",
          title: challenge.title,
          group_id: group.id,
        })
        .select()
        .single();

      if (conversation && participants?.length) {
        const convMembers = participants.map((p) => ({
          conversation_id: conversation.id,
          user_id: p.user_id,
          role: p.user_id === input.userId ? "admin" : "member",
        }));
        await supabase.from("conversation_members").insert(convMembers);
      }

      return group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}
