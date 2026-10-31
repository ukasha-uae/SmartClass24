import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { createChallenge } from '../src/lib/web-challenges';
import { isOnline, listPlayers, type PlayerProfile } from '../src/lib/players';
import { type BankLevel, loadBank } from '../src/lib/question-loader';
import { useSession } from '../src/lib/session';
import { Card, Chip, GhostButton, PrimaryButton, ProgressBar, Screen } from '../src/ui/components';
import { classLevelColor, theme } from '../src/ui/theme';

const TOTAL_STEPS = 4;
const QUESTION_COUNT = 10;

function subjectIcon(subject: string): { icon: string; color: string } {
  const s = subject.toLowerCase();
  if (s.includes('math')) return { icon: '🧮', color: theme.blue };
  if (s.includes('english') || s.includes('literature')) return { icon: '📖', color: theme.green };
  if (/science|physics|chemistry|biology/.test(s)) return { icon: '🧪', color: theme.amber };
  if (/social|geography|history|government/.test(s)) return { icon: '🌍', color: theme.purple };
  return { icon: '🎓', color: theme.muted };
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function NewChallenge() {
  const router = useRouter();
  const { uid, profile } = useSession();
  const params = useLocalSearchParams<{ level?: BankLevel }>();
  const level: BankLevel = params.level ?? 'primary';
  const [step, setStep] = useState(1);
  const [subject, setSubject] = useState<string | null>(null);
  const [classLevel, setClassLevel] = useState<string | null>(null);
  const [friend, setFriend] = useState<PlayerProfile | null>(null);
  const [players, setPlayers] = useState<PlayerProfile[] | null>(null);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bank = useMemo(() => loadBank(level), [level]);
  const subjects = useMemo(() => [...new Set(bank.map((q) => q.subject))], [bank]);
  const classLevels = useMemo(() => {
    const counts = new Map<string, number>();
    for (const q of bank) {
      if (q.subject === subject) counts.set(q.classLevel, (counts.get(q.classLevel) ?? 0) + 1);
    }
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }));
  }, [bank, subject]);

  useEffect(() => {
    if (step === 3 && players === null && uid) {
      listPlayers(uid)
        .then(setPlayers)
        .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load players.'));
    }
  }, [step, players, uid]);

  const visiblePlayers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (players ?? []).filter((p) => !term || `${p.name} ${p.school}`.toLowerCase().includes(term));
  }, [players, search]);

  const canNext = step === 1 ? !!subject : step === 2 ? !!classLevel : step === 3 ? !!friend : true;

  const send = async () => {
    if (!subject || !classLevel || !friend || !uid || !profile) return;
    setBusy(true);
    setError(null);
    try {
      const challenge = await createChallenge({
        level,
        subject,
        classLevel,
        creator: { id: uid, name: profile.name, school: profile.school },
        opponent: { id: friend.id, name: friend.name, school: friend.school },
      });
      router.replace({ pathname: '/challenge/[id]', params: { id: challenge.id } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create challenge.');
      setBusy(false);
    }
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.ink }}>⚔️ Challenge Arena</Text>
        <Text style={{ color: theme.muted }}>
          Step {step} of {TOTAL_STEPS}
        </Text>
      </View>
      <ProgressBar step={step} total={TOTAL_STEPS} />

      <Card>
        {step === 1 && (
          <>
            <Text style={{ fontSize: 17, fontWeight: '700', color: theme.ink }}>Choose Subject</Text>
            <Text style={{ color: theme.muted }}>What do you want to battle in?</Text>
            {subjects.map((s) => {
              const { icon, color } = subjectIcon(s);
              return (
                <Pressable
                  key={s}
                  onPress={() => {
                    setSubject(s);
                    setClassLevel(null);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: theme.tile,
                    borderWidth: 2,
                    borderColor: subject === s ? theme.primary : 'transparent',
                  }}
                >
                  <View style={{ backgroundColor: color + '22', padding: 8, borderRadius: 8 }}>
                    <Text style={{ fontSize: 18 }}>{icon}</Text>
                  </View>
                  <Text style={{ color: theme.ink, fontSize: 15 }}>{s}</Text>
                </Pressable>
              );
            })}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={{ fontSize: 17, fontWeight: '700', color: theme.ink }}>Battle Settings</Text>
            <Text style={{ color: theme.muted }}>Choose your class level</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {classLevels.map(([cl, count]) => (
                <Pressable
                  key={cl}
                  onPress={() => setClassLevel(cl)}
                  style={{
                    width: '31%',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: theme.tile,
                    borderWidth: 2,
                    borderColor: classLevel === cl ? theme.primary : 'transparent',
                  }}
                >
                  <Text style={{ color: classLevelColor(cl), fontWeight: '700', fontSize: 13 }}>{cl}</Text>
                  <Text style={{ color: theme.muted, fontSize: 11 }}>{Math.min(count, QUESTION_COUNT)} Qs</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={{ fontSize: 17, fontWeight: '700', color: theme.ink }}>Select Friend</Text>
            <Text style={{ color: theme.muted }}>Choose who you want to challenge</Text>
            <TextInput
              placeholder="🔍 Search by name or school..."
              value={search}
              onChangeText={setSearch}
              style={{ backgroundColor: '#F6EEE6', borderRadius: 10, padding: 12, color: theme.ink }}
            />
            {players === null && !error && <ActivityIndicator />}
            {players !== null && visiblePlayers.length === 0 && (
              <Text style={{ color: theme.muted }}>
                No players found yet. Friends appear here once they have used SmartClass24 on the web or in this app.
              </Text>
            )}
            {visiblePlayers.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => setFriend(p)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: theme.tile,
                  borderWidth: 2,
                  borderColor: friend?.id === p.id ? theme.primary : 'transparent',
                }}
              >
                <View
                  style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#EFE8E0', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ color: theme.ink, fontWeight: '600' }}>{initials(p.name)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: theme.ink, fontWeight: '600' }}>{p.name}</Text>
                  {!!p.school && <Text style={{ color: theme.muted, fontSize: 12 }}>{p.school}</Text>}
                </View>
                {isOnline(p.lastSeen) && (
                  <Text style={{ color: theme.green, fontSize: 12, fontWeight: '600' }}>● Online</Text>
                )}
              </Pressable>
            ))}
          </>
        )}

        {step === 4 && (
          <>
            <Text style={{ fontSize: 17, fontWeight: '700', color: theme.ink }}>Ready to battle</Text>
            <Text style={{ color: theme.muted }}>
              {friend?.name} will get a notification to play the same {QUESTION_COUNT} questions.
            </Text>
            {busy && <ActivityIndicator />}
          </>
        )}

        {error && <Text style={{ color: theme.red }}>{error}</Text>}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <GhostButton
            title={step === 1 ? '← Cancel' : '← Back'}
            onPress={() => (step === 1 ? router.back() : setStep(step - 1))}
          />
          {step < TOTAL_STEPS ? (
            <PrimaryButton title="Next →" disabled={!canNext} onPress={() => setStep(step + 1)} />
          ) : (
            <PrimaryButton title="Send challenge" disabled={busy} onPress={send} />
          )}
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {subject && <Chip label={subject} />}
        {classLevel && <Chip label={classLevel} />}
        {friend && <Chip label={friend.name} />}
      </View>
    </Screen>
  );
}
