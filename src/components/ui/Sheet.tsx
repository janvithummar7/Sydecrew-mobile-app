import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal as RNModal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from 'react-native-reanimated';
import { colors, radius, space } from '@/theme';
import { IconButton } from './Button';
import { Text } from './Text';

/** Bottom sheet (Sheet) and centred dialog (Modal). Tapping the scrim or "Close" dismisses. */
export function Sheet({ visible, onClose, title, children, centered }: { visible: boolean; onClose: () => void; title: string; children: ReactNode; centered?: boolean }) {
  const insets = useSafeAreaInsets();
  const reduced = useReducedMotion();
  return (
    <RNModal visible={visible} transparent animationType={reduced ? 'none' : centered ? 'fade' : 'slide'} onRequestClose={onClose} statusBarTranslucent>
      {/* Inputs in a sheet (report notes, cancel reasons) stay above the keyboard on both platforms. */}
      <KeyboardAvoidingView behavior="padding" style={[styles.root, centered && styles.center]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
        <View style={[styles.panel, centered ? styles.dialog : { paddingBottom: insets.bottom + space.lg }]} accessibilityViewIsModal>
          <View style={styles.head}>
            <Text variant="heading" color={colors.textStrong} accessibilityRole="header" style={{ flex: 1 }}>{title}</Text>
            <IconButton icon="close" label="Close" onPress={onClose} />
          </View>
          {children}
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

export const Modal = (props: Omit<Parameters<typeof Sheet>[0], 'centered'>) => <Sheet {...props} centered />;

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.scrim },
  center: { justifyContent: 'center', padding: space.xl },
  panel: { maxHeight: '85%', gap: space.md, paddingHorizontal: space.xl, paddingTop: space.md, backgroundColor: colors.bgRaised, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, borderWidth: 1, borderColor: colors.border },
  dialog: { borderRadius: radius.xl, paddingBottom: space.xl },
  head: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
});
