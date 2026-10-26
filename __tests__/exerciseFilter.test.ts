import { filterExercises, normalize } from "../lib/utils/exerciseFilter";

const list = [
  { name: "Barbell Bench Press", is_global: true, created_by: null, muscle_group: { name: "Peito" }, equipment: { name: "Barra" } },
  { name: "Elevação pélvica", is_global: false, created_by: "t1", muscle_group: { name: "Glúteos" }, equipment: null },
  { name: "Remada do outro", is_global: false, created_by: "t2", muscle_group: { name: "Costas" }, equipment: { name: "Cabo" } },
];
const names = (r: typeof list) => r.map((e) => e.name);

describe("exercise filter", () => {
  it("normalizes accents and case", () => {
    expect(normalize("Elevação PÉLVICA")).toBe("elevacao pelvica");
  });
  it("searches stored name, pt-BR translation, muscle and equipment", () => {
    expect(names(filterExercises(list, { search: "supino" }))).toEqual(["Barbell Bench Press"]);
    expect(names(filterExercises(list, { search: "pelvica" }))).toEqual(["Elevação pélvica"]);
    expect(names(filterExercises(list, { search: "gluteos" }))).toEqual(["Elevação pélvica"]);
    expect(names(filterExercises(list, { search: "cabo" }))).toEqual(["Remada do outro"]);
    expect(filterExercises(list, { search: "  " })).toHaveLength(3);
  });
  it("filters by origin", () => {
    expect(names(filterExercises(list, { origin: "mine", userId: "t1" }))).toEqual(["Elevação pélvica"]);
    expect(filterExercises(list, { origin: "mine" })).toEqual([]);
    expect(names(filterExercises(list, { origin: "global", search: "barra" }))).toEqual(["Barbell Bench Press"]);
  });
});
