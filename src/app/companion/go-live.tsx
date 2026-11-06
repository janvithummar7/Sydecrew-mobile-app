import { useRef, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinkRow, LoadState, StepHeader } from '@/components/companion/Bits';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { ApiError } from '@/lib/api';
import { companionApi } from '@/lib/companion/api';
import { useCompanion } from '@/lib/companion/context';
import { routeForStep, type CompanionRoute } from '@/lib/companion/steps';
import { colors } from '@/theme';

const ITEMS: { key: string; label: string; route: CompanionRoute }[] = [
  { key: 'CATEGORIES', label: 'An approved category', route: routeForStep('CATEGORIES') },
  { key: 'RATES', label: 'A rate inside the allowed range', route: '/companion/rates' as CompanionRoute },
  { key: 'AVAILABILITY', label: 'Weekly availability', route: routeForStep('SETUP') },
  { key: 'PHOTOS', label: 'Approved photos, including your main photo', route: routeForStep('PHOTOS') },
];

/** Go live: the API checks the same list again and moves the profile to LIVE. */
export default function GoLive() {
  const router = useRouter();
  const { companion, loading, error, refresh, setCompanion } = useCompanion();
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const submitting = useRef(false);

  if (!companion) return <Screen><StepHeader title="Go live" /><LoadState loading={loading} error={error} onRetry={refresh} /></Screen>;
  const missing = companion.setup?.missing ?? ITEMS.map((i) => i.key);

  const go = async () => {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setFormError(null);
    try {
      const res = await companionApi.goLive();
      setCompanion(res.companion);
      router.replace('/companion/dashboard');
    } catch (err) {
      if (err instanceof ApiError && err.code === 'SETUP_INCOMPLETE') {
        await refresh();
        setFormError('Something is still missing. Check the list.');
      } else setFormError(err instanceof ApiError ? err.message : 'Could not go live. Check your connection.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button onPress={go} loading={busy} disabled={missing.length > 0}>Go live</Button>}>
      <StepHeader title="Ready to go live?" subtitle="Once live, customers in your area can find and book you." />
      {formError ? <Alert>{formError}</Alert> : null}
      <View>
        {ITEMS.map((i) => <LinkRow key={i.key} label={i.label} done={!missing.includes(i.key)} onPress={() => router.push(i.route)} />)}
      </View>
      <Alert tone="info">Add your bank account before your first booking so we can pay you. You can do it after going live.</Alert>
      <Text variant="small" color={colors.fog400}>Meet only at the booked public venue, check in when you arrive, and keep every conversation and payment inside Sydecrew.</Text>
    </Screen>
  );
}
