// Seeds a LOCAL Supabase stack with a demo trainer + student and an A/B workout plan.
//   npx supabase start && npm run seed:demo
// Prints the demo credentials. Refuses to run against non-local URLs.
import { createClient } from "@supabase/supabase-js";
import { execSync } from "node:child_process";

const out = execSync("npx supabase@2 status -o env", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
const env = Object.fromEntries(
  out
    .split(/\r?\n/)
    .map((l) => l.match(/^([A-Z_]+)="?(.*?)"?$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2]]),
);
if (!/^http:\/\/(127\.0\.0\.1|localhost)/.test(env.API_URL ?? "")) throw new Error("Local stack only");
const admin = createClient(env.API_URL, env.SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const PASSWORD = "Demo-Treino-2026!";
async function ensureUser(email, fullName, role) {
  const { data: list } = await admin.auth.admin.listUsers();
  let user = list.users.find((u) => u.email === email);
  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: fullName, terms_version: "dev", terms_accepted_at: new Date().toISOString() },
    });
    if (error) throw error;
    user = data.user;
  }
  await admin.from("profiles").update({ role, onboarding_completed: true, full_name: fullName }).eq("id", user.id);
  return user.id;
}

const trainerId = await ensureUser("treinador@demo.local", "Treinador Demo", "trainer");
const studentId = await ensureUser("aluno@demo.local", "Aluno Demo", "student");
await admin.from("trainer_profiles").upsert({ id: trainerId }, { onConflict: "id" });
await admin
  .from("trainer_students")
  .upsert({ trainer_id: trainerId, student_id: studentId, status: "active" }, { onConflict: "trainer_id,student_id" });

const IMG = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises";
const catalog = [
  ["Supino reto com barra", "Barbell_Bench_Press_-_Medium_Grip", "Deite no banco, desça a barra até o peito e empurre até estender os cotovelos.", "Peito", "Barra"],
  ["Remada curvada", "Bent_Over_Barbell_Row", "Tronco inclinado, puxe a barra em direção ao abdômen mantendo a coluna neutra.", "Costas", "Barra"],
  ["Agachamento livre", "Barbell_Squat", "Pés na largura dos ombros, desça até as coxas ficarem paralelas ao chão.", "Quadríceps", "Barra"],
  ["Desenvolvimento com halteres", "Dumbbell_Shoulder_Press", "Empurre os halteres acima da cabeça sem arquear a lombar.", "Ombros", "Halteres"],
];
// Lookup tables come from the migrations' seed data; a missing name just leaves the column null.
const { data: muscleRows } = await admin.from("muscle_groups").select("id, name");
const { data: equipmentRows } = await admin.from("equipment").select("id, name");
const idByName = (rows, name) => rows?.find((r) => r.name === name)?.id ?? null;
const exerciseIds = [];
for (const [name, slug, instructions, muscle, equip] of catalog) {
  const tags = { primary_muscle_group_id: idByName(muscleRows, muscle), equipment_id: idByName(equipmentRows, equip) };
  const { data: found } = await admin.from("exercises").select("id").eq("name", name).maybeSingle();
  if (found) {
    await admin.from("exercises").update(tags).eq("id", found.id);
    exerciseIds.push(found.id);
    continue;
  }
  const { data, error } = await admin
    .from("exercises")
    .insert({ name, instructions, is_global: true, thumbnail_url: `${IMG}/${slug}/0.jpg`, video_url: `${IMG}/${slug}/1.jpg`, ...tags })
    .select("id")
    .single();
  if (error) throw error;
  exerciseIds.push(data.id);
}

const { data: existingPlan } = await admin
  .from("workout_plans")
  .select("id")
  .eq("student_id", studentId)
  .eq("name", "Hipertrofia (demo)")
  .maybeSingle();
if (!existingPlan) {
  const { data: plan } = await admin
    .from("workout_plans")
    .insert({ trainer_id: trainerId, student_id: studentId, name: "Hipertrofia (demo)" })
    .select("id")
    .single();
  const days = [
    ["Treino A — Superiores", [0, 1, 3]],
    ["Treino B — Inferiores", [2]],
  ];
  for (const [i, [name, exIdx]] of days.entries()) {
    const { data: w } = await admin
      .from("workouts")
      .insert({ plan_id: plan.id, name, sort_order: i, estimated_duration_minutes: 50, notes: "Foque na técnica antes da carga." })
      .select("id")
      .single();
    await admin.from("workout_exercises").insert(
      exIdx.map((e, order) => ({
        workout_id: w.id,
        exercise_id: exerciseIds[e],
        sort_order: order,
        target_sets: 3,
        target_reps: "8-12",
        rest_seconds: 60,
        notes: order === 0 ? "Controle a descida em 3 segundos." : null,
      })),
    );
  }
}

console.log(`Demo ready on ${env.API_URL}\n  aluno@demo.local / ${PASSWORD}\n  treinador@demo.local / ${PASSWORD}`);
