import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Misc';
import { Text } from '@/components/ui/Text';
import { discover as copy } from '@/content/discovery';
import { categoryNames } from '@/content/common';
import { CARD_HEIGHT, fromPrice, nextFree, sameRowProps } from '@/lib/discovery/list';
import { ratingView } from '@/lib/reviews/helpers';
import type { DiscoveryCard } from '@/lib/discovery/types';
import { colors, radius, space } from '@/theme';

const PHOTO = CARD_HEIGHT - 2 * space.md;

type Props = { card: DiscoveryCard; onOpen: (id: string) => void };

/**
 * One Discover result, exactly CARD_HEIGHT tall (every text is one line), so the
 * list uses getItemLayout and never measures rows. Memoised on the fields it
 * shows (sameRowProps): a refetched but unchanged card does not re-render.
 * A rating shows only when the API gives one (from the public threshold of
 * reviews); otherwise "New on Sydecrew", never made-up stars.
 */
function CompanionCardBase({ card, onOpen }: Props) {
  const price = fromPrice(card.from_paise);
  const free = nextFree(card.next_available_at);
  const rating = ratingView(card.rating);
  const cats = card.categories.map((c) => categoryNames[c.code] ?? c.name).join(' · ');
  const meta = [card.zone?.name, card.languages.join(', ')].filter(Boolean).join(' · ');
  const label = [
    card.display_name,
    card.verified ? copy.card.verified : null,
    rating.kind === 'rated' ? rating.label : card.new_on_sydecrew ? copy.card.newOn : null,
    cats,
    meta,
    price ? `${copy.card.from} ${price} ${copy.card.perHour}` : null,
    free ? `${copy.card.nextFree} ${free.today ? `${copy.card.today}, ` : ''}${free.text}` : null,
  ].filter(Boolean).join(', ');

  return (
    <Pressable
      onPress={() => onOpen(card.id)}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={copy.card.open(card.display_name)}
      testID={`companion-card-${card.id}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {card.photo_url ? (
        <Image
          source={{ uri: card.photo_url }}
          style={styles.photo}
          contentFit="cover"
          cachePolicy="memory-disk"
          recyclingKey={card.id}
          transition={{ duration: 150, skipOnCacheHit: 'all' }}
          accessible={false}
        />
      ) : (
        <View style={[styles.photo, styles.noPhoto]}>
          <Avatar name={card.display_name} size={56} />
        </View>
      )}
      <View style={styles.body}>
        <Text weight="600" color={colors.textStrong} numberOfLines={1}>{card.display_name}</Text>
        <View style={styles.badges}>
          {card.verified ? <Badge kind="verified" label={copy.card.verified} /> : null}
          {rating.kind === 'rated' ? (
            <View style={styles.rating} testID={`companion-rating-${card.id}`}>
              <Ionicons name="star" size={12} color={colors.accent} />
              <Text variant="caption" weight="600" color={colors.textStrong} numberOfLines={1}>{rating.averageText}</Text>
              <Text variant="caption" color={colors.textMuted} numberOfLines={1}>{`(${rating.count})`}</Text>
            </View>
          ) : card.new_on_sydecrew ? (
            <Badge kind="info" label={copy.card.newOn} />
          ) : null}
        </View>
        <Text variant="caption" color={colors.textMuted} numberOfLines={1}>{cats}</Text>
        <Text variant="caption" color={colors.textMuted} numberOfLines={1}>{meta}</Text>
        <View style={styles.foot}>
          <Text variant="small" color={colors.textStrong} numberOfLines={1} style={{ flexShrink: 1 }}>
            {price ? `${copy.card.from} ${price}` : copy.card.noRate}
            {price ? <Text variant="caption" color={colors.textMuted}>{` ${copy.card.perHour}`}</Text> : null}
          </Text>
          {free ? (
            <Text variant="caption" color={free.today ? colors.lime300 : colors.textMuted} numberOfLines={1} style={{ flexShrink: 1 }}>
              {free.today ? `${copy.card.today}, ${free.text}` : free.text}
            </Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export const CompanionCard = memo(CompanionCardBase, sameRowProps);

const styles = StyleSheet.create({
  card: {
    height: CARD_HEIGHT,
    flexDirection: 'row',
    gap: space.md,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.85 },
  photo: { width: PHOTO * 0.8, height: PHOTO, borderRadius: radius.md, backgroundColor: colors.bgCard },
  noPhoto: { alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, gap: 2, justifyContent: 'center' },
  badges: { flexDirection: 'row', alignItems: 'center', gap: space.xs, overflow: 'hidden' },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  foot: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: space.sm, marginTop: 2 },
});
