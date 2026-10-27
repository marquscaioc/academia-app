# Implementation status

_Last updated: 2026-10-26. Continuation of MASTER_PROMPT.md from Claude commit `8eff8f9`._

## Delivered locally

- Existing baseline preserved: Expo SDK 54 / Router 6 / NativeWind / Supabase / TanStack Query / Zustand.
- Workout plan editor: open owned plans/templates, preserve prescription IDs, reorder exercises, edit coach notes/days/loads, add/remove workouts or exercises in one transaction. Removed prescriptions detach history; actual sets remain intact. Stale versions and active sessions reject edits. Parent row locks coordinate concurrent session starts (00040/00043).
- Library origin/muscle/equipment filters and exercise evolution (load, volume, Epley e1RM) were already in the final Claude commits; they are no longer pending.
- Native rest reminders: absolute OS notification scheduling; cancellation on skip, replacement, finish and logout; foreground/background expiry handling. Persisted session now has ownerId and cannot resume in another account. Web avoids native calls.
- Challenges: points come from server rules or an owned finished session, not typed points. UTC daily caps, session reuse prevention, atomic individual/team scores, stable request IDs, uploaded-photo proof and legacy increment RPC revocation (00041/00044).
- Feed media: private bucket; access follows visible posts, private groups and challenges. Legacy public-URL references are normalized for signing. Cross-author path laundering denied. Signed URLs are presentation data, not persisted links (00042).
- Courses/e-books: trainer writes; linked-student free/preview reads; paid lesson bodies fail closed until verified entitlements exist. Private videos/PDFs, SDK 54 native player and document picker, idempotent progress, 15-minute signed course links (00045/00046).
- Professional partners: trainer-owned directory, nutritionist/sports-doctor profile/specialty/registration, WhatsApp/HTTPS booking/content links, explicit trainer WhatsApp publication; active linked students read active referrals. No clinical data or automatic health-data sharing (00047). The student's chat thread with their trainer shows a WhatsApp shortcut when the trainer published a number.
- Presentation page (`/bem-vindo`): visitors without a session land here (features that exist today, register/login). Signed-in users are redirected home.
- Challenges: optional Instagram link ("Ver no Instagram", 00052) and a "Desafio 30 dias" preset scoring finished workouts (no weight-loss promise).
- Auth: cancel/clear query cache on identity changes; discard stale profile requests; wait for actual identity and storage hydration before clearing foreign sessions. Failed/offline logout retains the active session and shows an error.
- UI failures distinguished from empty data in plan editor, progress, feed, comments and courses. Failed comments retain text; adherence query failures no longer become zero scores. Unsupported health synchronization reports unavailable rather than fabricated zero activity.
- Native uploads use ArrayBuffer through Expo FileSystem; account deletion traverses nested course-media folders.

## Validation

Latest completed suite counts are recorded in TESTING.md. Checks cover unit/state races, real PostgreSQL RLS, local Supabase PostgREST and Storage. Native delivery/playback/upload is compiled and unit-tested, not device-verified.

Browser: student login/workout/reload-resume/finish/history verified (3 sets ×40 kg ×8 =960 kg). Trainer opened a saved demo template, reordered exercises, cancelled removal, saved, reopened and verified order/notes, then restored the demo order. API editor test separately verifies finished-history preservation, stale edits and tenant denial.

## Current integration state

Branch `feat/master-continuation`, based on published `main` at `8eff8f9`. Feature commits are grouped by domain; consult git log for exact IDs. No production migration, deployment, payment credentials or real financial transaction has been performed.

Concurrent external visual changes appeared during this session: Projeto Academia branding, light theme and Geist. They are preserved in the original academia-app-master worktree. This functional branch lives in sibling academia-master-continuation and retains the original design. Do not reset or overwrite the original worktree.

## Remaining work / limits

- Phase 2: complete browser review of all main-screen empty/error/offline states and accessible navigation; tab index URLs still collide at `/` on web reload.
- Phase 3: trainer-approved exercise substitution in a running session; physical-device QA of rest notifications, playback and media uploads.
- Phase 4: exercise favourites/duplicate detection; trainer measurements/photo-view QA.
- Phase 6: business choice and gateway credentials, signed/replay-safe/idempotent payment webhook, verified entitlements and reconciliation. Existing financial records are internal accounting, not charges. Paid content intentionally stays locked.
- Phase 7: Sentry DSN/configuration, bundle profiling/splitting, policy performance pass and duplicate index review, native store IDs/EAS accounts and preview builds.
- Apply pending 00034–00052 migrations to remote only after owner authorization and backup; all work here is local.
- Historical course URLs pointing at public exercise-videos/external providers are unchanged. A separate storage copy/access migration is required if such paid content exists.
- A previously issued signed URL remains usable until its expiration (feed up to 60 minutes, course 15 minutes). Revoking a relationship stops new signing; it does not invalidate issued bearer links.
- HealthKit / Health Connect has no installed provider and remains unavailable.

## Next concrete action

Fix web tab URLs and finish the remaining main-screen QA while the owner chooses the commercial model. Use `git log` for exact feature commit references.

## Feature commits

| Commit | Change |
|---|---|
| 281a548 | Native binary upload bodies and SDK54 document support |
| c22e1a9 | Atomic plan editor/history/version/session locking |
| b002412 | Auth/cache/profile race guards and persisted session ownership |
| 1fdd1dd | Private feed/group media and failed comment recovery |
| 3e9e7f2 | Server ledger scoring and uploaded challenge proof |
| 545a835 | Private course video/PDF and progress authorization |
| d7a4b74 | Trainer-scoped professional directory and contact publication |
| fdf95f4 | Native rest reminders and countdown restart correction |
| 1055eb0 | Font asset imports limited to used weights |
| 05e567c | Progress errors, chat effect and truthful health-unavailable state |
| f23ab4e | Official DB/API integration scenarios |
