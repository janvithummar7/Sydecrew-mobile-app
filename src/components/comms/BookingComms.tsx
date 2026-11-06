import { useCallback, useEffect, useReducer, useState } from 'react';
import { AppState, Linking, Switch, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert, DevHint } from '@/components/ui/Feedback';
import { useToast } from '@/components/ui/Misc';
import { Modal } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { call as callCopy, location as locCopy, ping as pingCopy } from '@/content/comms';
import type { Booking } from '@/lib/bookings/types';
import { commsApi } from '@/lib/comms/api';
import { LocationThrottle, PING_PROMPT_INITIAL, callButton, nextPingPrompt, telUrl } from '@/lib/comms/helpers';
import { foregroundPermission, openLocationSettings, watchForeground } from '@/lib/comms/location';
import { useRealtimeEvents } from '@/lib/comms/realtime-context';
import { errorView } from '@/lib/errors';
import { formatDateTimeIST, formatTimeIST } from '@/lib/time';
import { alpha, colors, space } from '@/theme';


/**
 * Message and masked-call buttons on a booking (Feature 5, D15). The Call
 * button follows the API's actions.can_call (and hides when call_window
 * closes while the screen is open); the API returns a temporary number that
 * bridges to the other person, and the phone dialler opens with it.
 */
export function CallAndChat({ booking, now }: { booking: Booking; now: number }) {
  const toast = useToast();
  const router = useRouter();
  const other = booking.viewer === 'CUSTOMER' ? booking.companion.display_name : booking.customer.first_name;
  const [calling, setCalling] = useState(false);
  const [number, setNumber] = useState<{ until: string } | null>(null);
  const w = callButton(booking, new Date(now));

  const call = async () => {
    setCalling(true);
    try {
      const res = await commsApi.call(booking.id);
      setNumber({ until: res.expires_at });
      await Linking.openURL(telUrl(res.virtual_number));
    } catch (err) {
      toast(errorView(err).message, 'error');
    } finally {
      setCalling(false);
    }
  };

  return (
    <View style={{ gap: space.sm }}>
      {booking.conversation_id ? (
        <Button
          variant="secondary"
          onPress={() => router.push({ pathname: '/chat/[id]', params: { id: booking.conversation_id!, name: other } })}
          icon={<Ionicons name="chatbubble-outline" size={18} color={colors.textStrong} />}
          accessibilityHint={callCopy.messageHint}
        >
          {callCopy.message}
        </Button>
      ) : null}
      {w.show ? (
        <Button variant="secondary" onPress={call} loading={calling} icon={<Ionicons name="call-outline" size={18} color={colors.textStrong} />} accessibilityHint={callCopy.hint}>
          {calling ? callCopy.getting : callCopy.button}
        </Button>
      ) : null}
      {w.show && number ? <Text variant="caption" color={colors.textMuted}>{callCopy.body(formatTimeIST(number.until))}</Text> : null}
      {w.reason === 'NOT_YET' ? <Text variant="caption" color={colors.textMuted}>{callCopy.notYet(formatDateTimeIST(w.opensAt.toISOString()))}</Text> : null}
      {__DEV__ && w.show ? (
        <Button
          variant="ghost"
          onPress={() => commsApi.simulateCall(booking.id).then(() => toast(callCopy.devSimulated), (err) => toast(errorView(err).message, 'error'))}
        >
          {callCopy.devSimulate}
        </Button>
      ) : null}
    </View>
  );
}

/**
 * Live location sharing with the user's safety contacts during a booking
 * (Feature 5). FOREGROUND ONLY: points are sent while this screen is open and
 * the app is active, at most one every 30 s; nothing runs in the background.
 */
