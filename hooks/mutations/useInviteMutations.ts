import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export function useCreateInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (trainerId: string) => {
      const { data: codeResult } = await supabase.rpc("generate_invite_code");
      const code = codeResult as string;

      const { data, error } = await supabase
        .from("invites")
        .insert({ trainer_id: trainerId, code })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invites"] }),
  });
}

export function useAcceptInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { code: string; student_id: string }) => {
      const { data, error } = await supabase.rpc("accept_invite", {
        invite_code: input.code.toUpperCase(),
        student_uuid: input.student_id,
      });
      if (error) throw error;
      return data as { success: boolean; error?: string; trainer_id?: string };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
  });
}

export function useTrainerInvites(trainerId?: string) {
  const queryClient = useQueryClient();
  return {
    queryKey: ["invites", trainerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invites")
        .select("*")
        .eq("trainer_id", trainerId!)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data;
    },
    enabled: !!trainerId,
  };
}
