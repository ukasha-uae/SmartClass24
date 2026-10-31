import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { useSession } from '../src/lib/session';
import { Card, PrimaryButton, Screen } from '../src/ui/components';
import { theme } from '../src/ui/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, setProfile, uid, loading, suggestedName } = useSession();
  const [name, setName] = useState(profile?.name || suggestedName);
  const [school, setSchool] = useState(profile?.school ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && !uid) return <Redirect href="/" />;

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await setProfile(name.trim(), school.trim());
      router.replace('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save profile.');
      setBusy(false);
    }
  };

  const input = {
    backgroundColor: theme.tile,
    borderRadius: 10,
    padding: 12,
    color: theme.ink,
    borderWidth: 1,
    borderColor: theme.border,
  } as const;

  return (
    <Screen>
      <Card>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.ink }}>Your player profile</Text>
        <Text style={{ color: theme.muted }}>Friends find you by this name when they send you a challenge.</Text>
        <TextInput style={input} placeholder="Your name" value={name} onChangeText={setName} maxLength={40} />
        <TextInput style={input} placeholder="School (optional)" value={school} onChangeText={setSchool} maxLength={60} />
        {error && <Text style={{ color: theme.red }}>{error}</Text>}
        <PrimaryButton title="Save" disabled={busy || name.trim().length < 2} onPress={save} />
      </Card>
    </Screen>
  );
}
