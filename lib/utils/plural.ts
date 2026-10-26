/** "1 exercício" / "3 exercícios". Portuguese uses the singular only for exactly 1. */
export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
