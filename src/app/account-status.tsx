import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LoadState, Pill, Section, StepHeader } from '@/components/companion/Bits';
import { Button, TextButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Feedback';
import { TextField } from '@/components/ui/Field';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Text';
import { enforcement as copy } from '@/content/enforcement';
import { useAuth } from '@/lib/auth';
import { enforcementApi } from '@/lib/enforcement/api';
import {
  STATEMENT_MAX,
  actionDates,
  actionLabel,
  appealBody,
  appealStateText,
  holdView,
  isOnHold,
  statementError,
  statusLabel,
  statusTone,
} from '@/lib/enforcement/helpers';
import type { Standing, StandingAction } from '@/lib/enforcement/types';
import { errorView } from '@/lib/errors';
import { useLoad } from '@/lib/useLoad';
import { colors, space } from '@/theme';

/**
 * Account status (D22, app:/account-status): warnings, suspensions and bans
 * on your own account (GET /account/standing), with appeals
 * (POST /account/standing/{id}/appeal).
 *
 * A suspended or banned user sees only this screen (plus Log out): the root
 * layout's guards keep both shells unmounted while `on_hold` is true. On
 * focus and on pull-to-refresh it reloads GET /auth/me too, so when the hold
 * ends the layout sends them back to their normal home.
 */
export default function AccountStatus() {
  const { user, signOut, refreshUser } = useAuth();
  const standing = useLoad(() => enforcementApi.standing(), user?.id ?? '');
  const [pulling, setPulling] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [sentNote, setSentNote] = useState(false);
  const onHold = isOnHold(user);

  // Re-check the hold whenever the screen is shown (a timed suspension ends by itself).
  useFocusEffect(
    useCallback(() => {
      void refreshUser();
    }, [refreshUser]),
  );

  // The standing and the signed-in user disagree about the hold: let GET /auth/me decide the routing.
  const heldByStanding = standing.data?.on_hold;
  useEffect(() => {
    if (heldByStanding !== undefined && heldByStanding !== onHold) void refreshUser();
  }, [heldByStanding, onHold, refreshUser]);

  const pull = async () => {
    setPulling(true);
    standing.reload();
    await refreshUser();
    setPulling(false);
  };

  const onAppealed = (next: Standing) => {
    standing.setData(next);
    setSentNote(true);
    void refreshUser();
  };

  const data = standing.data;
  const banner = data ? holdView(data) : null;

  return (
    <Screen
      refreshControl={<RefreshControl refreshing={pulling} onRefresh={() => void pull()} tintColor={colors.accent} />}
      footer={
        onHold ? (
          <Button
            variant="secondary"
            loading={leaving}
            icon={<Ionicons name="log-out-outline" size={18} color={colors.textStrong} />}
            onPress={async () => {
              setLeaving(true);
              await signOut(); // the route guard returns to the welcome screen
            }}
          >
            {copy.logOut}
          </Button>
        ) : undefined
      }
    >
      <StepHeader title={copy.title} subtitle={copy.subtitle} back={!onHold} />
      <LoadState loading={standing.loading} error={standing.error} offline={standing.offline} onRetry={standing.reload} />

      {banner ? (
        <View testID="account-status-banner">
          <Card tone={banner.kind === 'clear' ? 'ok' : 'warn'}>
            <View style={{ gap: space.sm }}>
              <Text variant="heading" color={colors.textStrong} accessibilityRole="header">{banner.title}</Text>
              <Text variant="small" color={colors.text}>{banner.body}</Text>
              {banner.note ? <Text variant="small" color={colors.textMuted}>{banner.note}</Text> : null}
            </View>
          </Card>
        </View>
      ) : null}

      {sentNote ? <Alert tone="success">{copy.appeal.sent}</Alert> : null}

      {data && data.actions.length > 0 ? (
        <Section title={copy.historyTitle}>
          {data.actions.map((a) => (
            <ActionCard key={a.id} action={a} onAppealed={onAppealed} onStale={standing.reload} />
          ))}
        </Section>
      ) : null}

      {onHold ? (
        <TextButton onPress={() => void pull()}>{copy.refresh}</TextButton>
      ) : null}
      <View style={{ height: space.lg }} />
    </Screen>
  );
}

/** One decision: what, why, which guideline, dates, status, and its appeal (state or form). */
function ActionCard({ action: a, onAppealed, onStale }: { action: StandingAction; onAppealed: (s: Standing) => void; onStale: () => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [showError, setShowError] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const dates = actionDates(a);
  const local = showError ? statementError(text) : null;

  const send = async () => {
    setShowError(true);
    if (statementError(text)) return;
    setSending(true);
    setApiError(null);
    setFormError(null);
    try {
      const res = await enforcementApi.appeal(a.id, appealBody(text));
      setOpen(false);
      setText('');
      onAppealed(res.standing);
    } catch (err) {
      const v = errorView(err);
      if (v.fields.statement) setApiError(v.fields.statement);
      else {
        setFormError(v.message);
        // Already appealed, window closed, or no longer in place: show the current state.
        if (v.code === 'APPEAL_EXISTS' || v.code === 'APPEAL_WINDOW_CLOSED' || v.code === 'ENFORCEMENT_NOT_ACTIVE' || v.code === 'ENFORCEMENT_NOT_FOUND') onStale();
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <View testID={`account-status-action-${a.id}`}>
      <Card>
        <View style={{ gap: space.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md, flexWrap: 'wrap' }}>
            <Text variant="body" weight="600" color={colors.textStrong}>{actionLabel(a.action)}</Text>
            <Pill label={statusLabel(a.status)} tone={statusTone(a)} />
          </View>
          <Detail label={copy.reason} value={a.reason} />
          {a.rule ? <Detail label={copy.rule} value={a.rule} /> : null}
          {dates.from ? <Detail label={copy.started} value={dates.from} /> : null}
          {dates.until ? <Detail label={copy.ends} value={dates.until} /> : null}

          <Text variant="small" color={colors.text}>{appealStateText(a)}</Text>
          {a.appeal?.decision_reason ? <Detail label={copy.appeal.decisionReason} value={a.appeal.decision_reason} /> : null}

          {a.can_appeal && !a.appeal && !open ? (
            <Button variant="secondary" onPress={() => setOpen(true)}>{copy.appeal.open}</Button>
          ) : null}

          {a.can_appeal && !a.appeal && open ? (
            <View style={{ gap: space.md }} testID="account-status-appeal-form">
              <Text variant="small" weight="600" color={colors.textStrong}>{copy.appeal.formTitle}</Text>
              <Text variant="small" color={colors.textMuted}>{copy.appeal.guidance}</Text>
              <TextField
                label={copy.appeal.label}
                value={text}
                onChangeText={(t) => {
                  setText(t);
                  setApiError(null);
                }}
                error={apiError ?? local ?? undefined}
                hint={copy.appeal.once}
                multiline
                maxLength={STATEMENT_MAX}
                textAlignVertical="top"
              />
              <Text variant="caption" color={colors.textMuted} style={{ alignSelf: 'flex-end' }}>
                {copy.appeal.counter(text.trim().length, STATEMENT_MAX)}
              </Text>
              {formError ? <Alert>{formError}</Alert> : null}
              <Button loading={sending} onPress={() => void send()}>{copy.appeal.submit}</Button>
              <TextButton onPress={() => setOpen(false)}>{copy.appeal.cancel}</TextButton>
            </View>
          ) : null}
        </View>
      </Card>
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: space.xs }}>
      <Text variant="caption" color={colors.textMuted}>{label}</Text>
      <Text variant="small" color={colors.text}>{value}</Text>
    </View>
  );
}
