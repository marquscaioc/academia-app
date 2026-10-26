import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import { normalizeWhatsAppNumber, PartnerDraft, PartnerProfession, validatePartnerDraft } from "../../lib/partners/contact";

export interface ProfessionalPartner {
  id: string;
  trainer_id: string;
  full_name: string;
  profession: PartnerProfession;
  specialty: string;
  registration: string | null;
  bio: string | null;
  whatsapp_number: string | null;
  booking_url: string | null;
  content_url: string | null;
  is_active: boolean;
}

export interface TrainerContact {
  id: string;
  brand_name: string | null;
  contact_whatsapp: string | null;
  specializations: string[] | null;
}

export function useProfessionalPartners(userId?: string, isTrainer = false) {
  return useQuery({
    queryKey: ["partners", "directory", userId, isTrainer],
    queryFn: async () => {
      let query = supabase.from("professional_partners").select("id,trainer_id,full_name,profession,specialty,registration,bio,whatsapp_number,booking_url,content_url,is_active").order("full_name");
      query = isTrainer ? query.eq("trainer_id", userId!) : query.eq("is_active", true);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as ProfessionalPartner[];
    },
    enabled: !!userId,
  });
}

export function useTrainerContacts(userId?: string, isTrainer = false) {
  return useQuery({
    queryKey: ["partners", "trainer-contact", userId, isTrainer],
    queryFn: async () => {
      let ids = [userId!];
      if (!isTrainer) {
        const { data, error } = await supabase.from("trainer_students").select("trainer_id").eq("student_id", userId!).eq("status", "active");
        if (error) throw error;
        ids = [...new Set((data ?? []).map((row) => row.trainer_id as string))];
      }
      if (!ids.length) return [];
      const { data, error } = await supabase.from("trainer_profiles").select("id,brand_name,contact_whatsapp,specializations").in("id", ids);
      if (error) throw error;
      return (data ?? []) as TrainerContact[];
    },
    enabled: !!userId,
  });
}

export function useSaveProfessionalPartner(trainerId?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, draft }: { id?: string; draft: PartnerDraft }) => {
      if (!trainerId) throw new Error("Entre novamente para salvar.");
      const values = validatePartnerDraft(draft);
      const query = id
        ? supabase.from("professional_partners").update(values).eq("id", id).eq("trainer_id", trainerId)
        : supabase.from("professional_partners").insert({ ...values, trainer_id: trainerId });
      const { data, error } = await query.select("id").single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["partners", "directory"] }),
  });
}

export function useDeleteProfessionalPartner(trainerId?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!trainerId) throw new Error("Entre novamente para excluir.");
      const { error } = await supabase.from("professional_partners").delete().eq("id", id).eq("trainer_id", trainerId);
      if (error) throw error;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["partners", "directory"] }),
  });
}

export function useSaveTrainerContact(trainerId?: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: string) => {
      if (!trainerId) throw new Error("Entre novamente para salvar.");
      const phone = input.trim() ? normalizeWhatsAppNumber(input) : null;
      if (input.trim() && !phone) throw new Error("Use código do país e DDD, por exemplo +55 11 99999-9999.");
      const { error } = await supabase.from("trainer_profiles").upsert({ id: trainerId, contact_whatsapp: phone });
      if (error) throw error;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["partners", "trainer-contact"] }),
  });
}
