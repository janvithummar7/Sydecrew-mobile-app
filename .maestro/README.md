# Maestro flows

Written for later runs on a device or emulator; they are not run in CI yet.

1. Install Maestro: https://maestro.mobile.dev (`curl -fsSL "https://get.maestro.mobile.dev" | bash`).
2. Start the API with the mock KYC provider (`KYC_PROVIDER=mock`, the default) and seeds loaded.
3. Build and install a development build (`npx expo run:android`), with `EXPO_PUBLIC_API_URL` pointing at
   the API (Android emulator: `http://10.0.2.2:4000`).
4. Put at least two photos of 800 × 800 px or more in the device gallery.
5. Run the flows in order, with an account whose phone and email are verified:

```bash
maestro test -e EMAIL=you@example.com -e PASSWORD=Secret123 -e OTP=123456 .maestro/apply-submit.yaml
# On the web admin: claim the application and "Needs changes" with "Rewrite your intro".
maestro test -e EMAIL=you@example.com -e PASSWORD=Secret123 -e OTP=123456 .maestro/needs-changes-resubmit.yaml
# On the web admin: approve it.
maestro test -e EMAIL=you@example.com -e PASSWORD=Secret123 -e OTP=123456 .maestro/setup-go-live.yaml
```

Customer shell smoke test (tabs, design previews, settings and legal), with an onboarded customer account:

```bash
maestro test -e EMAIL=you@example.com -e PASSWORD=Secret123 -e OTP=123456 .maestro/navigation.yaml
```

Discovery (Feature 3): Discover, filter, open a profile, save, report, then the Saved list. Needs an onboarded
customer in a pilot city and at least one LIVE companion there:

```bash
maestro test -e EMAIL=you@example.com -e PASSWORD=Secret123 -e OTP=123456 .maestro/discovery.yaml
```

The OTP is shown on screen by the development API (dev hint); pass the current code each run.
The gallery picker and crop screen differ between Android versions: the photo steps use optional
taps and may need adjusting for your device.
