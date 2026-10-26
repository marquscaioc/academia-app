// Database integration tests: applies every migration to an in-memory Postgres
// (PGlite) with minimal Supabase stubs (auth.uid(), storage, roles) and then runs
// RLS / integrity scenarios as real users via SET ROLE authenticated.
//
// Usage: npm run test:db
// Limits: stubs are not the real Supabase platform (no GoTrue, no Storage API,
// no pg_cron/pg_net). Policies, triggers and functions are real Postgres.
import { PGlite } from "@electric-sql/pglite";
import { pg_trgm } from "@electric-sql/pglite/contrib/pg_trgm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(here, "..", "migrations");

const SUPABASE_STUB = `
CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
CREATE SCHEMA auth; CREATE SCHEMA storage; CREATE SCHEMA extensions;
CREATE TABLE auth.users (id uuid PRIMARY KEY, email text, raw_user_meta_data jsonb DEFAULT '{}'::jsonb, created_at timestamptz DEFAULT now());
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT current_setting('request.jwt.claim.role', true) $$;
CREATE TABLE storage.buckets (id text PRIMARY KEY, name text, public boolean DEFAULT false, file_size_limit bigint, allowed_mime_types text[]);
CREATE TABLE storage.objects (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), bucket_id text, name text, owner uuid);
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION storage.foldername(name text) RETURNS text[] LANGUAGE sql IMMUTABLE
  AS $$ SELECT (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
CREATE PUBLICATION supabase_realtime;
GRANT USAGE ON SCHEMA public, auth, storage TO authenticated, anon, service_role;
`;

const db = new PGlite({ extensions: { pg_trgm } });
await db.exec(SUPABASE_STUB);

let failures = 0;
const files = fs.readdirSync(migrationsDir).filter((f) => /^\d+_.*\.sql$/.test(f)).sort();
for (const f of files) {
  try {
    await db.exec(fs.readFileSync(path.join(migrationsDir, f), "utf8"));
  } catch (e) {
    failures++;
    console.log(`FAIL migration ${f}: ${e.message}`);
  }
}
console.log(`Applied ${files.length - failures}/${files.length} migrations`);
await db.exec(`
  GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
  GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
`);

// ---------------------------------------------------------------------------
const U = {
  trainerA: "00000000-0000-0000-0000-00000000000a",
  trainerB: "00000000-0000-0000-0000-00000000000b",
  studentA: "00000000-0000-0000-0000-0000000000a1",
  studentB: "00000000-0000-0000-0000-0000000000b1",
  attacker: "00000000-0000-0000-0000-0000000000ff",
};

async function asSuper(sql, params) {
  await db.query("RESET ROLE");
  await db.query("SELECT set_config('request.jwt.claim.sub', '', false)");
  return db.query(sql, params);
}
async function as(user, sql, params) {
  await db.query("RESET ROLE");
  await db.query("SELECT set_config('request.jwt.claim.sub', $1, false)", [user]);
  await db.query("SET ROLE authenticated");
  try {
    return await db.query(sql, params);
  } finally {
    await db.query("RESET ROLE");
  }
}

