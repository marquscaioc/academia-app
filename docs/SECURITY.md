# Security

## Authorization

The app contains only the public Supabase URL/anon key. RLS, checked database functions and verified JWT/service-role edge guards enforce access. Role navigation is a UI convenience. Secrets stay in edge/local environments; env files remain ignored.

`trainer_students` is the tenancy root. Active links grant student-data reads; ownership/relationship checks restrict trainer writes. Referrals require trainer ownership; active linked students see active cards. Explicit `trainer_profiles.contact_whatsapp` publication is separate from private phone fields and automation opt-in.

## Controls and evidence

| Control | Evidence |
|---|---|
| Tenant/role/counter protection, own-session sets, immutable finished history | DB + local API |
| Atomic editor ownership, bound IDs, visible exercises, stale-version/active-session protection | 00040/00043, DB + API; parent locks coordinate session starts |
| Challenge ledger owns score/count/team totals; arbitrary-increment RPCs revoked | 00041; DB + concurrent API |
| UTC rule caps, one-use finished session, stable request ID and uploaded photo proof | 00041/00044; DB + API |
| Private feed/group/challenge media; cross-author reference laundering denied | 00042; RLS + real Storage |
| Private course video/PDF and progress; paid bodies closed pending verified entitlements | 00045/00046; RLS + API/Storage |
| Referral tenancy, contact validation and explicit trainer contact | 00047; DB + API |
| Identity change cancels/clears query cache; stale profile work discarded | Auth Jest |
| Workout/rest owner binding; failed/offline logout preserves session with error | State/auth Jest |
| Frozen check-ins, deletion FKs, own-folder media writes | 00036; DB + API |

## Media and revocation

Feed objects are private. Owners or authorized readers of the referencing post/group/challenge can sign them. Existing public URL strings normalize to paths; anonymous public routes no longer serve the bucket.

New course media uses `<trainer>/<course>/<file>` in private `course-media`. Lesson visibility and matching owner/course path are required. Signed URLs are temporary UI values, not persisted links.

Feed links expire after60 minutes and refresh at45 minutes; course links expire after15 minutes and refresh at10 minutes. Revoking a relationship/membership/publication prevents new signing. Issued bearer links remain valid until expiry; instantaneous revocation is not promised.

Legacy course URLs in public `exercise-videos` or external providers remain unchanged. Real paid files there need a separately reviewed private-storage copy/reference migration. No remote copy or automatic deletion occurred.

## Edge functions

- `push-notification`: service role or authorized JWT actor; per-caller30/min limit and input caps.
- `food-lookup`: verified session, per-user30/min limit, validated input and escaped LIKE wildcards.
- `social-notification`: actor from JWT, recently finished owned session, one announcement per session (`social:<session id>` key in `consume_rate_limit`, 1-day window aligned to UTC midnight), CORS for web.
- `delete-account`: caller JWT, own files including nested course media, then auth user. Cleanup is best effort; recursive cleanup needs deployed-runtime verification.
- Cron functions require the service-role bearer. `weekly-digest` no longer reads/stores email in notifications.
- All Expo pushes go through `_shared/expoPush.ts`: 100-message chunks, per-message tickets checked, and tokens Expo reports as `DeviceNotRegistered` are cleared (matched by token, so a newer token is kept). Ticket "ok" means accepted by Expo, not delivered; receipts are not polled.
- `smart-nudge` sends once per milestone (exactly 3, 5 and 7 days without training; it previously re-sent daily from day 3 to 8). `smart-nudge` and `plan-expiring` hold a per-user/per-plan key for the day, so a repeated cron run sends nothing new. `plan-expiring` now also stores the in-app notification for diet plans.
- `push-notification` stores the in-app notification even when the target has no push token (`is_pushed=false`).
- `EXPO_PUSH_URL` overrides the Expo endpoint for local tests only; leave it unset in deployed functions.

00039 counters are service-role only. No production deployment occurred.

## Payments and sensitive data

Financial tables are internal bookkeeping; no gateway charge exists. Client statements or manually changed payment rows must not grant paid digital access. Paid course bodies fail closed pending verified entitlements.

The eventual webhook must authenticate its provider, enforce replay/idempotency, re-fetch authoritative payment status and record entitlement transitions server-side. Provider choice/credentials remain outstanding.

No clinical records, prescriptions, automatic transmission of measurements or referral messages were introduced. Contact actions open user-selected destinations. HealthKit/Health Connect is unavailable and reports no fabricated activity.

## Release work

- Remote migrations00034–00047 require owner authorization and backup; application here was local only.
- Native OS/media behavior requires device QA.
- Account cleanup is best effort; financial retention needs a business decision.
- Signed-link lifetime and historical public course objects remain the limits above.
- Policy/index performance, Sentry and store setup remain pending.

Report vulnerabilities privately to the owner, without public exploit reports.
