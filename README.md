# sydecrew mobile

The React Native app for Sydecrew (Android and iOS), built with Expo SDK 58 and Expo Router. It uses the same API contract (`contracts/openapi.json`), the same design tokens (`design/tokens.json`) and the same component names as the website.

## Run it

1. Start the API first (see the backend README). In local development, keep `OTP_DEV_ECHO=true` so codes show on screen.
2. Install and start the app:

```bash
npm install
cp .env.example .env.local   # optional, see "API address" below
npx expo start               # then press "a" for the Android emulator, or scan the QR code with Expo Go
```

**API address** (`EXPO_PUBLIC_API_URL`, see `.env.example`):

| Where the app runs | Value |
| --- | --- |
| Android emulator | leave empty (uses `http://10.0.2.2:4000`) |
| iOS simulator, web preview | leave empty (uses `http://localhost:4000`) |
| Real phone on Wi-Fi | your computer's LAN IP, e.g. `http://192.168.1.20:4000` |

In development the app warns in the console when Android is pointed at `localhost`.

## Checks

| Command | What it does |
| --- | --- |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `expo lint`, the copy check (`scripts/check-copy.js`: src, app.json, this README, `.maestro`) and the colour check (`scripts/check-hex.js`: no hex or rgb literals outside `src/theme/`) |
| `npm run tokens:check` | `src/theme/tokens.ts` matches `design/tokens.json`, and every contrast pair is at least 4.5:1 |
| `npm run contract:check` | `src/lib/contract/*` matches `contracts/openapi.json` and `contracts/errors.json` |
| `npm test` | unit tests (`test/*.test.ts`, Node's test runner) |
| `npx expo-doctor` | Expo dependency and config checks |

## One design system, one contract

- **Tokens.** `design/tokens.json` is shared with the web. `npm run tokens:gen` writes `src/theme/tokens.ts`; `src/theme.ts` only derives from it (no literal colours anywhere else).
- **Fonts.** Geist (text) and Instrument Serif (accents), loaded with `expo-font`; the splash screen stays up until they load.
- **Components** (`src/components/ui/`), same names as web: `Button` (primary, secondary, ghost, danger), `IconButton`, `TextField`, `Select`, `Chip`, `Card`, `Badge` (verified, pending, needs-changes, live, paused, suspended), `StatusTimeline`, `Stepper`, `EmptyState`, `ErrorState`, `OfflineBanner`, `Skeleton`, `Sheet`, `Modal`, `Toast`, `Avatar`, `PriceTag`, `SafetyCallout`, `PlaceholderNotice`, `Logo` / `Wordmark`. Every target is at least 44 pt, has an accessibility label, and animations respect reduced motion.
- **Brand assets.** The app icon, Android adaptive icon layers, splash image and favicon are generated from `design/brand/symbol.svg` by `npm run brand:gen`.
- **API types.** `npm run contract:gen` writes `src/lib/contract/schema.ts` (openapi-typescript), `enums.ts` and `errors.ts`. `src/lib/types.ts` and `src/lib/companion/types.ts` are aliases over it; `src/lib/api.ts` is the only HTTP client.
- **Helpers.** `errorView()` (`src/lib/errors.ts`) turns any error into the user-facing message from `contracts/errors.json`; `formatINR(paise)` (`src/lib/money.ts`); IST dates and times (`src/lib/time.ts`); `track()` is a no-op for now (`src/lib/track.ts`).
- **Copy** lives in `src/content/*.ts`, with the public category names Crew, Plus-One, Crew Care and Crew Events.

## Routes

`src/app/_layout.tsx` guards route groups with `Stack.Protected`; `routeFor(user)` (`src/lib/routing.ts`) picks the landing screen for every account state.

**Signed out:** `/` welcome, `/login`, `/signup`, `/forgot-password`. **Any time:** `/verify-email?token=…`, `/reset-password?token=…` (from `sydecrew://` links; links opened before sign-in are replayed after it).

**Customer tabs** (`(customer)/`): Home, Discover, Bookings, Messages, Profile (`account.tsx`: details, Become a companion, Settings and legal, role switch, log out). New accounts go through `/onboarding` first.

**Companion tabs** (`companion/(tabs)/`): Dashboard (one screen state and call to action per status), Profile, Availability and Rates (once approved), Status (timeline and fix list), Earnings (once approved; placeholder). Application screens: `companion/index`, `apply`, `photos`, `categories`, `identity`, `capture`, `review`, `go-live`, and `companion/preview` ("Preview your public profile").

| `next_step` | Screen |
| --- | --- |
| PROFILE / PHOTOS / CATEGORIES | `/companion/profile`, `/companion/photos`, `/companion/categories` |
| DOCUMENTS | `/companion/identity` (also `sydecrew://companion/identity`, the web "continue on phone" QR) |
| SUBMIT | `/companion/review` |
| WAITING / FIX_REQUIRED / COOLDOWN / REJECTED / SUSPENDED | `/companion/status` |
| SETUP | `/companion/availability` |
| GO_LIVE | `/companion/go-live` |
| LIVE / PAUSED | `/companion/dashboard` |

Accounts with both roles start in the customer shell and switch with "Switch to companion" / "Switch to customer" (remembered on the device). Staff accounts see `/staff`: the admin is web only.

**Design previews** (`preview/`): sample companion profile, booking details, review and pay, booking day and check-in, SOS. They use the one fixture file `src/content/samples.ts`, show "Coming soon — not bookable yet", and make no booking or payment calls. The SOS preview's emergency call (112) is real.

**Settings** (`/settings`): terms, privacy, refunds and community guidelines open on the website (`EXPO_PUBLIC_SITE_URL`), marked "Draft — pending legal review", plus a grievance officer placeholder.

## Companion details

- **Uploads** (`src/lib/uploads/`): each image is re-encoded on the phone as JPEG (HEIC included; the API accepts only JPEG, PNG and WebP), hashed with SHA-256, saved in the app's document directory and queued in `uploads/queue.json`. The queue survives backgrounding, restarts and lost connections, retrying with the **same `asset_id`** with back-off.
- **Money** is integer paise: typed in rupees, sent as paise, shown as `₹1,500`.
- Every request sends `X-Client: mobile`, `X-Device-Id` (random per install, in SecureStore) and `X-Platform`. The refresh token is kept in the Keychain / Keystore; the access token stays in memory.
- In development, the identity screen offers the mock KYC outcome (`PASS`, `FAKE_DOCUMENT` ...) and a test DigiLocker consent (`MOCK_OK`). A real provider's liveness SDK needs a development build and is not wired yet.
- Maestro flows for device runs: `.maestro/README.md`.

## Still to do

- Discovery, booking, payment, messages and earnings are design previews only.
- Universal / app links are not configured: email links open the website; the app handles `sydecrew://` links.
- Bundle IDs are `com.sydecrew.app` (`app.json`). Release builds: EAS (`npx eas-cli@latest build`); no `eas.json` yet.
- There's no SMS provider yet, so codes are shown on screen in development only.
- The legal documents are drafts pending legal review.
