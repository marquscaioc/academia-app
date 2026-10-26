# Testing

Executed on 2026-10-26 in isolated `academia-master-continuation`, branch `feat/master-continuation`. No remote database or native device was tested.

| Command | Result | Coverage / limits |
|---|---|---|
| `npm run typecheck` | pass, 0 errors | App, hooks, stores and tests |
| `npm run lint` | pass, 0 errors / 14 existing warnings | Mostly unused baseline imports/catch variables |
| `npm test -- --runInBand` | pass, 22 suites / 117 tests | Workout logic/editor, auth races/offline logout, session ownership, OS rest scheduling/background expiry, upload buffers, comment recovery, contacts and unavailable health integration |
| `npm run test:db` | pass, 46 migrations / 68 scenarios | Real Postgres policies/triggers/functions in PGlite; 00024 template is excluded |
| `npm run test:api` | pass, 35 scenarios | Real local GoTrue, PostgREST and Storage; concurrent scoring, editor/history/version protection, private media, course PDF/progress and partners |
| `npm run build` | pass | Web export, main JS 4.91 MB, 32 exported assets; imports only used font weights |
| Browser | pass for tested flows | Trainer reordered/saved/reopened a demo template, retained notes, cancelled removal and restored original order. Partner directory loaded and rejected empty professional data; radio selection reaches accessibility tree; trainer logout → student login → start/sets → reload/resume → finish → history (3 × 40 kg × 8, volume960 kg) |

## Reproduce

```powershell
npm install
npm run typecheck
npm run lint
npm test -- --runInBand
npm run test:db
npx supabase@2 migration up --local
npm run test:api
npm run build
npx expo start --web --port 8100
```

The local stack uses ports554xx. A different project uses543xx; never stop/reset it. API tests refuse non-local URLs, create random users and delete their own fixtures. CLI credentials load internally; service keys are never printed. `.env.local` remains ignored.

Optional: `node supabase/tests/professional-partners-tests.mjs`. Its same10 scenarios are already included in the official68; do not count them twice.

Local demo: `npm run seed:demo`; aluno@demo.local or treinador@demo.local / Demo-Treino-2026!. Original worktree may run8099; this isolated continuation uses8100 to avoid concurrent visual work.

## Limits

PGlite has auth/storage stubs, not GoTrue or a Storage HTTP server; API tests supply that second layer. Native notifications, video/document-picker and FileSystem uploads have type/unit coverage, but actual iOS/Android delivery, playback and uploads need a physical preview build. Android restrictions may defer alarms; exact delivery is not guaranteed.

Not executed: EAS/native builds, device push delivery, full screen-reader audit, every main-screen browser flow, deployed edge runtime after recursive account-cleanup changes, paid gateway/webhooks, production migration/deployment. Claude's earlier edge runtime results are in commit messages and were not rerun here.

## Adding coverage

- Pure/state/race rules: Jest under `__tests__`.
- SQL authorization/integrity: new migration plus scenario export imported by `run-db-tests.mjs`.
- HTTP/Storage/concurrency: scenario export imported by `api-integration.mjs`, retaining its local guard and cleanup.
- Applied migrations are immutable; next number after00047 is00048.
