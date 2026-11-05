import { useRef, useState } from 'react';
import { View, type TextInputInstance } from 'react-native';
import { useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { OtpStep } from '@/components/account/OtpStep';
import { PasswordRules } from '@/components/account/PasswordRules';
import { Button, TextButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { PasswordField, TextField } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { ApiError, authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Challenge } from '@/lib/types';
import { indianMobile, isEmail, passwordOk } from '@/lib/validation';
import { colors } from '@/theme';

type Fields = { full_name: string; email: string; phone: string; password: string };
type Errors = Partial<Record<keyof Fields, string>>;

/** D5 sign-up: details → mobile OTP. Signing in flips the route guard to onboarding. */
export default function SignUp() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [f, setF] = useState<Fields>({ full_name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<{ text: string; exists?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  // Keyboard "Go" can fire submit twice before the button disables itself.
  const submitting = useRef(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const email = useRef<TextInputInstance>(null);
  const phone = useRef<TextInputInstance>(null);
  const password = useRef<TextInputInstance>(null);

  const set = (key: keyof Fields) => (value: string) => {
    setF((x) => ({ ...x, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async () => {
    if (submitting.current) return;
    const e: Errors = {};
    if (f.full_name.trim().length < 2) e.full_name = 'Enter your full name.';
    if (!isEmail(f.email)) e.email = 'Enter a valid email address.';
    if (!indianMobile(f.phone)) e.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!passwordOk(f.password)) e.password = 'Your password needs at least 8 characters, a letter and a number.';
    setErrors(e);
    setFormError(null);
    if (Object.keys(e).length) return;
    setBusy(true);
    submitting.current = true;
    try {
      const { challenge: c } = await authApi.register({ ...f, email: f.email.trim(), phone: `+91${indianMobile(f.phone)}` });
      setChallenge(c);
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) setErrors(err.fields as Errors);
      else if (err instanceof ApiError && err.code === 'ACCOUNT_EXISTS') {
        setFormError({ text: `An account with this ${err.details?.field === 'phone' ? 'mobile number' : 'email'} already exists.`, exists: true });
      } else setFormError({ text: err instanceof ApiError ? err.message : 'Something went wrong. Please try again.' });
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  if (challenge) {
    return (
      <Screen>
        <OtpStep challenge={challenge} onBack={() => setChallenge(null)} onVerified={signIn} />
      </Screen>
    );
  }

  return (
    <Screen footer={<Button onPress={submit} loading={busy}>Continue</Button>}>
      <BackBar />
      <View style={{ gap: 8 }}>
        <Title>Create your account</Title>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <Text color={colors.fog300}>Already a member?</Text>
          <TextButton onPress={() => router.replace('/login')}>Log in</TextButton>
        </View>
      </View>

      <TextField
        label="Full name"
        value={f.full_name}
        onChangeText={set('full_name')}
        error={errors.full_name}
        hint="As on your government ID. Companions see only your first name and last initial."
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => email.current?.focus()}
      />
      <TextField
        ref={email}
        label="Email"
        value={f.email}
        onChangeText={set('email')}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => phone.current?.focus()}
      />
      <TextField
        ref={phone}
        label="Mobile number"
        prefix="+91"
        placeholder="98765 43210"
        value={f.phone}
        onChangeText={set('phone')}
        error={errors.phone}
        hint="We text a code to verify it. Your number is never shown to companions."
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        returnKeyType="next"
        onSubmitEditing={() => password.current?.focus()}
      />
      <View style={{ gap: 10 }}>
        <PasswordField
          ref={password}
          label="Password"
          value={f.password}
          onChangeText={set('password')}
          error={errors.password}
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <PasswordRules value={f.password} />
      </View>

      {formError ? (
        <Alert
          action={
            formError.exists ? (
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <TextButton onPress={() => router.replace('/login')}>Log in</TextButton>
                <TextButton onPress={() => router.replace('/forgot-password')}>Reset password</TextButton>
              </View>
            ) : undefined
          }
        >
          {formError.text}
        </Alert>
      ) : null}

      <Text variant="caption" color={colors.fog400}>
        {/* copy-check-allow: legal disclaimer must name the prohibited services */}
        Sydecrew is for adults 18 and over. It is a platonic social companionship service, not a dating or escort service.
      </Text>
    </Screen>
  );
}
