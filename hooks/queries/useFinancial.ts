import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";

export interface SubscriptionPlan {
  id: string;
  trainer_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  billing_interval: string;
  features: string[];
  max_students: number | null;
  is_active: boolean;
  created_at: string;
  active_subscriptions?: number;
}

export interface Subscription {
  id: string;
  student_id: string;
  plan_id: string;
  trainer_id: string;
  status: "active" | "past_due" | "cancelled" | "paused";
  current_period_start: string;
  current_period_end: string | null;
  created_at: string;
  student?: { full_name: string; avatar_url: string | null };
  plan?: { name: string; price_cents: number };
}

export interface PaymentRecord {
  id: string;
  subscription_id: string;
  trainer_id: string;
  student_id: string;
  amount_cents: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  paid_at: string | null;
  due_date: string | null;
  created_at: string;
  student?: { full_name: string };
}

export function useSubscriptionPlans(trainerId?: string) {
  return useQuery({
    queryKey: ["financial", "plans", trainerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("trainer_id", trainerId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SubscriptionPlan[];
    },
    enabled: !!trainerId,
  });
}

export function useSubscriptions(trainerId?: string) {
  return useQuery({
    queryKey: ["financial", "subscriptions", trainerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*, student:profiles!student_id(full_name, avatar_url), plan:subscription_plans(name, price_cents)")
        .eq("trainer_id", trainerId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Subscription[];
    },
    enabled: !!trainerId,
  });
}

export function usePaymentRecords(trainerId?: string) {
  return useQuery({
    queryKey: ["financial", "payments", trainerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_records")
        .select("*, student:profiles!student_id(full_name)")
        .eq("trainer_id", trainerId!)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as PaymentRecord[];
    },
    enabled: !!trainerId,
  });
}

export function useRevenueStats(trainerId?: string) {
  return useQuery({
    queryKey: ["financial", "revenue", trainerId],
    queryFn: async () => {
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("plan:subscription_plans(price_cents)")
        .eq("trainer_id", trainerId!)
        .eq("status", "active");

      const mrr = (subs ?? []).reduce(
        (sum, s) => sum + ((s.plan as unknown as { price_cents: number })?.price_cents ?? 0), 0,
      );

      const { count: activeStudents } = await supabase
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", trainerId!)
        .eq("status", "active");

      const { count: pendingPayments } = await supabase
        .from("payment_records")
        .select("*", { count: "exact", head: true })
        .eq("trainer_id", trainerId!)
        .eq("status", "pending");

      return {
        mrr,
        activeStudents: activeStudents ?? 0,
        pendingPayments: pendingPayments ?? 0,
      };
    },
    enabled: !!trainerId,
  });
}
