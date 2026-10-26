# Architecture

## 1. Overview

```
┌──────────────────────────── Expo app (iOS / Android / Web) ────────────────────────────┐
│ Expo Router (app/)  ── role groups: (auth) (student) (trainer) (admin) + shared screens │
│   screens ─► hooks/queries (TanStack Query)  ─┐                                         │
│           ─► hooks/mutations                  ├─► lib/supabase/client.ts (anon key + JWT)│
│           ─► stores/ (Zustand, persisted)     ┘                                         │
│   lib/workout (pure domain logic, unit-tested)   components/ (ui, workout, diet, …)     │
└────────────────────────────────────────────┬────────────────────────────────────────────┘
                                             │ HTTPS (PostgREST / GoTrue / Storage / Realtime)
┌────────────────────────────────────────────▼────────────────────────────────────────────┐
│ Supabase                                                                                 │
│  Postgres 17 + RLS (supabase/migrations 00001–00036) — the security boundary             │
│  Storage buckets (avatars, exercise-videos, progress-photos, feed-media, chat-media,     │
│                   brand-assets) with per-folder policies                                 │
│  Edge functions (Deno): push-notification, social-notification, delete-account,          │
│   food-lookup, cron: auto-checkin, hydration-reminder, plan-expiring, smart-nudge,        │
│   weekly-digest (service-role only)                                                       │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

The client holds only the **anon key**. Every authorisation decision is enforced by RLS policies, SECURITY DEFINER
functions with explicit caller checks, or edge functions that validate the JWT / service-role key. `RoleGuard` and the
role `_layout.tsx` files are navigation conveniences, not security.

## 2. Directory map

| Path | Contents |
|---|---|
| `app/` | Routes. `(student)` uses bottom tabs (sidebar on desktop web), each tab a route group with its own Stack. |
| `app/(student)/(workouts)/treino/[workoutId].tsx` | Workout overview + execution (focus mode, tab bar hidden). |
| `app/(student)/(workouts)/session-complete.tsx` | Post-workout summary (duration, volume, PRs, planned vs done). |
| `components/ui/` | Design-system primitives (`Button`, `Card`, `Input`, `ConfirmDialog`, `EmptyState`, `AppIcon`, …). |
| `components/workout/` | `SetRow`, `RestTimer`, `ExerciseCard`, `VideoPlayerModal` (expo-video), `WorkoutSummaryCard`. |
| `hooks/queries/`, `hooks/mutations/` | One file per domain; all Supabase access goes through these. |
| `stores/useWorkoutSessionStore.ts` | The only Zustand store: in-progress workout, persisted to AsyncStorage (`workout-session-v2`). |
| `lib/workout/metrics.ts` | Pure functions: rep-target parsing, volume, Epley e1RM, PR detection, double-progression suggestion, formatting. |
| `lib/workout/schedule.ts` | Next-workout recommendation (weekday → A/B/C rotation) and per-workout status. |
| `lib/design/tokens.ts`, `tailwind.config.js` | Colour, typography (Instrument Serif display / DM Sans body), radii, glow. |
| `lib/utils/media.ts` | `isPlayableVideo` — distinguishes real video URLs from image frames. |
| `supabase/migrations/` | Ordered SQL. Never edited in place; fixes are new migrations. |
| `supabase/functions/` | Edge functions; `_shared/auth.ts` has `requireServiceRole` (constant-time compare). |
| `supabase/tests/` | `run-db-tests.mjs` (PGlite), `api-integration.mjs` (local stack), `seed-demo.mjs`. |
| `__tests__/` | Jest unit tests. |

## 3. Routing rules

Expo Router strips group names from URLs. Two dynamic routes in sibling groups therefore collide
(`(workouts)/[id]` and `(chat)/[id]` both match `/:id`). **Every dynamic route must sit under a unique static segment.**

| Screen | URL |
|---|---|
| Workout | `/treino/:workoutId` |
| Student conversation | `/conversa/:conversationId` |
| Student course | `/curso/:courseId` |
| Trainer conversation / course | `/chat/:id`, `/courses/:id` |

Static screens inside groups (`/history`, `/session-complete`) must also stay unique across groups.

Student navigation: 5 tabs — Início, Treinos, Dieta, Progresso, **Mais**. `(social)`, `(chat)` and `(courses)` stay as
routes but are hidden from the tab bar (`href: null`) and reached from the Mais hub (`app/(student)/(more)/index.tsx`),
which also links challenges, groups, badges, notifications, profile and legal pages. The Mais tab shows the unread-chat
badge. Desktop web keeps the full sidebar.

Known limitation: each tab group's `index` resolves to `/`, so on web a reload while on a tab other than Início returns
to Início (deep screens such as `/treino/:id` are unaffected). Fixing it requires per-tab URL segments (e.g. `/treinos`),
a larger routing change not yet done.

## 4. Workout session data flow

```
start ──► useStartSession (insert workout_sessions)        store.begin(sessionId, startedAt)
  │        or resume: useOpenSession (unfinished < 24h)
log set ─► store.upsertSet (client UUID, syncStatus=pending) ──► useSyncSet: upsert onConflict id
  │                                                             └─ ok → synced | error → failed (retry button)
rest ───► store.startRest(endsAt = now + rest_seconds)   (absolute time → survives reload/background)
finish ─► useFinishSession: update … where finished_at is null (idempotent)
          → server trigger updates streak; social-notification (actor from JWT)
          → detectRecords() vs get_exercise_bests() baseline → session-complete screen
```

Server guarantees (migrations 00034/00035): a session can only reference a workout of the student's own plan; sets can
only be written to the caller's sessions; sessions and sets become immutable 24 h after finish; prescription edits never
delete history (FKs `SET NULL`).

## 5. State and caching

- **Server state**: TanStack Query. Keys are arrays starting with the domain (`["workouts", "plans", {studentId}]`).
  Mutations invalidate by prefix.
- **Client state**: only the workout session store. Everything else is derived from queries.
- **Auth**: `lib/auth/provider.tsx` wraps Supabase auth, loads the profile (role, onboarding) and exposes `useAuth()`.
- **Branding**: `BrandingProvider` applies the linked trainer's colours to the student UI.

## 6. Platform specifics

- Web: single bundle (4.8 MB, Phase 7 target). `Alert.alert` is a no-op on web → use `ConfirmDialog`.
- Native-only APIs (haptics, notifications, health) are wrapped and no-op on web.
- `babel.config.js` must keep `unstable_transformImportMeta: true` (zustand ESM).
