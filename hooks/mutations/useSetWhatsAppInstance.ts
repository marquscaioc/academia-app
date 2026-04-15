import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export function useSetWhatsAppInstance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { trainerId: string; instanceName: string | null }) => {
      const { error } = await supabase
        .from("trainer_profiles")
        .update({ whatsapp_instance_name: input.instanceName })
        .eq("id", input.trainerId);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["whatsapp", "instance-name", vars.trainerId] });
    },
  });
}
