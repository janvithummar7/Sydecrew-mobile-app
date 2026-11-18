import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge, type BadgeKind } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip, ChipRow } from '@/components/ui/Chip';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Misc';
import { Text } from '@/components/ui/Text';
import { bookingReview as copy, tagLabels } from '@/content/reviews';
import type { Booking } from '@/lib/bookings/types';
import { errorView } from '@/lib/errors';
import { reviewsApi } from '@/lib/reviews/api';
import { COMMENT_MAX, MAX_TAGS, draftErrors, emptyDraft, myReviewState, reviewBody, reviewSection, tagDisabled, toggleTag, type MyReviewState, type ReviewDraft } from '@/lib/reviews/helpers';
import type { MyReview, TheirReview } from '@/lib/reviews/types';
import { formatDateTimeIST } from '@/lib/time';
import { colors, space } from '@/theme';
import { StarPicker, Stars } from './Stars';

/** Codes after which the form no longer applies: reload the booking to show the current state. */
const STALE = new Set(['REVIEW_EXISTS', 'REVIEW_WINDOW_CLOSED', 'REVIEW_NOT_AVAILABLE']);

const STATE_BADGE: Record<MyReviewState, BadgeKind> = { visible: 'verified', waiting: 'pending', checking: 'needs-changes', hidden: 'neutral' };

/**
 * The review on a completed booking (customer and companion). With
 * `actions.can_review`: stars, tags (up to 5, only those the API offers this
 * viewer), an optional comment, send once. Afterwards the viewer's review and
 * its state; a companion also sees the customer's review once it is released.
 */
export function BookingReviewSection({ booking, onDone, onStale }: { booking: Booking; onDone: (b: Booking) => void; onStale: () => void }) {
  const s = reviewSection(booking);
  if (!s.show) return null;
  const other = booking.viewer === 'CUSTOMER' ? booking.companion.display_name : booking.customer.first_name;
  const deadline = booking.review.window_ends_at ? formatDateTimeIST(booking.review.window_ends_at) : null;
  return (
    <View style={{ gap: space.sm }} testID="booking-review">
      <Text variant="eyebrow" color={colors.textSubtle} accessibilityRole="header">{copy.title}</Text>
      {s.form ? <ReviewForm booking={booking} other={other} deadline={deadline} onDone={onDone} onStale={onStale} /> : null}
      {s.mine ? <MineCard mine={s.mine} viewer={booking.viewer} other={other} deadline={deadline} /> : null}
      {s.theirs ? <TheirsCard theirs={s.theirs} other={other} /> : null}
    </View>
  );
}

