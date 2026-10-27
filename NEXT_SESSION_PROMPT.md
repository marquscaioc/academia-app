# Next session prompt

Continue MASTER_PROMPT.md at `C:\Users\Caio\Desktop\ACADEMIA PP\MASTER_PROMPT.md`, especially sections 14–18.
Repo: `C:\Users\Caio\Desktop\ACADEMIA PP\academia-master-continuation`; read docs/IMPLEMENTATION_STATUS.md, IMPLEMENTATION_PLAN.md, SECURITY.md and TESTING.md first.

## State

- Branch feat/master-continuation started at main/8eff8f9; origin is https://github.com/marquscaioc/academia-app.git. GitHub master has the same original snapshot but separate Git ancestry. Never force-push or combine unrelated histories without a deliberate plan.
- Editor, exercise reordering, rest notifications/session ownership, server challenge scoring, private feed, course video/PDF access, auth cache isolation and partner directory are now implemented locally. Filters/evolution and edge rate limits/email removal were already completed by Claude.
- Migrations through 00047 exist. Never edit an applied migration; next number is 00048.
- Concurrent external visual changes to Projeto Academia/light/Geist were detected. They remain in original academia-app-master; this branch retains the original design. Preserve both worktrees and review feature commits before combining them.
- Read the final docs/test results and git log; do not trust the older pending lists from the baseline.

## Environment

- Local Supabase ports554xx, other project uses543xx: do not stop/reset either database.
- `npx supabase@2 migration up --local`; `npm run seed:demo` (local only).
- Demo users aluno@demo.local / treinador@demo.local, password Demo-Treino-2026!.
- Original web uses8099; this isolated branch uses8100. Verify listeners before starting. Never kill other processes to free a port.
- `.env.local` is ignored and local. Never commit secrets.
- Mixed LF/CRLF: preserve per-file endings; `git -c core.whitespace=cr-at-eol diff --check` handles existing CRLF.
- Checks: typecheck, lint, Jest, test:db, test:api, build.

## Next work

Resolve visual-work integration, web tab URLs, remaining main-screen QA, exercise favourites and approved substitutions. Commercial model/credentials, Sentry DSN, EAS/store accounts and production authorization remain external blockers. Paid course bodies stay closed until server-verified entitlements exist.

Native rest notifications/player/uploads compile and have unit/API coverage, but physical-device delivery/playback/upload is unverified. Legacy public course objects still need an authorized copy if present; issued signed links stay valid until expiry.

No remote migrations, deploy, payment transaction or health-data integration was performed. No clinical records or automated sharing of body data should be introduced without explicit requirements.
