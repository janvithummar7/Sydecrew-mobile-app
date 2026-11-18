import type { ReactElement, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type RefreshControlProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, space } from '@/theme';

type Props = {
  children: ReactNode;
  /** Pinned below the scroll area (e.g. the main button), above the keyboard. */
  footer?: ReactNode;
  /** Pinned above the scroll area. */
  header?: ReactNode;
  /** Pull-to-refresh (a <RefreshControl />). */
  refreshControl?: ReactElement<RefreshControlProps>;
};

/** Full-screen dark page that scrolls, respects notches and keeps inputs above the keyboard. */
export function Screen({ children, footer, header, refreshControl }: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {header}
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={refreshControl}
        >
          <View style={styles.inner}>{children}</View>
        </ScrollView>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * Full-screen page whose body is a virtualised list (FlatList) instead of a
 * ScrollView: lists must not be nested in a ScrollView. `header` stays above
 * the list; the list fills the rest and scrolls by itself.
 */
export function ListScreen({ header, children }: { header?: ReactNode; children: ReactNode }) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <View style={styles.listInner}>
        {header ? <View style={styles.listHeader}>{header}</View> : null}
        <View style={styles.flex}>{children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listInner: { flex: 1, width: '100%', maxWidth: 528, alignSelf: 'center' },
  listHeader: { gap: space.md, paddingHorizontal: space.xl, paddingTop: space.lg, paddingBottom: space.md },
  root: { flex: 1, backgroundColor: colors.ink950 },
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: space.xl, paddingTop: space.lg, paddingBottom: space.xxl },
  // Comfortable reading width on tablets and the web preview.
  inner: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center', gap: space.xl },
  footer: {
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    paddingBottom: space.lg,
    width: '100%',
    maxWidth: 528,
    alignSelf: 'center',
  },
});
