import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { colors } from '@/theme';

/** "‹ Back" control. Without onPress it goes back, or to the welcome screen if there is no history. */
export function BackBar({ onPress, label = 'Back' }: { onPress?: () => void; label?: string }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={onPress ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={12}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', opacity: pressed ? 0.6 : 1 })}
    >
      <Ionicons name="chevron-back" size={18} color={colors.fog400} />
      <Text variant="small" color={colors.fog400}>
        {label}
      </Text>
    </Pressable>
  );
}
