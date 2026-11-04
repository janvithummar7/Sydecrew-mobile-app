import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { colors, type as t } from '@/theme';

type Variant = keyof typeof t;

type Props = TextProps & { variant?: Variant; color?: string; weight?: TextStyle['fontWeight'] };

/** Text with the app's type scale. Defaults to body copy in fog white. */
export function Text({ variant = 'body', color = colors.fog100, weight, style, ...rest }: Props) {
  return <RNText {...rest} style={[t[variant] as TextStyle, { color }, weight ? { fontWeight: weight } : null, style]} />;
}

export function Title({ children, ...rest }: Omit<Props, 'variant'>) {
  return (
    <Text variant="title" color={colors.fog50} accessibilityRole="header" {...rest}>
      {children}
    </Text>
  );
}
