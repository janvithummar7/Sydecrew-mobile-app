import { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { PasswordRules } from '@/components/account/PasswordRules';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { PasswordField } from '@/components/ui/Field';
import { EmptyState } from '@/components/ui/States';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { authApi } from '@/lib/api';
import { errorView } from '@/lib/errors';
import { passwordOk } from '@/lib/validation';
import { colors } from '@/theme';

/** sydecrew://reset-password?token=… from the reset email. Sets a new password (also unlocks the account). */
export default function ResetPassword() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const submitting = useRef(false);

  const submit = async () => {
    if (submitting.current || !token) return;
    if (!passwordOk(password)) {
      setError('Choose a password that meets every rule below.');
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError(null);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Screen footer={<Button onPress={() => router.replace('/login')}>Log in</Button>}>
        <EmptyState icon="lock-open-outline" title="Password changed" body="You were signed out on every device. Log in with your new password." />
      </Screen>
    );
  }
  return (
    <Screen footer={<Button onPress={submit} loading={busy} disabled={!token}>Set new password</Button>}>
      <BackBar />
      <Title>Choose a new password</Title>
      {!token ? <Alert>This link is incomplete. Open it again from the email.</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}
      <PasswordField label="New password" value={password} onChangeText={setPassword} autoComplete="new-password" onSubmitEditing={submit} />
      <PasswordRules value={password} />
      <Text variant="caption" color={colors.textMuted}>Links expire after 30 minutes and work once.</Text>
    </Screen>
  );
}
