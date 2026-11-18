import { useState } from 'react';
import { Alert as NativeAlert, Platform, View } from 'react-native';
import { Redirect, useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LoadState, Section, StepHeader } from '@/components/companion/Bits';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Feedback';
import { Checkbox, PasswordField, TextField } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { deleteAccount as copy } from '@/content/account';
import { accountApi } from '@/lib/account/api';
import {
  DEFAULT_GRACE_DAYS,
  REASON_MAX,
  blockerViews,
  blockersFromDetails,
  deletionBody,
  deletionDate,
  deletionDraftErrors,
  emptyDeletionDraft,
  type DeletionDraft,
} from '@/lib/account/helpers';
import type { DeletionBlocker } from '@/lib/account/types';
import { useAuth } from '@/lib/auth';
import { errorView } from '@/lib/errors';
import { useRole } from '@/lib/role';
import { shellFor } from '@/lib/routing';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

/**
 * Delete account (customers and companions). Explains the 30-day grace period
 * and what is erased or kept (GET /account/deletion), lists what blocks it
 * with a way to fix each, or asks for the password, an optional reason and a
 * confirmation (POST /account/deletion). Success ends every session on the
 * server, so the app signs out locally and shows the deletion date.
 *
 * Not behind the signed-in route guard: the confirmation must stay on screen
 * after the sign-out. Signed out without a confirmation, it goes to the start.
 */
