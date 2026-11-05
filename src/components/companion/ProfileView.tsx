import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Avatar } from '@/components/ui/Misc';
import { Text } from '@/components/ui/Text';
import { previews } from '@/content/customer';
import { colors, radius, space } from '@/theme';

export type ProfileViewData = {
  name: string;
  headline?: string | null;
  meta: string;
  photoUrl?: string | null;
  verified: boolean;
  intro?: string | null;
  offers: { activity: string; label: string }[];
  interests?: string[];
  boundaries: string[];
};

/**
 * The public companion profile, laid out like the "Companion profile" design
 * artboard: photo, name and verified badge, meta line, intro, offers,
 * interests, boundaries, reviews. Read-only; `actions` go at the bottom.
 */
export function ProfileView({ data, actions }: { data: ProfileViewData; actions?: ReactNode }) {
  return (
    <View style={{ gap: space.xl }}>
      {data.photoUrl ? (
        <Image source={{ uri: data.photoUrl }} style={styles.photo} contentFit="cover" accessibilityLabel={`Photo of ${data.name}`} />
      ) : (
        <View style={[styles.photo, styles.noPhoto]}>
          <Avatar name={data.name} size={96} />
        </View>
      )}
      <View style={{ gap: space.sm }}>
        <Text variant="display" color={colors.textStrong} accessibilityRole="header">{data.name}</Text>
        {data.verified ? <Badge kind="verified" label={previews.profile.verified} /> : null}
        <Text variant="small" color={colors.textMuted}>{data.meta}</Text>
        {data.headline ? <Text serif variant="heading" color={colors.brand}>{data.headline}</Text> : null}
      </View>
      {data.intro ? <Text color={colors.text}>{data.intro}</Text> : null}

      <Section title={previews.profile.offers}>
        {data.offers.map((o) => (
          <View key={o.activity} style={styles.offer}>
            <Text color={colors.textStrong} style={{ flex: 1 }}>{o.activity}</Text>
            <Text variant="small" color={colors.textMuted}>{o.label}</Text>
          </View>
        ))}
      </Section>
      {data.interests?.length ? (
        <Section title={previews.profile.interests}>
          <ChipRow>{data.interests.map((i) => <Chip key={i} label={i} selected={false} onPress={() => {}} disabled />)}</ChipRow>
        </Section>
      ) : null}
      <Section title={previews.profile.boundaries}>
        <Card>
          {data.boundaries.map((b) => <Text key={b} variant="small" color={colors.text}>{`• ${b}`}</Text>)}
        </Card>
      </Section>
      <Section title={previews.profile.reviews}>
        <Text variant="small" color={colors.textMuted}>{previews.profile.noReviews}</Text>
      </Section>
      {actions}
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: space.md }}>
      <Text variant="eyebrow" color={colors.textSubtle} accessibilityRole="header">{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  photo: { width: '100%', aspectRatio: 4 / 5, borderRadius: radius.xl, backgroundColor: colors.bgCard },
  noPhoto: { alignItems: 'center', justifyContent: 'center' },
  offer: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
});
