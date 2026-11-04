import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '@/theme';
import { Text } from './Text';

/** Same geometry as the web BrandSymbol: a lavender arc and a lime arc forming an S. */
export function BrandSymbol({ size = 28, strokeWidth = 7.5 }: { size?: number; strokeWidth?: number }) {
  return (
    // Decorative. aria-hidden goes on the wrapper: react-native-svg passes props straight to the DOM on web.
    <View aria-hidden>
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <Path d="M39.07 12.57A11 11 0 1 0 32 32" stroke={colors.lavender400} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Path d="M32 32A11 11 0 1 1 24.93 51.43" stroke={colors.lime400} strokeWidth={strokeWidth} strokeLinecap="round" />
      <Circle cx={32} cy={32} r={strokeWidth * 0.42} fill="#fff" />
    </Svg>
    </View>
  );
}

export function Logo() {
  return (
    <View style={styles.logo} accessible accessibilityLabel="Sydecrew">
      <BrandSymbol />
      <Text variant="small" weight="700" color={colors.fog50} style={styles.word}>
        SYDECREW
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  word: { letterSpacing: 3.5 },
});
