import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Logo } from '@/components/ui/Brand';
import { Button } from '@/components/ui/Button';
import { EmptyState, ErrorState, SkeletonList } from '@/components/ui/States';
import { Screen } from '@/components/ui/Screen';
import { authApi } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorView } from '@/lib/errors';

/** sydecrew://verify-email?token=… from the verification email. Works signed in or out. */
export default function VerifyEmail() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { status, refreshUser } = useAuth();
  const [state, setState] = useState<{ done?: boolean; error?: string }>(() => (token ? {} : { error: 'This link is incomplete. Open it again from the email.' }));
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!token) return;
    authApi
      .verifyEmail(token)
      .then(() => {
        setState({ done: true });
        // Reload /auth/me so the banner goes away (not retry(): that remounts the app and loses the history).
        if (status === 'authenticated') void refreshUser();
      })
      .catch((err) => setState({ error: errorView(err).message }));
  }, [token, status, refreshUser]);

  return (
    <Screen footer={state.done || state.error ? <Button onPress={() => router.replace('/')}>Continue</Button> : null}>
      <Logo />
      {state.done ? <EmptyState icon="mail-open-outline" title="Email verified" body="Thank you. Booking confirmations and receipts will go to this address." /> : null}
      {state.error ? <ErrorState message={state.error} /> : null}
      {!state.done && !state.error ? <SkeletonList rows={2} /> : null}
    </Screen>
  );
}
