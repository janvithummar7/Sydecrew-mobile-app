import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert, DevHint } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Misc';
import { Modal } from '@/components/ui/Sheet';
import { Screen } from '@/components/ui/Screen';
import { EmptyState, ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { contacts as copy } from '@/content/comms';
import { commsApi } from '@/lib/comms/api';
import type { TrustedContact } from '@/lib/comms/types';
import { errorView } from '@/lib/errors';
import { indianMobile } from '@/lib/validation';
import { colors, space } from '@/theme';

/**
 * Safety contacts (Feature 5, D21): up to 3 people. Adding one sends them an
 * SMS to accept; only accepted contacts get meeting links. Numbers come back
 * masked and are never shown in full again.
 */
export default function TrustedContacts() {
  const toast = useToast();
  const [items, setItems] = useState<TrustedContact[] | null>(null);
  const [max, setMax] = useState(3);
  const [state, setState] = useState<{ error: string | null; offline: boolean }>({ error: null, offline: false });
  const [form, setForm] = useState({ name: '', phone: '', relationship: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [removing, setRemoving] = useState<TrustedContact | null>(null);
  const acting = useRef(false);

  const load = useCallback(() => {
    commsApi.contacts().then(
      (r) => {
        setItems(r.items);
        setMax(r.max);
        setState({ error: null, offline: false });
      },
      (err) => {
        const v = errorView(err);
        setState({ error: v.offline ? null : v.message, offline: v.offline });
      },
    );
  }, []);
  useFocusEffect(load);

  const run = async (key: string, fn: () => Promise<void>) => {
    if (acting.current) return;
    acting.current = true;
    setBusy(key);
    try {
      await fn();
    } finally {
      acting.current = false;
      setBusy(null);
    }
  };

  const add = () =>
    run('add', async () => {
      const e: Record<string, string> = {};
      const digits = indianMobile(form.phone);
      if (form.name.trim().length < 1) e.name = copy.errors.name;
      if (!digits) e.phone = copy.errors.phone;
      setFieldErrors(e);
      setFormError(null);
      if (Object.keys(e).length) return;
      try {
        const res = await commsApi.addContact({ name: form.name.trim(), phone: `+91${digits}`, ...(form.relationship.trim() ? { relationship: form.relationship.trim() } : {}) });
        setForm({ name: '', phone: '', relationship: '' });
        setDevLink(res.dev_link ?? null);
        toast(copy.added);
        load();
      } catch (err) {
        const v = errorView(err);
        setFieldErrors(v.fields);
        setFormError(Object.keys(v.fields).length ? null : v.message);
      }
    });

  const resend = (c: TrustedContact) =>
    run(`resend-${c.id}`, async () => {
      try {
        const res = await commsApi.resendContact(c.id);
        setDevLink(res.dev_link ?? null);
        toast(copy.resent);
      } catch (err) {
        toast(errorView(err).message, 'error');
      }
    });

  const remove = (c: TrustedContact) =>
    run(`remove-${c.id}`, async () => {
      try {
        await commsApi.removeContact(c.id);
        setRemoving(null);
        toast(copy.removed);
        load();
      } catch (err) {
        setRemoving(null);
        toast(errorView(err).message, 'error');
      }
    });

  const full = (items?.length ?? 0) >= max;

  return (
    <Screen>
      <BackBar />
      <Title>{copy.title}</Title>
      <Text color={colors.textMuted}>{copy.intro}</Text>
      {state.offline ? <OfflineBanner onRetry={load} /> : null}
      {items === null ? (
        state.error ? <ErrorState message={state.error} onRetry={load} /> : state.offline ? null : <SkeletonList rows={2} />
      ) : items.length === 0 ? (
        <EmptyState icon="people-outline" title={copy.emptyTitle} body={copy.emptyBody} />
      ) : (
        <View style={{ gap: space.sm }}>
          {items.map((c) => (
            <Card key={c.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text weight="600" color={colors.textStrong}>{c.name}</Text>
                  <Text variant="small" color={colors.textMuted}>{[c.phone_masked, c.relationship].filter(Boolean).join(' · ')}</Text>
                </View>
                <Badge kind={c.status === 'ACCEPTED' ? 'verified' : 'pending'} label={c.status === 'ACCEPTED' ? copy.accepted : copy.pending} />
              </View>
              <View style={{ flexDirection: 'row', gap: space.sm }}>
                {c.status === 'PENDING' ? (
                  <Button variant="secondary" onPress={() => resend(c)} loading={busy === `resend-${c.id}`} style={{ flex: 1 }}>{copy.resend}</Button>
                ) : null}
                <Button variant="ghost" onPress={() => setRemoving(c)} accessibilityLabel={`${copy.remove} ${c.name}`} style={{ flex: 1 }}>{copy.remove}</Button>
              </View>
            </Card>
          ))}
        </View>
      )}
      {devLink ? <DevHint>{`${copy.devLink}: ${devLink}`}</DevHint> : null}

      {items !== null ? (
        full ? (
          <Alert tone="info">{copy.max(max)}</Alert>
        ) : (
          <View style={{ gap: space.md }}>
            <Text variant="heading" color={colors.textStrong} accessibilityRole="header">{copy.add}</Text>
            <TextField label={copy.name} value={form.name} onChangeText={(name) => setForm((f) => ({ ...f, name }))} error={fieldErrors.name} maxLength={80} autoComplete="name" />
            <TextField label={copy.phone} hint={copy.phoneHint} prefix="+91" value={form.phone} onChangeText={(phone) => setForm((f) => ({ ...f, phone }))} error={fieldErrors.phone} keyboardType="phone-pad" maxLength={14} autoComplete="tel" />
            <TextField label={copy.relationship} hint={copy.relationshipHint} value={form.relationship} onChangeText={(relationship) => setForm((f) => ({ ...f, relationship }))} error={fieldErrors.relationship} maxLength={40} />
            {formError ? <Alert>{formError}</Alert> : null}
            <Button onPress={add} loading={busy === 'add'}>{copy.save}</Button>
          </View>
        )
      ) : null}

      <Modal visible={!!removing} onClose={() => setRemoving(null)} title={removing ? copy.removeTitle(removing.name) : copy.remove}>
        <View style={{ gap: space.md }}>
          <Text variant="small" color={colors.text}>{copy.removeBody}</Text>
          <Button variant="danger" onPress={() => removing && remove(removing)} loading={!!removing && busy === `remove-${removing.id}`}>{copy.remove}</Button>
        </View>
      </Modal>
    </Screen>
  );
}
