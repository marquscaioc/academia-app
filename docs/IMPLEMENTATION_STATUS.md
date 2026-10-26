# Implementation status

_Last updated: 2026-10-26_

## Current phase

Phase 1 complete; Phase 3 (workout experience) core complete; Phase 2 partially started; Phase 7 security items
largely complete locally. Next: Phase 3 history detail → Phase 2 navigation → Phase 4.

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
| Migrations 00034, 00035, 00036 (tenancy, workout integrity, storage, LGPD FKs, check-ins) | `test:db` 38/38 on PGlite; applied on local Postgres 17; `test:api` 19/19 |
| Edge functions: service-role guard on cron functions, social-notification actor from JWT, hydration column, delete-account buckets | code review; not executed against a deployed runtime |
| Web production build | `npm run build` OK (4.82 MB main bundle) |
| Docs: AUDIT, IMPLEMENTATION_PLAN, GITHUB_INTEGRATION_MATRIX, ARCHITECTURE, DATABASE, SECURITY, TESTING, DEPLOYMENT, this file, `NEXT_SESSION_PROMPT.md` | — |

## Tests (last run 2026-10-26)

| Suite | Result |
|---|---|
| typecheck | pass |
| lint | pass (0 errors / 26 warnings) |
| jest | 4 suites, 29 tests, pass |
| test:db | 35/35 migrations, 38/38 scenarios, pass |
| test:api (local stack) | 19/19 pass |
| web build | pass |
| Native builds | **not run** (needs EAS credentials) |
| Edge functions runtime | **not run** |

## Pending (see IMPLEMENTATION_PLAN.md)

- Workout history detail + evolution charts; background rest notification.
- Student nav 7 → 5 tabs; remaining `Alert.alert` on web; empty/error state sweep.
- Trainer adherence N+1 → RPC; real-data dashboard; editor duplicate/templates; library filters.
- Challenge server-side scoring; private feed-media with signed URLs; rate limits; weekly-digest PII.
- Sentry; bundle splitting.

## External blockers

| Blocker | Needed from owner |
|---|---|
| Apply 00034–00036 to the remote Supabase project | Authorisation, project access, backup |
| Payment gateway (Phase 6) | Business decision (IAP vs 1:1 coaching), Asaas/Mercado Pago/RevenueCat credentials |
| Store builds/submission | Apple/Google accounts, EAS project, real bundle ids (`eas.json` has `PREENCHER_*`) |
| Sentry | DSN + auth token |

## Next concrete action

Build the workout history detail screen (`/historico/:sessionId`): sets grouped by exercise, volume, comparison with the
previous session of the same workout, PR badges — reusing `lib/workout/metrics.ts`; add unit tests for the comparison.

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
