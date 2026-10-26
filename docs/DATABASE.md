# Database

Supabase Postgres (17 locally). Schema = `supabase/migrations/00001…00038` applied in order
(`00024_cron_edge_functions.sql.template` is a template, not a migration).

**Rules**: never edit or delete an applied migration; every change is a new numbered file; no destructive statements
(drop table/column, delete data) without an explicit decision; every migration must pass `npm run test:db` and apply on
the local stack (`npx supabase migration up --local`) before it is proposed for the remote project.

## 1. Domain tables

| Domain | Tables |
|---|---|
| Identity / tenancy | `profiles` (role student/trainer/nutritionist/admin, streaks, counters), `trainer_profiles`, `trainer_students` (tenancy root), `invites` |
| Workouts | `workout_plans` → `workouts` → `workout_exercises` (prescription); `workout_sessions` → `workout_session_sets` (execution); `exercises`, `muscle_groups`, `equipment` |
| Progress | `body_measurements`, `progress_photos` |
| Check-ins | `questionnaire_templates` → `questionnaire_questions`; `check_ins` → `check_in_answers` |
| Nutrition | `diet_plans` → `meals` → `meal_items`; `meal_logs`, `food_logs`, `foods`, `food_substitutions`, `water_logs`, `recipes`, `recipe_ingredients`, `recipe_favorites` |
| Social | `feed_posts`, `feed_reactions`, `feed_comments`, `user_follows`, `groups`, `group_members` |
| Challenges | `challenges`, `challenge_participants`, `challenge_entries`, `challenge_teams`, `challenge_point_rules`, `challenge_entry_comments`, `daily_poses`, `achievement_definitions`, `user_achievements` |
| Chat | `conversations`, `conversation_members`, `messages` (realtime) |
| Content | `courses`, `lessons`, `lesson_progress`, `student_notes` |
| Financial (internal records, no gateway) | `subscription_plans`, `subscriptions`, `payment_records` |
| Other | `notifications` |

## 2. Workout data rules

- Deleting a prescription (`workout_exercises`, plan, workout) **never** deletes history: `workout_session_sets.workout_exercise_id`
  and `workout_sessions.workout_id` are `ON DELETE SET NULL`; sets keep `exercise_id` (NOT NULL).
- Sets are written with client-generated UUIDs and `upsert … onConflict id` → retries are idempotent.
- Finish is `update … where finished_at is null` → idempotent; streak updated by trigger.
- 00035 triggers: sets and sessions are immutable 24 h after `finished_at`; `finished_at` cannot be rewritten once set;
  FK `SET NULL` updates still pass.
- New sessions must reference a workout from the caller's own plan (policy WITH CHECK).
- `get_exercise_bests(p_exercise_ids uuid[], p_exclude_session uuid)` returns per-exercise max weight / reps / e1RM /
  volume for the caller only (baseline for PR detection).

## 3. Security-relevant functions

| Function | Kind | Guard |
|---|---|---|
| `is_trainer_of(uuid)` | definer | active link only |
| `has_trainer_link(uuid)` | definer | any link status — used in trainer WITH CHECK |
| `accept_invite(code, uuid)` | definer | uses `auth.uid()`; `FOR UPDATE` on invite |
| `get_user_prs(uuid)` | **invoker** | RLS applies |
| `trainer_student_overview()` (00037) | **invoker** | caller's active students only; RLS applies to every joined table |
| `create_workout_plan(...)`, `copy_workout_plan(...)` (00038) | **invoker** | trainer role only; RLS on every insert; exercises must be visible to the caller; one transaction |
| `increment_challenge_score`, `increment_team_score` | definer | caller must be the user / team member; points 0..100000 |
| `is_challenge_participant(uuid)` | definer | avoids RLS recursion |
| `is_conversation_member(uuid, uuid)` | definer | used by chat RLS and chat-media storage |
| `prevent_role_escalation` | trigger | role, active, onboarding, streak and follower counters are server-managed |

All SECURITY DEFINER functions pin `search_path = public`.

## 4. Storage layout

All client uploads use `<auth.uid()>/<file>`.

| Bucket | Public | Write | Read |
|---|---|---|---|
| avatars | yes | own folder | everyone (authenticated) |
| exercise-videos | yes | own folder | everyone (authenticated) |
| progress-photos | no | own folder (insert/update/delete) | owner + actively linked trainer |
| feed-media | yes* | own folder | everyone (authenticated) |
| chat-media | no | `<uid>/<conversation_id>/…`, member of that conversation | conversation members |
| brand-assets | yes | own folder, trainer/nutritionist/admin | everyone |

\* Open item: media of non-public posts is reachable by URL. Needs a private bucket + signed URLs.

## 5. Account deletion (LGPD)

`delete-account` (edge function, caller only) removes the user's files from every user bucket and deletes the auth user;
profile rows cascade. 00036 turned the remaining `NO ACTION` foreign keys into `SET NULL` so deletion can't be blocked by
other users' rows (check-ins on a deleted template, feed posts referencing a deleted session/challenge, etc.).
Open decision: financial records cascade with the student — fiscal retention may require keeping anonymised copies.

## 6. Indexes

00035 added FK/filter indexes for sets (exercise, workout_exercise), workout_exercises, workouts, plans, sessions,
diet, check-ins, payments, recipes, feed and challenges. Remaining: rewrite policies to `(select auth.uid())` for per-statement
evaluation; drop duplicate indexes listed in `AUDIT.md`.

## 7. Applying migrations

- **Local**: `npx supabase start` (ports 554xx, see `supabase/config.toml`), then `npx supabase migration up --local`.
- **Remote**: not done by this work. 00034–00038 are pending on the production project and require the owner's
  authorisation and a backup first. Recommended order: take a backup → apply on a Supabase branch → run `npm run test:api`
  against the branch → apply to production.
