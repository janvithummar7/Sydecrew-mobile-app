import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Avatar, PlaceholderNotice } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { discover as copy } from '@/content/customer';
import { SAMPLE_LABEL, sampleCompanions } from '@/content/samples';
import { colors, space } from '@/theme';

/** Discover (PLACEHOLDER, design artboard "Discover companions"): sample cards only, no search API. */
export default function Discover() {
  const router = useRouter();
  const [filter, setFilter] = useState<string | null>(null);
  const list = filter ? sampleCompanions.filter((c) => c.category === filter) : sampleCompanions;
  return (
    <Screen>
      <Title>{copy.title}</Title>
      <Text color={colors.textMuted}>{copy.subtitle}</Text>
      <PlaceholderNotice />
      <ChipRow>
        {copy.filters.map((f) => <Chip key={f} label={f} selected={filter === f} onPress={() => setFilter(filter === f ? null : f)} />)}
      </ChipRow>
      <Text variant="caption" color={colors.warningText}>{SAMPLE_LABEL}</Text>
      <View style={{ gap: space.md }}>
        {list.map((c) => (
          <Card key={c.id} onPress={() => router.push({ pathname: '/preview/companion/[id]', params: { id: c.id } })} accessibilityLabel={`${c.name}, ${c.category}, sample profile`}>
            <View style={styles.row}>
              <Avatar name={c.name} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text weight="600" color={colors.textStrong}>{c.name}</Text>
                <Text variant="caption" color={colors.textMuted}>{`${c.category} · ${c.headline}`}</Text>
              </View>
              <Badge kind="verified" label="Verified" />
            </View>
            <Text variant="small" color={colors.textMuted}>{`${c.area} · ${c.languages.join(', ')}`}</Text>
            <Text variant="small" color={colors.text}>{`${c.rateLabel} · ${c.mode}`}</Text>
          </Card>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', gap: space.md } });
