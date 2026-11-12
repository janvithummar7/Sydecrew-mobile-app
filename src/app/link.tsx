import { useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { Screen } from '@/components/ui/Screen';
import { SkeletonList } from '@/components/ui/States';
import { useAuth } from '@/lib/auth';
import { pushRoute } from '@/lib/nav/pushLinks';
import { setPendingLink } from '@/lib/nav/pendingLink';
import { useRole } from '@/lib/role';
import { routeFor, shellFor } from '@/lib/routing';

/**
 * Landing route for universal / app links (src/app/+native-intent.tsx rewrites
 * https://sydecrew.com/<path> to /link?to=<path>). Replaces itself with the
 * screen for the user's shell (the push deep-link table), or home when the path
 * is unknown. Signed out: the path is kept and opened after sign-in.
 */
export default function UniversalLink() {
  const { to } = useLocalSearchParams<{ to?: string }>();
  const { status, user } = useAuth();
  const { preferred } = useRole();
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (done.current || status === 'loading') return;
    done.current = true;
    const path = typeof to === 'string' ? to : null;
    if (status !== 'authenticated' || !user) {
      setPendingLink(path);
      router.replace('/');
      return;
    }
    const target = user.is_staff ? '/staff' : ((path ? pushRoute(path, shellFor(user, preferred)) : null) ?? routeFor(user, preferred));
    router.replace(target as Href);
  }, [to, status, user, preferred, router]);

  return (
    <Screen>
      <SkeletonList rows={2} />
    </Screen>
  );
}