function ReviewForm({ booking, other, deadline, onDone, onStale }: { booking: Booking; other: string; deadline: string | null; onDone: (b: Booking) => void; onStale: () => void }) {
  const toast = useToast();
  const allowed = booking.review.tags;
  const [draft, setDraft] = useState<ReviewDraft>(emptyDraft);
  const [shown, setShown] = useState(false); // show field errors only after the first send attempt
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);

  const errs = draftErrors(draft, allowed);
  const ratingError = shown && errs.rating ? copy.ratingNeeded : fields.rating;
  const commentError = errs.comment ? copy.commentTooLong(COMMENT_MAX) : fields.comment;

  const send = async () => {
    setShown(true);
    if (Object.keys(errs).length || sending.current) return;
    sending.current = true;
    setBusy(true);
    setError(null);
    setFields({});
    try {
      const b = await reviewsApi.submit(booking.id, reviewBody(draft));
      toast(copy.sent);
      onDone(b);
    } catch (err) {
      const v = errorView(err);
      if (v.code && STALE.has(v.code)) {
        toast(v.message, 'error');
        onStale();
        return;
      }
      setFields(v.fields);
      setError(v.message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  };

  return (
    <Card>
      <Text variant="small" color={colors.text}>{booking.viewer === 'CUSTOMER' ? copy.customerIntro(other) : copy.companionIntro(other)}</Text>
      {deadline ? <Text variant="caption" color={colors.textMuted}>{copy.deadline(deadline)}</Text> : null}
      {error ? <Alert>{error}</Alert> : null}
      <View style={{ gap: space.xs }}>
        <Text variant="small" weight="600" color={colors.fog100}>{copy.rating}</Text>
        <StarPicker value={draft.rating} onChange={(rating) => setDraft((d) => ({ ...d, rating }))} label={copy.rating} disabled={busy} />
        {ratingError ? <Text variant="caption" color={colors.red300} accessibilityRole="alert" accessibilityLiveRegion="polite">{ratingError}</Text> : null}
      </View>
      {allowed.length ? (
        <View style={{ gap: space.sm }} accessibilityLabel={copy.tags(MAX_TAGS)}>
          <Text variant="small" weight="600" color={colors.fog100}>{copy.tags(MAX_TAGS)}</Text>
          <ChipRow>
            {allowed.map((t) => (
              <Chip
                key={t}
                label={tagLabels[t] ?? t}
                selected={draft.tags.includes(t)}
                disabled={busy || tagDisabled(draft.tags, t)}
                onPress={() => setDraft((d) => ({ ...d, tags: toggleTag(d.tags, t, allowed) }))}
              />
            ))}
          </ChipRow>
          {draft.tags.length >= MAX_TAGS ? <Text variant="caption" color={colors.textMuted}>{copy.tagsFull(MAX_TAGS)}</Text> : null}
          {fields.tags ? <Text variant="caption" color={colors.red300} accessibilityRole="alert">{fields.tags}</Text> : null}
        </View>
      ) : null}
      <TextField
        label={copy.comment}
        value={draft.comment}
        onChangeText={(comment) => setDraft((d) => ({ ...d, comment }))}
        multiline
        numberOfLines={4}
        maxLength={COMMENT_MAX}
        textAlignVertical="top"
        hint={`${copy.commentHint} ${draft.comment.length}/${COMMENT_MAX}`}
        error={commentError}
        editable={!busy}
      />
      <Button onPress={send} loading={busy}>{copy.submit}</Button>
    </Card>
  );
}

function ReviewBody({ rating, tags, comment }: { rating: number; tags: MyReview['tags']; comment: string | null }) {
  return (
    <>
      <Stars value={rating} size={16} />
      {tags.length ? <View style={styles.tags}>{tags.map((t) => <Badge key={t} label={tagLabels[t] ?? t} />)}</View> : null}
      {comment ? <Text color={colors.text}>{comment}</Text> : null}
    </>
  );
}

function MineCard({ mine, viewer, other, deadline }: { mine: MyReview; viewer: Booking['viewer']; other: string; deadline: string | null }) {
  const st = myReviewState(mine);
  const body =
    st === 'visible'
      ? viewer === 'CUSTOMER'
        ? copy.stateBody.visibleCustomer(other)
        : copy.stateBody.visibleCompanion(other)
      : st === 'waiting'
        ? copy.stateBody.waiting(other, deadline)
        : copy.stateBody[st];
  return (
    <Card>
      <View style={styles.head}>
        <Text weight="600" color={colors.textStrong}>{copy.mineTitle}</Text>
        <Badge kind={STATE_BADGE[st]} label={st === 'visible' && viewer === 'COMPANION' ? copy.states.visibleCompanion : copy.states[st]} />
      </View>
      <ReviewBody rating={mine.rating} tags={mine.tags} comment={mine.comment} />
      <Text variant="caption" color={colors.textMuted}>{body}</Text>
    </Card>
  );
}

function TheirsCard({ theirs, other }: { theirs: TheirReview; other: string }) {
  return (
    <Card>
      <Text weight="600" color={colors.textStrong}>{copy.theirsTitle(other)}</Text>
      <ReviewBody rating={theirs.rating} tags={theirs.tags} comment={theirs.comment} />
    </Card>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs },
});
