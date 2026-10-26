// End-to-end API tests against a LOCAL Supabase stack (GoTrue + PostgREST + RLS),
// using supabase-js exactly like the app does.
//
//   npx supabase start            # local stack (see supabase/config.toml ports)
//   npm run test:api
//
// Reads SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY from env, or from
// `supabase status -o env` automatically. Refuses to run against non-local URLs.
import { createClient } from "@supabase/supabase-js";
import { execSync } from "node:child_process";
import crypto from "node:crypto";

function loadEnv() {
  let url = process.env.SUPABASE_URL;
  let anon = process.env.SUPABASE_ANON_KEY;
  let service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !anon || !service) {
    const out = execSync("npx supabase@2 status -o env", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    const env = Object.fromEntries(
      out
        .split(/\r?\n/)
        .map((l) => l.match(/^([A-Z_]+)="?(.*?)"?$/))
        .filter(Boolean)
        .map((m) => [m[1], m[2]]),
    );
    url = env.API_URL;
    anon = env.ANON_KEY;
    service = env.SERVICE_ROLE_KEY;
  }
  if (!/^http:\/\/(127\.0\.0\.1|localhost)/.test(url ?? "")) {
    throw new Error(`Refusing to run destructive tests against non-local URL: ${url}`);
  }
  return { url, anon, service };
}

const { url, anon, service } = loadEnv();
const admin = createClient(url, service, { auth: { persistSession: false } });
const run = crypto.randomBytes(4).toString("hex");

async function makeUser(label, role) {
  const email = `${label}-${run}@test.dev`;
  const password = `Pw-${run}-${label}!`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: label },
  });
  if (error) throw error;
  await admin.from("profiles").update({ role, onboarding_completed: true }).eq("id", data.user.id);
  const client = createClient(url, anon, { auth: { persistSession: false } });
  const { error: signErr } = await client.auth.signInWithPassword({ email, password });
  if (signErr) throw signErr;
  return { id: data.user.id, client };
}

const results = [];
let failures = 0;
async function check(name, fn) {
  try {
    await fn();
    results.push(`PASS  ${name}`);
  } catch (e) {
    failures++;
    results.push(`FAIL  ${name} -> ${e.message}`);
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const trainer = await makeUser("trainer", "trainer");
const otherTrainer = await makeUser("trainer2", "trainer");
const student = await makeUser("student", "student");
const attacker = await makeUser("attacker", "student");

const { data: ex, error: exErr } = await admin
  .from("exercises")
  .insert({ name: `Supino ${run}`, is_global: true })
  .select("id")
  .single();
if (exErr) throw exErr;

// ---- onboarding via invite ------------------------------------------------------
let code;
await check("trainer creates an invite", async () => {
  code = run.slice(0, 6).toUpperCase();
  const { error } = await trainer.client.from("invites").insert({ trainer_id: trainer.id, code });
  assert(!error, error?.message);
});

await check("attacker cannot link themselves to the student directly", async () => {
  const { error } = await attacker.client
    .from("trainer_students")
    .insert({ trainer_id: attacker.id, student_id: student.id, status: "active" });
  assert(error, "insert should be rejected");
});

await check("student accepts invite (RPC used by the app)", async () => {
  const { data, error } = await student.client.rpc("accept_invite", { invite_code: code, student_uuid: student.id });
  assert(!error && data?.success, error?.message ?? JSON.stringify(data));
});

// ---- prescription ----------------------------------------------------------------
let workoutId, weId;
await check("trainer prescribes a plan/workout/exercise to own student", async () => {
  const { data: plan, error: e1 } = await trainer.client
    .from("workout_plans")
    .insert({ trainer_id: trainer.id, student_id: student.id, name: "Hipertrofia" })
    .select("id")
    .single();
  assert(!e1, e1?.message);
  const { data: w, error: e2 } = await trainer.client
    .from("workouts")
    .insert({ plan_id: plan.id, name: "Treino A", sort_order: 0 })
    .select("id")
    .single();
  assert(!e2, e2?.message);
  const { data: we, error: e3 } = await trainer.client
    .from("workout_exercises")
    .insert({ workout_id: w.id, exercise_id: ex.id, target_sets: 3, target_reps: "8-12", rest_seconds: 90 })
    .select("id")
    .single();
  assert(!e3, e3?.message);
  workoutId = w.id;
  weId = we.id;
});

await check("another trainer cannot prescribe to this student", async () => {
  const { error } = await otherTrainer.client
    .from("workout_plans")
    .insert({ trainer_id: otherTrainer.id, student_id: student.id, name: "x" });
  assert(error, "insert should be rejected");
});

await check("student sees the assigned workout with exercises (app query)", async () => {
  const { data, error } = await student.client
    .from("workout_plans")
    .select("*, workouts(*, exercises:workout_exercises(*, exercise:exercises(id, name)))")
    .eq("student_id", student.id)
    .eq("is_active", true);
  assert(!error, error?.message);
  assert(data?.[0]?.workouts?.[0]?.exercises?.length === 1, "expected 1 exercise");
});

// ---- execution ------------------------------------------------------------------
let sessionId;
const setIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];
await check("student starts a session", async () => {
  const { data, error } = await student.client
    .from("workout_sessions")
    .insert({ user_id: student.id, workout_id: workoutId, started_at: new Date().toISOString() })
    .select("id, started_at")
    .single();
  assert(!error, error?.message);
  sessionId = data.id;
});

await check("open session is discoverable for resume (useOpenSession query)", async () => {
  const { data, error } = await student.client
    .from("workout_sessions")
    .select("id, sets:workout_session_sets(id)")
    .eq("user_id", student.id)
    .eq("workout_id", workoutId)
    .is("finished_at", null)
    .limit(1)
    .maybeSingle();
  assert(!error && data?.id === sessionId, error?.message ?? "session not found");
});

await check("set logging is idempotent under retries (upsert by client id)", async () => {
  const row = (id, n, reps, kg) => ({
    id,
    session_id: sessionId,
    workout_exercise_id: weId,
    exercise_id: ex.id,
    set_number: n,
    reps,
    weight_kg: kg,
    is_warmup: false,
  });
  for (const r of [row(setIds[0], 1, 10, 40), row(setIds[0], 1, 10, 40), row(setIds[1], 2, 9, 40), row(setIds[2], 3, 8, 42.5)]) {
    const { error } = await student.client.from("workout_session_sets").upsert(r, { onConflict: "id" });
    assert(!error, error?.message);
  }
  const { count } = await student.client
    .from("workout_session_sets")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId);
  assert(count === 3, `expected 3 sets, got ${count}`);
});

