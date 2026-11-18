import { useRef, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { OptionCard } from '@/components/ui/Chip';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Misc';
import { Sheet } from '@/components/ui/Sheet';
import { ErrorState, OfflineBanner, SkeletonList } from '@/components/ui/States';
import { Text } from '@/components/ui/Text';
import { reviewList as copy, reviewReport as reportCopy, tagLabels } from '@/content/reviews';
import { ReviewReportReasonValues, type ReviewReportReason } from '@/lib/contract/enums';
import { errorView } from '@/lib/errors';
import { monthLabel } from '@/lib/reviews/helpers';
import { reviewsApi } from '@/lib/reviews/api';
import type { ReviewItem } from '@/lib/reviews/types';
import { colors, space } from '@/theme';
import { Stars } from './Stars';

/** One released review: stars, tags, comment, "Priya · Coffee · Nov 2026", and Report. */
export function ReviewCard({ item, reported, onReport }: { item: ReviewItem; reported: boolean; onReport: () => void }) {
  const byline = copy.byline(item.reviewer, item.activity, monthLabel(item.month));
  return (
    <Card>
      <View style={styles.head}>
        <Stars value={item.rating} />
        {reported ? (
          <Text variant="caption" color={colors.textMuted}>{copy.reported}</Text>
        ) : (
          <Button variant="ghost" onPress={onReport} accessibilityLabel={copy.reportLabel(item.reviewer)} icon={<Ionicons name="flag-outline" size={16} color={colors.textStrong} />}>
            {copy.report}
          </Button>
        )}
      </View>
      {item.tags.length ? <View style={styles.tags}>{item.tags.map((t) => <Badge key={t} label={tagLabels[t] ?? t} />)}</View> : null}
      {item.comment ? <Text color={colors.text}>{item.comment}</Text> : null}
      <Text variant="caption" color={colors.textMuted}>{byline}</Text>
    </Card>
  );
}

/**
 * A review list with "Show more" paging and Report (the sheet below). Used on
 * a companion's public profile and on the companion's own Reviews screen.
 */
export function ReviewFeed({ items, loading, more, hasMore, error, offline, onMore, onRetry, empty }: {
  items: ReviewItem[];
  loading: boolean;
  more: boolean;
  hasMore: boolean;
  error: string | null;
  offline: boolean;
  onMore: () => void;
  onRetry: () => void;
  empty?: ReactNode;
}) {
  const [reporting, setReporting] = useState<string | null>(null);
  const [reported, setReported] = useState<Set<string>>(() => new Set());
  if (loading && !items.length) return <SkeletonList rows={2} />;
  if (!items.length && (error || offline)) return offline ? <OfflineBanner onRetry={onRetry} /> : <ErrorState message={error ?? ''} onRetry={onRetry} />;
  if (!items.length) return <>{empty ?? null}</>;
  return (
    <View style={{ gap: space.sm }}>
      {items.map((it) => <ReviewCard key={it.id} item={it} reported={reported.has(it.id)} onReport={() => setReporting(it.id)} />)}
      {error ? <Alert>{error}</Alert> : null}
      {offline ? <OfflineBanner onRetry={onMore} /> : null}
      {hasMore ? <Button variant="secondary" onPress={onMore} loading={more} accessibilityLabel={more ? copy.loadingMore : copy.showMore}>{copy.showMore}</Button> : null}
      <ReviewReportSheet
        reviewId={reporting}
        onClose={() => setReporting(null)}
        onReported={(id) => setReported((s) => new Set(s).add(id))}
      />
    </View>
  );
}

/**
 * "Report this review" (POST /reviews/:id/report): a reason, an optional note,
 * then a confirmation. A repeat report is accepted and says so.
 */
export function ReviewReportSheet({ reviewId, onClose, onReported }: { reviewId: string | null; onClose: () => void; onReported: (id: string) => void }) {
  const toast = useToast();
  const visible = reviewId !== null;
  const [reason, setReason] = useState<ReviewReportReason | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [noteError, setNoteError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);

  // A fresh form each time the sheet opens (state reset during render, not in an effect).
  const [wasOpenFor, setWasOpenFor] = useState(reviewId);
  if (reviewId !== wasOpenFor) {
    setWasOpenFor(reviewId);
    if (reviewId) {
      setReason(null);
      setNote('');
      setError(null);
      setNoteError(undefined);
    }
  }

  const send = async () => {
    if (!reviewId || !reason || sending.current) return;
    sending.current = true;
    setBusy(true);
    setError(null);
    try {
      const res = await reviewsApi.report(reviewId, { reason_code: reason, ...(note.trim() ? { note: note.trim() } : {}) });
      toast(res.already_reported ? reportCopy.already : reportCopy.thanks);
      onReported(reviewId);
      onClose();
    } catch (err) {
      const v = errorView(err);
      if (v.fields.note) setNoteError(v.fields.note);
      setError(v.message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={reportCopy.title}>
      <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled" testID="review-report-sheet">
        <Text variant="small" color={colors.textMuted}>{reportCopy.intro}</Text>
        {error ? <Alert>{error}</Alert> : null}
        <View style={{ gap: space.sm }} accessibilityRole="radiogroup" accessibilityLabel={reportCopy.reason}>
          <Text variant="eyebrow" color={colors.textSubtle} accessibilityRole="header">{reportCopy.reason}</Text>
          {ReviewReportReasonValues.map((r) => <OptionCard key={r} title={reportCopy.reasons[r]} selected={reason === r} onPress={() => setReason(r)} />)}
        </View>
        <TextField label={reportCopy.note} value={note} onChangeText={(t) => { setNote(t); setNoteError(undefined); }} multiline numberOfLines={3} maxLength={1000} error={noteError} textAlignVertical="top" />
      </ScrollView>
      <Button variant="danger" onPress={send} loading={busy} disabled={!reason}>{reportCopy.submit}</Button>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
  body: { gap: space.lg, paddingBottom: space.md },
});
