import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { colors, fontFor, type as t } from '@/theme';

type Variant = keyof typeof t;

type Props = TextProps & {
  variant?: Variant;
  color?: string;
  weight?: TextStyle['fontWeight'];
  /** Instrument Serif italic: the brand's display accent ("Your way."). */
  serif?: boolean;
};

/** Text with the app's type scale and brand fonts (Geist; Instrument Serif accent). */
export function Text({ variant = 'body', color = colors.text, weight, serif, style, ...rest }: Props) {
  const base = t[variant] as TextStyle;
  const family = serif ? fontFor(undefined, true) : weight ? fontFor(String(weight)) : base.fontFamily;
  // Custom fonts carry their weight in the family; a fontWeight on top would fake-bold on Android.
  return <RNText {...rest} style={[base, { color, fontFamily: family, fontWeight: undefined, fontStyle: serif ? 'italic' : undefined }, style]} />;
}

export function Title({ children, ...rest }: Omit<Props, 'variant'>) {
  return (
    <Text variant="title" color={colors.textStrong} accessibilityRole="header" {...rest}>
      {children}
    </Text>
  );
}
