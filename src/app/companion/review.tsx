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
import { checklistRows, isEditable } from '@/lib/companion/steps';
import { colors } from '@/theme';

/** Review and submit: the checklist from the API, each row a link to its step. */
export default function Review() {
  const router = useRouter();
  const { companion, loading, error, refresh, setCompanion, uploads } = useCompanion();
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const submitting = useRef(false);

  if (!companion) return <Screen><StepHeader title="Review" /><LoadState loading={loading} error={error} onRetry={refresh} /></Screen>;
  const rows = checklistRows(companion.checklist.missing);
  const uploading = uploads.items.length > 0;
  const canSubmit = companion.checklist.ready && !uploading && isEditable(companion.status);

  const submit = async () => {
    if (submitting.current || !canSubmit) return;
    submitting.current = true;
    setBusy(true);
    setFormError(null);
    try {
      const res = await companionApi.submit();
      setCompanion(res.companion);
      // Submitted: the edit steps leave the history, so Back does not walk through them again.
      if (router.canDismiss()) router.dismissAll();
      router.replace('/companion/status');
    } catch (err) {
      if (err instanceof ApiError && err.code === 'APPLICATION_INCOMPLETE') {
        await refresh();
        setFormError('A step is not finished yet. Check the list below.');
      } else setFormError(err instanceof ApiError ? err.message : 'Could not submit. Check your connection and try again.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  return (
    <Screen footer={<Button onPress={submit} loading={busy} disabled={!canSubmit}>Submit for review</Button>}>
      <StepHeader title="Review and submit" step={5} total={5} subtitle={`A Sydecrew reviewer checks every application. ${companion.review_sla_text}.`} />
      {formError ? <Alert>{formError}</Alert> : null}
      {uploading ? <Alert tone="info">Uploads are still in progress. Keep the app open until they finish.</Alert> : null}
      <View>
        {rows.map((r) => (
          <LinkRow key={r.key} label={r.label} done={r.done} onPress={() => router.push(r.route)} />
        ))}
      </View>
      <Text variant="small" color={colors.fog400}>
        By submitting you confirm the details are true and the photos and documents are yours. Applications with false details are rejected for good.
      </Text>
    </Screen>
  );
}
