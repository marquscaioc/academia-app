const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "free_exercise_db.json");
const outputPath = path.join(__dirname, "exercise_database.sql");

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));
console.log("Total exercises loaded:", data.length);

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

function esc(str) {
  if (!str) return "";
  return str.replace(/'/g, "''");
}

let sql = `-- ============================================
-- EXERCISE DATABASE - 873 exercises
-- Source: https://github.com/yuhonas/free-exercise-db
-- Generated automatically
-- ============================================

-- ============================================
-- REFERENCE TABLES
-- ============================================

CREATE TABLE IF NOT EXISTS muscle_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    name_en VARCHAR(50) NOT NULL,
    body_area VARCHAR(20) NOT NULL
);

INSERT INTO muscle_groups (name, name_en, body_area) VALUES
('abs', 'Abdominals', 'core'),
('back', 'Back', 'upper_body'),
('biceps', 'Biceps', 'upper_body'),
('calves', 'Calves', 'lower_body'),
('chest', 'Chest', 'upper_body'),
('forearms', 'Forearms', 'upper_body'),
('full_body', 'Full Body', 'core'),
('glutes', 'Glutes', 'lower_body'),
('hamstrings', 'Hamstrings', 'lower_body'),
('legs', 'Legs', 'lower_body'),
('lower_back', 'Lower Back', 'core'),
('neck', 'Neck', 'upper_body'),
('quadriceps', 'Quadriceps', 'lower_body'),
('shoulders', 'Shoulders', 'upper_body'),
('traps', 'Trapezius', 'upper_body'),
('triceps', 'Triceps', 'upper_body');

CREATE TABLE IF NOT EXISTS equipment_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    name_en VARCHAR(50) NOT NULL
);

INSERT INTO equipment_types (name, name_en) VALUES
('barbell', 'Barbell'),
('body_only', 'Body Only / Bodyweight'),
('cable', 'Cable Machine'),
('dumbbell', 'Dumbbell'),
('exercise_ball', 'Exercise Ball'),
('ez_bar', 'EZ Curl Bar'),
('foam_roller', 'Foam Roller'),
('kettlebell', 'Kettlebell'),
('machine', 'Machine'),
('medicine_ball', 'Medicine Ball'),
('other', 'Other'),
('resistance_band', 'Resistance Band');

CREATE TABLE IF NOT EXISTS exercise_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    name_en VARCHAR(50) NOT NULL
);

INSERT INTO exercise_types (name, name_en) VALUES
('cardio', 'Cardio'),
('flexibility', 'Flexibility / Stretching'),
('plyometrics', 'Plyometrics'),
('strength', 'Strength');

CREATE TABLE IF NOT EXISTS difficulty_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(20) NOT NULL UNIQUE,
    level_order INTEGER NOT NULL
);

INSERT INTO difficulty_levels (name, level_order) VALUES
('beginner', 1),
('intermediate', 2),
('advanced', 3);

-- ============================================
-- MAIN EXERCISES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    muscle_group VARCHAR(50) NOT NULL,
    equipment VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    exercise_type VARCHAR(50) NOT NULL,
    category_original VARCHAR(50),
    instructions TEXT,
    primary_muscles_original TEXT
);

-- ============================================
-- INSERT ALL ${data.length} EXERCISES
-- ============================================

`;

// Generate INSERT statements in batches of 50
const batchSize = 50;
for (let i = 0; i < data.length; i += batchSize) {
  const batch = data.slice(i, i + batchSize);
  sql += `-- Batch ${Math.floor(i/batchSize) + 1} (exercises ${i+1} to ${Math.min(i+batchSize, data.length)})\n`;
  sql += `INSERT INTO exercises (name, muscle_group, equipment, difficulty, exercise_type, category_original, instructions, primary_muscles_original) VALUES\n`;

  const rows = batch.map((ex) => {
    const name = esc(ex.name);
    const mg = getMuscleGroup(ex.primaryMuscles);
    const eq = getEquipment(ex.equipment);
    const diff = getDifficulty(ex);
    const type = getType(ex.category);
    const catOrig = esc(ex.category);
    const instr = esc((ex.instructions || []).join(" "));
    const primMuscles = esc((ex.primaryMuscles || []).join(", "));

    return `('${name}', '${mg}', '${eq}', '${diff}', '${type}', '${catOrig}', '${instr}', '${primMuscles}')`;
  });

  sql += rows.join(",\n") + ";\n\n";
}

// Add summary at the end
sql += `-- ============================================
-- SUMMARY
-- ============================================
-- Total exercises: ${data.length}
--
-- By muscle group:
`;

const muscleCount = {};
const equipCount = {};
const typeCount = {};
const diffCount = {};

data.forEach(ex => {
  const mg = getMuscleGroup(ex.primaryMuscles);
  const eq = getEquipment(ex.equipment);
  const type = getType(ex.category);
  const diff = getDifficulty(ex);
  muscleCount[mg] = (muscleCount[mg] || 0) + 1;
  equipCount[eq] = (equipCount[eq] || 0) + 1;
  typeCount[type] = (typeCount[type] || 0) + 1;
  diffCount[diff] = (diffCount[diff] || 0) + 1;
});

Object.entries(muscleCount).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => {
  sql += `--   ${k}: ${v}\n`;
});

sql += `--\n-- By equipment:\n`;
Object.entries(equipCount).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => {
  sql += `--   ${k}: ${v}\n`;
});

sql += `--\n-- By exercise type:\n`;
Object.entries(typeCount).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => {
  sql += `--   ${k}: ${v}\n`;
});

sql += `--\n-- By difficulty:\n`;
Object.entries(diffCount).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => {
  sql += `--   ${k}: ${v}\n`;
});

fs.writeFileSync(outputPath, sql, "utf8");
console.log("SQL file written to:", outputPath);
console.log("File size:", (fs.statSync(outputPath).size / 1024).toFixed(1), "KB");

// Print summary
console.log("\n=== SUMMARY ===");
console.log("Total exercises:", data.length);
console.log("\nBy muscle group:");
Object.entries(muscleCount).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
console.log("\nBy equipment:");
Object.entries(equipCount).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
console.log("\nBy type:");
Object.entries(typeCount).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
console.log("\nBy difficulty:");
Object.entries(diffCount).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