await check("attacker cannot read or write the student's sets", async () => {
  const { data } = await attacker.client.from("workout_session_sets").select("id").eq("session_id", sessionId);
  assert((data ?? []).length === 0, "attacker read sets");
  const { error } = await attacker.client
    .from("workout_session_sets")
    .insert({ session_id: sessionId, exercise_id: ex.id, set_number: 9, reps: 1 });
  assert(error, "attacker insert should fail");
});

await check("finish is idempotent (second finish affects nothing)", async () => {
  const finish = () =>
    student.client
      .from("workout_sessions")
      .update({ duration_seconds: 1800, finished_at: new Date().toISOString() })
      .eq("id", sessionId)
      .is("finished_at", null)
      .select()
      .maybeSingle();
  const first = await finish();
  assert(!first.error && first.data, first.error?.message ?? "first finish failed");
  const second = await finish();
  assert(!second.error && second.data === null, "second finish should match no rows");
});

await check("streak updated by server trigger", async () => {
  const { data } = await student.client.from("profiles").select("current_streak").eq("id", student.id).single();
  assert(data?.current_streak === 1, `streak ${data?.current_streak}`);
});

await check("get_exercise_bests RPC returns the student's marks", async () => {
  const { data, error } = await student.client.rpc("get_exercise_bests", { p_exercise_ids: [ex.id], p_exclude_session: null });
  assert(!error, error?.message);
  assert(Number(data?.[0]?.max_weight_kg) === 42.5, JSON.stringify(data));
});

await check("trainer sees the student's finished session; other trainer does not", async () => {
  const mine = await trainer.client.from("workout_sessions").select("id").eq("user_id", student.id);
  assert(mine.data?.length === 1, `trainer saw ${mine.data?.length}`);
  const other = await otherTrainer.client.from("workout_sessions").select("id").eq("user_id", student.id);
  assert((other.data ?? []).length === 0, "other trainer saw sessions");
});

await check("trainer can edit the prescription without destroying history", async () => {
  const { error } = await trainer.client.from("workout_exercises").delete().eq("id", weId);
  assert(!error, error?.message);
  const { count } = await admin
    .from("workout_session_sets")
    .select("*", { count: "exact", head: true })
    .eq("session_id", sessionId);
  assert(count === 3, `history lost: ${count} sets`);
});

await check("student cannot mark a payment as paid", async () => {
  const { data: plan } = await trainer.client
    .from("subscription_plans")
    .insert({ trainer_id: trainer.id, name: "Mensal", price_cents: 9900 })
    .select("id")
    .single();
  const { data: sub, error: subErr } = await trainer.client
    .from("subscriptions")
    .insert({ student_id: student.id, plan_id: plan.id, trainer_id: trainer.id })
    .select("id")
    .single();
  assert(!subErr, subErr?.message);
  const { data: pay } = await trainer.client
    .from("payment_records")
    .insert({ subscription_id: sub.id, trainer_id: trainer.id, student_id: student.id, amount_cents: 9900 })
    .select("id")
    .single();
  const { data: upd } = await student.client.from("payment_records").update({ status: "paid" }).eq("id", pay.id).select();
  assert((upd ?? []).length === 0, "student updated payment");
});

// ---- cleanup ----------------------------------------------------------------------
for (const u of [trainer, otherTrainer, student, attacker]) await admin.auth.admin.deleteUser(u.id);
await admin.from("exercises").delete().eq("id", ex.id);

for (const r of results) console.log(r);
console.log(`\n${results.length - failures} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
