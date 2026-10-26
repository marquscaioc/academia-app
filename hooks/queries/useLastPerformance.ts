import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase/client";
import {
  bestMarks,
  parseRepTarget,
  suggestNextWeight,
  type BestMarks,
  type LoggedSet,
} from "../../lib/workout/metrics";

export interface PreviousSet extends LoggedSet {
  setNumber: number;
}

export interface LastPerformance {
  /** Sets of the most recent finished session for this exercise, by set number. */
  lastSets: PreviousSet[];
  lastDate: string | null;
  suggestedWeight: number | null;
  increase: boolean;
}

interface SetRow {
  weight_kg: number | null;
  reps: number | null;
  is_warmup: boolean | null;
  set_number: number;
  session_id: string;
  workout_sessions: { started_at: string } | { started_at: string }[];
}

/**
 * Previous performance of the current user for one exercise (Strong/Hevy-style
 * "previous" column) plus a double-progression load suggestion.
 */
export function useLastPerformance(
  exerciseId: string | undefined,
  userId: string | undefined,
  targetReps: string | null | undefined,
  excludeSessionId?: string | null,
) {
  return useQuery({
    queryKey: ["workouts", "lastPerformance", { exerciseId, userId, excludeSessionId }],
    queryFn: async (): Promise<LastPerformance> => {
      let query = supabase
        .from("workout_session_sets")
        .select("weight_kg, reps, is_warmup, set_number, session_id, workout_sessions!inner(user_id, finished_at, started_at)")
        .eq("exercise_id", exerciseId!)
        .eq("workout_sessions.user_id", userId!)
        .not("workout_sessions.finished_at", "is", null)
        .order("created_at", { ascending: false })
        .limit(30);
      if (excludeSessionId) query = query.neq("session_id", excludeSessionId);

      const { data, error } = await query;
      if (error) throw error;
      const rows = (data ?? []) as unknown as SetRow[];
      if (rows.length === 0) {
        return { lastSets: [], lastDate: null, suggestedWeight: null, increase: false };
      }

      const lastSessionId = rows[0].session_id;
      const sessionRel = rows[0].workout_sessions;
      const lastDate = Array.isArray(sessionRel) ? sessionRel[0]?.started_at ?? null : sessionRel?.started_at ?? null;
      const lastSets: PreviousSet[] = rows
        .filter((r) => r.session_id === lastSessionId)
        .map((r) => ({
          setNumber: r.set_number,
          reps: r.reps,
          weightKg: r.weight_kg === null ? null : Number(r.weight_kg),
          isWarmup: !!r.is_warmup,
        }))
        .sort((a, b) => a.setNumber - b.setNumber);

      const suggestion = suggestNextWeight(lastSets, parseRepTarget(targetReps));
      return { lastSets, lastDate, suggestedWeight: suggestion.weightKg, increase: suggestion.increase };
    },
    enabled: !!exerciseId && !!userId,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * All-time best marks per exercise for the current user, excluding one session
 * (the one being finished). Uses the `get_exercise_bests` RPC (migration 00035);
 * falls back to a bounded client-side scan if the RPC is not deployed yet.
 */
export async function fetchExerciseBests(
  userId: string,
  exerciseIds: string[],
  excludeSessionId: string,
): Promise<Record<string, BestMarks>> {
  const result: Record<string, BestMarks> = {};
  if (exerciseIds.length === 0) return result;

  const { data, error } = await supabase.rpc("get_exercise_bests", {
    p_exercise_ids: exerciseIds,
    p_exclude_session: excludeSessionId,
  });
  if (!error && Array.isArray(data)) {
    for (const row of data as {
      exercise_id: string;
      max_weight_kg: number | null;
      best_e1rm_kg: number | null;
      best_set_volume: number | null;
    }[]) {
      result[row.exercise_id] = {
        maxWeightKg: row.max_weight_kg === null ? null : Number(row.max_weight_kg),
        bestE1rmKg: row.best_e1rm_kg === null ? null : Number(row.best_e1rm_kg),
        bestSetVolume: row.best_set_volume === null ? null : Number(row.best_set_volume),
      };
    }
    return result;
  }

  // Fallback (RPC missing): scan the most recent finished sets of these exercises.
  const { data: rows, error: scanError } = await supabase
    .from("workout_session_sets")
    .select("exercise_id, weight_kg, reps, is_warmup, workout_sessions!inner(user_id, finished_at)")
    .in("exercise_id", exerciseIds)
    .eq("workout_sessions.user_id", userId)
    .not("workout_sessions.finished_at", "is", null)
    .neq("session_id", excludeSessionId)
    .order("created_at", { ascending: false })
    .limit(2000);
  if (scanError) throw scanError;

  const grouped: Record<string, LoggedSet[]> = {};
  for (const r of (rows ?? []) as { exercise_id: string; weight_kg: number | null; reps: number | null; is_warmup: boolean | null }[]) {
    (grouped[r.exercise_id] ??= []).push({
      reps: r.reps,
      weightKg: r.weight_kg === null ? null : Number(r.weight_kg),
      isWarmup: !!r.is_warmup,
    });
  }
  for (const id of exerciseIds) result[id] = bestMarks(grouped[id] ?? []);
  return result;
}