const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push(["PASS", name]);
  } catch (e) {
    failures++;
    results.push(["FAIL", `${name} -> ${e.message}`]);
  }
}
async function expectError(promise, label = "expected an error") {
  try {
    await promise;
  } catch {
    return;
  }
  throw new Error(label);
}
function eq(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

// ---- fixtures (as service/superuser) ---------------------------------------
for (const [k, id] of Object.entries(U)) {
  await asSuper("INSERT INTO auth.users (id, email, raw_user_meta_data) VALUES ($1, $2, $3)", [
    id,
    `${k}@test.dev`,
    JSON.stringify({ full_name: k }),
  ]);
}
await asSuper(
  "UPDATE public.profiles SET role = 'trainer', onboarding_completed = true WHERE id IN ($1, $2)",
  [U.trainerA, U.trainerB],
);
await asSuper("UPDATE public.profiles SET onboarding_completed = true WHERE role = 'student'");
await asSuper(
  "INSERT INTO public.trainer_students (trainer_id, student_id, status) VALUES ($1, $2, 'active'), ($3, $4, 'active')",
  [U.trainerA, U.studentA, U.trainerB, U.studentB],
);
const exercise = (
  await asSuper("INSERT INTO public.exercises (name, is_global) VALUES ('Supino', true) RETURNING id")
).rows[0].id;
const planA = (
  await asSuper(
    "INSERT INTO public.workout_plans (trainer_id, student_id, name) VALUES ($1, $2, 'Plano A') RETURNING id",
    [U.trainerA, U.studentA],
  )
).rows[0].id;
const workoutA = (
  await asSuper("INSERT INTO public.workouts (plan_id, name) VALUES ($1, 'Treino A') RETURNING id", [planA])
).rows[0].id;
const weA = (
  await asSuper(
    "INSERT INTO public.workout_exercises (workout_id, exercise_id, target_sets, target_reps) VALUES ($1, $2, 3, '8-12') RETURNING id",
    [workoutA, exercise],
  )
).rows[0].id;

// ---- tenant isolation ---------------------------------------------------------
await check("attacker cannot self-link as trainer of a student", () =>
  expectError(
    as(U.attacker, "INSERT INTO public.trainer_students (trainer_id, student_id, status) VALUES ($1, $2, 'active')", [
      U.attacker,
      U.studentA,
    ]),
  ),
);

await check("attacker cannot read another user's workout sessions", async () => {
  await asSuper("INSERT INTO public.workout_sessions (user_id, workout_id, finished_at) VALUES ($1, $2, now())", [
    U.studentA,
    workoutA,
  ]);
  const r = await as(U.attacker, "SELECT id FROM public.workout_sessions WHERE user_id = $1", [U.studentA]);
  eq(r.rows.length, 0, "visible sessions");
});

await check("trainer A sees own student's sessions", async () => {
  const r = await as(U.trainerA, "SELECT id FROM public.workout_sessions WHERE user_id = $1", [U.studentA]);
  eq(r.rows.length, 1, "visible sessions");
});

await check("trainer B cannot read trainer A's student sessions", async () => {
  const r = await as(U.trainerB, "SELECT id FROM public.workout_sessions WHERE user_id = $1", [U.studentA]);
  eq(r.rows.length, 0, "visible sessions");
});

await check("trainer B cannot create a workout plan for trainer A's student", () =>
  expectError(
    as(U.trainerB, "INSERT INTO public.workout_plans (trainer_id, student_id, name) VALUES ($1, $2, 'x')", [
      U.trainerB,
      U.studentA,
    ]),
  ),
);

await check("trainer A can create a plan for own student and a template", async () => {
  await as(U.trainerA, "INSERT INTO public.workout_plans (trainer_id, student_id, name) VALUES ($1, $2, 'ok')", [
    U.trainerA,
    U.studentA,
  ]);
  await as(U.trainerA, "INSERT INTO public.workout_plans (trainer_id, student_id, name) VALUES ($1, NULL, 'tpl')", [
    U.trainerA,
  ]);
});

await check("trainer B cannot bill trainer A's student", async () => {
  const planB = (
    await as(
      U.trainerB,
      "INSERT INTO public.subscription_plans (trainer_id, name, price_cents) VALUES ($1, 'Mensal', 10000) RETURNING id",
      [U.trainerB],
    )
  ).rows[0].id;
  await expectError(
    as(U.trainerB, "INSERT INTO public.subscriptions (student_id, plan_id, trainer_id) VALUES ($1, $2, $3)", [
      U.studentA,
      planB,
      U.trainerB,
    ]),
  );
});

await check("trainer A can subscribe and bill own student", async () => {
  const planA2 = (
    await as(
      U.trainerA,
      "INSERT INTO public.subscription_plans (trainer_id, name, price_cents) VALUES ($1, 'Mensal', 10000) RETURNING id",
      [U.trainerA],
    )
  ).rows[0].id;
  const sub = (
    await as(
      U.trainerA,
      "INSERT INTO public.subscriptions (student_id, plan_id, trainer_id) VALUES ($1, $2, $3) RETURNING id",
      [U.studentA, planA2, U.trainerA],
    )
  ).rows[0].id;
  await as(
    U.trainerA,
    "INSERT INTO public.payment_records (subscription_id, trainer_id, student_id, amount_cents) VALUES ($1, $2, $3, 10000)",
    [sub, U.trainerA, U.studentA],
  );
});

await check("student cannot mark own payment as paid", async () => {
  const r = await as(U.studentA, "UPDATE public.payment_records SET status = 'paid' WHERE student_id = $1 RETURNING id", [
    U.studentA,
  ]);
  eq(r.rows.length, 0, "updated rows");
});

await check("get_user_prs does not leak other users' records", async () => {
  const r = await as(U.attacker, "SELECT * FROM public.get_user_prs($1)", [U.studentA]);
  eq(r.rows.length, 0, "rows");
});

await check("accept_invite rejects accepting on behalf of another user", async () => {
  await asSuper("INSERT INTO public.invites (trainer_id, code) VALUES ($1, 'ABC123')", [U.trainerA]);
  const r = await as(U.attacker, "SELECT public.accept_invite('ABC123', $1) AS r", [U.studentB]);
  eq(r.rows[0].r.success, false, "success");
});

await check("accept_invite links the caller", async () => {
  const r = await as(U.attacker, "SELECT public.accept_invite('ABC123', $1) AS r", [U.attacker]);
  eq(r.rows[0].r.success, true, "success");
  const link = await asSuper("SELECT status FROM public.trainer_students WHERE trainer_id = $1 AND student_id = $2", [
    U.trainerA,
    U.attacker,
  ]);
  eq(link.rows[0]?.status, "active", "link status");
});

await check("trainer cannot repoint a relationship to another student", () =>
  expectError(
    as(U.trainerA, "UPDATE public.trainer_students SET student_id = $1 WHERE student_id = $2", [U.studentB, U.studentA]),
  ),
);

await check("user cannot add points to someone else's challenge score", () =>
  expectError(
    as(U.attacker, "SELECT public.increment_challenge_score(gen_random_uuid(), $1, 50)", [U.studentA]),
  ),
);

await check("user cannot inflate own streak directly", () =>
  expectError(as(U.studentA, "UPDATE public.profiles SET current_streak = 999 WHERE id = $1", [U.studentA])),
);

await check("user cannot self-promote to admin", () =>
  expectError(as(U.studentA, "UPDATE public.profiles SET role = 'admin' WHERE id = $1", [U.studentA])),
);

await check("outsider cannot join a private DM", async () => {
  const conv = (await as(U.trainerA, "SELECT public.get_or_create_dm($1, $2) AS id", [U.trainerA, U.studentA])).rows[0].id;
  await expectError(
    as(U.attacker, "INSERT INTO public.conversation_members (conversation_id, user_id) VALUES ($1, $2)", [conv, U.attacker]),
  );
});

await check("group chat creator can add members", async () => {
  const conv = (
    await as(
      U.trainerA,
      "INSERT INTO public.conversations (conversation_type, created_by) VALUES ('group', $1) RETURNING id",
      [U.trainerA],
    )
  ).rows[0].id;
  await as(
    U.trainerA,
    "INSERT INTO public.conversation_members (conversation_id, user_id, role) VALUES ($1, $2, 'admin'), ($1, $3, 'member')",
    [conv, U.trainerA, U.studentA],
  );
  const seen = await as(U.studentA, "SELECT id FROM public.conversations WHERE id = $1", [conv]);
  eq(seen.rows.length, 1, "member sees conversation");
});

await check("member cannot promote self to conversation admin", async () => {
  const conv = (
    await asSuper("SELECT conversation_id FROM public.conversation_members WHERE user_id = $1 AND role = 'member' LIMIT 1", [
      U.studentA,
    ])
  ).rows[0].conversation_id;
  await expectError(
    as(U.studentA, "UPDATE public.conversation_members SET role = 'admin' WHERE conversation_id = $1 AND user_id = $2", [
      conv,
      U.studentA,
    ]),
  );
});

await check("other tenant's public challenge is not visible to a student", async () => {
  await asSuper(
    "INSERT INTO public.challenges (created_by, trainer_id, title, is_public, starts_at, ends_at) VALUES ($1, $1, 'B only', true, now(), now() + interval '30 days')",
    [U.trainerB],
  );
  const r = await as(U.studentA, "SELECT id FROM public.challenges WHERE title = 'B only'");
  eq(r.rows.length, 0, "visible challenges");
});

await check("non-admin cannot publish a global exercise", () =>
  expectError(
    as(U.trainerA, "INSERT INTO public.exercises (name, created_by, is_global) VALUES ('x', $1, true)", [U.trainerA]),
  ),
);

// ---- workout integrity ---------------------------------------------------------
let sessionId;
await check("student starts a session for an assigned workout", async () => {
  sessionId = (
    await as(U.studentA, "INSERT INTO public.workout_sessions (user_id, workout_id) VALUES ($1, $2) RETURNING id", [
      U.studentA,
      workoutA,
    ])
  ).rows[0].id;
});

await check("student cannot start a session on someone else's workout", async () => {
  const planB = (
    await asSuper("INSERT INTO public.workout_plans (trainer_id, student_id, name) VALUES ($1, $2, 'B') RETURNING id", [
      U.trainerB,
      U.studentB,
    ])
  ).rows[0].id;
  const wB = (await asSuper("INSERT INTO public.workouts (plan_id, name) VALUES ($1, 'B') RETURNING id", [planB])).rows[0]
    .id;
  await expectError(
    as(U.studentA, "INSERT INTO public.workout_sessions (user_id, workout_id) VALUES ($1, $2)", [U.studentA, wB]),
  );
});

await check("set upsert by client id is idempotent", async () => {
  const id = "11111111-1111-1111-1111-111111111111";
  const upsert = `INSERT INTO public.workout_session_sets (id, session_id, workout_exercise_id, exercise_id, set_number, reps, weight_kg)
                  VALUES ($1, $2, $3, $4, 1, $5, 40) ON CONFLICT (id) DO UPDATE SET reps = EXCLUDED.reps`;
  await as(U.studentA, upsert, [id, sessionId, weA, exercise, 10]);
  await as(U.studentA, upsert, [id, sessionId, weA, exercise, 12]);
  const r = await as(U.studentA, "SELECT reps FROM public.workout_session_sets WHERE session_id = $1", [sessionId]);
  eq(r.rows, [{ reps: 12 }], "rows");
});

await check("attacker cannot insert sets into another user's session", () =>
  expectError(
    as(
      U.attacker,
      "INSERT INTO public.workout_session_sets (session_id, exercise_id, set_number, reps) VALUES ($1, $2, 2, 10)",
      [sessionId, exercise],
    ),
  ),
);

await check("finishing only affects open sessions (idempotent) and updates streak", async () => {
  const first = await as(
    U.studentA,
    "UPDATE public.workout_sessions SET finished_at = now() WHERE id = $1 AND finished_at IS NULL RETURNING id",
    [sessionId],
  );
  eq(first.rows.length, 1, "first finish");
  const second = await as(
    U.studentA,
    "UPDATE public.workout_sessions SET finished_at = now() WHERE id = $1 AND finished_at IS NULL RETURNING id",
    [sessionId],
  );
  eq(second.rows.length, 0, "second finish");
  const p = await asSuper("SELECT current_streak FROM public.profiles WHERE id = $1", [U.studentA]);
  eq(p.rows[0].current_streak, 1, "streak via trigger");
});

await check("get_exercise_bests returns explicit PR marks for own data only", async () => {
  await asSuper(
    "INSERT INTO public.workout_session_sets (session_id, exercise_id, set_number, reps, weight_kg, is_warmup) VALUES ($1, $2, 2, 8, 50, false), ($1, $2, 3, 20, 100, true)",
    [sessionId, exercise],
  );
  const mine = await as(U.studentA, "SELECT * FROM public.get_exercise_bests($1::uuid[], NULL)", [[exercise]]);
  eq(
    mine.rows.map((r) => [Number(r.max_weight_kg), Number(r.best_e1rm_kg), Number(r.best_set_volume)]),
    [[50, 63.3, 480]],
    "bests (warm-up ignored)",
  );
  const other = await as(U.attacker, "SELECT * FROM public.get_exercise_bests($1::uuid[], NULL)", [[exercise]]);
  eq(other.rows.length, 0, "attacker rows");
});

await check("sessions finished >24h ago are immutable for the student", async () => {
  await asSuper("UPDATE public.workout_sessions SET finished_at = now() - interval '3 days' WHERE id = $1", [sessionId]);
  await expectError(
    as(U.studentA, "UPDATE public.workout_session_sets SET reps = 99 WHERE session_id = $1", [sessionId]),
    "set edit should fail",
  );
  await expectError(
    as(U.studentA, "DELETE FROM public.workout_sessions WHERE id = $1", [sessionId]),
    "session delete should fail",
  );
});

await check("trainer can still edit the prescription; history is preserved", async () => {
  await as(U.trainerA, "DELETE FROM public.workout_exercises WHERE id = $1", [weA]);
  const r = await asSuper("SELECT count(*)::int AS n, count(workout_exercise_id)::int AS linked FROM public.workout_session_sets WHERE session_id = $1", [
    sessionId,
  ]);
  eq(r.rows[0], { n: 3, linked: 0 }, "sets kept, link nulled");
  await as(U.trainerA, "DELETE FROM public.workout_plans WHERE id = $1", [planA]);
  const s = await asSuper("SELECT workout_id FROM public.workout_sessions WHERE id = $1", [sessionId]);
  eq(s.rows[0].workout_id, null, "session kept, workout link nulled");
});

// ---- check-ins (00036) -------------------------------------------------------------
await asSuper("GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated");
const tpl = (
  await asSuper("INSERT INTO public.questionnaire_templates (created_by, title) VALUES ($1, 'Semanal') RETURNING id", [U.trainerA])
).rows[0].id;
const question = (
  await asSuper(
    "INSERT INTO public.questionnaire_questions (template_id, question_text, question_type) VALUES ($1, 'Sono?', 'scale') RETURNING id",
    [tpl],
  )
).rows[0].id;
const otherTpl = (
  await asSuper("INSERT INTO public.questionnaire_templates (created_by, title) VALUES ($1, 'Outro') RETURNING id", [U.trainerA])
).rows[0].id;
const otherQuestion = (
  await asSuper(
    "INSERT INTO public.questionnaire_questions (template_id, question_text, question_type) VALUES ($1, 'x', 'text') RETURNING id",
    [otherTpl],
  )
).rows[0].id;
const checkIn = (
  await asSuper(
    "INSERT INTO public.check_ins (user_id, template_id, trainer_id) VALUES ($1, $2, $3) RETURNING id",
    [U.studentA, tpl, U.trainerA],
  )
).rows[0].id;

await check("student answers a pending check-in", async () => {
  await as(U.studentA, "INSERT INTO public.check_in_answers (check_in_id, question_id, answer_number) VALUES ($1, $2, 7)", [
    checkIn,
    question,
  ]);
});

await check("student cannot answer a question from another template", async () => {
  await expectError(
    as(U.studentA, "INSERT INTO public.check_in_answers (check_in_id, question_id, answer_text) VALUES ($1, $2, 'x')", [
      checkIn,
      otherQuestion,
    ]),
  );
});

await check("answers are frozen once the check-in is submitted", async () => {
  await as(U.studentA, "UPDATE public.check_ins SET status = 'submitted', submitted_at = now() WHERE id = $1", [checkIn]);
  const r = await as(U.studentA, "UPDATE public.check_in_answers SET answer_number = 10 WHERE check_in_id = $1 RETURNING id", [
    checkIn,
  ]);
  eq(r.rows.length, 0, "rows updated after submit");
  const seen = await as(U.studentA, "SELECT answer_number FROM public.check_in_answers WHERE check_in_id = $1", [checkIn]);
  eq(Number(seen.rows[0]?.answer_number), 7, "student can still read own answer");
});

await check("deleting a trainer keeps the student's check-in history (LGPD FKs)", async () => {
  await asSuper("DELETE FROM public.questionnaire_templates WHERE id = $1", [tpl]);
  const r = await asSuper("SELECT template_id FROM public.check_ins WHERE id = $1", [checkIn]);
  // Template delete cascades its questions; the check-in survives with template/question links nulled.
  eq(r.rows.length, 1, "check-in kept");
  eq(r.rows[0].template_id, null, "template link nulled");
});

// ---- storage (00036) ---------------------------------------------------------------
await check("feed-media uploads only into the uploader's own folder", async () => {
  await as(U.studentA, "INSERT INTO storage.objects (bucket_id, name) VALUES ('feed-media', $1)", [`${U.studentA}/a.jpg`]);
  await expectError(
    as(U.attacker, "INSERT INTO storage.objects (bucket_id, name) VALUES ('feed-media', $1)", [`${U.studentA}/evil.jpg`]),
  );
});

await check("linked trainer reads student progress photos; other trainer cannot", async () => {
  await asSuper("INSERT INTO storage.objects (bucket_id, name) VALUES ('progress-photos', $1)", [`${U.studentA}/front.jpg`]);
  const a = await as(U.trainerA, "SELECT name FROM storage.objects WHERE bucket_id = 'progress-photos'");
  eq(a.rows.length, 1, "trainer A sees 1");
  const b = await as(U.trainerB, "SELECT name FROM storage.objects WHERE bucket_id = 'progress-photos'");
  eq(b.rows.length, 0, "trainer B sees 0");
});

await check("student can delete own progress photo", async () => {
  const r = await as(U.studentA, "DELETE FROM storage.objects WHERE bucket_id = 'progress-photos' RETURNING id");
  eq(r.rows.length, 1, "deleted rows");
});

await check("only trainers upload brand assets", async () => {
  await as(U.trainerA, "INSERT INTO storage.objects (bucket_id, name) VALUES ('brand-assets', $1)", [`${U.trainerA}/logo.jpg`]);
  await expectError(
    as(U.studentA, "INSERT INTO storage.objects (bucket_id, name) VALUES ('brand-assets', $1)", [`${U.studentA}/logo.jpg`]),
  );
});

await check("chat media: members only", async () => {
  const conv = (
    await asSuper("INSERT INTO public.conversations (conversation_type, created_by) VALUES ('direct', $1) RETURNING id", [U.trainerA])
  ).rows[0].id;
  await asSuper(
    "INSERT INTO public.conversation_members (conversation_id, user_id) VALUES ($1, $2), ($1, $3)",
    [conv, U.trainerA, U.studentA],
  );
  await as(U.studentA, "INSERT INTO storage.objects (bucket_id, name) VALUES ('chat-media', $1)", [`${U.studentA}/${conv}/a.jpg`]);
  const t = await as(U.trainerA, "SELECT 1 FROM storage.objects WHERE bucket_id = 'chat-media'");
  eq(t.rows.length, 1, "member reads");
  const x = await as(U.attacker, "SELECT 1 FROM storage.objects WHERE bucket_id = 'chat-media'");
  eq(x.rows.length, 0, "outsider reads");
  await expectError(
    as(U.attacker, "INSERT INTO storage.objects (bucket_id, name) VALUES ('chat-media', $1)", [`${U.attacker}/${conv}/b.jpg`]),
  );
});

// ---------------------------------------------------------------------------
for (const [status, name] of results) console.log(`${status}  ${name}`);
console.log(`\n${results.filter((r) => r[0] === "PASS").length} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