export default function DeleteAccount() {
  const router = useRouter();
  const { status, user, signOut } = useAuth();
  const { preferred } = useRole();
  const signedIn = status === 'authenticated' && !!user;
  const preview = useLoad(() => accountApi.deletionPreview(), user?.id ?? '');

  const [draft, setDraft] = useState<DeletionDraft>(emptyDeletionDraft);
  const [showErrors, setShowErrors] = useState(false);
  const [apiFields, setApiFields] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [blockedNow, setBlockedNow] = useState<DeletionBlocker[] | null>(null);
  const [notDeletable, setNotDeletable] = useState(false);
  const [sending, setSending] = useState(false);
  const [scheduledFor, setScheduledFor] = useState<string | null>(null);

  if (scheduledFor) return <Done date={deletionDate(scheduledFor)} onDone={() => router.replace('/')} />;
  if (!signedIn) return <Redirect href="/" />;

  const days = preview.data?.grace_days ?? DEFAULT_GRACE_DAYS;
  const role = shellFor(user, preferred);
  const blockers = blockerViews(blockedNow ?? preview.data?.blockers ?? [], role);
  const local = showErrors ? deletionDraftErrors(draft) : {};
  const go = (to: string) => () => {
    setBlockedNow(null); // the preview reloads on return and shows what is still open
    router.push(to as Href);
  };

  const edit = (patch: Partial<DeletionDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    if ('password' in patch) setApiFields((f) => ({ ...f, password: '' }));
    if ('reason' in patch) setApiFields((f) => ({ ...f, reason: '' }));
  };

  const send = async () => {
    setSending(true);
    setFormError(null);
    setApiFields({});
    try {
      const res = await accountApi.requestDeletion(deletionBody(draft));
      setScheduledFor(res.scheduled_for); // first, so the confirmation shows instead of the signed-out redirect
      await signOut({ sessionEnded: true });
    } catch (err) {
      const v = errorView(err);
      if (v.code === 'INVALID_PASSWORD') setApiFields({ password: v.fields.password ?? v.message });
      else if (v.code === 'ACCOUNT_DELETION_BLOCKED' && blockersFromDetails(v.details).length > 0) setBlockedNow(blockersFromDetails(v.details));
      else if (v.code === 'ACCOUNT_NOT_DELETABLE') setNotDeletable(true);
      else {
        setApiFields(v.fields);
        setFormError(v.message);
      }
    } finally {
      setSending(false);
    }
  };

  const submit = () => {
    setShowErrors(true);
    if (Object.keys(deletionDraftErrors(draft)).length > 0) return;
    if (Platform.OS === 'web') {
      // Development preview only: react-native-web has no buttons on Alert.
      if (globalThis.confirm?.(`${copy.alertTitle}\n\n${copy.alertBody(days)}`)) void send();
      return;
    }
    NativeAlert.alert(copy.alertTitle, copy.alertBody(days), [
      { text: copy.alertCancel, style: 'cancel' },
      { text: copy.alertConfirm, style: 'destructive', onPress: () => void send() },
    ]);
  };

  const ready = !!preview.data;
  const cannot = notDeletable || (ready && blockers.length === 0 && !preview.data!.can_delete && blockedNow === null);

  return (
    <Screen>
      <StepHeader title={copy.title} subtitle={copy.subtitle} />
      <LoadState loading={preview.loading} error={preview.error} offline={preview.offline} onRetry={preview.reload} />

      {ready ? (
        <Section title={copy.whatTitle}>
          <View style={{ gap: space.sm }}>
            {copy.what(days).map((line) => (
              <View key={line} style={{ flexDirection: 'row', gap: space.sm }}>
                <Text color={colors.textSubtle}>•</Text>
                <Text variant="small" color={colors.text} style={{ flex: 1 }}>{line}</Text>
              </View>
            ))}
          </View>
        </Section>
      ) : null}

      {ready && blockers.length > 0 ? (
        <View style={{ gap: space.md }} testID="delete-account-blockers">
          <Section title={copy.blockedTitle} hint={copy.blockedBody}>
            {blockers.map((b) => (
              <Card key={b.code} tone="warn">
                <Text variant="small" color={colors.text}>{b.message}</Text>
                <Button variant="secondary" onPress={go(b.route)}>{b.action}</Button>
              </Card>
            ))}
          </Section>
        </View>
      ) : null}

      {ready && blockers.length === 0 && cannot ? (
        <Alert action={<Button variant="secondary" onPress={go('/support')}>{copy.support}</Button>}>{copy.notDeletable}</Alert>
      ) : null}

      {ready && blockers.length === 0 && !cannot ? (
        <View style={{ gap: space.lg }} testID="delete-account-form">
          <Section title={copy.formTitle}>
            <PasswordField
              label={copy.password}
              hint={copy.passwordHint}
              value={draft.password}
              onChangeText={(password) => edit({ password })}
              error={apiFields.password || local.password}
              autoComplete="current-password"
              textContentType="password"
            />
            <TextField
              label={copy.reason}
              hint={copy.reasonHint}
              value={draft.reason}
              onChangeText={(reason) => edit({ reason })}
              error={apiFields.reason || local.reason}
              multiline
              maxLength={REASON_MAX}
            />
            <Checkbox checked={draft.confirmed} onChange={(confirmed) => edit({ confirmed })} error={local.confirmed} label={copy.confirm(days)}>
              {copy.confirm(days)}
            </Checkbox>
          </Section>
          {formError ? <Alert>{formError}</Alert> : null}
          <Button
            variant="danger"
            loading={sending}
            onPress={submit}
            icon={<Ionicons name="trash-outline" size={18} color={colors.dangerText} />}
          >
            {copy.submit}
          </Button>
        </View>
      ) : null}
      <View style={{ height: space.lg }} />
    </Screen>
  );
}

/** After the request: signed out, with the date and how to keep the account. */
function Done({ date, onDone }: { date: string; onDone: () => void }) {
  return (
    <Screen footer={<Button onPress={onDone}>{copy.doneButton}</Button>}>
      <View style={{ gap: space.lg, paddingTop: space.xl }} testID="delete-account-done">
        <Ionicons name="checkmark-circle-outline" size={40} color={colors.brand} />
        <Title>{copy.doneTitle}</Title>
        <Text color={colors.text}>{copy.doneBody(date)}</Text>
        <Card>
          <Text weight="600" color={colors.textStrong}>{copy.doneKeep}</Text>
        </Card>
        <Text variant="small" color={colors.textMuted}>{copy.doneEmail}</Text>
      </View>
    </Screen>
  );
}
