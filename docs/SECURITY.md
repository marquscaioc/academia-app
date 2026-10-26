# Security

## 1. Model

- The app ships only `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Both are public by design.
- **RLS is the security boundary.** Client role checks (`RoleGuard`, role layouts) only shape navigation.
- The service-role key exists only in edge-function secrets (`SUPABASE_SERVICE_ROLE_KEY`) and local test scripts that
  refuse non-local URLs. It must never appear in the app, in `EXPO_PUBLIC_*` variables, or in the repo.
- `.env`, `.env.local` are gitignored. `.env.example` lists the variables without values.

## 2. Tenancy

`trainer_students` is the tenancy root. Links are created only by `accept_invite()` (no client INSERT); trainer/student
ids are immutable. Trainer writes to student data require `has_trainer_link(student)` in WITH CHECK; trainer reads use
`is_trainer_of(student)` (active links). Covered by DB tests (`supabase/tests/run-db-tests.mjs`) and API tests.

## 3. Verified controls (tests that exist and pass)

| Control | Where tested |
|---|---|
| Cannot self-link as trainer of another user | DB + API |
| Other trainer cannot read/prescribe/bill a student | DB + API |
| Student cannot mark own payment paid | DB + API |
| `accept_invite` cannot accept for someone else | DB |
| Cannot add points to others' challenge score; cannot inflate streak; cannot self-promote to admin | DB |
| Outsider cannot join a DM; member cannot self-promote | DB |
| Other tenant's public challenge invisible; non-admin cannot publish global exercise | DB |
| Cannot start a session on someone else's workout or write sets into others' sessions | DB + API |
| Finished sessions immutable after 24 h | DB |
| Check-in answers frozen after submit; only template questions | DB |
| Storage: own-folder uploads, trainer reads linked student's photos only, chat media members only, brand assets trainers only | DB (policies) + API (real Storage) |

## 4. Edge functions

| Function | Auth |
|---|---|
| `push-notification` | service key, or JWT (self / admin / trainer → own active students) |
| `social-notification` | JWT; actor from token; only after a session finished in the last 10 min |
| `delete-account` | JWT; deletes only the caller |
| `food-lookup` | JWT at gateway (low-risk proxy; rate limiting open) |
| `auto-checkin`, `hydration-reminder`, `plan-expiring`, `smart-nudge`, `weekly-digest` | `requireServiceRole` (constant-time compare). Cron must send `Authorization: Bearer <service role key>` (see `00024_…sql.template`). |

## 5. Payments (rules for Phase 6 — nothing is live)

- Premium/paid state is **never** set from the client or from a "client says it paid" signal.
- Only a webhook handler (edge function) may change payment/entitlement state, and only after:
  1. signature/token verification (Mercado Pago HMAC manifest; Asaas `asaas-access-token`, constant-time),
  2. timestamp tolerance / replay protection,
  3. idempotency on the provider event id (unique table),
  4. re-fetching the payment from the provider API.
- Gateway secrets are edge-function secrets only. Test mocks live only in tests.
- See `GITHUB_INTEGRATION_MATRIX.md` §3–4 for store rules (IAP vs. 1:1 coaching).

## 6. Privacy / LGPD

- Account deletion removes files in all user buckets and the auth user; FKs no longer block it (00036).
- Progress photos are private; trainers see them only while actively linked.
- `weekly-digest` stores the student's email in notification data — unnecessary PII, **open**.
- Clinical records / prescriptions: not implemented; must not be added without consent capture (master prompt rule).
- Consent: `terms_accepted_at`, `terms_version`, `date_of_birth` captured at signup (00032).

## 7. Known open risks

| Risk | Plan |
|---|---|
| `feed-media` bucket public → media of non-public posts reachable by URL | Private bucket + signed URLs |
| Challenge points still client-computed (bounded) | Server-side scoring trigger from `challenge_point_rules` |
| `docker-compose.evolution.yml` uses `AUTHENTICATION_API_KEY: teste123` | Dev only; never deploy this file as-is; use a secret in any shared environment |
| No rate limiting on push / food-lookup | Add per-user limits in edge functions |
| Migrations 00034–00036 not yet on the remote project | Owner authorisation + backup required |

## 8. Reporting

Report suspected vulnerabilities privately to the project owner; do not open public issues with exploit details.
