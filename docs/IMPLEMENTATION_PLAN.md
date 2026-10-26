# Implementation plan

Order and scope follow `MASTER_PROMPT.md` §14. Each phase ends with typecheck, lint, unit, DB and (when relevant) API
tests plus a browser check. ✅ = done and verified, ◐ = partly done, ☐ = not started, ⛔ = blocked externally.

## Phase 0 — Audit ✅
- ✅ Repository inspected; git initialised and baseline committed unchanged.
- ✅ DB/RLS audit, edge functions audit, dependency audit → `AUDIT.md`.
- ✅ GitHub reference evaluation → `GITHUB_INTEGRATION_MATRIX.md`.

## Phase 1 — Stabilisation ✅
- ✅ Hooks violation, dependency mismatches (async-storage, babel-preset), expo-av → expo-video.
- ✅ Web blank page (import.meta), NativeWind dark-mode error, notification observer on web.
- ✅ Route collisions (`/treino`, `/conversa`, `/curso`).
- ✅ Test infrastructure: Jest, PGlite DB tests, local-stack API tests, demo seed. ESLint.
- ✅ Critical security fixes: migrations 00034 (tenancy), 00035 (workout integrity), 00036 (storage, LGPD, check-ins);
  edge-function auth.

## Phase 2 — Design system ◐
- ✅ Button a11y, ConfirmDialog (web-safe), pt-BR copy pass.
- ✅ Student navigation: 7 tabs → 5 (Início, Treinos, Dieta, Progresso, Mais[Social, Chat, Aulas, Desafios, Perfil]).
- ✅ Replace remaining `Alert.alert` with `ConfirmDialog` / cross-platform toast (`stores/useToastStore`).
- ☐ Adopt react-native-reusables primitives (Select, Tabs, Progress) where they replace ad-hoc code; keep tokens.
- ☐ Consistent loading / empty / error states on every main screen (audit each with the browser).

## Phase 3 — Workout experience ◐ (highest priority)
- ✅ List: next recommended, last execution, done today/this week, in-progress banner.
- ✅ Execution: set table with previous performance, placeholders from previous set, warm-up toggle, haptics, rest timer
  (absolute), progress, exercise pager, trainer notes, how-to, video only when real, persisted session + server resume,
  idempotent sync, idempotent finish, sync-failure retry.
- ✅ Finish: duration, volume, planned vs done, PRs (explicit criteria: beats previous best weight / reps at weight /
  e1RM / set volume; first-ever is not a PR; warm-ups excluded).
- ✅ History detail screen: sets per exercise, volume, comparison with previous session of the same workout.
- ☐ Per-exercise evolution chart (load, e1RM) with gifted-charts.
- ☐ Background rest notification (expo-notifications local schedule) on native.
- ☐ Exercise substitution during a session (trainer-approved alternatives).

## Phase 4 — Trainer panel ◐
- ✅ Replace N+1 with one RPC (`trainer_student_overview()`, migration 00037).
- ✅ Dashboard from real data only: active students, trained in 7d, pending check-ins, plans/subscriptions expiring.
- ◐ Student profile: timeline opens session detail (shared `SessionDetailScreen`). Measurements/photos views not reviewed.
- ☐ Workout editor: duplicate plan, reorder, templates, assign to multiple students.
- ☐ Exercise library: muscle/equipment filters, favourites, duplicate detection.

## Phase 5 — Content and ecosystem ☐
- ☐ Challenges: server-side scoring from `challenge_point_rules` (trigger), web-safe confirmations.
- ☐ Courses/e-books: access by trainer link; progress.
- ☐ Partners and WhatsApp links (`wa.me` deep links from trainer profile; Evolution API stays optional/dev).

## Phase 6 — Commercial ⛔ (needs business decision + credentials)
- ☐ Decide model: RevenueCat IAP for app features vs. Asaas/Mercado Pago for 1:1 coaching fees.
- ☐ Gateway adapter interface + webhook edge function with signature verification, replay window, idempotency table,
  provider re-fetch; tested with recorded fixtures (mocks only in tests).
- ☐ Entitlement table written only by webhooks; RLS read-only for clients.

## Phase 7 — Hardening ◐
- ✅ RLS/tenancy, storage, LGPD FKs, edge-function auth (with tests).
- ☐ Private feed-media + signed URLs; rate limits on push/food-lookup; remove email from weekly-digest payload.
- ☐ Policies → `(select auth.uid())`; drop duplicate indexes.
- ☐ Sentry ~7.2.0; web bundle splitting (4.8 MB today); EAS preview build on device.
- ⛔ Apply 00034–00037 to the remote project (owner authorisation + backup).
