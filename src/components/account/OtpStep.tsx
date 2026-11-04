import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, TextButton } from '@/components/ui/Button';
import { Alert, DevHint } from '@/components/ui/Feedback';
import { OtpInput } from '@/components/ui/OtpInput';
import { Text, Title } from '@/components/ui/Text';
import { ApiError, authApi } from '@/lib/api';
import type { Challenge, SessionResponse } from '@/lib/types';
import { colors } from '@/theme';
import { BackBar } from './BackBar';

const time = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });

function useSecondsUntil(iso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return Math.max(0, Math.ceil((new Date(iso).getTime() - now) / 1000));
}

type Props = { challenge: Challenge; onVerified: (s: SessionResponse) => Promise<void> | void; onBack: () => void };

/** Second step of sign-up and login (D2, D5). Submits as soon as six digits are in. */
export function OtpStep({ challenge: initial, onVerified, onBack }: Props) {
  const [challenge, setChallenge] = useState(initial);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);
  const resendIn = useSecondsUntil(challenge.resend_available_at);

  const verify = async (value: string) => {
    if (busy || blocked) return;
    if (value.length !== 6) {
      setFieldError('Enter the 6-digit code.');
      return;
    }
    setBusy(true);
    setFieldError(null);
    setError(null);
    setNotice(null);
    try {
      await onVerified(await authApi.verifyCode({ otp_id: challenge.otp_id, code: value }));
    } catch (err) {
      setCode('');
      if (!(err instanceof ApiError)) setError('Something went wrong. Please try again.');
      else if (err.code === 'OTP_INVALID') setFieldError(err.message);
      else if (err.code === 'OTP_LOCKED' || err.code === 'OTP_COOLDOWN') {
        setBlocked(true);
        const at = err.details?.retry_at as string | undefined;
        setError(at ? `Too many wrong codes. You can try again after ${time(at)}.` : err.message);
      } else setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setResending(true);
    setError(null);
    setFieldError(null);
    try {
      const { challenge: next } = await authApi.resendCode(challenge.otp_id);
      setChallenge(next);
      setCode('');
      setNotice(`A new code is on its way to ${next.destination}.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send a new code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={{ gap: 24 }}>
      <BackBar onPress={onBack} />
      <View style={{ gap: 8 }}>
        <Title>Enter the code</Title>
        <Text color={colors.fog300}>
          We sent a 6-digit code {challenge.channel === 'EMAIL' ? 'by email to' : 'by SMS to'}{' '}
          <Text weight="600" color={colors.fog50}>{challenge.destination}</Text>.{' '}
          {challenge.purpose === 'REGISTER'
            ? 'Verify your mobile number to finish creating your account.'
            : 'For your security, we check a one-time code every time you log in.'}
        </Text>
      </View>

      <View style={{ gap: 8 }}>
        <OtpInput
          value={code}
          onChange={(v) => {
            setCode(v);
            setFieldError(null);
          }}
          onComplete={(v) => void verify(v)}
          invalid={!!fieldError}
          disabled={busy || blocked}
        />
        <Text variant="caption" color={fieldError ? colors.red300 : colors.fog400} accessibilityLiveRegion="polite">
          {fieldError ?? `The code expires at ${time(challenge.expires_at)}. Never share it with anyone, including companions.`}
        </Text>
      </View>

      {error ? <Alert>{error}</Alert> : null}
      {notice ? <Alert tone="success">{notice}</Alert> : null}
      {challenge.dev_code ? <DevHint>code {challenge.dev_code}</DevHint> : null}

      <Button onPress={() => void verify(code)} loading={busy} disabled={blocked}>
        Verify and continue
      </Button>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Text variant="small" color={colors.fog400}>Didn&apos;t get it?</Text>
        {resendIn > 0 ? (
          <Text variant="small" color={colors.fog400}>Send a new code in {resendIn}s</Text>
        ) : (
          <TextButton onPress={resend} disabled={resending || blocked}>
            {resending ? 'Sending…' : 'Send a new code'}
          </TextButton>
        )}
      </View>
    </View>
  );
}
