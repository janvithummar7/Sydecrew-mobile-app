import { View } from 'react-native';
import { BackBar } from '@/components/account/BackBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PlaceholderNotice, SafetyCallout } from '@/components/ui/Misc';
import { Screen } from '@/components/ui/Screen';
import { Text, Title } from '@/components/ui/Text';
import { previews } from '@/content/customer';
import { SAMPLE_LABEL, sampleBooking as b } from '@/content/samples';
import { colors, space } from '@/theme';

const copy = previews.pay;

/** Review and pay (PLACEHOLDER, artboard "Review and pay"). The pay button is disabled; no payment API. */
export default function PayPreview() {
  return (
    <Screen footer={<Button disabled accessibilityHint={copy.disabled}>{`${copy.pay} · ${b.total}`}</Button>}>
      <BackBar />
      <Title>{copy.title}</Title>
      <PlaceholderNotice />
      <Card>
        <Text variant="caption" color={colors.warningText}>{SAMPLE_LABEL}</Text>
        <Text weight="600" color={colors.textStrong}>{b.occasion}</Text>
        <Text variant="small" color={colors.textMuted}>{b.when}</Text>
      </Card>
      <View style={{ gap: space.sm }}>
        <Text variant="eyebrow" color={colors.textSubtle}>{copy.breakdown}</Text>
        <Card>
          {b.lines.map((l) => (
            <View key={l.label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="small" color={colors.text}>{l.label}</Text>
              <Text variant="small" color={colors.text}>{l.amount}</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text weight="600" color={colors.textStrong}>{copy.total}</Text>
            <Text weight="600" color={colors.textStrong}>{b.total}</Text>
          </View>
        </Card>
      </View>
      <Card tone="ok">
        <Text weight="600" color={colors.textStrong}>{copy.protected}</Text>
        <Text variant="small" color={colors.textMuted}>{copy.protectedBody}</Text>
      </Card>
      <SafetyCallout compact />
    </Screen>
  );
}
