# Implementation status

_Last updated: 2026-10-26_

## Current phase

Phase 1 complete; Phase 3 core + history detail complete; Phase 2 navigation/toast done; Phase 4 dashboard, overview RPC
and session drill-down done; Phase 7 security items largely complete locally. Next: Phase 4 workout editor + library
filters → Phase 3 evolution charts → Phase 5 challenge scoring.

## Done (verified)

| Item | Evidence |
|---|---|
| Dependencies aligned to SDK 54; expo-av → expo-video; ESLint; Jest | `npm run typecheck`, `lint`, `test` pass |
| Workout execution rebuilt (persisted session, resume, idempotent sets/finish, rest timer, PRs, summary) | 29 unit tests; API e2e; browser flow incl. reload-resume; DB rows checked |
| Next-workout recommendation + statuses | `__tests__/workoutSchedule.test.ts` |
| Route collisions fixed (`/treino`, `/conversa`, `/curso`); tab bar hidden in workout | browser reload test |
| Web blank page, NativeWind error, notification observer | browser: 0 console errors |
| Home invite card only for unlinked students | browser |
| Button/ConfirmDialog accessibility; 113 accented strings | typecheck/lint; browser |
| Migrations 00034, 00035, 00036 (tenancy, workout integrity, storage, LGPD FKs, check-ins) | `test:db` on PGlite; applied on local Postgres 17; `test:api` 19/19 |
| Workout history detail: sets per exercise, volume, comparison with previous session of the same workout | `__tests__/workoutCompare.test.ts`; browser |
| Student nav 7 → 5 tabs (Início, Treinos, Dieta, Progresso, Mais) with "Mais" hub + unread badge | browser |
| Cross-platform toast replaces every `Alert.alert` | `__tests__/toastStore.test.ts`; **not visually checked in browser** |
| Migration 00037 `trainer_student_overview()` replaces the adherence N+1; dashboard from real data, sorted by attention | `__tests__/trainerAdherence.test.ts`; `test:db` scenario; browser as trainer |
| Trainer opens a student's session from the profile timeline (`/(trainer)/students/sessao/:id`, shared `SessionDetailScreen`) | browser as trainer (RLS via `is_trainer_of`) |
| Edge functions: service-role guard on cron functions, social-notification actor from JWT, hydration column, delete-account buckets | code review; not executed against a deployed runtime |
| Web production build | `npm run build` OK (4.82 MB main bundle) |
| Docs: AUDIT, IMPLEMENTATION_PLAN, GITHUB_INTEGRATION_MATRIX, ARCHITECTURE, DATABASE, SECURITY, TESTING, DEPLOYMENT, this file, `NEXT_SESSION_PROMPT.md` | — |

## Tests (last run 2026-10-26)

| Suite | Result |
|---|---|
| typecheck | pass |
| lint | pass (0 errors / 27 warnings) |
| jest | 7 suites, 42 tests, pass |
| test:db | 37 migrations, 39/39 scenarios, pass |
| test:api (local stack) | 19/19 pass |
| web build | pass |
| Native builds | **not run** (needs EAS credentials) |
| Edge functions runtime | **not run** |

## Pending (see IMPLEMENTATION_PLAN.md)

- Per-exercise evolution charts; background rest notification.
- Empty/error state sweep; tab URLs on web (each group's index resolves to `/`, so reload returns to Início).
- Workout editor duplicate/templates; exercise library filters.
- Challenge server-side scoring; private feed-media with signed URLs; rate limits; weekly-digest PII.
- Sentry; bundle splitting.

## External blockers

| Blocker | Needed from owner |
|---|---|
| Apply 00034–00037 to the remote Supabase project | Authorisation, project access, backup |
| Payment gateway (Phase 6) | Business decision (IAP vs 1:1 coaching), Asaas/Mercado Pago/RevenueCat credentials |
| Store builds/submission | Apple/Google accounts, EAS project, real bundle ids (`eas.json` has `PREENCHER_*`) |
| Sentry | DSN + auth token |

## Next concrete action

Trainer workout editor: duplicate a plan (to the same or another student) and save/apply templates; exercise library
muscle/equipment filters. Then per-exercise evolution charts.

## Commits (local, branch `main`, not pushed)

| Commit | Summary |
|---|---|
| e2f740d | baseline (repository as received) |
| 499432d | deps, expo-video, lint and test tooling |
| 040842a | workout execution rebuild |
| 4f5f692 | migrations 00034/00035 + PGlite DB tests |
| 37c9dd2 | edge function fixes |
| 2f3b0f0 | workout list status/rotation, supabase config, API e2e tests |
| 18f9008 | web: import.meta, notification observer, NativeWind dark mode |
| e7d5786 | routing: unique student detail URLs; focus-mode workout; video helper |
| c758bbc | home: invite card only for unlinked students |
| 99438a8 | seed:demo script |
| 7216e9d | a11y + pt-BR copy |
| cffee61 | 00036 storage/LGPD/check-ins + tests |
| 77c8326 | docs |
| aa01974 | workout history detail + comparison |
| 1c7e9b2 | student nav 5 tabs + "Mais" hub |
| 0d69598 | pluralize helper |
| 01e47ec | cross-platform toast |
| a3b3500 | trainer dashboard + 00037 overview RPC |
| 8f62d19 | trainer opens student sessions from timeline |
