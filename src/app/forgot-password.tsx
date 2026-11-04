import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackBar } from '@/components/account/BackBar';
import { Button } from '@/components/ui/Button';
import { Alert, DevHint } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { ApiError, authApi } from '@/lib/api';
import { isEmail } from '@/lib/validation';
import { colors } from '@/theme';

/**
 * Requests a reset link. The link opens the website's reset page, which also
 * unlocks a locked account. The answer is the same whether or not the email exists.
 */
export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState<{ devLink?: string } | null>(null);

  const submit = async () => {
    setFormError(null);
    if (!isEmail(email)) {
      setError('Enter the email you signed up with.');
      return;
    }
    setBusy(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      setSent({ devLink: res.dev_link });
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <Screen footer={<Button onPress={() => router.replace('/login')}>Back to log in</Button>}>
        <Ionicons name="mail-open-outline" size={40} color={colors.lime400} style={{ marginTop: 24 }} />
        <View style={{ gap: 8 }}>
          <Title>Check your email</Title>
          <Text color={colors.fog300}>
            If an account exists for <Text weight="600" color={colors.fog50}>{email.trim()}</Text>, we&apos;ve sent a link to
            reset your password. It works for 30 minutes and also unlocks a locked account.
          </Text>
        </View>
        {sent.devLink ? <DevHint>{sent.devLink}</DevHint> : null}
      </Screen>
    );
  }

  return (
    <Screen footer={<Button onPress={submit} loading={busy}>Send reset link</Button>}>
      <BackBar />
      <View style={{ gap: 8 }}>
        <Title>Reset your password</Title>
        <Text color={colors.fog300}>Enter the email on your account and we&apos;ll send you a reset link.</Text>
      </View>
      <TextField
        label="Email"
        value={email}
        onChangeText={(v) => {
          setEmail(v);
          setError(null);
        }}
        error={error ?? undefined}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={submit}
      />
      {formError ? <Alert>{formError}</Alert> : null}
    </Screen>
  );
}
