import { useState, type ReactNode } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { RatingLine } from '@/components/reviews/Stars';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Avatar, PriceTag } from '@/components/ui/Misc';
import { Text } from '@/components/ui/Text';
import { categoryNames } from '@/content/common';
import { profile as copy } from '@/content/discovery';
import { availabilityLabel, shortDay, verifiedSince } from '@/lib/discovery/list';
import type { AvailabilityDay, PublicProfile } from '@/lib/discovery/types';
import { colors, radius, space, alpha } from '@/theme';

const MAX_WIDTH = 480;

/**
 * The public companion profile (artboard "Companion profile"), the same for a
 * customer (GET /discovery/companions/:id) and for the companion's own preview
 * (GET /companion/public-preview): gallery, name, verified badge and "New on
 * Sydecrew" until the API gives a rating (never a made-up one), offers with
 * prices, interests, boundaries, coarse 14-day availability, cancellation
 * terms, meeting rule. `actions` render under the header (Save / Report);
 * `reviews` is the Reviews section's list (customers; the preview has none).
 */
export function PublicProfileView({ data, actions, reviews }: { data: PublicProfile; actions?: ReactNode; reviews?: ReactNode }) {
  const since = verifiedSince(data.verified_since);
  const meta = [data.zone?.name && data.city ? `${data.zone.name}, ${data.city}` : data.zone?.name ?? data.city, data.languages.join(', ')].filter(Boolean).join(' · ');
  const catName = (id: string) => {
    const c = data.categories.find((x) => x.id === id);
    return c ? categoryNames[c.code] ?? c.name : '';
  };
  const offersByCat = data.categories.map((c) => ({ id: c.id, name: categoryNames[c.code] ?? c.name, offers: data.offerings.filter((o) => o.category_id === c.id) })).filter((g) => g.offers.length);

  return (
    <View style={{ gap: space.xl }}>
      <Gallery name={data.display_name} photos={data.photos} />

      <View style={{ gap: space.sm }}>
        <Text variant="display" color={colors.textStrong} accessibilityRole="header">
          {data.display_name}
          {data.age !== null ? <Text variant="title" color={colors.textMuted}>{`  ${copy.age(data.age)}`}</Text> : null}
        </Text>
        <View style={styles.badges}>
          {data.verified ? <Badge kind="verified" label={copy.verified} /> : null}
          {!data.rating && data.new_on_sydecrew ? <Badge kind="info" label={copy.newOn} /> : null}
        </View>
        <RatingLine rating={data.rating} />
        {since ? <Text variant="caption" color={colors.textMuted}>{copy.verifiedSince(since)}</Text> : null}
        {meta ? <Text variant="small" color={colors.textMuted}>{meta}</Text> : null}
        {data.categories.length ? <Text serif variant="heading" color={colors.brand}>{data.categories.map((c) => categoryNames[c.code] ?? c.name).join(' · ')}</Text> : null}
      </View>
      {actions}

      {data.intro ? (
        <Section title={copy.about}>
          <Text color={colors.text}>{data.intro}</Text>
        </Section>
      ) : null}

      {offersByCat.length ? (
        <Section title={copy.offers}>
          {offersByCat.map((g) => (
            <View key={g.id} style={{ gap: space.xs }}>
              {offersByCat.length > 1 ? <Text variant="small" weight="600" color={colors.textStrong}>{g.name}</Text> : null}
              {g.offers.map((o) => (
                <View key={`${o.category_id}-${o.activity_id}`} style={styles.offer}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text color={colors.textStrong}>{o.activity}</Text>
                    <Text variant="caption" color={colors.textMuted}>{copy.minHours(o.min_hours)}</Text>
                  </View>
                  {o.hourly_rate_paise !== null ? <PriceTag paise={o.hourly_rate_paise} unit={copy.perHour} /> : <Text variant="small" color={colors.textMuted}>{copy.noRate}</Text>}
                </View>
              ))}
            </View>
          ))}
        </Section>
      ) : null}

      {data.interests.length ? (
        <Section title={copy.interests}>
          <View style={styles.badges}>{data.interests.map((i) => <Badge key={i} label={i} />)}</View>
        </Section>
      ) : null}

      {data.boundaries.length ? (
        <Section title={copy.boundaries}>
          <Card>
            {data.boundaries.map((b) => <Text key={b} variant="small" color={colors.text}>{`• ${b}`}</Text>)}
            <Text variant="caption" color={colors.textMuted}>{copy.boundariesNote}</Text>
          </Card>
        </Section>
      ) : null}

      {data.availability.length ? (
        <Section title={copy.availability}>
          <AvailabilityStrip days={data.availability} />
          <Text variant="caption" color={colors.textMuted}>{copy.availabilityNote}</Text>
        </Section>
      ) : null}

      {data.cancellation.length ? (
        <Section title={copy.cancellation}>
          {data.cancellation.map((c) => (
            <Card key={c.category_id}>
              {data.cancellation.length > 1 ? <Text variant="small" weight="600" color={colors.textStrong}>{catName(c.category_id)}</Text> : null}
              {c.lines.map((l) => <Text key={l} variant="small" color={colors.text}>{`• ${l}`}</Text>)}
              <Text variant="caption" color={colors.textMuted}>{`${copy.companionCancels}: ${c.companion_cancels}`}</Text>
            </Card>
          ))}
        </Section>
      ) : null}

      <Section title={copy.meeting}>
        <Text variant="small" color={colors.text}>{data.meeting_rule}</Text>
      </Section>

      <Section title={copy.reviews}>
        {data.rating ? <RatingLine rating={data.rating} size={16} /> : null}
        {reviews ?? (data.rating ? null : <Text variant="small" color={colors.textMuted}>{copy.noReviews}</Text>)}
      </Section>
    </View>
  );
}

