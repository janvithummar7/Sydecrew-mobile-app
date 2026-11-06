import { useState } from 'react';
import { Linking } from 'react-native';
import { Logo } from '@/components/ui/Brand';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/lib/auth';
import { staff } from '@/content/common';
import { SITE_URL } from './settings';

/** Staff accounts: the admin is web only (two-step sign-in), so the app only offers the website and log out. */
export default function Staff() {
  const { signOut } = useAuth();
  const [leaving, setLeaving] = useState(false);
  return (
    <Screen
      footer={
        <>
          <Button onPress={() => Linking.openURL(`${SITE_URL}/admin`)}>Open the website</Button>
          <Button variant="ghost" loading={leaving} onPress={async () => { setLeaving(true); await signOut(); }}>Log out</Button>
        </>
      }
    >
      <Logo />
      <EmptyState icon="desktop-outline" title={staff.title} body={staff.body} />
    </Screen>
  );
}
