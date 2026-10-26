import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      trainer_id: string;
      name: string;
      description?: string;
      price_cents: number;
      billing_interval?: string;
      features?: string[];
    }) => {
      const { data, error } = await supabase.from("subscription_plans").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["financial", "plans"] }),
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      student_id: string;
      plan_id: string;
      trainer_id: string;
    }) => {
      const { data, error } = await supabase.from("subscriptions").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["financial"] }),
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      subscription_id: string;
      trainer_id: string;
      student_id: string;
      amount_cents: number;
      status?: string;
      due_date?: string;
    }) => {
      const { data, error } = await supabase.from("payment_records").insert(input).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["financial", "payments"] }),
  });
}

export function useMarkPaymentPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase
        .from("payment_records")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", paymentId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["financial"] }),
  });
}