function Gallery({ name, photos }: { name: string; photos: PublicProfile['photos'] }) {
  const { width } = useWindowDimensions();
  const w = Math.min(width, MAX_WIDTH) - 2 * space.xl;
  const [index, setIndex] = useState(0);
  const shown = photos.filter((p) => p.url || p.thumb_url);
  if (!shown.length) {
    return (
      <View style={[styles.photo, styles.noPhoto, { width: w, height: (w * 5) / 4 }]}>
        <Avatar name={name} size={96} />
      </View>
    );
  }
  return (
    <View style={{ gap: space.sm }}>
      <FlatList
        data={shown}
        keyExtractor={(p) => p.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_d, i) => ({ length: w, offset: w * i, index: i })}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / w))}
        renderItem={({ item, index: i }) => (
          <Image
            source={{ uri: item.url ?? item.thumb_url ?? undefined }}
            placeholder={item.thumb_url ? { uri: item.thumb_url } : undefined}
            placeholderContentFit="cover"
            style={[styles.photo, { width: w, height: (w * 5) / 4 }]}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={{ duration: 150, skipOnCacheHit: 'all' }}
            accessibilityLabel={copy.photoOf(name, i + 1, shown.length)}
          />
        )}
      />
      {shown.length > 1 ? (
        <View style={styles.dots} accessible accessibilityLabel={copy.photoOf(name, index + 1, shown.length)}>
          {shown.map((p, i) => <View key={p.id} style={[styles.dot, i === index && styles.dotOn]} />)}
        </View>
      ) : null}
    </View>
  );
}

const PARTS = ['morning', 'afternoon', 'evening'] as const;

/** 14 day columns with three dots each (morning, afternoon, evening); filled = some free time. */
function AvailabilityStrip({ days }: { days: AvailabilityDay[] }) {
  return (
    <View accessibilityRole="list">
      <FlatList
        data={days}
        keyExtractor={(d) => d.date}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: space.sm }}
        renderItem={({ item }) => {
          const d = shortDay(item.date);
          const any = PARTS.some((k) => item[k]);
          return (
            <View style={[styles.day, any && styles.dayOn]} accessible accessibilityLabel={availabilityLabel(item, copy.parts)}>
              <Text variant="caption" color={colors.textMuted}>{d.weekday}</Text>
              <Text variant="small" weight="600" color={any ? colors.textStrong : colors.textSubtle}>{d.day}</Text>
              <View style={{ gap: 3 }}>
                {PARTS.map((k) => <View key={k} style={[styles.part, item[k] && styles.partOn]} />)}
              </View>
            </View>
          );
        }}
      />
      <View style={styles.legend}>
        {PARTS.map((k, i) => <Text key={k} variant="caption" color={colors.textSubtle}>{`${i + 1}. ${copy.parts[k]}`}</Text>)}
      </View>
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
  photo: { borderRadius: radius.xl, backgroundColor: colors.bgCard },
  noPhoto: { alignItems: 'center', justifyContent: 'center' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  offer: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: radius.pill, backgroundColor: colors.surfaceStrong },
  dotOn: { backgroundColor: colors.brand, width: 16 },
  day: { width: 48, alignItems: 'center', gap: space.xs, paddingVertical: space.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  dayOn: { borderColor: alpha(colors.lime400, 0.35) },
  part: { width: 8, height: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceStrong },
  partOn: { backgroundColor: colors.accent },
  legend: { flexDirection: 'row', gap: space.md, marginTop: space.sm },
});
