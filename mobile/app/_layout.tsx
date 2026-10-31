import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { SessionProvider } from '../src/lib/session';
import { InviteBanner } from '../src/ui/InviteBanner';

function NotificationRouter() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const open = (data: unknown) => {
      const id = (data as { challengeId?: string } | null)?.challengeId;
      if (id) router.push({ pathname: '/challenge/[id]', params: { id } });
    };
    // Covers a tap that cold-started the app.
    Notifications.getLastNotificationResponseAsync().then((r) => r && open(r.notification.request.content.data));
    const sub = Notifications.addNotificationResponseReceivedListener((r) => open(r.notification.request.content.data));
    return () => sub.remove();
  }, [router]);

  return null;
}

export default function RootLayout() {
  return (
    <SessionProvider>
      <StatusBar style="dark" />
      <NotificationRouter />
      <Stack screenOptions={{ headerShown: false }} />
      <InviteBanner />
    </SessionProvider>
  );
}
