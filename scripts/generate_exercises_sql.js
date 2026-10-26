const fs = require("fs");
const data = JSON.parse(fs.readFileSync("exercises_raw.json", "utf8"));

// Muscle group mapping: english -> portuguese (matching our seed data)
const muscleMap = {
  abdominals: "Abdômen",
  abductors: "Glúteos",
  adductors: "Posterior de Coxa",
  biceps: "Bíceps",
  calves: "Panturrilha",
  chest: "Peito",
  forearms: "Antebraço",
  glutes: "Glúteos",
  hamstrings: "Posterior de Coxa",
  lats: "Costas",
  lower_back: "Lombar",
  middle_back: "Costas",
  neck: "Trapézio",
  quadriceps: "Quadríceps",
  shoulders: "Ombros",
  traps: "Trapézio",
  triceps: "Tríceps",
};

// Equipment mapping
const equipMap = {
  barbell: "Barra",
  dumbbell: "Halteres",
  "body only": "Peso Corporal",
  cable: "Cabo/Polia",
  machine: "Máquina",
  kettlebells: "Kettlebell",
  "e-z curl bar": "Barra",
  "medicine ball": "Bola Suíça",
  "exercise ball": "Bola Suíça",
  bands: "Elástico/Banda",
  "foam roll": "Rolo de Espuma",
  other: "Peso Corporal",
  "none": "Peso Corporal",
};

// Category mapping
const categoryMap = {
  strength: "strength",
  stretching: "flexibility",
  plyometrics: "calisthenics",
  cardio: "cardio",
  powerlifting: "strength",
  strongman: "strength",
  "olympic weightlifting": "strength",
};

// Difficulty mapping
const diffMap = {
  beginner: "beginner",
  intermediate: "intermediate",
  expert: "advanced",
};

// Exercise name translations (common ones)
const nameTranslations = {
  "bench press": "Supino Reto",
  "incline bench press": "Supino Inclinado",
  "decline bench press": "Supino Declinado",
  "dumbbell bench press": "Supino Reto com Halteres",
  "barbell squat": "Agachamento com Barra",
  squat: "Agachamento",
  "front squat": "Agachamento Frontal",
  deadlift: "Levantamento Terra",
  "romanian deadlift": "Levantamento Terra Romeno",
  "pull-up": "Barra Fixa",
  "chin-up": "Barra Fixa Supinada",
  "lat pulldown": "Puxada na Polia Alta",
  "seated cable rows": "Remada Sentada no Cabo",
  "barbell row": "Remada Curvada",
  "bent over barbell row": "Remada Curvada com Barra",
  "dumbbell row": "Remada com Halter",
  "overhead press": "Desenvolvimento",
  "military press": "Desenvolvimento Militar",
  "shoulder press": "Desenvolvimento de Ombros",
  "lateral raise": "Elevação Lateral",
  "front raise": "Elevação Frontal",
  "barbell curl": "Rosca Direta com Barra",
  "dumbbell curl": "Rosca Direta com Halter",
  "hammer curl": "Rosca Martelo",
  "preacher curl": "Rosca Scott",
  "tricep dip": "Mergulho para Tríceps",
  "tricep pushdown": "Tríceps no Cabo",
  "skull crusher": "Tríceps Testa",
  "leg press": "Leg Press",
  "leg extension": "Cadeira Extensora",
  "leg curl": "Mesa Flexora",
  "calf raise": "Elevação de Panturrilha",
  lunge: "Avanço",
  "walking lunge": "Avanço Caminhando",
  plank: "Prancha",
  crunch: "Abdominal Crunch",
  "sit-up": "Abdominal",
  "russian twist": "Rotação Russa",
  "push-up": "Flexão de Braço",
  "dip": "Mergulho",
  "cable fly": "Crucifixo no Cabo",
  "dumbbell fly": "Crucifixo com Halteres",
  "face pull": "Face Pull",
  "hip thrust": "Hip Thrust",
  "glute bridge": "Ponte de Glúteos",
  "cable crossover": "Crossover no Cabo",
  "chest fly": "Crucifixo",
  "t-bar row": "Remada Cavalinho",
  "upright row": "Remada Alta",
  "shrug": "Encolhimento de Ombros",
  "reverse fly": "Crucifixo Inverso",
  "concentration curl": "Rosca Concentrada",
  "incline dumbbell curl": "Rosca Inclinada com Halter",
  "close-grip bench press": "Supino Pegada Fechada",
  "overhead tricep extension": "Tríceps Francês",
  "cable curl": "Rosca no Cabo",
  "hack squat": "Hack Squat",
  "bulgarian split squat": "Agachamento Búlgaro",
  "goblet squat": "Agachamento Goblet",
  "sumo deadlift": "Levantamento Terra Sumo",
  "good morning": "Good Morning",
  "hyperextension": "Hiperextensão Lombar",
  "ab wheel rollout": "Roda Abdominal",
  "hanging leg raise": "Elevação de Pernas na Barra",
  "mountain climber": "Escalador",
  burpee: "Burpee",
  "jumping jack": "Polichinelo",
  "box jump": "Salto na Caixa",
  "kettlebell swing": "Swing com Kettlebell",
  "clean and jerk": "Arremesso (Clean & Jerk)",
  snatch: "Arranco (Snatch)",
  "power clean": "Power Clean",
  "farmer walk": "Caminhada do Fazendeiro",
  "battle rope": "Corda Naval",
};

