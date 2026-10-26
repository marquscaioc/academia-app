import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import type { Food } from "../../lib/diet/foodTypes";

/**
 * Local food search — queries the `foods` table (TACO + previously cached OFF
 * items) using an ilike on name. Enabled when `term` has at least 2 characters.
 */
export function useFoodSearch(term: string) {
  return useQuery({
    queryKey: ["foods", "search", term],
    enabled: term.trim().length >= 2,
    queryFn: async (): Promise<Food[]> => {
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .ilike("name", `%${term.trim()}%`)
        .eq("is_active", true)
        .order("source", { ascending: true })
        .limit(30);
      if (error) throw error;
      return data as Food[];
    },
  });
}

/**
 * Calls the deployed `food-lookup` edge function which hits OpenFoodFacts.
 * The function reads query-string params and was deployed with --no-verify-jwt,
 * so we call its URL directly instead of supabase.functions.invoke (which does not cleanly
 * support query strings). It verifies the user's session itself, so we send the access token
 * (not the anon key) and it rate limits per user (HTTP 429).
 *
 * Returns the `results` array from the edge function response as `Food[]`.
 */
export async function lookupOpenFoodFacts(params: {
  q?: string;
  barcode?: string;
}): Promise<Food[]> {
  const base = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const qs = params.barcode
    ? `barcode=${encodeURIComponent(params.barcode)}`
    : `q=${encodeURIComponent(params.q ?? "")}`;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("food-lookup: sessão expirada");

  const res = await fetch(`${base}/functions/v1/food-lookup?${qs}`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
    },
  });

  if (res.status === 429) throw new Error("Muitas buscas seguidas. Aguarde um minuto e tente novamente.");
  if (!res.ok) throw new Error(`food-lookup ${res.status}`);
  const j = await res.json();
  return (j?.results ?? []) as Food[];
}
