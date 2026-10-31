import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { type Challenge, type ChallengePhase, subscribeForUser, viewOf } from '../src/lib/web-challenges';
import type { BankLevel } from '../src/lib/question-loader';
import { useSession } from '../src/lib/session';
import { Card, GhostButton, PrimaryButton, Screen } from '../src/ui/components';
import { theme } from '../src/ui/theme';

const LEVELS: { key: BankLevel; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'jhs', label: 'Middle School' },
  { key: 'shs', label: 'High School' },
];

function statusOf(c: Challenge, uid: string): { label: string; color: string; phase: ChallengePhase } {
  const v = viewOf(c, uid);
  switch (v.phase) {
    case 'invited':
      return { phase: v.phase, label: 'Invitation — tap to respond', color: theme.green };
    case 'awaiting-accept':
      return { phase: v.phase, label: `Waiting for ${v.other.name} to accept`, color: theme.amber };
    case 'declined':
      return { phase: v.phase, label: 'Declined', color: theme.red };
    case 'your-turn':
      return { phase: v.phase, label: 'Your turn', color: theme.green };
    case 'waiting-friend':
      return { phase: v.phase, label: 'Waiting for friend to finish', color: theme.amber };
    default:
      return v.won
        ? { phase: v.phase, label: 'You won', color: theme.green }
        : { phase: v.phase, label: 'You lost', color: theme.red };
  }
}

export default function Home() {
  const router = useRouter();
  const { uid, profile, loading, error, isGuest, signOut } = useSession();
  const [level, setLevel] = useState<BankLevel>('primary');
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    if (!uid) return;
    return subscribeForUser(uid, setChallenges);
  }, [uid]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error || !uid) {
    return (
      <Screen>
        <Text style={{ color: theme.red }}>{error ?? 'Could not sign in.'}</Text>
      </Screen>
    );
  }
  if (!profile) return <Redirect href="/profile" />;

  return (
    <Screen>
      <View style={{ gap: 6 }}>
        <Text style={styles.title}>🎮 Challenge Arena</Text>
        <Text style={{ color: theme.muted }}>Hi {profile.name}, compete with classmates across your region</Text>
      </View>

      <View style={styles.tabs}>
        {LEVELS.map((l) => (
          <Pressable
            key={l.key}
            onPress={() => setLevel(l.key)}
            style={[styles.tab, level === l.key && { backgroundColor: theme.green }]}
          >
            <Text style={{ color: level === l.key ? '#fff' : theme.ink, fontWeight: '600', fontSize: 13 }}>
              {l.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Card>
        <Text style={{ fontSize: 17, fontWeight: '700', color: theme.ink }}>Challenge a Friend</Text>
        <Text style={{ color: theme.muted }}>Pick a subject and a friend. They get a notification to play the same questions.</Text>
        <PrimaryButton title="Start a challenge" onPress={() => router.push({ pathname: '/new', params: { level } })} />
      </Card>

      {challenges.length > 0 && (
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: theme.ink }}>Your challenges</Text>
          {challenges.map((c) => {
            const status = statusOf(c, uid);
            const other = viewOf(c, uid).other.name;
            return (
              <Pressable key={c.id} onPress={() => router.push({ pathname: '/challenge/[id]', params: { id: c.id } })}>
                <Card style={{ gap: 4 }}>
                  <Text style={{ fontWeight: '700', color: theme.ink }}>vs {other}</Text>
                  <Text style={{ color: theme.muted }}>
                    {c.subject} · {c.difficulty}
                  </Text>
                  <Text style={{ color: status.color, fontWeight: '600' }}>{status.label}</Text>
                </Card>
              </Pressable>
            );
          })}
        </View>
      )}

      {isGuest ? (
        <GhostButton title="Have a SmartClass24 account? Sign in" onPress={() => router.push('/signin')} />
      ) : (
        <GhostButton title="Sign out" onPress={signOut} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, fontWeight: '800', color: theme.blue },
  tabs: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#EFE8E0' },
});
