import { useRef, useState } from 'react';
import { View } from 'react-native';
import { StepHeader } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Feedback';
import { useToast } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { DataState } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { account as copy } from '@/content/payouts';
import { errorView } from '@/lib/errors';
import { payoutsApi } from '@/lib/payouts/api';
import { accountStatus, maskAccount, normaliseAccount, validateAccount, type AccountErrors, type AccountForm } from '@/lib/payouts/helpers';
import type { PayoutAccount } from '@/lib/payouts/types';
import { formatDateTimeIST } from '@/lib/time';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

const EMPTY: AccountForm = { account_number: '', confirm_account_number: '', ifsc: '', account_holder_name: '' };

/**
 * Payout account (GET/POST /companion/payout-account). Only the last 4 digits
 * ever come back from the API, and the typed number is cleared from memory as
 * soon as it is sent: the full number is never shown again.
 */
export default function PayoutAccountScreen() {
  const toast = useToast();
  const q = useLoad(() => payoutsApi.account());
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<AccountForm>(EMPTY);
  const [errors, setErrors] = useState<AccountErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);

  const s = q.data;
  const hours = s?.cooling_hours ?? 72;
  const set = (k: keyof AccountForm) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (sending.current) return;
    const e = validateAccount(form);
    setErrors(e);
    setFormError(null);
    if (Object.keys(e).length) return;
    sending.current = true;
    setBusy(true);
    try {
      const res = await payoutsApi.saveAccount(normaliseAccount(form));
      q.setData(res);
      setForm(EMPTY); // never keep or show the full number again
      setEditing(false);
      toast(copy.saved);
    } catch (err) {
      const v = errorView(err);
      setErrors(v.fields as AccountErrors);
      setForm((f) => ({ ...f, confirm_account_number: '' }));
      setFormError(v.message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen>
      <StepHeader title={copy.title} subtitle={copy.intro} />
      <DataState loading={q.loading} hasData={q.data != null} error={q.error} offline={q.offline} onRetry={q.reload}>
        {s ? (
          <>
            <View style={{ gap: space.xs }}>
              {copy.checks.map((c) => (
                <Text key={c} variant="small" color={colors.text}>{`• ${c.replace('{hours}', String(hours))}`}</Text>
              ))}
            </View>
            {s.current ? <AccountCard title={copy.current} a={s.current} /> : <Text color={colors.textMuted}>{copy.none}</Text>}
            {s.pending ? <AccountCard title={copy.pending} a={s.pending} /> : null}
            {s.last_rejected && !s.pending ? <AccountCard title={copy.rejected} a={s.last_rejected} /> : null}

            {editing ? (
              <View style={{ gap: space.md }}>
                {formError ? <Alert>{formError}</Alert> : null}
                <TextField label={copy.number} value={form.account_number} onChangeText={set('account_number')} keyboardType="number-pad" autoComplete="off" importantForAutofill="no" maxLength={22} error={errors.account_number} testID="account-number" />
                <TextField label={copy.confirm} value={form.confirm_account_number} onChangeText={set('confirm_account_number')} keyboardType="number-pad" autoComplete="off" importantForAutofill="no" maxLength={22} contextMenuHidden error={errors.confirm_account_number} testID="account-confirm" />
                <TextField label={copy.ifsc} hint={copy.ifscHint} value={form.ifsc} onChangeText={(v) => set('ifsc')(v.toUpperCase())} autoCapitalize="characters" autoCorrect={false} maxLength={11} error={errors.ifsc} testID="account-ifsc" />
                <TextField label={copy.holder} hint={copy.holderHint} value={form.account_holder_name} onChangeText={set('account_holder_name')} autoComplete="name" maxLength={120} error={errors.account_holder_name} testID="account-holder" />
                <Button onPress={submit} loading={busy}>{copy.save}</Button>
                <Button variant="ghost" onPress={() => (setEditing(false), setForm(EMPTY), setErrors({}), setFormError(null))}>Cancel</Button>
              </View>
            ) : !s.pending ? (
              <Button onPress={() => setEditing(true)}>{s.current ? copy.change : copy.add}</Button>
            ) : null}
          </>
        ) : null}
      </DataState>
    </Screen>
  );
}

function AccountCard({ title, a }: { title: string; a: PayoutAccount }) {
  const st = accountStatus[a.status];
  return (
    <Card accessibilityLabel={`${title}: ${a.bank_name ?? ''} account ending ${a.account_last4}, ${st.label}`}>
      <Text variant="caption" color={colors.textMuted}>{title}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.md }}>
        <Text weight="600" color={colors.textStrong}>{`${a.bank_name ? `${a.bank_name} ` : ''}${maskAccount(a.account_last4)}`}</Text>
        <Badge kind={st.badge} label={st.label} />
      </View>
      <Text variant="caption" color={colors.textMuted}>{`${a.account_holder_name} · ${a.ifsc}`}</Text>
      {a.status === 'COOLING' && a.cooling_until ? <Text variant="small" color={colors.text}>{copy.coolingUntil(formatDateTimeIST(a.cooling_until))}</Text> : null}
      {a.failure_reason && (a.status === 'REJECTED' || a.status === 'NEEDS_REVIEW') ? <Text variant="small" color={colors.text}>{a.failure_reason}</Text> : null}
    </Card>
  );
}
