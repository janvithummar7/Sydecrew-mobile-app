import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '@/theme';
import { brand } from '@/content/common';
import { Text } from './Text';

/** Same geometry as the web BrandSymbol: a lavender arc and a lime arc forming an S. */
export function BrandSymbol({ size = 28, strokeWidth = 7.5 }: { size?: number; strokeWidth?: number }) {
  return (
    // Decorative. aria-hidden goes on the wrapper: react-native-svg passes props straight to the DOM on web.
    <View aria-hidden>
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M39.07 12.57A11 11 0 1 0 32 32" stroke={colors.lavender400} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M32 32A11 11 0 1 1 24.93 51.43" stroke={colors.lime400} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx={32} cy={32} r={strokeWidth * 0.42} fill={colors.white} />
    </Svg>
    </View>
  );
}

/** The lowercase "sydecrew" wordmark (same as web). */
export function Wordmark({ size = 20 }: { size?: number }) {
  return (
    <Text weight="600" color={colors.textStrong} style={{ fontSize: size, lineHeight: Math.round(size * 1.2), letterSpacing: -0.02 * size }}>
      {brand.name}
    </Text>
  );
}

/** Symbol + wordmark lockup. One accessible element read as "Sydecrew". */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <View style={styles.logo} accessible accessibilityRole="image" accessibilityLabel={brand.legalName}>
      <BrandSymbol size={size} />
      <Wordmark size={Math.round(size * 0.72)} />
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
