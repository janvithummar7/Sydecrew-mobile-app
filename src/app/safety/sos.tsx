import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Linking, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackBar } from '@/components/account/BackBar';
import { LinkRow } from '@/components/companion/Bits';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Field';
import { Alert } from '@/components/ui/Feedback';
import { Modal } from '@/components/ui/Sheet';
import { Text, Title } from '@/components/ui/Text';
import { Screen } from '@/components/ui/Screen';
import { sos as copy } from '@/content/comms';
import { commsApi } from '@/lib/comms/api';
import { sosSections, telUrl, type SosSection } from '@/lib/comms/helpers';
import { currentPoint, foregroundPermission } from '@/lib/comms/location';
import { usePollingFallback, useRealtimeEvents } from '@/lib/comms/realtime-context';
import type { SosIncident } from '@/lib/comms/types';
import { errorView } from '@/lib/errors';
import { formatTimeIST } from '@/lib/time';
import { colors, space } from '@/theme';

/**
 * SOS (Feature 5, D16), artboard "Safety SOS". Reachable from both shells
 * with or without a booking (/safety/sos?booking=<id> from booking day).
 * "Call 112" is ALWAYS first (sosSections): the in-app alert to the 24×7
 * safety desk comes after it and never replaces it. The location goes with
 * the alert only if the user leaves "share my location" on.
 */
export default function Sos() {
  const router = useRouter();
  const { booking } = useLocalSearchParams<{ booking?: string }>();
  const [incident, setIncident] = useState<SosIncident | null>(null);
  const [share, setShare] = useState(true);
  const [phase, setPhase] = useState<'idle' | 'locating' | 'sending'>('idle');
  const [error, setError] = useState<{ message: string; offline: boolean } | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [confirmSafe, setConfirmSafe] = useState(false);
  const [safeBusy, setSafeBusy] = useState(false);
  const sending = useRef(false);

  const refresh = useCallback(() => {
    commsApi.currentSos().then(
      (r) => setIncident((cur) => r.incident ?? (cur && cur.marked_safe ? cur : null)),
      () => undefined,
    );
  }, []);
  useEffect(refresh, [refresh]);
  useRealtimeEvents((e) => {
    if (e.type === 'incident.update' && incident && e.payload.id === incident.id) refresh();
  });
  // While the desk has not acknowledged, check every 10 s when the socket is down.
  usePollingFallback(() => incident && !incident.acknowledged && !incident.marked_safe && refresh(), 10_000);

  const call112 = () => void Linking.openURL(telUrl('112'));

  const sendAlert = async () => {
    if (sending.current) return;
    sending.current = true;
    setError(null);
    setNote(null);
    try {
      let point = null;
      if (share) {
        setPhase('locating');
        if ((await foregroundPermission(true)) === 'granted') point = await currentPoint();
        if (!point) setNote(copy.noLocation);
      }
      setPhase('sending');
      const res = await commsApi.sos({ booking_id: booking ?? null, share_location: share && !!point, ...(point ?? {}) });
      setIncident(res.incident);
    } catch (err) {
      const v = errorView(err);
      setError({ message: v.offline ? copy.offline : v.message, offline: v.offline });
    } finally {
      sending.current = false;
      setPhase('idle');
    }
  };

  const markSafe = async () => {
    if (!incident) return;
    setSafeBusy(true);
    try {
      const res = await commsApi.safe(incident.id);
      setIncident(res.incident ?? { ...incident, marked_safe: true });
      setConfirmSafe(false);
    } catch (err) {
      setError({ message: errorView(err).message, offline: false });
      setConfirmSafe(false);
    } finally {
      setSafeBusy(false);
    }
  };

  const sections = sosSections({ alertSent: !!incident, markedSafe: !!incident?.marked_safe });
  const render: Record<SosSection, () => ReactNode> = {
    CALL_112: () => (
      <Button key="call" variant="danger" onPress={call112} icon={<Ionicons name="call" size={20} color={colors.dangerText} />} accessibilityHint={copy.call112Hint}>
        {copy.call112}
      </Button>
    ),
    STATUS: () =>
      incident ? (
        <Card key="status">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm }}>
            <Ionicons name={incident.marked_safe ? 'checkmark-circle' : 'shield-checkmark'} size={22} color={colors.accent} />
            <Text variant="heading" color={colors.textStrong} accessibilityRole="header" accessibilityLiveRegion="polite">{copy.sentTitle}</Text>
          </View>
          <Text color={colors.text}>{incident.help_message}</Text>
          <Text variant="small" color={colors.textMuted}>{incident.marked_safe ? copy.markedSafe : incident.acknowledged ? copy.acknowledged : copy.waiting}</Text>
          <View style={{ flexDirection: 'row', gap: space.sm, alignItems: 'center' }}>
            <Badge kind={incident.acknowledged || incident.marked_safe ? 'verified' : 'pending'} label={copy.ref(incident.ref)} />
            <Text variant="caption" color={colors.textSubtle}>{formatTimeIST(incident.triggered_at)}</Text>
          </View>
        </Card>
      ) : null,
    SHARE_LOCATION: () => (
      <Card key="share">
        <Checkbox checked={share} onChange={setShare} label={`${copy.shareTitle}. ${copy.shareBody}`}>
          <View style={{ gap: 2 }}>
            <Text weight="600" color={colors.textStrong}>{copy.shareTitle}</Text>
            <Text variant="small" color={colors.textMuted}>{copy.shareBody}</Text>
          </View>
        </Checkbox>
      </Card>
    ),
    SEND_ALERT: () => (
      <View key="send" style={{ gap: space.sm }}>
        <Button onPress={sendAlert} loading={phase !== 'idle'} accessibilityHint={copy.sendAlertHint} icon={<Ionicons name="alert-circle" size={20} color={colors.onAccent} />}>
          {phase === 'locating' ? copy.locating : phase === 'sending' ? copy.sending : copy.sendAlert}
        </Button>
      </View>
    ),
    IM_SAFE: () => (
      <Button key="safe" variant="secondary" onPress={() => setConfirmSafe(true)} accessibilityHint={copy.safeHint}>
        {copy.safe}
      </Button>
    ),
    LEAVE: () => (
      <Card key="leave">
        <Text weight="600" color={colors.textStrong}>{copy.leave}</Text>
        <Text variant="small" color={colors.textMuted}>{copy.leaveBody}</Text>
      </Card>
    ),
  };

  return (
    <Screen>
      <BackBar />
      <Title>{copy.title}</Title>
      <Text color={colors.text}>{copy.lead}</Text>
      {error ? <Alert>{error.message}</Alert> : null}
      {note ? <Alert tone="info">{note}</Alert> : null}
      {sections.map((s) => render[s]())}
      <LinkRow label={copy.contacts} onPress={() => router.push('/safety/contacts')} />
      <Modal visible={confirmSafe} onClose={() => setConfirmSafe(false)} title={copy.safeConfirmTitle}>
        <View style={{ gap: space.md }}>
          <Text variant="small" color={colors.text}>{copy.safeConfirmBody}</Text>
          <Button onPress={markSafe} loading={safeBusy}>{copy.safeConfirm}</Button>
          <Button variant="ghost" onPress={() => setConfirmSafe(false)}>{copy.safeCancel}</Button>
        </View>
      </Modal>
    </Screen>
  );
}
