# Sydecrew mobile

The React Native app for Sydecrew (Android and iOS), built with Expo SDK 58 and Expo Router. It uses the same API as the website (`../Sydecrew-backend`) and the same brand: dark ink, lavender and lime.

## Run it

1. Start the API first (see the backend README). In local development, keep `OTP_DEV_ECHO=true` so codes show on screen.
2. Install and start the app:

```bash
npm install
cp .env.example .env.local   # optional, see "API address" below
npx expo start               # then press "a" for the Android emulator, or scan the QR code with Expo Go
```

**API address** (`EXPO_PUBLIC_API_URL`):

| Where the app runs | Value |
| --- | --- |
| Android emulator | leave empty (uses `http://10.0.2.2:4000`) |
| iOS simulator, web preview | leave empty (uses `http://localhost:4000`) |
| Real phone on Wi-Fi | your computer's LAN IP, e.g. `http://192.168.1.20:4000` |

`npx expo start --web` runs a browser preview of the same screens. It's handy for quick checks; add its origin (`http://localhost:8081`) to the API's `WEB_APP_URL`.

Before finishing any change, run `npx tsc --noEmit`, `npx expo lint` and `npx expo-doctor`.

## Feature 1: account (flows D2 and D5)

| Screen | File |
| --- | --- |
| Welcome | `src/app/index.tsx` |
| Sign up: details → SMS code | `src/app/signup.tsx` |
| Log in: email or mobile + password → code. Five wrong passwords lock the account | `src/app/login.tsx` |
| Forgot password (the reset link opens the website) | `src/app/forgot-password.tsx` |
| Onboarding: date of birth and 18+ → area → interests and privacy → consents | `src/app/onboarding.tsx` |
| Home | `src/app/home.tsx` |

**Navigation:** `src/app/_layout.tsx` uses `Stack.Protected` to switch between three route sets: signed out, onboarding, and signed in. When the session changes, Expo Router redirects by itself, so screens never navigate after login or logout.

**Sessions:**
- Every request sends `X-Client: mobile`. The API then returns the refresh token in the response body rather than as a cookie.
- The refresh token is stored in the iOS Keychain or Android Keystore through `expo-secure-store` (`src/lib/tokenStore.ts`).
- The 15-minute access token stays in memory.
- At launch, `AuthProvider` exchanges the stored token for a new session. If the API is unreachable, the token is kept and the welcome screen offers "Try again".

## Feature 2: become a companion (flows D3 and D4)

Screens live in `src/app/companion/`; `_layout.tsx` guards them by `user.companion.status` from `/auth/me`
(landing and apply: any signed-in user, no customer onboarding needed; the application: once applied;
setup, rates, go-live, dashboard: once approved). Entry point: the "Become a companion" card on Home.

| Screen | File |
| --- | --- |
| Landing (platonic, public venues only, 18+, what you need) | `companion/index.tsx` |
| Terms and 7 consents (DOB and area only if missing) | `companion/apply.tsx` |
| Profile basics (live counter, contact-detail warning, languages, area, radius) | `companion/profile.tsx` |
| Photos (pick, 4:5 crop, reorder, delete, moderation state) | `companion/photos.tsx` |
| Categories, activities, boundaries | `companion/categories.tsx` |
| Identity: document type, ID photos, selfie, Aadhaar via DigiLocker | `companion/identity.tsx`, `companion/capture.tsx` |
| Review and submit | `companion/review.tsx` |
| Application status (timeline, fix list deep links, rejection, cooldown) | `companion/status.tsx` |
| Availability, rates (price band shown), go live, dashboard (pause / resume) | `companion/setup.tsx`, `rates.tsx`, `go-live.tsx`, `dashboard.tsx` |

- **Uploads** (`src/lib/uploads/`): each image is re-encoded on the phone as JPEG (HEIC included; the API accepts
  only JPEG, PNG and WebP), hashed with SHA-256, saved in the app's document directory and queued in
  `uploads/queue.json`. The queue survives backgrounding, restarts and lost connections: it retries with the
  **same `asset_id`** (the API re-issues the URL), with back-off, and resumes when the app returns to the foreground.
- **Money** is integer paise (`src/lib/money.ts`): typed in rupees, sent as paise, shown as `₹1,500`.
- Every request sends `X-Device-Id` (random per install, in SecureStore) and `X-Platform`.
- Staff accounts are refused with a message: the admin (TOTP sign-in) is web only.
- The web "continue on phone" QR opens `sydecrew://companion/identity`.
- In development, the identity screen offers the mock KYC outcome (`PASS`, `FAKE_DOCUMENT` ...) and a test
  DigiLocker consent (`MOCK_OK`). A real provider's liveness SDK (`liveness/session` mode `SDK`) needs a
  development build and is not wired yet.
- New native modules: expo-camera, expo-image-picker, expo-image-manipulator, expo-file-system, expo-crypto.
  Expo Go includes them; store builds pick up the permission texts from `app.json`.
- Maestro flows for later device runs: `.maestro/README.md`.
- `npm run lint` also runs the copy check (`scripts/check-copy.js`: no "rent a …", dating, escort, RENDER).

## Layout

```
src/
  app/                 screens (Expo Router)
  components/ui/       Screen, Text, Button, TextField, PasswordField, Checkbox, OtpInput, Alert, Logo
  components/account/  OtpStep, BackBar, PasswordRules
  components/companion/ Chip, StepHeader, Section, Card, Pill, LinkRow, LoadState
  lib/                 api.ts (client + endpoints), auth.tsx (session), tokenStore.ts, types.ts, validation.ts,
                       device.ts, money.ts, contentWarning.ts
  lib/companion/       api.ts, context.tsx (shared state), types.ts, steps.ts, availability.ts
  lib/uploads/         queue.ts (pure retry logic), uploader.ts (prepare, upload, confirm)
  theme.ts             colours, type scale, radii (matches Sydecrew-web)
```

## Still placeholders

- App icon and splash image are Expo's defaults. Replace the files in `assets/images/`.
- Bundle IDs are `com.sydecrew.app` (`app.json`). Change them before the first store build.
- There's no SMS provider yet, so codes are shown on screen in development only.
- The legal documents behind the consents aren't published yet.
- Release builds: use EAS (`npx eas-cli@latest build`). No `eas.json` yet.
