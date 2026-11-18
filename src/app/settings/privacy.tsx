import { useRef, useState } from 'react';
import { Linking, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { BackBar } from '@/components/account/BackBar';
import { OtpStep } from '@/components/account/OtpStep';
import { Section } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Button, TextButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Feedback';
import { PasswordField, TextField } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Modal } from '@/components/ui/Sheet';
import { DataState } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { legal } from '@/content/common';
import { privacy as copy } from '@/content/privacy';
import { ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { errorView } from '@/lib/errors';
import { isOpenableLink } from '@/lib/payouts/helpers';
import { privacyApi } from '@/lib/privacy/api';
import { canWithdraw, deletionReason, deletionView, exportView, hidesProfile } from '@/lib/privacy/helpers';
import type { Consent, DeletionState } from '@/lib/privacy/types';
import { formatDateIST, formatDateTimeIST } from '@/lib/time';
import type { Challenge } from '@/lib/types';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

/**
 * Privacy and your data (Feature 7, DPDP Act rights), for both roles:
 *  - data export: GET/POST /me/data-export, then POST /me/data-export/:id/link
 *    opens a short-lived link (no bearer token) in the in-app browser
 *  - consents: GET /me/consents, POST /me/consents/:type/withdraw
 *  - delete account: GET /me/delete-account (blockers), POST .../start
 *    (password) -> OTP -> POST /me/delete-account; POST .../cancel
 *  - grievance officer: GET /legal/grievance-officer
 */
export default function PrivacySettings() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [reason, setReason] = useState('');
  const deletion = useLoad(() => privacyApi.deletionState());
  const toast = useToast();

  if (challenge) {
    return (
      <Screen>
        <OtpStep
          challenge={challenge}
          onBack={() => setChallenge(null)}
          intro={copy.deleteOtpIntro}
          submitLabel={copy.deleteConfirm}
          onSubmit={async (code) => {
            const state = await privacyApi.confirmDeletion({ otp_id: challenge.otp_id, code, ...(deletionReason(reason) ? { reason: deletionReason(reason) } : {}) });
            deletion.setData(state);
            setChallenge(null);
            toast(copy.deleteDone);
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <BackBar />
      <Title>{copy.title}</Title>
      <Text color={colors.textMuted}>{copy.intro}</Text>
      <ExportCard />
      <ConsentsCard />
      <DeleteCard state={deletion} reason={reason} setReason={setReason} onChallenge={setChallenge} />
      <GrievanceCard />
      <View style={{ height: space.lg }} />
    </Screen>
  );
}

function ExportCard() {
  const q = useLoad(() => privacyApi.exportState());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const sending = useRef(false);
  const v = q.data ? exportView(q.data) : null;

  const run = async (fn: () => Promise<void>) => {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(errorView(err).message);
      if (err instanceof ApiError && err.code === 'DATA_EXPORT_TOO_SOON') q.reload();
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };
  const request = () =>
    run(async () => {
      q.setData(await privacyApi.requestExport());
      toast(copy.exportRequested);
    });
  const open = (id: string) =>
    run(async () => {
      const { url } = await privacyApi.exportLink(id);
      if (!isOpenableLink(url, __DEV__)) throw new Error('bad link');
      await WebBrowser.openBrowserAsync(url);
    });

  return (
    <Section title={copy.exportTitle} hint={copy.exportBody}>
      <DataState loading={q.loading} error={q.error} offline={q.offline} onRetry={q.reload}>
        {v && q.data ? (
          <Card>
            {v.kind === 'preparing' ? <Text variant="small" color={colors.text} accessibilityLiveRegion="polite">{copy.exportPreparing}</Text> : null}
            {v.kind === 'ready' ? <Text variant="small" color={colors.text}>{v.expiresAt ? copy.exportReady(formatDateTimeIST(v.expiresAt)) : copy.exportOpen}</Text> : null}
            {v.kind === 'expired' ? <Text variant="small" color={colors.textMuted}>{copy.exportExpired}</Text> : null}
            {v.kind === 'failed' ? <Text variant="small" color={colors.textMuted}>{copy.exportFailed}</Text> : null}
            {error ? <Alert>{error}</Alert> : null}
            {v.kind === 'ready' ? (
              <Button onPress={() => open(v.id)} loading={busy} accessibilityHint={copy.exportOpenHint}>{copy.exportOpen}</Button>
            ) : null}
            {v.canRequest && v.kind !== 'ready' ? <Button variant={v.kind === 'none' ? 'primary' : 'secondary'} onPress={request} loading={busy}>{copy.exportRequest}</Button> : null}
            {'nextAt' in v && v.nextAt ? <Text variant="caption" color={colors.textMuted}>{copy.exportNextAt(formatDateIST(v.nextAt))}</Text> : null}
            {v.kind === 'none' ? <Text variant="caption" color={colors.textMuted}>{copy.exportCooldown(q.data.cooldown_days)}</Text> : null}
          </Card>
        ) : null}
      </DataState>
    </Section>
  );
}

function ConsentsCard() {
  const { user } = useAuth();
  const q = useLoad(() => privacyApi.consents());
  const [confirm, setConfirm] = useState<Consent | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const isCompanion = !!user?.companion;

  const withdraw = async () => {
    if (!confirm || busy) return;
    setBusy(true);
    setError(null);
    try {
      q.setData(await privacyApi.withdraw(confirm.type));
      setConfirm(null);
      toast(copy.withdrawn);
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title={copy.consentsTitle} hint={copy.consentsBody}>
      <DataState loading={q.loading} error={q.error} offline={q.offline} onRetry={q.reload} empty={q.data?.consents.length === 0}>
        <Card>
          {(q.data?.consents ?? []).map((c) => (
            <View key={c.type} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 44 }}>
              <View style={{ flex: 1, gap: 2 }} accessible accessibilityLabel={`${copy.consentNames[c.type] ?? c.type}: ${c.granted ? copy.consentGiven(formatDateIST(c.at)) : copy.consentWithdrawn(formatDateIST(c.at))}`}>
                <Text variant="small" weight="600" color={colors.textStrong}>{copy.consentNames[c.type] ?? c.type}</Text>
                <Text variant="caption" color={colors.textMuted}>{c.granted ? copy.consentGiven(formatDateIST(c.at)) : copy.consentWithdrawn(formatDateIST(c.at))}</Text>
              </View>
              {canWithdraw(c) ? (
                <TextButton
                  onPress={() => {
                    setError(null);
                    setConfirm(c);
                  }}
                >
                  {copy.withdraw}
                </TextButton>
              ) : null}
            </View>
          ))}
        </Card>
      </DataState>
      <Modal visible={!!confirm} onClose={() => setConfirm(null)} title={copy.withdrawTitle}>
        {confirm ? (
          <View style={{ gap: space.md }}>
            <Text variant="small" weight="600" color={colors.textStrong}>{copy.consentNames[confirm.type] ?? confirm.type}</Text>
            {copy.withdrawEffect[confirm.type] ? <Text variant="small" color={colors.text}>{copy.withdrawEffect[confirm.type]}</Text> : null}
            {hidesProfile(confirm.type, isCompanion) ? <Alert tone="error">{copy.biometricCompanionWarning}</Alert> : null}
            {error ? <Alert>{error}</Alert> : null}
            <Button variant="danger" onPress={withdraw} loading={busy}>{copy.withdrawConfirm}</Button>
            <Button variant="ghost" onPress={() => setConfirm(null)}>{copy.withdrawKeep}</Button>
          </View>
        ) : null}
      </Modal>
    </Section>
  );
}

type Loaded<T> = { data: T | null; setData: (d: T) => void; loading: boolean; error: string | null; offline: boolean; reload: () => void };

function DeleteCard({ state: q, reason, setReason, onChallenge }: { state: Loaded<DeletionState>; reason: string; setReason: (s: string) => void; onChallenge: (c: Challenge) => void }) {
  const [asking, setAsking] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | undefined>();
  const toast = useToast();
  const v = q.data ? deletionView(q.data) : null;

  const start = async () => {
    if (busy) return;
    if (!password) return setFieldError(copy.deletePassword);
    setBusy(true);
    setError(null);
    setFieldError(undefined);
    try {
      const { challenge } = await privacyApi.startDeletion(password);
      setPassword('');
      setAsking(false);
      onChallenge(challenge);
    } catch (err) {
      const e = errorView(err);
      if (e.code === 'PASSWORD_INCORRECT') setFieldError(e.message);
      else setError(e.message);
      if (e.code === 'ACCOUNT_DELETION_BLOCKED') q.reload();
    } finally {
      setBusy(false);
    }
  };
  const cancel = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      q.setData(await privacyApi.cancelDeletion());
      toast(copy.deleteCancelled);
    } catch (err) {
      setError(errorView(err).message);
      q.reload();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title={copy.deleteTitle}>
      <DataState loading={q.loading} error={q.error} offline={q.offline} onRetry={q.reload}>
        {v && q.data ? (
          <Card>
            {v.kind === 'scheduled' ? (
              <>
                <Badge kind="needs-changes" label={copy.deleteScheduled(formatDateIST(v.scheduledFor))} />
                {v.blocked.length ? <Text variant="small" color={colors.text}>{copy.deleteScheduledBlocked}</Text> : null}
                {v.blocked.map((b) => <Text key={b.code} variant="small" color={colors.text}>• {b.message}</Text>)}
                {error ? <Alert>{error}</Alert> : null}
                <Button variant="secondary" onPress={cancel} loading={busy}>{copy.deleteCancel}</Button>
              </>
            ) : (
              <>
                <Text variant="small" color={colors.text}>{copy.deleteCoolingDays(q.data.cooling_days)}</Text>
                {copy.deleteBody.slice(1).map((line) => <Text key={line} variant="small" color={colors.textMuted}>{line}</Text>)}
                {v.kind === 'blocked' ? (
                  <View style={{ gap: space.xs }} accessibilityRole="summary">
                    <Text variant="small" weight="600" color={colors.textStrong}>{copy.deleteBlockedTitle}</Text>
                    {v.blockers.map((b) => <Text key={b.code} variant="small" color={colors.text}>• {b.message}</Text>)}
                  </View>
                ) : null}
                {error ? <Alert>{error}</Alert> : null}
                {v.kind === 'available' && !asking ? <Button variant="danger" onPress={() => setAsking(true)}>{copy.deleteStart}</Button> : null}
                {v.kind === 'available' && asking ? (
                  <View style={{ gap: space.md }}>
                    <PasswordField label={copy.deletePassword} hint={copy.deletePasswordHint} value={password} onChangeText={setPassword} error={fieldError} autoComplete="current-password" textContentType="password" onSubmitEditing={start} />
                    <TextField label={copy.deleteReason} value={reason} onChangeText={setReason} maxLength={500} multiline />
                    <Button variant="danger" onPress={start} loading={busy}>{copy.deleteContinue}</Button>
                  </View>
                ) : null}
              </>
            )}
          </Card>
        ) : null}
      </DataState>
    </Section>
  );
}

function GrievanceCard() {
  const q = useLoad(() => privacyApi.grievanceOfficer());
  const g = q.data;
  return (
    <Section title={copy.grievanceTitle}>
      <DataState loading={q.loading} error={q.error} offline={q.offline} onRetry={q.reload}>
        {g ? (
          <Card>
            {g.placeholder ? <Badge kind="needs-changes" label={legal.draftBadge} /> : null}
            <Text variant="small" color={colors.text}>{copy.grievanceBody(g.response_days)}</Text>
            <Text weight="600" color={colors.textStrong}>{g.name}</Text>
            <TextButton onPress={() => void Linking.openURL(`mailto:${g.email}`)}>{g.email}</TextButton>
            {g.placeholder ? <Text variant="caption" color={colors.textMuted}>{copy.grievancePlaceholder}</Text> : null}
          </Card>
        ) : null}
      </DataState>
    </Section>
  );
}
