# Testing

Four layers. Results below are from real runs on 2026-10-26 (Windows 11, Node 20+, Docker Desktop).

| Command | What | Needs | Last result |
|---|---|---|---|
| `npm run typecheck` | `tsc --noEmit` | — | **pass** (0 errors) |
| `npm run lint` | ESLint 9 + eslint-config-expo | — | **pass** (0 errors, 25 warnings) |
| `npm test` | Jest (jest-expo): `lib/workout/metrics`, `schedule`, `compare`, session store, media helper, toast store, trainer adherence, plan draft | — | **pass** — 8 suites, 49 tests |
| `npm run test:db` | All migrations applied to an in-memory Postgres (PGlite 0.2.17) with Supabase stubs, then RLS / trigger scenarios as different users | — | **pass** — 38 migrations, 40/40 scenarios |
| `npm run test:api` | supabase-js against the **local** stack (GoTrue + PostgREST + Storage + RLS), exactly as the app calls it | Docker + `npx supabase start` | **pass** — 20/20 |
| `npm run build` | Production web export | — | **pass** (main bundle 4.82 MB) |
| Browser smoke (manual, Playwright MCP) | login → workout → sets → rest → finish → summary → history → reload-resume | dev server + local stack + `npm run seed:demo` | **pass** (see AUDIT.md §6) |

Not run / not available: native iOS/Android builds (need EAS + credentials), device tests, push delivery,
performance profiling, accessibility audit with a screen reader.

## Local stack

```bash
npx supabase start          # ports 554xx (supabase/config.toml) — chosen to avoid another local stack on 543xx
npx supabase migration up --local
npm run seed:demo           # aluno@demo.local / treinador@demo.local, password Demo-Treino-2026!
npm run test:api
```

`seed-demo.mjs` and `api-integration.mjs` read keys from `supabase status -o env` and **refuse any non-localhost URL**.
The API tests create random users per run and delete them at the end.

Web app against the local stack: put the local URL/anon key in `.env.local` (gitignored) and run
`npx expo start --web --port 8099`. Do not set `CI=1` (it disables the file watcher).

## Writing tests

- Pure logic → `lib/…` + Jest test in `__tests__/`. Keep domain functions free of React/Supabase imports.
- Any RLS/trigger/migration change → add a scenario to `supabase/tests/run-db-tests.mjs` (use `as(user, sql)` /
  `asSuper(sql)`; assert both the allowed and the denied path).
- Anything the app does through supabase-js that depends on GoTrue/PostgREST/Storage behaviour → `api-integration.mjs`.
- Never mark something as tested unless one of the commands above ran it.

## PGlite stub caveats

The stub provides `auth.uid()`, `auth.users`, `storage.objects/buckets/foldername` and the `anon/authenticated/service_role`
roles. It does not emulate GoTrue, PostgREST or the Storage API; those are covered by `test:api`.
