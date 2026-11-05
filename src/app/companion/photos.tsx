import { useRef, useState } from 'react';
import { ActivityIndicator, Alert as NativeAlert, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LoadState, Pill, StepHeader } from '@/components/companion/Bits';
import { Card as UiCard } from '@/components/ui/Card';
import { Button, IconButton, TextButton } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { ApiError } from '@/lib/api';
import { companionApi } from '@/lib/companion/api';
import { useCompanion } from '@/lib/companion/context';
import { limitsOf } from '@/lib/companion/types';
import { isApproved } from '@/lib/companion/steps';
import type { CompanionPhoto } from '@/lib/companion/types';
import { dismissFailure, enqueue, retryAll } from '@/lib/uploads/uploader';
import { colors, radius } from '@/theme';

const MODERATION = { PENDING: ['Waiting for review', 'info'], APPROVED: ['Approved', 'ok'], REJECTED: ['Replace this photo', 'warn'] } as const;

/** 2–6 photos, 4:5. Converted to JPEG on the phone and uploaded in the background (resumable). */
export default function Photos() {
  const router = useRouter();
  const { companion, options, loading, error, refresh, setCompanion, uploads } = useCompanion();
  const [busy, setBusy] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const picking = useRef(false);

  if (!companion || !options) {
    return <Screen><StepHeader title="Photos" /><LoadState loading={loading} error={error} onRetry={refresh} /></Screen>;
  }
  const { photos_min: min, photos_max: max, photo_min_px: minPx } = limitsOf(options);
  const photos = companion.photos;
  const pending = uploads.items.filter((i) => i.kind === 'PHOTO');
  const failures = uploads.failures.filter((f) => f.kind === 'PHOTO');
  const count = photos.length + pending.length;
  const approved = isApproved(companion.status);

  const add = async () => {
    if (picking.current) return;
    picking.current = true;
    setFormError(null);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        setFormError('Allow photo access in Settings to add photos.');
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [4, 5], quality: 1 });
      const asset = res.canceled ? null : res.assets[0];
      if (!asset) return;
      if (Math.min(asset.width, asset.height) < minPx) {
        setFormError(`Choose a sharper photo: at least ${minPx} × ${minPx} pixels.`);
        return;
      }
      // The queue owns the upload from here; errors come back as failures.
      void enqueue({ kind: 'PHOTO', uri: asset.uri, width: asset.width, height: asset.height }).catch(() => undefined);
    } catch {
      setFormError('Could not open that photo. Try another one.');
    } finally {
      picking.current = false;
    }
  };

  const run = async (key: string, fn: () => Promise<{ companion: typeof companion }>) => {
    if (busy) return;
    setBusy(key);
    setFormError(null);
    try {
      const res = await fn();
      if (res.companion) setCompanion(res.companion);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Could not save. Check your connection.');
    } finally {
      setBusy(null);
    }
  };

  const move = (i: number, by: -1 | 1) => {
    const ids = photos.map((p) => p.id);
    const j = i + by;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
    void run(`move-${i}`, () => companionApi.orderPhotos(ids));
  };

  const del = (p: CompanionPhoto) =>
    NativeAlert.alert('Delete this photo?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void run(`del-${p.id}`, () => companionApi.deletePhoto(p.id)) },
    ]);

  const ready = photos.filter((p) => p.moderation_status !== 'REJECTED').length >= min && pending.length === 0;

  return (
    <Screen
      footer={
        approved ? undefined : (
          <Button onPress={() => router.push('/companion/categories')} disabled={!ready}>
            {ready ? 'Continue' : `Add at least ${min} photos`}
          </Button>
        )
      }
    >
      <StepHeader title="Your photos" step={approved ? undefined : 2} total={approved ? undefined : 5} subtitle={`Add ${min} to ${max} recent photos of yourself. Your main photo must show only your face clearly; no group photos.`} />
      {formError ? <Alert>{formError}</Alert> : null}
      {failures.map((f) => (
        <Alert key={f.id} action={<TextButton onPress={() => dismissFailure(f.id)}>Dismiss</TextButton>}>{`A photo was not accepted: ${f.message}`}</Alert>
      ))}
      {pending.some((p) => p.attempts > 0) ? (
        <Alert tone="info" action={<TextButton onPress={() => void retryAll()}>Retry now</TextButton>}>Some uploads are waiting for a connection. They will continue automatically.</Alert>
      ) : null}

      <View style={styles.grid}>
        {photos.map((p, i) => (
          <View key={p.id} style={styles.tile}>
            {p.url ? <Image source={{ uri: p.url }} style={styles.img} contentFit="cover" accessibilityLabel={`Photo ${i + 1}${p.is_primary ? ', main photo' : ''}`} /> : <View style={styles.img} />}
            <View style={styles.tileInfo}>
              {p.is_primary ? <Pill label="Main photo" tone="ok" /> : null}
              <Pill label={MODERATION[p.moderation_status][0]} tone={MODERATION[p.moderation_status][1]} />
              <View style={styles.actions}>
                <IconButton icon="arrow-back" label="Move earlier" onPress={() => move(i, -1)} disabled={i === 0 || !!busy} />
                <IconButton icon="arrow-forward" label="Move later" onPress={() => move(i, 1)} disabled={i === photos.length - 1 || !!busy} />
                <IconButton icon="trash-outline" label="Delete photo" onPress={() => del(p)} disabled={!!busy} />
              </View>
            </View>
          </View>
        ))}
        {pending.map((p) => (
          <View key={p.id} style={[styles.tile, styles.pendingTile]}>
            <Image source={{ uri: p.localUri }} style={[styles.img, { opacity: 0.5 }]} contentFit="cover" />
            <View style={styles.overlay}>
              <ActivityIndicator color={colors.fog50} />
              <Text variant="caption" color={colors.fog50}>{p.attempts ? 'Waiting to retry' : 'Uploading'}</Text>
            </View>
          </View>
        ))}
        {count < max ? (
          <UiCard onPress={add} accessibilityLabel="Add a photo" style={[styles.tile, styles.add]}>
            <Ionicons name="add" size={32} color={colors.lime400} />
            <Text variant="small" color={colors.fog300}>Add photo</Text>
          </UiCard>
        ) : null}
      </View>
      <Text variant="caption" color={colors.fog400}>{`${count} of ${max}. The first photo is your main photo. Every photo is checked by our team.`}</Text>
    </Screen>
  );
}


const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { width: '47%', borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  img: { width: '100%', aspectRatio: 4 / 5, backgroundColor: colors.ink800 },
  tileInfo: { padding: 8, gap: 6 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  pendingTile: { position: 'relative' },
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: 6 },
  add: { aspectRatio: 4 / 5, alignItems: 'center', justifyContent: 'center', gap: 6, borderStyle: 'dashed' },
});
