import { useRef, useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Feedback';
import { EmptyState } from '@/components/ui/States';
import { waitlist as copy } from '@/content/discovery';
import { discoveryApi } from '@/lib/discovery/api';
import { errorView } from '@/lib/errors';
import { space } from '@/theme';

/**
 * Shown instead of results when the customer's city has no live pilot area
 * (`in_pilot: false`). Joining is idempotent (POST /discovery/waitlist).
 */
export function Waitlist({ city, cityId, zoneId, categoryId, joined: joinedAtLoad }: { city: string | null; cityId: string | null; zoneId: string | null; categoryId: string | null; joined: boolean }) {
  const [joined, setJoined] = useState(joinedAtLoad);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sending = useRef(false);

  const join = async () => {
    if (!cityId || sending.current) return;
    sending.current = true;
    setBusy(true);
    setError(null);
    try {
      await discoveryApi.joinWaitlist({ city_id: cityId, ...(zoneId ? { zone_id: zoneId } : {}), ...(categoryId ? { category_id: categoryId } : {}) });
      setJoined(true);
    } catch (err) {
      setError(errorView(err).message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  return (
    <View style={{ gap: space.md }} testID="discover-waitlist">
      <EmptyState
        icon="map-outline"
        title={joined ? copy.joined : copy.title}
        body={joined ? copy.joinedBody : copy.body(city)}
        action={joined ? null : cityId ? <Button onPress={join} loading={busy}>{copy.join}</Button> : null}
      />
      {!cityId && !joined ? <Alert tone="info">{copy.noCity}</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}
    </View>
  );
}
