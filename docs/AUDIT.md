# Audit — academia-app (Projeto Gaab)

Date: 2026-10-26. Baseline commit: `e2f740d` (state of the repository as received).
Scope: client (Expo SDK 54 / Expo Router / RN Web), Supabase schema + RLS (migrations 00001–00033),
edge functions, build/tooling, and the workout experience end to end.

Status legend: **Fixed** (code + test in this repo), **Open** (still to do), **Decision** (needs the owner).

---

## 1. Stack as found

| Area | Found | Notes |
|---|---|---|
| Runtime | Expo SDK 54, RN 0.81, React 19.1, New Architecture | SDK 54 is 4 versions behind current (58). Kept on purpose (master prompt: don't replace stack). |
| Routing | Expo Router 6, role groups `(auth)`, `(student)`, `(trainer)`, `(admin)` | Client `RoleGuard` is UX only; security relies on RLS. |
| Styling | NativeWind 4 + custom tokens (`lib/design/tokens.ts`) | Dark-only theme. |
| Data | Supabase JS 2, TanStack Query 5, Zustand 5 | |
| Forms | react-hook-form + zod | |
| Media | `expo-av` (deprecated in SDK 53, removed in 55) | **Fixed**: replaced with `expo-video`. |
| Tests | None | **Fixed**: jest-expo unit tests, PGlite DB tests, API e2e tests (see TESTING.md). |
| Lint | None configured | **Fixed**: ESLint 9 + `eslint-config-expo`. 0 errors. |
| VCS | No git repository | Initialised; baseline committed unchanged. |

## 2. Build / tooling defects

| # | Finding | Status |
|---|---|---|
| B1 | `@react-native-async-storage/async-storage` 3.x (incompatible with SDK 54) | **Fixed** → 2.2.0 |
| B2 | `babel-preset-expo` 55 on SDK 54 | **Fixed** → ~54.0.10 |
| B3 | Web rendered a blank page: `zustand/middleware` ESM uses `import.meta.env`; the web bundle is not a module | **Fixed** (`unstable_transformImportMeta`) |
| B4 | NativeWind web error "Cannot manually set color scheme, as dark mode is type 'media'" on every load | **Fixed** (`darkMode: "class"`, no `dark:` variants exist) |
| B5 | `useNotificationObserver` threw on web | **Fixed** (no-op on web) |
| B6 | Single 4.8 MB web JS bundle, no route splitting | **Open** (Phase 7) |
| B7 | `LAUNCH_ROADMAP.md` is outdated (lists `eas.json`, privacy/terms, delete-account as missing; they exist) | Superseded by `docs/IMPLEMENTATION_STATUS.md` |

## 3. Client defects

| # | Finding | Status |
|---|---|---|
| C1 | Rules-of-Hooks violation: `useLastPerformance` called after an early return in the workout screen (crash when data arrives) | **Fixed** (screen rewritten) |
| C2 | Route collision: route groups are stripped from URLs, so `(workouts)/[workoutId]`, `(chat)/[conversationId]`, `(courses)/[courseId]` all matched `/:id`. Reloading a workout opened a chat | **Fixed** → `/treino/:id`, `/conversa/:id`, `/curso/:id` |
| C3 | Workout session state lived only in memory; reload/app kill lost the session | **Fixed** (persisted Zustand store + server resume of open sessions < 24 h) |
| C4 | Sets inserted with plain `insert` → duplicates on retry | **Fixed** (client UUID + `upsert onConflict id`) |
| C5 | Finishing a workout could run twice and double-count streak/feed | **Fixed** (`update … where finished_at is null`) |
| C6 | Rest timer based on `setInterval` counting; drifted and died in background | **Fixed** (absolute `restEndsAt`) |
| C7 | "Ver vídeo" shown for exercises whose `video_url` is a JPG frame (free-exercise-db) | **Fixed** (`isPlayableVideo`) |
| C8 | `Alert.alert` used for confirmations; does nothing on web | Partially fixed: workout flow uses `ConfirmDialog`. **Open** for other screens (e.g. `app/challenges/[challengeId].tsx`) |
| C9 | Home always showed "Tem um código de convite?" and an unconditional "Conectado" banner, even for linked students | **Fixed** |
| C10 | Student tab bar has 7 tabs (labels truncated on phones) | **Open** — proposal: 5 tabs + "Mais" hub (Phase 2) |
| C11 | Many user-visible strings without Portuguese accents | **Fixed** for 113 strings in 41 files; residual cases may remain in less-used screens |
| C12 | `Button` had no accessibility role/state; `ConfirmDialog` nested the dialog inside the backdrop button | **Fixed** |
| C13 | Next workout picked naïvely (first workout) | **Fixed** (`recommendNextWorkout`: weekday schedule, then A→B→C rotation from real history) |
| C14 | History screen shows only name/date/duration; no session detail | **Open** (Phase 3) |

## 4. Database / RLS (full report summarised; SQL fixes in 00034–00036)

| Sev | Finding | Status |
|---|---|---|
| Critical | `trainer_students` FOR ALL policy: any user could insert themselves as "trainer" of any user → read sessions, measurements, photos rows, food logs | **Fixed** 00034 (no client INSERT, immutable ids trigger) |
| High | Trainer write policies (`workout_plans`, `diet_plans`, `check_ins`, `subscriptions`, `payment_records`, `student_notes`) didn't check the student belongs to the trainer | **Fixed** 00034 (`has_trainer_link`) |
| High | `accept_invite(code, student_uuid)` trusted `student_uuid` | **Fixed** 00034 (`auth.uid()`, `FOR UPDATE`) |
| High | Anyone could join any conversation/group and self-promote to admin | **Fixed** 00034 |
| High | SECURITY DEFINER without authz: `get_user_prs` (IDOR), `increment_challenge_score`, `increment_team_score` | **Fixed** 00034 (invoker / caller checks, bounded points) |
| High | Edge cron functions callable with the anon key; `social-notification` trusted body `user_id` | **Fixed** (`requireServiceRole`, JWT actor) |
| High | `hydration-reminder` filtered a non-existent column → pushed everyone every run | **Fixed** (`logged_at`) |
| High (LGPD) | NO ACTION FKs blocked account deletion; `delete-account` skipped `progress-photos`/`chat-media` | **Fixed** 00036 + function |
| Medium | Legacy "View public challenges/recipes" policies defeated tenant scoping from 00017 | **Fixed** 00034 |
| Medium | `exercises.is_global` settable by any creator | **Fixed** 00034 (admin only) |
| Medium | Leaderboard forging (client-supplied scores/points) | Partially fixed 00034 (insert checks, caller-bound RPCs). **Open**: compute points server-side |
| Medium | Profile counters (streak, followers) writable by the user | **Fixed** 00034 |
| Medium | `feed_comments`/`feed_reactions` readable with `USING true` | **Fixed** 00034 |
| Medium | `feed-media` uploads to any path; `chat-media` had no policies; `brand-assets` had no INSERT; progress photos not deletable | **Fixed** 00036 |
| Medium | Check-in answers editable after submit; question not checked against template | **Fixed** 00036 |
| Medium | Finished sessions editable/backdatable forever | **Fixed** 00035 (locked 24 h after finish) |
| Low | Missing FK/filter indexes; `auth.uid()` per-row in policies | Mostly **fixed** 00035; policy rewrite to `(select auth.uid())` **Open** |
| Low | `progress_photos.is_private` unused; `feed-media` bucket is public so non-public post media is reachable by URL | **Open** (needs private bucket + signed URLs) |
| Perf | N+1 in `useStudentAdherenceList` (2 queries per student, sequential) | **Open** (Phase 4: one RPC) |

## 5. Financial

There is **no payment gateway**. `subscription_plans`, `subscriptions`, `payment_records` are internal bookkeeping; the
trainer marks payments as paid by hand. Students cannot mark their own payment paid (verified by DB and API tests).
Nothing in the app may be presented as a real charge until a gateway with verified webhooks exists (Phase 6, see
`GITHUB_INTEGRATION_MATRIX.md` §Payments and `SECURITY.md` §Payments).

## 6. Product / UX observations (workout experience)

Verified in the browser at 400×860 against the local stack:
- Login → home → "Treino de hoje" → overview → start → log sets (typed and placeholder-accepted) → rest timer →
  switch exercise → finish with partial sets (confirmation shows 3/9) → summary (duration, volume 1100 kg, planned vs done)
  → history. Session, sets and streak verified in Postgres.
- Reload in the middle of a session restores it (same sets, same timer).

Remaining UX gaps: history detail, charts of load/e1RM over time, exercise substitution during a session,
plate calculator, warm-up ramp, notes per set. See `IMPLEMENTATION_PLAN.md`.