export function LocationShare({ bookingId, onAddContacts }: { bookingId: string; onAddContacts: () => void }) {
  const [sharing, setSharing] = useState<boolean | null>(null);
  const [info, setInfo] = useState<{ notified?: number; devLink?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const [explain, setExplain] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lastSent, setLastSent] = useState<string | null>(null);
  const [active, setActive] = useState(AppState.currentState === 'active');
  const [focused, setFocused] = useState(false);
  const [throttle] = useState(() => new LocationThrottle());

  useEffect(() => {
    commsApi.locationState(bookingId).then((r) => setSharing(r.sharing), () => setSharing(false));
  }, [bookingId]);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => setActive(s === 'active'));
    return () => sub.remove();
  }, []);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  // The foreground watcher: only while sharing, focused and in the foreground.
  useEffect(() => {
    if (!sharing || !focused || !active) return;
    let stop: (() => void) | null = null;
    let alive = true;
    (async () => {
      if ((await foregroundPermission(false)) !== 'granted') return setDenied(true);
      const remove = await watchForeground((p) => {
        const now = Date.now();
        if (!throttle.due(now)) return;
        throttle.mark(now);
        commsApi.sendLocation(bookingId, p).then(
          () => setLastSent(new Date(now).toISOString()),
          (err) => {
            const code = errorView(err).code;
            if (code === 'LOCATION_SHARING_OFF' || code === 'LOCATION_WINDOW_CLOSED') {
              setSharing(false);
              setError(locCopy.stopped);
            }
          },
        );
      }).catch(() => null);
      if (!alive) remove?.();
      else stop = remove;
    })();
    return () => {
      alive = false;
      stop?.();
    };
  }, [sharing, focused, active, bookingId, throttle]);

  const turnOn = async () => {
    setExplain(false);
    setBusy(true);
    setError(null);
    try {
      const perm = await foregroundPermission(true);
      if (perm !== 'granted') {
        setDenied(true);
        return;
      }
      setDenied(false);
      const res = await commsApi.setLocationSharing(bookingId, true);
      throttle.reset();
      setSharing(res.sharing);
      setInfo({ notified: res.contacts_notified, devLink: res.dev_link });
    } catch (err) {
      const v = errorView(err);
      setError(v.code === 'LOCATION_WINDOW_CLOSED' ? locCopy.windowClosed : v.message);
    } finally {
      setBusy(false);
    }
  };
  const turnOff = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await commsApi.setLocationSharing(bookingId, false);
      setSharing(res.sharing);
      setInfo(null);
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      setBusy(false);
    }
  };

  const toggle = async (on: boolean) => {
    if (busy) return;
    if (!on) return turnOff();
    // Our explanation first, then the system prompt (only if it has not been answered yet).
    if ((await foregroundPermission(false)) === 'undetermined') setExplain(true);
    else void turnOn();
  };

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <Ionicons name="navigate-circle-outline" size={24} color={sharing ? colors.accent : colors.textSubtle} />
        <View style={{ flex: 1 }}>
          <Text weight="600" color={colors.textStrong}>{locCopy.title}</Text>
          <Text variant="caption" color={sharing ? colors.accent : colors.textMuted}>{sharing ? locCopy.on : locCopy.off}</Text>
        </View>
        <Switch
          testID="location-share-switch"
          value={!!sharing}
          onValueChange={(v) => void toggle(v)}
          disabled={sharing === null || busy}
          accessibilityLabel={locCopy.title}
          accessibilityHint={locCopy.toggleHint}
          trackColor={{ false: colors.surfaceStrong, true: alpha(colors.accent, 0.5) }}
          thumbColor={sharing ? colors.accent : colors.fog300}
        />
      </View>
      <Text variant="small" color={colors.textMuted}>{locCopy.body}</Text>
      {sharing ? <Text variant="caption" color={colors.warningText}>{locCopy.foregroundOnly}</Text> : null}
      {sharing && lastSent ? <Text variant="caption" color={colors.textSubtle}>{locCopy.lastSent(formatTimeIST(lastSent))}</Text> : null}
      {info && info.notified !== undefined ? (
        info.notified > 0 ? (
          <Text variant="caption" color={colors.textMuted}>{locCopy.notified(info.notified)}</Text>
        ) : (
          <Alert tone="info" action={<Button variant="ghost" onPress={onAddContacts}>{locCopy.addContacts}</Button>}>{`${locCopy.noContacts} ${locCopy.pendingContacts}`}</Alert>
        )
      ) : null}
      {info?.devLink ? <DevHint>{info.devLink}</DevHint> : null}
      {denied ? <Alert action={<Button variant="ghost" onPress={() => void openLocationSettings()}>{locCopy.openSettings}</Button>}>{locCopy.permissionDenied}</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}
      <Modal visible={explain} onClose={() => setExplain(false)} title={locCopy.permissionTitle}>
        <View style={{ gap: space.md }}>
          <Text variant="small" color={colors.text}>{locCopy.permissionBody}</Text>
          <Button onPress={() => void turnOn()}>{locCopy.permissionContinue}</Button>
        </View>
      </Modal>
    </Card>
  );
}

/**
 * "Are you OK?" check-in during a meeting. Shown when GET
 * /bookings/:id/safety-ping reports a pending ping (fetched when the screen
 * opens and whenever the app comes back to the foreground, so opening the app
 * from the push works) or when safety.ping arrives over realtime. "I need
 * help" answers the ping AND raises an SOS (the API does both), then opens SOS.
 */
export function PingPrompt({ bookingId, onHelp }: { bookingId: string; onHelp: () => void }) {
  const toast = useToast();
  const [prompt, dispatch] = useReducer(nextPingPrompt, PING_PROMPT_INITIAL);
  const [busy, setBusy] = useState<'ok' | 'help' | null>(null);
  const check = useCallback(() => {
    commsApi.pendingPing(bookingId).then((res) => dispatch({ type: 'fetched', res }), () => undefined);
  }, [bookingId]);
  useFocusEffect(check);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (s) => s === 'active' && check());
    return () => sub.remove();
  }, [check]);
  useRealtimeEvents((e) => {
    if (e.type === 'safety.ping' && e.payload.booking_id === bookingId) dispatch({ type: 'realtime', pingId: e.payload.ping_id });
  });
  if (!prompt.pingId) return null;
  const answer = async (ok: boolean) => {
    setBusy(ok ? 'ok' : 'help');
    try {
      await commsApi.answerPing(bookingId, ok);
      dispatch({ type: 'answered' });
      if (ok) toast(pingCopy.thanks);
      else onHelp();
    } catch (err) {
      toast(errorView(err).message, 'error');
      if (!ok) onHelp(); // never block the way to help
    } finally {
      setBusy(null);
    }
  };
  return (
    <Card>
      <Text variant="heading" color={colors.textStrong} accessibilityRole="header" accessibilityLiveRegion="assertive">{pingCopy.title}</Text>
      <Text variant="small" color={colors.textMuted}>{pingCopy.body}</Text>
      <View style={{ flexDirection: 'row', gap: space.sm }}>
        <Button onPress={() => void answer(true)} loading={busy === 'ok'} style={{ flex: 1 }}>{pingCopy.ok}</Button>
        <Button variant="danger" onPress={() => void answer(false)} loading={busy === 'help'} style={{ flex: 1 }}>{pingCopy.help}</Button>
      </View>
    </Card>
  );
}
