import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BackBar } from '@/components/account/BackBar';
import { Button } from '@/components/ui/Button';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { PriceTag } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text, Title } from '@/components/ui/Text';
import { details as copy } from '@/content/bookings';
import { bookingsApi } from '@/lib/bookings/api';
import { setDraft } from '@/lib/bookings/draft';
import { durationChoices, durationLabel, hhmmIST } from '@/lib/bookings/helpers';
import type { BookingForm, BookingOffering } from '@/lib/bookings/types';
import { nextDates } from '@/lib/discovery/filters';
import { errorView } from '@/lib/errors';
import { todayIST } from '@/lib/time';
import { colors, space } from '@/theme';

const dayLabel = (iso: string) => new Date(`${iso}T12:00:00+05:30`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });

/**
 * Booking details (artboard "Booking details"): occasion (activity), date,
 * length, a free start time from GET /bookings/slots, an approved public venue
 * and an optional note. "See the price" asks for a quote (immutable, 10 minutes).
 */
export default function BookingDetails() {
  const router = useRouter();
  const { companionId } = useLocalSearchParams<{ companionId: string }>();
  const [form, setForm] = useState<BookingForm | null>(null);
  const [load, setLoad] = useState<{ error: string | null; offline: boolean }>({ error: null, offline: false });
  const [offering, setOffering] = useState<BookingOffering | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);
  const [start, setStart] = useState<string | null>(null);
  const [venue, setVenue] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  // Free start times, keyed by the request they answer (occasion | date | length).
  const [times, setTimes] = useState<{ key: string | null; list: string[] }>({ key: null, list: [] });
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);

  const fetchForm = useCallback(() => {
    if (!companionId) return;
    bookingsApi.form(companionId).then(
      (f) => {
        setForm(f);
        setLoad({ error: null, offline: false });
        const first = f.offerings.find((o) => !o.closed_reason) ?? null;
        setOffering(first);
        setMinutes(first ? first.min_duration_minutes : null);
      },
      (err) => {
        const v = errorView(err);
        setLoad({ error: v.offline ? null : v.message, offline: v.offline });
      },
    );
  }, [companionId]);
  useEffect(fetchForm, [fetchForm]);

  const dates = useMemo(() => (form ? nextDates(todayIST(), Math.min(14, form.rules.max_advance_days)) : []), [form]);
  const venues = useMemo(() => (form && offering ? form.venues.filter((v) => v.categories.includes(offering.category.code)) : []), [form, offering]);

  const slotKey = companionId && offering && date && minutes ? `${offering.offering_id}|${date}|${minutes}` : null;
  useEffect(() => {
    if (!companionId || !offering || !date || !minutes || !slotKey) return;
    let live = true;
    bookingsApi.slots({ companion_id: companionId, offering_id: offering.offering_id, date, duration_minutes: minutes }).then(
      (s) => live && setTimes({ key: slotKey, list: s.start_times }),
      () => live && setTimes({ key: slotKey, list: [] }),
    );
    return () => {
      live = false;
    };
  }, [companionId, offering, date, minutes, slotKey]);
  const loadingTimes = slotKey !== null && times.key !== slotKey;
  const freeTimes = times.key === slotKey ? times.list : [];
  // A start time picked for another day or length no longer counts.
  const chosen = start && freeTimes.includes(start) ? start : null;

  const getQuote = async () => {
    if (sending.current || !companionId) return;
    if (!offering || !date || !minutes || !chosen || !venue) {
      setError(copy.pick);
      return;
    }
    sending.current = true;
    setBusy(true);
    setError(null);
    try {
      const quote = await bookingsApi.quote({ companion_id: companionId, offering_id: offering.offering_id, date, start_time: hhmmIST(chosen), duration_minutes: minutes, venue_id: venue });
      setDraft({ quote, notes: notes.trim(), companionId });
      router.push('/book/review');
    } catch (err) {
      const v = errorView(err);
      setError(v.message);
      if (v.code === 'SLOT_UNAVAILABLE' || v.code === 'OUTSIDE_AVAILABILITY' || v.code === 'TOO_SOON') setStart(null);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  if (!form) {
    return (
      <Screen>
        <BackBar />
        {load.offline ? <OfflineBanner onRetry={fetchForm} /> : load.error ? <ErrorState message={load.error} onRetry={fetchForm} /> : <SkeletonList rows={5} />}
      </Screen>
    );
  }

  return (
    <Screen footer={<Button onPress={getQuote} loading={busy} disabled={!offering}>{copy.continue}</Button>}>
      <BackBar />
      <Title>{`${copy.title} · ${form.companion.display_name}`}</Title>
      {error ? <Alert>{error}</Alert> : null}

      <Text variant="small" weight="600" color={colors.textStrong}>{copy.occasion}</Text>
      <ChipRow>
        {form.offerings.map((o) => (
          <Chip
            key={o.offering_id}
            radio
            label={`${o.activity.name} · ${o.category.name}`}
            note={o.closed_reason ? copy.plusOneClosed : undefined}
            disabled={!!o.closed_reason}
            selected={offering?.offering_id === o.offering_id}
            onPress={() => {
              setOffering(o);
              setMinutes(o.min_duration_minutes);
              setVenue(null);
            }}
          />
        ))}
      </ChipRow>
      {offering ? (
        <View style={{ gap: space.xs }}>
          <PriceTag paise={offering.hourly_rate_paise} unit="/ hour" />
          <Text variant="caption" color={colors.textMuted}>{offering.instant ? copy.instant : copy.request}</Text>
        </View>
      ) : null}

      <Text variant="small" weight="600" color={colors.textStrong}>{copy.date}</Text>
      <ChipRow>
        {dates.map((d) => (
          <Chip key={d} radio label={dayLabel(d)} selected={date === d} onPress={() => setDate(d)} />
        ))}
      </ChipRow>

      {offering ? (
        <>
          <Text variant="small" weight="600" color={colors.textStrong}>{copy.duration}</Text>
          <ChipRow>
            {durationChoices(offering.min_duration_minutes, offering.max_duration_minutes).map((m) => (
              <Chip key={m} radio label={durationLabel(m)} selected={minutes === m} onPress={() => setMinutes(m)} />
            ))}
          </ChipRow>
        </>
      ) : null}

      {date && offering ? (
        <>
          <Text variant="small" weight="600" color={colors.textStrong}>{copy.startTime}</Text>
          {loadingTimes ? (
            <View style={{ flexDirection: 'row', gap: space.sm, alignItems: 'center' }}>
              <ActivityIndicator color={colors.textMuted} />
              <Text variant="caption" color={colors.textMuted}>{copy.loadingTimes}</Text>
            </View>
          ) : freeTimes.length ? (
            <ChipRow>
              {freeTimes.map((t) => (
                <Chip key={t} radio label={timeLabel(t)} selected={chosen === t} onPress={() => setStart(t)} />
              ))}
            </ChipRow>
          ) : (
            <Text variant="small" color={colors.textMuted}>{copy.noTimes}</Text>
          )}
        </>
      ) : null}

      <Text variant="small" weight="600" color={colors.textStrong}>{copy.venue}</Text>
      <Text variant="caption" color={colors.textMuted}>{copy.venueHint}</Text>
      {venues.length ? (
        <ChipRow>
          {venues.map((v) => (
            <Chip key={v.id} radio label={v.name} note={v.pending_approval ? copy.venuePending : undefined} selected={venue === v.id} onPress={() => setVenue(v.id)} />
          ))}
        </ChipRow>
      ) : (
        <Text variant="small" color={colors.textMuted}>{copy.noVenues}</Text>
      )}

      <TextField label={copy.notes} hint={copy.notesHint} value={notes} onChangeText={setNotes} maxLength={500} multiline />
    </Screen>
  );
}
