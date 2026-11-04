import { useRef, useState } from 'react';
import { View, type TextInputInstance } from 'react-native';
import { useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { OtpStep } from '@/components/account/OtpStep';
import { Button, TextButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { PasswordField, TextField } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { ApiError, authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Challenge } from '@/lib/types';
import { colors } from '@/theme';

const time = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

/** D2 login: email or mobile + password → one-time code. Five wrong passwords lock the account. */
export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [formError, setFormError] = useState<{ text: string; reset?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const passwordRef = useRef<TextInputInstance>(null);

  const submit = async () => {
    const e: typeof errors = {};
    if (identifier.trim().length < 3) e.identifier = 'Enter your email or mobile number.';
    if (!password) e.password = 'Enter your password.';
    setErrors(e);
    setFormError(null);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const { challenge: c } = await authApi.login({ identifier, password });
      setChallenge(c);
      setPassword('');
    } catch (err) {
      if (!(err instanceof ApiError)) setFormError({ text: 'Something went wrong. Please try again.' });
      else if (err.code === 'ACCOUNT_LOCKED') {
        const until = err.details?.locked_until as string | undefined;
        setFormError({
          text: `Too many failed attempts, so we've locked your account${until ? ` until ${time(until)}` : ''}. Reset your password to unlock it now.`,
          reset: true,
        });
      } else if (err.code === 'INVALID_CREDENTIALS') {
        setFormError({ text: 'That email, mobile or password is incorrect. After 5 failed attempts your account locks for a while.', reset: true });
      } else if (err.status === 422) setErrors(err.fields);
      else setFormError({ text: err.message });
    } finally {
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
        <Title>Welcome back</Title>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
          <Text color={colors.fog300}>New to Sydecrew?</Text>
          <TextButton onPress={() => router.replace('/signup')}>Create an account</TextButton>
        </View>
      </View>
      <TextField
        label="Email or mobile number"
        value={identifier}
        onChangeText={(v) => {
          setIdentifier(v);
          setErrors((x) => ({ ...x, identifier: undefined }));
        }}
        error={errors.identifier}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
        textContentType="username"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <View style={{ gap: 10 }}>
        <PasswordField
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={(v) => {
            setPassword(v);
            setErrors((x) => ({ ...x, password: undefined }));
          }}
          error={errors.password}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={submit}
        />
        <TextButton onPress={() => router.push('/forgot-password')} color={colors.fog300}>
          Forgot password?
        </TextButton>
      </View>
      {formError ? (
        <Alert action={formError.reset ? <TextButton onPress={() => router.push('/forgot-password')}>Reset password</TextButton> : undefined}>
          {formError.text}
        </Alert>
      ) : null}
    </Screen>
  );
}
