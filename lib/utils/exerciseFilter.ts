// Client-side exercise search/origin filter used by useExercises. Pure; tested in __tests__/exerciseFilter.test.ts.
import { translateExerciseName } from "./exerciseTranslations";

export type ExerciseOrigin = "all" | "mine" | "global";

interface FilterableExercise {
  name: string;
  is_global: boolean;
  created_by: string | null;
  muscle_group?: { name: string } | null;
  equipment?: { name: string } | null;
}

/** Accent-insensitive, lowercase. */
export function normalize(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Search matches the stored name, its pt-BR translation, the muscle group or the equipment. */
export function filterExercises<T extends FilterableExercise>(
  list: T[],
  opts: { search?: string; origin?: ExerciseOrigin; userId?: string },
): T[] {
  const term = opts.search?.trim() ? normalize(opts.search.trim()) : "";
  const origin = opts.origin ?? "all";
  return list.filter((ex) => {
    if (origin === "mine" && (!opts.userId || ex.created_by !== opts.userId)) return false;
    if (origin === "global" && !ex.is_global) return false;
    if (!term) return true;
    return (
      normalize(ex.name).includes(term) ||
      normalize(translateExerciseName(ex.name)).includes(term) ||
      normalize(ex.muscle_group?.name ?? "").includes(term) ||
      normalize(ex.equipment?.name ?? "").includes(term)
    );
  });
}
