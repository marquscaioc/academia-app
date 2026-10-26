// Standalone RLS/validation tests for migration 00047, using real Postgres policies.
// Run: node supabase/tests/professional-partners-tests.mjs
import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { runProfessionalPartnerScenarios } from "./professional-partners-scenarios.mjs";

const db = new PGlite();
await db.exec(`
CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN;
CREATE SCHEMA auth;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
GRANT USAGE ON SCHEMA public,auth TO authenticated,anon;
CREATE TABLE public.profiles(id uuid PRIMARY KEY, role text NOT NULL);
CREATE TABLE public.trainer_profiles(id uuid PRIMARY KEY REFERENCES public.profiles(id),brand_name text,specializations text[]);
CREATE TABLE public.trainer_students(trainer_id uuid REFERENCES public.profiles(id),student_id uuid REFERENCES public.profiles(id),status text);
CREATE FUNCTION public.update_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at=now(); RETURN NEW; END $$;
GRANT SELECT,INSERT,UPDATE,DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_profile ON public.profiles FOR SELECT TO authenticated USING(id=auth.uid());
ALTER TABLE public.trainer_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_relation ON public.trainer_students FOR SELECT TO authenticated USING(trainer_id=auth.uid() OR student_id=auth.uid());
ALTER TABLE public.trainer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY own_trainer_profile ON public.trainer_profiles FOR ALL TO authenticated USING(id=auth.uid()) WITH CHECK(id=auth.uid());
CREATE POLICY linked_trainer_profile ON public.trainer_profiles FOR SELECT TO authenticated USING(EXISTS(SELECT 1 FROM public.trainer_students ts WHERE ts.trainer_id=trainer_profiles.id AND ts.student_id=auth.uid() AND ts.status='active'));
`);
await db.exec(await readFile(new URL("../migrations/00047_professional_partners.sql", import.meta.url), "utf8"));
const U = { trainerA: "00000000-0000-0000-0000-00000000000a", trainerB: "00000000-0000-0000-0000-00000000000b", studentA: "00000000-0000-0000-0000-0000000000a1", studentB: "00000000-0000-0000-0000-0000000000b1", outsider: "00000000-0000-0000-0000-0000000000ff" };
for (const [name,id] of Object.entries(U)) await db.query("INSERT INTO public.profiles VALUES($1,$2)",[id,name.startsWith("trainer")?"trainer":"student"]);
await db.query("INSERT INTO public.trainer_profiles(id) VALUES($1),($2)",[U.trainerA,U.trainerB]);
await db.query("INSERT INTO public.trainer_students VALUES($1,$2,'active'),($3,$4,'active')",[U.trainerA,U.studentA,U.trainerB,U.studentB]);
async function as(id,sql,params=[]) {
  await db.query("RESET ROLE");
  await db.query("SELECT set_config('request.jwt.claim.sub',$1,false)",[id]);
  await db.query("SET ROLE authenticated");
  try { return await db.query(sql,params); } finally { await db.query("RESET ROLE"); }
}
let passed = 0;
async function check(name,run) { await run(); passed++; console.log(`PASS ${name}`); }
async function asSuper(sql,params=[]) {
  await db.query("RESET ROLE");
  await db.query("SELECT set_config('request.jwt.claim.sub','',false)");
  return db.query(sql,params);
}
try {
  await runProfessionalPartnerScenarios({ as, asSuper, check,
    expectError: (promise) => assert.rejects(promise),
    eq: (actual,expected) => assert.deepEqual(actual,expected), U,
  });
  console.log(`${passed} passed, 0 failed`);
} finally { await db.close(); }