function translateName(name) {
  const lower = name.toLowerCase();
  // Check exact matches first
  for (const [en, pt] of Object.entries(nameTranslations)) {
    if (lower === en) return pt;
  }
  // Check partial matches
  for (const [en, pt] of Object.entries(nameTranslations)) {
    if (lower.includes(en)) return name; // Keep original if partial match
  }
  return name; // Keep English name if no translation found
}

function escapeSQL(str) {
  return str.replace(/'/g, "''");
}

function translateInstructions(instructions) {
  // Keep instructions in English - too complex to auto-translate accurately
  // But format them as numbered steps
  return instructions
    .map((step, i) => `${i + 1}. ${step}`)
    .join("\n");
}

let sql = `-- =============================================
-- EXERCISE DATABASE: 873 exercises
-- Source: github.com/yuhonas/free-exercise-db
-- =============================================

-- First, clear existing exercises (keep muscle_groups and equipment)
DELETE FROM public.workout_exercises WHERE TRUE;
DELETE FROM public.exercises WHERE TRUE;

-- Insert exercises (mapped to existing muscle_groups and equipment)
`;

let count = 0;
for (const ex of data) {
  const muscle = ex.primaryMuscles?.[0] || "chest";
  const musclePt = muscleMap[muscle] || "Peito";
  const equipPt = equipMap[(ex.equipment || "body only").toLowerCase()] || "Peso Corporal";
  const diff = diffMap[ex.level] || "intermediate";
  const type = categoryMap[ex.category] || "strength";
  const name = translateName(ex.name);
  const instructions = translateInstructions(ex.instructions || []);

  sql += `INSERT INTO public.exercises (name, description, instructions, primary_muscle_group_id, equipment_id, difficulty, exercise_type, is_global, is_active)
VALUES (
  '${escapeSQL(name)}',
  '${escapeSQL(muscle)} - ${escapeSQL(ex.category || "strength")}',
  '${escapeSQL(instructions)}',
  (SELECT id FROM public.muscle_groups WHERE name = '${escapeSQL(musclePt)}' LIMIT 1),
  (SELECT id FROM public.equipment WHERE name = '${escapeSQL(equipPt)}' LIMIT 1),
  '${diff}',
  '${type}',
  TRUE,
  TRUE
);\n`;
  count++;
}

sql += `\n-- Total: ${count} exercises inserted\n`;

fs.writeFileSync("supabase/exercises_seed.sql", sql);
console.log(`Generated SQL for ${count} exercises`);
