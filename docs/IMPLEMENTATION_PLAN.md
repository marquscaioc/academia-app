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
- ✅ Per-exercise evolution: load, volume and Epley e1RM; existing lightweight charts retained (no redundant chart dependency).
- ✅ Native OS rest notification with ownership, cancellation and background-expiry tests; physical-device QA pending.
- ☐ Exercise substitution during a session (trainer-approved alternatives).

## Phase 4 — Trainer panel ◐
- ✅ Replace N+1 with one RPC (`trainer_student_overview()`, migration 00037).
- ✅ Dashboard from real data only: active students, trained in 7d, pending check-ins, plans/subscriptions expiring.
- ◐ Student profile: timeline opens session detail (shared `SessionDetailScreen`). Measurements/photos views not reviewed.
- ◐ Workout editor: ✅ atomic create (00038), multiple workouts + days, templates, duplicate to student/template.
  ✅ edit existing plans atomically, preserve history/IDs, reorder exercises and coach notes (00040/00043).
- ◐ Exercise library: origin/muscle/equipment filters done; favourites/duplicate detection pending.

## Phase 5 — Content and ecosystem ◐
- ✅ Challenges: server-side rules/session scoring, UTC caps, atomic team totals, retry protection and web-safe confirmation (00041/00044).
- ✅ Courses/e-books: linked free/preview access, private video/PDF, native player, idempotent progress (00045/00046); paid entitlements pending Phase6.
- ✅ Trainer-scoped partner directory and explicitly published WhatsApp contact; validated wa.me/HTTPS links (00047); no clinical records.

## Phase 6 — Commercial ⛔ (needs business decision + credentials)
- ☐ Decide model: RevenueCat IAP for app features vs. Asaas/Mercado Pago for 1:1 coaching fees.
- ☐ Gateway adapter interface + webhook edge function with signature verification, replay window, idempotency table,
  provider re-fetch; tested with recorded fixtures (mocks only in tests).
- ☐ Entitlement table written only by webhooks; RLS read-only for clients.

## Phase 7 — Hardening ◐
- ✅ RLS/tenancy, storage, LGPD FKs, edge-function auth (with tests).
- ✅ Private feed-media + scoped signing (00042); edge rate limits (00039); weekly-digest email removed. Auth/cache/session ownership hardened.
- ☐ Policies → `(select auth.uid())`; drop duplicate indexes.
- ☐ Sentry; web bundle splitting (4.91 MB main today, 32 assets); EAS preview build on device.
- ⛔ Apply 00034–00047 to remote (owner authorization + backup); local migrations only here.
