const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "free_exercise_db.json");
const outputPath = path.join(__dirname, "exercises_structured.json");

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

function getDifficulty(ex) {
  const name = ex.name.toLowerCase();
  const cat = ex.category;
  if (cat === "stretching") return "beginner";
  if (cat === "olympic weightlifting" || cat === "strongman") return "advanced";
  if (cat === "powerlifting") return "advanced";
  if (name.includes("advanced") || name.includes("weighted") || name.includes("one-arm") || name.includes("single-leg") || name.includes("pistol")) return "advanced";
  if (name.includes("beginner") || name.includes("basic") || name.includes("assisted")) return "beginner";
  if (cat === "plyometrics") return "intermediate";
  return "intermediate";
}

function getType(cat) {
  const map = {
    "strength": "strength",
    "stretching": "flexibility",
    "cardio": "cardio",
    "plyometrics": "plyometrics",
    "powerlifting": "strength",
    "olympic weightlifting": "strength",
    "strongman": "strength"
  };
  return map[cat] || "strength";
}

function getEquipment(eq) {
  if (!eq || eq === "none" || eq === "body only") return "body_only";
  const map = {
    "barbell": "barbell",
    "dumbbell": "dumbbell",
    "cable": "cable",
    "machine": "machine",
    "kettlebells": "kettlebell",
    "bands": "resistance_band",
    "exercise ball": "exercise_ball",
    "medicine ball": "medicine_ball",
    "foam roll": "foam_roller",
    "e-z curl bar": "ez_bar",
    "other": "other"
  };
  return map[eq] || "other";
}

function getMuscleGroup(muscles) {
  if (!muscles || muscles.length === 0) return "full_body";
  const m = muscles[0].toLowerCase();
  const map = {
    "abdominals": "abs",
    "abductors": "legs",
    "adductors": "legs",
    "biceps": "biceps",
    "calves": "calves",
    "chest": "chest",
    "forearms": "forearms",
    "glutes": "glutes",
    "hamstrings": "hamstrings",
    "lats": "back",
    "lower back": "lower_back",
    "middle back": "back",
    "neck": "neck",
    "quadriceps": "quadriceps",
    "shoulders": "shoulders",
    "traps": "traps",
    "triceps": "triceps"
  };
  return map[m] || "full_body";
}

const structured = data.map((ex, i) => ({
  id: i + 1,
  name: ex.name,
  muscle_group: getMuscleGroup(ex.primaryMuscles),
  primary_muscles: ex.primaryMuscles || [],
  equipment: getEquipment(ex.equipment),
  equipment_original: ex.equipment || "body only",
  difficulty: getDifficulty(ex),
  exercise_type: getType(ex.category),
  category_original: ex.category,
  instructions: (ex.instructions || []).join(" ")
}));

fs.writeFileSync(outputPath, JSON.stringify(structured, null, 2), "utf8");
console.log("Structured JSON written to:", outputPath);
console.log("Total exercises:", structured.length);
console.log("File size:", (fs.statSync(outputPath).size / 1024).toFixed(1), "KB");
