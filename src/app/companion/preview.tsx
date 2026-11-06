import { useCallback, useEffect, useState } from 'react';
import { StepHeader, LoadState } from '@/components/companion/Bits';
import { PublicProfileView } from '@/components/discovery/PublicProfileView';
import { Alert } from '@/components/ui/Feedback';
import { Screen } from '@/components/ui/Screen';
import { preview as copy } from '@/content/discovery';
import { companionApi } from '@/lib/companion/api';
import type { PublicProfile } from '@/lib/discovery/types';
import { errorView } from '@/lib/errors';

/**
 * "This is how customers see you": GET /companion/public-preview, the same
 * public profile customers get from Discover (approved photos, approved
 * categories, rates, boundaries, availability), rendered by the same view.
 * Read-only: no save, report or booking actions.
 */
export default function PublicProfilePreview() {
  const [data, setData] = useState<PublicProfile | null>(null);
  const [state, setState] = useState<{ loading: boolean; error: string | null; offline: boolean }>({ loading: true, error: null, offline: false });

  // State changes only after the request settles (the first render already shows loading).
  const load = useCallback(
    () =>
      companionApi.publicPreview().then(
        (p) => {
          setData(p);
          setState({ loading: false, error: null, offline: false });
        },
        (err) => {
          const v = errorView(err);
          setState({ loading: false, error: v.offline ? null : v.message, offline: v.offline });
        },
      ),
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);
  const retry = () => {
    setState({ loading: true, error: null, offline: false });
    void load();
  };

  return (
    <Screen>
      <StepHeader title={copy.title} subtitle={copy.subtitle} />
      {data ? (
        <>
          <Alert tone={data.status === 'LIVE' ? 'success' : 'info'}>{data.status === 'LIVE' ? copy.live : copy.notLive}</Alert>
          <PublicProfileView data={data} />
        </>
      ) : (
        <LoadState loading={state.loading} error={state.error} offline={state.offline} onRetry={retry} />
      )}
    </Screen>
  );
}
