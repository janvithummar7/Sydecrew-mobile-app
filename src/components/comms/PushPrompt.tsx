import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { Text } from '@/components/ui/Text';
import { push as copy } from '@/content/comms';
import { askAndRegisterPush, rememberPushPrompted, shouldExplainPush } from '@/lib/comms/push';
import { colors, space } from '@/theme';

/**
 * Our own explanation before the system notification prompt, shown once, the
 * first time Messages or a chat opens. "Not now" never asks again (the user
 * can still allow notifications in the phone settings).
 */
export function PushPrompt() {
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let alive = true;
    shouldExplainPush().then((x) => alive && setVisible(x), () => undefined);
    return () => {
      alive = false;
    };
  }, []);
  const later = () => {
    setVisible(false);
    void rememberPushPrompted();
  };
  return (
    <Sheet visible={visible} onClose={later} title={copy.title}>
      <View style={{ gap: space.md }}>
        <Text color={colors.text}>{copy.body}</Text>
        <Button
          loading={busy}
          onPress={async () => {
            setBusy(true);
            await askAndRegisterPush();
            setBusy(false);
            setVisible(false);
          }}
        >
          {copy.allow}
        </Button>
        <Button variant="ghost" onPress={later}>{copy.later}</Button>
      </View>
    </Sheet>
  );
}
