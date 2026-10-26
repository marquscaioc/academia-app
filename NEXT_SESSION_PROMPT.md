# Next session prompt

You are continuing work on **academia-app (Projeto Gaab)** at `C:\Users\Caio\Desktop\ACADEMIA PP\academia-app-master`.
The governing instructions are in `C:\Users\Caio\Desktop\ACADEMIA PP\MASTER_PROMPT.md` — read §14–18 before acting.
Stack: Expo SDK 54, Expo Router 6, RN Web, TypeScript, NativeWind 4, Supabase, TanStack Query 5, Zustand 5. Don't replace it.

## Read first
1. `docs/IMPLEMENTATION_STATUS.md` — what is done, test results, blockers, next action.
2. `docs/IMPLEMENTATION_PLAN.md` — phase checklist.
3. `docs/ARCHITECTURE.md` (routing rule: every dynamic route needs a unique static segment), `docs/DATABASE.md`,
   `docs/SECURITY.md`, `docs/TESTING.md`.

## Environment facts
- Git repo on `main`, local only. Commit trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Never push or
  force-push without authorisation. Small commits per feature.
- Mixed line endings in the baseline: preserve each file's existing EOL (check `git ls-files --eol <file>`). Python
  `open(..., 'w')` on Windows writes CRLF — use `newline=''` or the Edit tool.
- Local Supabase: `npx supabase start` (ports **554xx**; another project, `chuck-crm-staging`, uses 543xx — do not stop it).
  `npx supabase migration up --local`, `npm run seed:demo` (aluno@demo.local / treinador@demo.local, `Demo-Treino-2026!`).
- `.env.local` (gitignored) points the app to the local stack. Never commit env files.
- Web dev server: `npx expo start --web --port 8099` (no `CI=1`). If the port is busy, an orphaned `node … expo start`
  is holding it.
- Verification commands: `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:db`, `npm run test:api`,
  `npm run build`. Report pass/fail/not-run honestly.

## Next action
Implement the workout history detail (`app/(student)/(workouts)/historico/[sessionId].tsx`, linked from `history.tsx`):
sets grouped by exercise, volume, comparison with the previous session of the same workout, PR badges. Pure comparison
logic in `lib/workout/` with Jest tests. Verify in the browser with the demo user, then commit.

Then: student nav 7 → 5 tabs with a "Mais" hub; replace remaining `Alert.alert`; trainer adherence RPC (Phase 4).

## Do not
- Edit applied migrations; write new ones (next number: 00037) and add DB test scenarios.
- Apply migrations to the remote project, deploy, or touch payment credentials without the owner's authorisation.
- Show fictitious metrics or mock data in production flows; add buttons without real actions.
- Copy code from AGPL (Stravio, wger) or unlicensed (expo-supabase-starter-kit) repos.
