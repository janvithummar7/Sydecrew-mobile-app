import { StepHeader, LoadState } from '@/components/companion/Bits';
import { ProfileView } from '@/components/companion/ProfileView';
import { Alert } from '@/components/ui/Feedback';
import { Screen } from '@/components/ui/Screen';
import { useCompanion } from '@/lib/companion/context';
import { categoryNames } from '@/content/common';

/**
 * "This is how customers will see you": a read-only preview of the public
 * profile built from the companion's own data (there is no public discovery
 * yet). Only approved photos and approved categories are shown, as customers would see them.
 */
export default function PublicProfilePreview() {
  const { companion, options, loading, error, refresh } = useCompanion();
  if (!companion) {
    return (
      <Screen>
        <StepHeader title="Your public profile" />
        <LoadState loading={loading} error={error} onRetry={refresh} />
      </Screen>
    );
  }
  const photo = companion.photos.find((p) => p.is_primary && p.moderation_status === 'APPROVED') ?? companion.photos.find((p) => p.is_primary);
  const zone = options?.cities.flatMap((c) => c.zones.map((z) => ({ ...z, city: c.name }))).find((z) => z.id === companion.zone_id);
  const cats = companion.categories.filter((c) => c.status === 'APPROVED' || c.status === 'PENDING');
  return (
    <Screen>
      <StepHeader title="Your public profile" subtitle="This is how customers will see you once discovery opens." />
      {companion.status !== 'LIVE' ? <Alert tone="info">You are not live yet, so customers cannot see this profile.</Alert> : null}
      <ProfileView
        data={{
          name: companion.display_name,
          headline: cats.map((c) => categoryNames[c.code] ?? c.name).join(' · ') || null,
          meta: [zone ? `${zone.name}, ${zone.city}` : null, companion.languages.map((l) => l.name).join(', ') || null].filter(Boolean).join(' · '),
          photoUrl: photo?.url ?? null,
          verified: ['APPROVED', 'SETUP', 'LIVE', 'PAUSED'].includes(companion.status),
          intro: companion.intro,
          offers: companion.activities.map((a) => ({ activity: a.name, label: categoryNames[companion.categories.find((c) => c.category_id === a.category_id)?.code ?? ''] ?? '' })),
          boundaries: companion.boundaries.filter((b) => b.moderation_status !== 'REJECTED').map((b) => b.text),
        }}
      />
    </Screen>
  );
}
