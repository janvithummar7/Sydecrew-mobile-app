import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { Text } from '@/components/ui/Text';
import { enqueue } from '@/lib/uploads/uploader';
import { colors, radius, alpha } from '@/theme';

type Side = 'FRONT' | 'BACK' | 'SELFIE';
const COPY: Record<Side, { title: string; tip: string }> = {
  FRONT: { title: 'Front of your ID', tip: 'Fit the card inside the frame. All corners visible, no glare, no fingers over the text.' },
  BACK: { title: 'Back of your ID', tip: 'Turn the card over and fit it inside the frame.' },
  SELFIE: { title: 'Selfie', tip: 'Fit your face in the oval. Good light, no glasses, mask or hat.' },
};

/**
 * Camera with a guide frame (card for ID sides, oval for the selfie). The
 * photo goes into the upload queue (JPEG, hashed, resumable) and this screen
 * closes straight away; the identity screen shows the upload progress.
 */
export default function Capture() {
  const router = useRouter();
  const { side: raw } = useLocalSearchParams<{ side?: string }>();
  const side: Side = raw === 'BACK' || raw === 'SELFIE' ? raw : 'FRONT';
  const camera = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const copy = COPY[side];

  const shoot = async () => {
    if (busy || !ready) return;
    setBusy(true);
    setError(null);
    try {
      const pic = await camera.current?.takePictureAsync({ quality: 0.9 });
      if (!pic) throw new Error('no picture');
      void enqueue({ kind: 'DOCUMENT', side, uri: pic.uri, width: pic.width, height: pic.height }).catch(() => undefined);
      router.back();
    } catch {
      setError('Could not take the photo. Try again.');
      setBusy(false);
    }
  };

  if (!permission) return <View style={styles.root} />;
  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.root, { padding: 24, gap: 16, justifyContent: 'center' }]}>
        <Text variant="title" color={colors.fog50} accessibilityRole="header">Camera access</Text>
        <Text color={colors.fog300}>Sydecrew needs the camera to photograph your ID and take your selfie. Photos go only to our verification team.</Text>
        <Button onPress={requestPermission}>Allow camera</Button>
        <Button variant="ghost" onPress={() => router.back()}>Not now</Button>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.root}>
      <CameraView ref={camera} style={StyleSheet.absoluteFill} facing={side === 'SELFIE' ? 'front' : 'back'} onCameraReady={() => setReady(true)} />
      <View style={styles.overlay} pointerEvents="none" accessible accessibilityLabel={copy.tip}>
        <View style={side === 'SELFIE' ? styles.oval : styles.card} />
      </View>
      <SafeAreaView style={styles.chrome} edges={['top', 'bottom']}>
        <View style={{ gap: 6 }}>
          <Text variant="heading" color={colors.fog50} accessibilityRole="header">{copy.title}</Text>
          <Text variant="small" color={colors.fog100}>{copy.tip}</Text>
        </View>
        <View style={{ gap: 10 }}>
          {error ? <Alert>{error}</Alert> : null}
          <Button onPress={shoot} loading={busy} disabled={!ready}>Take photo</Button>
          <Button variant="secondary" onPress={() => router.back()}>Cancel</Button>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink950 },
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  // ID-1 card ratio (85.6 × 54 mm).
  card: { width: '86%', aspectRatio: 1.586, borderRadius: radius.md, borderWidth: 3, borderColor: colors.lime400 },
  oval: { width: '68%', aspectRatio: 0.78, borderRadius: 999, borderWidth: 3, borderColor: colors.lime400 },
  chrome: { flex: 1, justifyContent: 'space-between', padding: 24, backgroundColor: alpha(colors.ink950, 0.25) },
});
