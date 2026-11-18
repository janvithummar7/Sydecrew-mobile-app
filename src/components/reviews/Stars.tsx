import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { stars as copy } from '@/content/reviews';
import { ratingView, starButtons, starFills } from '@/lib/reviews/helpers';
import type { Rating } from '@/lib/reviews/types';
import { colors, space, touchTarget } from '@/theme';

const ICON = { full: 'star', half: 'star-half', empty: 'star-outline' } as const;

/**
 * Star picker: five buttons ("1 star" … "5 stars"), each announcing whether it
 * is the chosen value. Each star is a full 44 pt touch target.
 */
export function StarPicker({ value, onChange, label, disabled }: { value: number | null; onChange: (n: number) => void; label: string; disabled?: boolean }) {
  return (
    <View style={styles.picker} accessibilityLabel={label} testID="star-picker">
      {starButtons(value).map((s) => (
        <Pressable
          key={s.value}
          onPress={() => onChange(s.value)}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={s.label}
          accessibilityState={{ selected: s.selected, disabled: !!disabled }}
          testID={`star-${s.value}`}
          hitSlop={4}
          style={({ pressed }) => [styles.pick, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name={s.filled ? 'star' : 'star-outline'} size={32} color={s.filled ? colors.accent : colors.textSubtle} />
        </Pressable>
      ))}
    </View>
  );
}

/** Read-only stars for a rating (rounded to the nearest half). Spoken as "Rated 4.7 out of 5". */
export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <View style={styles.row} accessible accessibilityLabel={copy.rated(value.toFixed(1))}>
      {starFills(value).map((f, i) => (
        <Ionicons key={i} name={ICON[f]} size={size} color={f === 'empty' ? colors.textSubtle : colors.accent} />
      ))}
    </View>
  );
}

/** Stars plus "4.7 · 12 reviews" when the API gives a rating; nothing otherwise (the caller shows "New on Sydecrew"). */
export function RatingLine({ rating, size = 14 }: { rating: Rating | null | undefined; size?: number }) {
  const v = ratingView(rating);
  if (v.kind !== 'rated') return null;
  return (
    <View style={styles.line} accessible accessibilityLabel={v.label}>
      <Stars value={v.average} size={size} />
      <Text variant="small" weight="600" color={colors.textStrong}>{v.averageText}</Text>
      <Text variant="small" color={colors.textMuted}>{`· ${copy.reviews(v.count)}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  picker: { flexDirection: 'row', gap: space.xs },
  pick: { width: touchTarget, height: touchTarget, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  line: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
});
