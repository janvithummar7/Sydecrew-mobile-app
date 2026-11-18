import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackBar } from '@/components/account/BackBar';
import { PublicProfileView } from '@/components/discovery/PublicProfileView';
import { ReportSheet } from '@/components/discovery/ReportSheet';
import { ProfileReviews } from '@/components/reviews/ProfileReviews';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { EmptyState, ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { profile as copy } from '@/content/discovery';
import { discoveryApi } from '@/lib/discovery/api';
import type { PublicProfile } from '@/lib/discovery/types';
import { errorView } from '@/lib/errors';
import { colors, space } from '@/theme';

/**
 * A companion's public profile (Feature 3 §5, artboard "Companion profile"):
 * GET /discovery/companions/:id (also records "recently viewed"). Save /
 * unsave, report, "Request to book" (Feature 4: booking details) and, once
 * the companion has a public rating, their reviews (with Report). A
 * hidden, blocked, paused or removed companion answers 404 PROFILE_UNAVAILABLE:
 * the screen says "not available" (other errors get the shared message and retry).
 */
export default function CompanionProfileScreen() {
  const router = useRouter();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<PublicProfile | null>(null);
  const [state, setState] = useState<{ loading: boolean; error: string | null; offline: boolean; gone: boolean }>({ loading: true, error: null, offline: false, gone: false });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reporting, setReporting] = useState(false);
  const busy = useRef(false);

  const load = useCallback(() => {
    if (!id) return Promise.resolve();
    return discoveryApi.profile(id).then(
      (p) => {
        setData(p);
        setSaved(!!p.saved);
        setState({ loading: false, error: null, offline: false, gone: false });
      },
      (err) => {
        const v = errorView(err);
        const gone = v.code === 'PROFILE_UNAVAILABLE';
        setState({ loading: false, error: gone || v.offline ? null : v.message, offline: v.offline, gone });
      },
    );
  }, [id]);

  useEffect(() => {
    void load(); // the first render already shows loading; state changes after the request settles
  }, [load]);
  const retry = () => {
    setState((s) => ({ ...s, loading: true, error: null, offline: false }));
    void load();
  };

  const toggleSave = async () => {
    if (!id || busy.current) return;
    busy.current = true;
    const want = !saved;
    setSaved(want); // optimistic; reverted if the API says otherwise
    setSaving(true);
    try {
      const res = want ? await discoveryApi.save(id) : await discoveryApi.unsave(id);
      setSaved(res.saved);
      toast(res.saved ? copy.savedToast : copy.unsavedToast);
    } catch (err) {
      setSaved(!want);
      const v = errorView(err);
      if (v.code === 'PROFILE_UNAVAILABLE') {
        // Hidden or paused while open: show "not available" instead of a stale profile.
        setData(null);
        setState({ loading: false, error: null, offline: false, gone: true });
      } else toast(v.message, 'error');
    } finally {
      busy.current = false;
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <Screen>
        <BackBar label={copy.back} />
        {state.gone ? (
          <EmptyState icon="eye-off-outline" title={copy.notFoundTitle} body={copy.notFoundBody} action={<Button variant="secondary" onPress={() => router.replace('/discover')}>{copy.backToDiscover}</Button>} />
        ) : state.offline ? (
          <OfflineBanner onRetry={retry} />
        ) : state.error ? (
          <ErrorState message={state.error} onRetry={retry} />
        ) : (
          <SkeletonList rows={5} />
        )}
      </Screen>
    );
  }

  return (
    <Screen
      footer={
        <Button onPress={() => id && router.push({ pathname: '/book/[companionId]', params: { companionId: id } })} accessibilityHint={copy.requestHint}>
          {copy.request}
        </Button>
      }
    >
      <BackBar label={copy.back} />
      {state.offline ? <OfflineBanner onRetry={retry} /> : null}
      <PublicProfileView
        data={data}
        reviews={data.rating && id ? <ProfileReviews companionId={id} /> : undefined}
        actions={
          <View style={styles.actions}>
            <Button
              variant={saved ? 'primary' : 'secondary'}
              onPress={toggleSave}
              loading={saving}
              accessibilityHint={copy.saveHint}
              icon={<Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={saved ? colors.onAccent : colors.textStrong} />}
              style={{ flex: 1 }}
            >
              {saved ? copy.saved : copy.save}
            </Button>
            <Button variant="ghost" onPress={() => setReporting(true)} accessibilityLabel={copy.reportLabel} icon={<Ionicons name="flag-outline" size={18} color={colors.textStrong} />} style={{ flex: 1 }}>
              {copy.report}
            </Button>
          </View>
        }
      />
      {id ? <ReportSheet visible={reporting} onClose={() => setReporting(false)} companionId={id} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({ actions: { flexDirection: 'row', gap: space.sm } });
