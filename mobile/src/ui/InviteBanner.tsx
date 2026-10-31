import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { type Challenge, subscribeForUser, viewOf } from '../lib/web-challenges';
import { useSession } from '../lib/session';
import { playSound } from '../lib/sounds';
import { theme } from './theme';

// Push can't reach Expo Go, so an invite that lands while the app is open surfaces here.
export function InviteBanner() {
  const { uid } = useSession();
  const router = useRouter();
  const { id: openId } = useGlobalSearchParams<{ id?: string }>();
  const [invite, setInvite] = useState<Challenge | null>(null);
  const seen = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!uid) return;
    seen.current = null;
    return subscribeForUser(uid, (list) => {
      const pending = list.filter((c) => viewOf(c, uid).phase === 'invited');
      // The first snapshot is existing invites; only ones arriving afterwards are news.
      if (seen.current === null) {
        seen.current = new Set(pending.map((c) => c.id));
        return;
      }
      const fresh = pending.find((c) => !seen.current!.has(c.id));
      pending.forEach((c) => seen.current!.add(c.id));
      if (fresh) {
        setInvite(fresh);
        playSound('correct');
      }
      setInvite((cur) => (cur && !pending.some((c) => c.id === cur.id) ? null : cur));
    });
  }, [uid]);

  if (!invite || invite.id === openId) return null;

  return (
    <SafeAreaView pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
      <View
        style={{
          margin: 12,
          padding: 14,
          borderRadius: theme.radius,
          backgroundColor: theme.primary,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>⚔️ {invite.creatorName} challenged you</Text>
          <Text style={{ color: '#EADBCF', fontSize: 12 }}>{invite.subject}</Text>
        </View>
        <Pressable
          onPress={() => {
            const id = invite.id;
            setInvite(null);
            router.push({ pathname: '/challenge/[id]', params: { id } });
          }}
          style={{ backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 }}
        >
          <Text style={{ color: theme.primary, fontWeight: '700' }}>Open</Text>
        </Pressable>
        <Pressable onPress={() => setInvite(null)}>
          <Text style={{ color: '#fff', fontSize: 18 }}>✕</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
