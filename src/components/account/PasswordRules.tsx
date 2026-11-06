import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { passwordRules } from '@/lib/validation';
import { colors, alpha } from '@/theme';

/** Live checklist under a new-password field. */
export function PasswordRules({ value }: { value: string }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 4 }}>
      {passwordRules.map((rule) => {
        const ok = rule.test(value);
        return (
          <View
            key={rule.id}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            accessible
            accessibilityLabel={`${rule.label}: ${ok ? 'done' : 'missing'}`}
          >
            <Ionicons name="checkmark" size={14} color={ok ? colors.lime300 : alpha(colors.fog400, 0.4)} />
            <Text variant="caption" color={ok ? colors.lime300 : colors.fog400}>
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
