import { memo, useCallback, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BackBar } from '@/components/account/BackBar';
import { BlockDialog, ReportSheet } from '@/components/comms/ChatSheets';
import { PushPrompt } from '@/components/comms/PushPrompt';
import { IconButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Misc';
import { Sheet } from '@/components/ui/Sheet';
import { EmptyState, ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { LinkRow } from '@/components/companion/Bits';
import { chat as copy, chatList as listCopy } from '@/content/comms';
import { commsApi } from '@/lib/comms/api';
import { uploadChatImage } from '@/lib/comms/chatImage';
import { Outbox, mergeMessages, moderationView, newClientMessageId, type Pending } from '@/lib/comms/helpers';
import { usePollingFallback, useRealtimeEvents, useRealtimeStatus } from '@/lib/comms/realtime-context';
import type { ConversationMeta, Message } from '@/lib/comms/types';
import { errorView } from '@/lib/errors';
import { formatDateTimeIST, formatTimeIST } from '@/lib/time';
import { alpha, colors, fonts, radius, space, touchTarget } from '@/theme';

type Row = { kind: 'msg'; m: Message } | { kind: 'pending'; p: Pending };

/** Time of the newest message from the other person in a page. */
const latestIncoming = (items: Message[]) => items.filter((m) => m.from === 'OTHER').reduce<string | null>((a, m) => (a && a > m.created_at ? a : m.created_at), null);

/**
 * One booking chat (Feature 5, D14): newest at the bottom (inverted,
 * virtualised list), earlier pages on scroll, realtime with a 5 s polling
 * fallback, text and photo messages, moderation states, report (long-press a
 * message from the other person), block, and the closed state.
 * A failed send keeps its client message id, so a retry never duplicates.
 */
export default function Conversation() {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ id: string; name?: string }>();
  const id = params.id;
  const rt = useRealtimeStatus();
  const [meta, setMeta] = useState<ConversationMeta | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [older, setOlder] = useState<string | null>(null);
  const [state, setState] = useState<{ error: string | null; offline: boolean; loadingOlder: boolean }>({ error: null, offline: false, loadingOlder: false });
  const [text, setText] = useState('');
  const [sheet, setSheet] = useState<'menu' | 'block' | null>(null);
  const [reporting, setReporting] = useState<Message | null>(null);
  const [uploading, setUploading] = useState(false);
  const [outbox] = useState(() => new Outbox());
  const [pending, setPending] = useState<Pending[]>([]);
  const sync = () => setPending([...outbox.list()]);
  const focused = useRef(false);

  // Marks the chat read once per new incoming message (not on every poll).
  const readUpTo = useRef<string | null>(null);
  const markRead = useCallback(
    (latestIncoming: string | null | undefined) => {
      if (!id || !focused.current || !latestIncoming || (readUpTo.current && readUpTo.current >= latestIncoming)) return;
      readUpTo.current = latestIncoming;
      void commsApi.read(id).catch(() => {
        readUpTo.current = null;
      });
    },
    [id],
  );

  const firstPage = useRef(true);
  const loadLatest = useCallback(async (): Promise<string | null> => {
    if (!id) return null;
    try {
      const page = await commsApi.messages(id);
      setMeta(page.conversation);
      setMessages((cur) => mergeMessages(cur, page.items));
      // The cursor for earlier pages comes from the first load only; later polls just top up the newest page.
      if (firstPage.current) setOlder(page.next_before);
      firstPage.current = false;
      setState((s) => ({ ...s, error: null, offline: false }));
      return latestIncoming(page.items);
    } catch (err) {
      const v = errorView(err);
      setState((s) => ({ ...s, error: v.offline ? null : v.message, offline: v.offline }));
      return null;
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      void loadLatest().then(markRead);
      return () => {
        focused.current = false;
      };
    }, [loadLatest, markRead]),
  );


  useRealtimeEvents((e) => {
    if ((e.type === 'message.new' || e.type === 'message.updated') && e.payload.conversation_id === id) {
      setMessages((cur) => mergeMessages(cur, [e.payload.message]));
      if (e.type === 'message.new' && e.payload.message.from === 'OTHER') markRead(e.payload.message.created_at);
    } else if (e.type === 'read' && e.payload.conversation_id === id) {
      setMeta((m) => (m ? { ...m, other_read_at: e.payload.read_at } : m));
    } else if (e.type === 'booking.status' && meta && e.payload.booking_id === meta.booking_id) {
      void loadLatest();
    }
  });
  usePollingFallback(() => void loadLatest().then(markRead), 5000);

  const loadOlder = async () => {
    if (!id || !older || state.loadingOlder) return;
    setState((s) => ({ ...s, loadingOlder: true }));
    try {
      const page = await commsApi.messages(id, older);
      setMessages((cur) => mergeMessages(cur, page.items));
      setOlder(page.next_before);
    } catch {
      // the next scroll tries again
    } finally {
      setState((s) => ({ ...s, loadingOlder: false }));
    }
  };

  const deliver = async (p: Pending) => {
    sync();
    try {
      const res = await commsApi.send(id!, { body: p.body }, p.clientMessageId);
      outbox.done(p.localId);
      setMessages((cur) => mergeMessages(cur, [res.message]));
    } catch (err) {
      const v = errorView(err);
      outbox.fail(p.localId, v.message);
      if (v.code === 'CHAT_CLOSED' || v.code === 'CONVERSATION_BLOCKED') void loadLatest();
    }
    sync();
  };

  const send = () => {
    const body = text.trim();
    if (!body || !id) return;
    setText('');
    void deliver(outbox.add(body));
  };
  const retry = (p: Pending) => {
    const again = outbox.retry(p.localId); // same Idempotency-Key
    if (again) void deliver(again);
  };

  const sendPhoto = async () => {
    if (!id || uploading) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    const asset = res.canceled ? null : res.assets[0];
    if (!asset) return;
    setUploading(true);
    try {
      const assetId = await uploadChatImage(id, asset);
      const key = newClientMessageId();
      const sent = await commsApi.send(id, { asset_id: assetId }, key);
      setMessages((cur) => mergeMessages(cur, [sent.message]));
      toast(copy.photoHeld);
    } catch (err) {
      toast(errorView(err).message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const rows: Row[] = [...pending.map((p) => ({ kind: 'pending' as const, p })).reverse(), ...[...messages].reverse().map((m) => ({ kind: 'msg' as const, m }))];
  const lastMine = [...messages].reverse().find((m) => m.from === 'ME');
  const seen = !!(lastMine && meta?.other_read_at && meta.other_read_at >= lastMine.created_at);

  const header = (
    <View style={styles.header}>
      <View style={{ flex: 1, gap: space.xs }}>
        <BackBar />
        <Text variant="heading" color={colors.textStrong} numberOfLines={1} accessibilityRole="header">{meta?.other_party ?? params.name ?? listCopy.title}</Text>
        {meta?.can_send && meta.window_closes_at ? <Text variant="caption" color={colors.textSubtle}>{copy.closesAt(formatDateTimeIST(meta.window_closes_at))}</Text> : null}
      </View>
      <IconButton icon="ellipsis-horizontal" label={copy.more} onPress={() => setSheet('menu')} />
    </View>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.flex} behavior="padding">
        <View style={styles.inner}>
          {header}
          {state.offline ? <View style={styles.pad}><OfflineBanner onRetry={() => void loadLatest()} /></View> : rt === 'polling' ? <Text variant="caption" color={colors.textSubtle} style={styles.pad}>{listCopy.polling}</Text> : null}
          {!meta ? (
            <View style={styles.pad}>{state.error ? <ErrorState message={state.error} onRetry={() => void loadLatest()} /> : state.offline ? null : <SkeletonList rows={5} />}</View>
          ) : (
            <FlatList
              style={styles.flex}
              inverted
              data={rows}
              keyExtractor={(r) => (r.kind === 'msg' ? r.m.id : r.p.localId)}
              renderItem={({ item }) =>
                item.kind === 'msg' ? <Bubble m={item.m} onReport={setReporting} /> : <PendingBubble p={item.p} onRetry={retry} />
              }
              onEndReached={() => void loadOlder()}
              onEndReachedThreshold={0.3}
              ListHeaderComponent={seen ? <Text variant="caption" color={colors.textSubtle} style={styles.seen}>{copy.read}</Text> : undefined}
              ListEmptyComponent={<View style={styles.flip}><EmptyState icon="chatbubble-ellipses-outline" title={copy.emptyTitle} body={copy.emptyBody} /></View>}
              contentContainerStyle={styles.list}
              keyboardShouldPersistTaps="handled"
              maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            />
          )}
          {meta && !meta.can_send ? (
            <View style={styles.pad}>
              <Card>
                <Text weight="600" color={colors.textStrong}>{copy.closedTitle[meta.closed_reason ?? 'CLOSED']}</Text>
                <Text variant="small" color={colors.textMuted}>{copy.closedBody[meta.closed_reason ?? 'CLOSED']}</Text>
              </Card>
            </View>
          ) : meta ? (
            <View style={styles.composer}>
              <IconButton icon={uploading ? 'hourglass-outline' : 'image-outline'} label={uploading ? copy.photoUploading : copy.attach} onPress={() => void sendPhoto()} disabled={uploading} />
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder={copy.placeholder}
                placeholderTextColor={colors.textSubtle}
                style={styles.input}
                multiline
                maxLength={2000}
                accessibilityLabel={copy.placeholder}
              />
              <IconButton icon="send" label={copy.send} onPress={send} disabled={!text.trim()} />
            </View>
          ) : null}
        </View>
      </KeyboardAvoidingView>

      <Sheet visible={sheet === 'menu'} onClose={() => setSheet(null)} title={copy.more}>
        <View>
          {meta ? <LinkRow label={copy.booking} onPress={() => (setSheet(null), router.push({ pathname: '/booking/[id]', params: { id: meta.booking_id } }))} /> : null}
          <LinkRow label={copy.report} detail={copy.reportPick} onPress={() => setSheet(null)} />
          {meta?.closed_reason !== 'BLOCKED' ? <LinkRow label={copy.block} onPress={() => setSheet('block')} /> : null}
        </View>
      </Sheet>
      {id ? (
        <BlockDialog
          conversationId={id}
          visible={sheet === 'block'}
          onClose={() => setSheet(null)}
          onDone={() => {
            setSheet(null);
            toast(copy.blocked);
            void loadLatest();
          }}
        />
      ) : null}
      <ReportSheet
        message={reporting}
        onClose={() => setReporting(null)}
        onDone={(already) => {
          setReporting(null);
          toast(already ? copy.reportedAlready : copy.reported);
        }}
      />
      <PushPrompt />
    </SafeAreaView>
  );
}

const Bubble = memo(function Bubble({ m, onReport }: { m: Message; onReport: (m: Message) => void }) {
  if (m.from === 'SYSTEM' || m.type === 'SYSTEM') {
    return (
      <View style={styles.system} accessible accessibilityLabel={`${copy.system}: ${m.body ?? ''}`}>
        <Text variant="caption" color={colors.textMuted} style={{ textAlign: 'center' }}>{m.body}</Text>
      </View>
    );
  }
  const mine = m.from === 'ME';
  const mod = moderationView(m.moderation, mine, { masked: copy.masked, held: m.type === 'IMAGE' ? copy.photoHeld : copy.held, rejected: copy.rejected });
  const time = formatTimeIST(m.created_at);
  return (
    <Pressable
      onLongPress={mine ? undefined : () => onReport(m)}
      accessibilityRole={mine ? undefined : 'button'}
      accessibilityLabel={`${mine ? 'You' : ''} ${m.type === 'IMAGE' ? listCopy.photo : (m.body ?? '')}, ${time}${mod.label ? `, ${mod.label}` : ''}`}
      accessibilityHint={mine ? undefined : copy.messageHint}
      accessibilityActions={mine ? undefined : [{ name: 'longpress', label: copy.report }]}
      onAccessibilityAction={mine ? undefined : () => onReport(m)}
      style={[styles.bubbleRow, mine ? styles.right : styles.left]}
    >
      <View style={[styles.bubble, mine ? styles.mine : styles.theirs, m.moderation === 'REJECTED' && styles.rejected]}>
        {m.type === 'IMAGE' ? (
          m.image_url ? (
            <Image source={{ uri: m.image_url }} style={styles.image} contentFit="cover" accessibilityIgnoresInvertColors />
          ) : (
            <View style={[styles.image, styles.noImage]}>
              <Ionicons name="image-outline" size={28} color={colors.textSubtle} />
              <Text variant="caption" color={colors.textMuted}>{m.moderation === 'HELD' ? copy.photoHeld : copy.removed}</Text>
            </View>
          )
        ) : (
          <Text color={mine ? colors.onAccent : colors.textStrong}>{m.body}</Text>
        )}
        <Text variant="caption" color={mine ? alpha(colors.onAccent, 0.7) : colors.textSubtle} style={styles.time}>{time}</Text>
      </View>
      {mod.label ? <Text variant="caption" color={mod.tone === 'danger' ? colors.dangerText : colors.warningText} style={[styles.note, mine ? styles.noteRight : null]}>{mod.label}</Text> : null}
    </Pressable>
  );
});

function PendingBubble({ p, onRetry }: { p: Pending; onRetry: (p: Pending) => void }) {
  const failed = p.status === 'failed';
  return (
    <Pressable
      onPress={failed ? () => onRetry(p) : undefined}
      disabled={!failed}
      accessibilityRole={failed ? 'button' : undefined}
      accessibilityLabel={`${p.body}, ${failed ? copy.failed : copy.sending}`}
      accessibilityHint={failed ? copy.retryHint : undefined}
      style={[styles.bubbleRow, styles.right]}
    >
      <View style={[styles.bubble, styles.mine, { opacity: failed ? 1 : 0.7 }]}>
        <Text color={colors.onAccent}>{p.body}</Text>
      </View>
      <Text variant="caption" color={failed ? colors.dangerText : colors.textSubtle} style={[styles.note, styles.noteRight]}>{failed ? (p.error ? `${p.error} ${copy.failed}` : copy.failed) : copy.sending}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink950 },
  flex: { flex: 1 },
  inner: { flex: 1, width: '100%', maxWidth: 528, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'flex-end', gap: space.md, paddingHorizontal: space.xl, paddingTop: space.lg, paddingBottom: space.md, borderBottomWidth: 1, borderBottomColor: colors.divider },
  pad: { paddingHorizontal: space.xl, paddingVertical: space.sm },
  list: { paddingHorizontal: space.lg, paddingVertical: space.md, gap: space.sm, flexGrow: 1 },
  flip: { flex: 1, transform: [{ scaleY: -1 }] },
  seen: { alignSelf: 'flex-end', paddingRight: space.sm },
  system: { alignSelf: 'center', maxWidth: '85%', paddingVertical: space.xs },
  bubbleRow: { maxWidth: '82%', gap: 2 },
  left: { alignSelf: 'flex-start' },
  right: { alignSelf: 'flex-end' },
  bubble: { paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.lg, gap: 2 },
  mine: { backgroundColor: colors.accent, borderBottomRightRadius: radius.sm },
  theirs: { backgroundColor: colors.surfaceStrong, borderBottomLeftRadius: radius.sm },
  rejected: { opacity: 0.6 },
  time: { alignSelf: 'flex-end' },
  note: { paddingHorizontal: space.xs },
  noteRight: { textAlign: 'right' },
  image: { width: 200, height: 200, borderRadius: radius.md },
  noImage: { alignItems: 'center', justifyContent: 'center', gap: space.xs, backgroundColor: colors.surface, padding: space.md },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.sm, borderTopWidth: 1, borderTopColor: colors.divider },
  input: { flex: 1, minHeight: touchTarget, maxHeight: 140, paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.lg, backgroundColor: colors.surface, color: colors.textStrong, fontFamily: fonts.sans.regular, fontSize: 16 },
});
