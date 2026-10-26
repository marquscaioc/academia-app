# GitHub / library integration matrix

Researched 2026-10-26 from the GitHub REST API, raw LICENSE / package.json files and the npm registry.
Items marked *(unverified)* could not be confirmed from a primary source.

Rules applied (from `MASTER_PROMPT.md`): never copy whole repositories; AGPL and unlicensed code is **concept
reference only**; MIT/Unlicense code may be adapted with its notice preserved; anything adopted must work on
Expo SDK 54 / RN 0.81 / Reanimated ~4.1 (New Architecture).

## 1. Decision table

| Repo | License | Last push | Fit with SDK 54 | Decision | What we take |
|---|---|---|---|---|---|
| ischys-app/Ischys | MIT | 2026-10-26 | Expo 57 (newer); pure TS domain logic ports fine | **Reference** (code may be adapted with notice) | PR detection, e1RM, prefill/previous, progression ideas. Our own implementations live in `lib/workout/metrics.ts`; no code copied so far. |
| Beccio00/stravio | **AGPL-3.0** | 2026-09-29 | Expo 52 | **Concepts only** | Student/trainer RLS split, previous-session hints, calendar history UX. **No code or SQL.** |
| wger-project/wger | **AGPL-3.0** (data CC per entry) | 2026-10-26 | Django backend | **Concepts only** | Routine → day → slot → set-config model; progression rules. Do not bulk-import its exercise data (per-entry CC licences, some share-alike). |
| founded-labs/react-native-reusables | MIT | 2026-09-27 | NativeWind 4.2; showcase on SDK 56 | **Adopt** (copy components via CLI, keep notice) | Base primitives for the design system (Dialog, Select, Tabs, Progress). Check `@rn-primitives` versions resolve on SDK 54 *(unverified)*. |
| gorhom/react-native-bottom-sheet | MIT | 2026-05-09 (5.2.14) | Reanimated 4 supported since 5.1.8 | **Adopt with caveats** | Set editor, rest picker, exercise picker. Test early: Android back closes screen instead of sheet (#2781), `stackBehavior="switch"` bug (#2685). |
| Abhinandan-Kushwaha/react-native-gifted-charts | MIT | 2026-10-05 (1.4.81) | Pure JS on react-native-svg 15.12 + expo-linear-gradient | **Adopt** | Load / e1RM / volume / body-weight charts. Runtime on New Arch *(unverified)*, low risk. |
| robertguss/expo-supabase-starter-kit | **No license** | 2026-03-11 | Expo 55 | **Concepts only** (all rights reserved) | `Stack.Protected` route guards, persisted query cache, Sentry user context. Write our own. |
| RevenueCat/react-native-purchases | MIT | 2026-10-26 (10.15.1) | RN ≥ 0.73; needs dev build (Expo Go = mock "Preview API Mode") | **Adopt** (Phase 6, after business decision) | IAP subscriptions for app features; entitlements synced to Supabase via RevenueCat webhook; server-side gating. |
| getsentry/sentry-react-native | MIT | 2026-10-26 (8.32.0) | SDK 54 pins **~7.2.0**; v8 needs iOS 15 | **Adopt, pin ~7.2.0** | Crash/error monitoring (Phase 7). Needs `SENTRY_AUTH_TOKEN` as EAS secret. |
| yuhonas/free-exercise-db | Unlicense | 2026-09-27 | Data only | **Adopt data, not images** | Exercise names/muscles/equipment/instructions (translate to PT-BR). Image provenance unclear → don't ship the photos in production. The local demo seed references them by URL only. |

All ten repositories exist and are not archived.

## 2. By feature

| Feature | Source | Status in this repo |
|---|---|---|
| Workout execution / set logging | Ischys (MIT), Stravio (concepts) | Implemented independently (`app/(student)/(workouts)/treino/[workoutId].tsx`, `stores/useWorkoutSessionStore.ts`) |
| PRs, e1RM, double progression | Ischys `domain/records.ts`, `progression.ts`, `previous.ts` | Implemented independently (`lib/workout/metrics.ts`, 20+ unit tests) |
| Rest timer | Ischys RestBar (UX), expo-notifications | Implemented (`RestTimer.tsx`, absolute end time). Background notification: **open** |
| Routine organisation (A/B/C, weekdays) | wger / Stravio (concepts) | `lib/workout/schedule.ts` |
| Design system primitives | react-native-reusables | **Open** (Phase 2) |
| Bottom sheets | @gorhom/bottom-sheet | **Open** |
| Charts | react-native-gifted-charts | **Open** (current `SimpleLineChart` is hand-made) |
| Subscriptions (app features) | react-native-purchases | **Open — needs business decision** |
| Trainer ↔ student payments (1:1 coaching) | Asaas / Mercado Pago APIs | **Open — needs credentials** |
| Crash monitoring | @sentry/react-native ~7.2.0 | **Open** |
| Exercise catalogue | free-exercise-db JSON | Data present in repo root (`free_exercise_db.json`, `exercise_database.sql`) |

## 3. Payments: store rules (verified 2026-10-26, not legal advice)

- **Apple 3.1.1**: digital features/subscriptions must use IAP. **3.1.3(d)** lists *"fitness training"* among real-time
  person-to-person services that may use other payment methods; one-to-few / one-to-many real-time services must use IAP.
  Asynchronous plan delivery may not count as "real-time" *(unverified how App Review treats it)*.
- **Google Play**: Play Billing required for digital features (examples include fitness subscriptions); physical services
  and peer-to-peer payments must *not* use Play Billing. Alternative billing available in Brazil after enrolment.
- **Brazil (Apple / CADE)**: alternative payments and link-outs allowed with the StoreKit External Purchase entitlement,
  reportedly live since mid-2026 (exact date unconfirmed; secondary sources say 2026-06-18). Commissions still apply.
- **US**: Epic v. Apple commission question remanded; unresolved. Google US programmes report fees from 2026-10-01.
- **EU**: new Apple terms effective 2026-10-01.

**Recommendation**: RevenueCat IAP for any paid app feature on both stores; Asaas or Mercado Pago only for the trainer's
1:1 coaching fee, collected outside the app's digital-feature gating. Never unlock premium because the client says it paid —
entitlements come only from verified webhooks (see `SECURITY.md`).

## 4. Payments: webhook authentication (confirmed from official docs / SDK source)

| Provider | Mechanism | How we must verify |
|---|---|---|
| Asaas | Header `asaas-access-token` = token configured on the webhook. **No HMAC.** | Constant-time compare with a long random secret; then **re-fetch the payment from the Asaas API** before changing state; idempotency by event id. Optional IP allowlist. |
| Mercado Pago | Header `x-signature: ts=<ts>,v1=<hex>` + `x-request-id`; query `data.id` | Manifest `id:<data.id>;request-id:<x-request-id>;ts:<ts>;` (omit missing pairs) → HMAC-SHA256 with the app's secret → constant-time compare with `v1`; timestamp tolerance (test seconds vs ms with a real notification); idempotency; re-fetch the payment. |

## 5. Platform notes

- `expo-av` is deprecated (removed in SDK 55). **Done**: replaced by `expo-video` ~3.0.16.
- SDK 54 bundled versions used as the compatibility reference: reanimated ~4.1.1, worklets 0.5.1, gesture-handler ~2.28.0,
  react-native-svg 15.12.1, expo-linear-gradient ~15.0.8, expo-router ~6.0.x, @sentry/react-native ~7.2.0.
- Upgrading to SDK 58 is a separate project (4 major versions; Legacy Architecture already dropped). Not started.

## 6. Continuation dependency decisions

- Kept existing evolution charts; no redundant chart dependency for already working load/e1RM/volume views.
- Added SDK54-compatible expo-document-picker~14.0.8 for PDF lessons and direct expo-file-system~19.0.24 for native ArrayBuffer uploads. Existing expo-video/notifications reused.
- Upload contract: [official Supabase reference](https://supabase.com/docs/reference/javascript/storage-from-upload). Native Blob/FormData replaced by File.arrayBuffer after inspecting installed SDK54 source. Device QA remains pending.
- Rest scheduling checked against installed SDK54 types/Android implementation and [SDK54 source](https://github.com/expo/expo/blob/sdk-54/packages/expo-notifications/src/scheduleNotificationAsync.ts). OS restrictions can defer delivery.
- Used font weights imported individually: exported web assets reduced from55 in the earlier build to32. Main JS is4.91 MB after features; splitting remains pending.
- Earlier store/payment-policy notes are historical audit research, not refreshed release advice. Reverify official store/provider rules when the commercial model is chosen.
