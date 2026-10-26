# Deployment

Nothing in this work was deployed. Pushing, deploying or changing the remote Supabase project requires the owner's
authorisation (master prompt).

## 1. Environments and variables

| Variable | Where | Secret? |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | app (`.env`, EAS env, Vercel env) | no |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | app | no (public by design; RLS protects data) |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | edge functions (set automatically by Supabase) | **yes** |
| `SENTRY_AUTH_TOKEN` | EAS secret (when Sentry is added) | **yes** |
| Payment gateway secrets (Asaas token, Mercado Pago webhook secret / access token), RevenueCat webhook secret | edge-function secrets (Phase 6) | **yes** |

Never put a secret in an `EXPO_PUBLIC_*` variable: those are inlined into the bundle.

## 2. Database (Supabase)

1. Backup the production database.
2. Apply pending migrations **00034–00047** to a branch / staging project first:
   `npx supabase link --project-ref <ref>` then `npx supabase db push` (review the diff it prints).
3. Prepare an explicit disposable-staging harness; the committed `test:api` suite intentionally refuses non-local URLs.
4. Apply to production during low traffic after approval. Migrations add/replace functions/policies;00036 alters FKs
   (brief locks on `check_ins`, `check_in_answers`, `meal_logs`, `feed_posts`, `challenge_entries`).
5. Cron jobs (`00024_cron_edge_functions.sql.template`): fill the project URL and service-role key **in the SQL editor**,
   never commit the filled file. Cron functions now reject calls without the service-role bearer.

## 3. Edge functions

```bash
npx supabase functions deploy push-notification social-notification delete-account food-lookup \
  auto-checkin hydration-reminder plan-expiring smart-nudge weekly-digest
```

## 4. Web

- `npm run build` → `dist/` (static SPA; `scripts/patch-web-html.mjs` sets lang/title/meta).
- Vercel: `vercel.json` (build `npm run build`, output `dist`, SPA rewrite).
- Nixpacks/Railway: `nixpacks.toml` (`npm start` serves `dist` with `serve -s`).

## 5. Mobile (EAS)

`eas.json` profiles: `development` (dev client), `preview` (internal APK/IPA), `production` (auto-increment).
`submit.production` still has `PREENCHER_*` placeholders — Apple ID, ASC app id, team id, Google service-account JSON
must be provided by the owner. `runtimeVersion.policy = appVersion`.

Requirements before store submission: real bundle ids (currently `com.academiaapp`), icons/splash, privacy policy URL
(`/privacidade` exists), data-safety form, account deletion in-app (exists: `delete-account`), and the payment model
decision (IAP vs 1:1 coaching, see `GITHUB_INTEGRATION_MATRIX.md`).

## 6. Pre-release checklist

- [ ] `npm run typecheck && npm run lint && npm test && npm run test:db` green
- [ ] `npm run test:api` green on local and staging
- [ ] Migrations applied to staging, then production (with backup)
- [ ] Edge functions deployed; cron uses service-role bearer
- [ ] Web build smoke-tested (login, workout flow, finish)
- [ ] EAS preview build installed on a physical device (not yet done)

## 7. Continuation release notes

Migrations00034–00047 applied only to the local academia-app-master stack on554xx. Remote application needs owner authorization and backup. Publish compatible frontend/schema together after staging verification. The committed API suite deliberately refuses non-local URLs; prepare a separately reviewed disposable-staging harness instead of weakening that guard for production.

00042 makes feed-media private, so old clients need the signing flow.00045/00046 restrict lesson bodies and add private course-media/PDF; paid bodies stay closed pending verified entitlements. Historical public course objects need an explicitly reviewed copy if present; external/public lesson URLs were not migrated automatically.

Document-picker/FileSystem dependencies match SDK54. Native delivery, playback, upload and document selection need EAS preview/device verification. Modified account-cleanup edge code also needs deliberate deployment/runtime verification. No native or deployed-runtime success is claimed.

Concurrent visual changes remain in the original worktree. The functional branch feat/master-continuation is isolated in academia-master-continuation. Build/smoke-test the merged artifact before release. Functional development preview uses8100; original visual work may use8099.
