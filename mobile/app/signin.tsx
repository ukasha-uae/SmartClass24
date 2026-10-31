import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { useSession } from '../src/lib/session';
import { Card, GhostButton, PrimaryButton, Screen } from '../src/ui/components';
import { theme } from '../src/ui/theme';

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await signIn(email, password);
      router.replace('/');
    } catch {
      setError('Email or password is incorrect.');
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
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.ink }}>Sign in to SmartClass24</Text>
        <Text style={{ color: theme.muted }}>
          Use the same account as the website so your challenges and friends follow you here.
        </Text>
        <TextInput
          style={input}
          placeholder="Email"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={input}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />
        {error && <Text style={{ color: theme.red }}>{error}</Text>}
        <PrimaryButton title={busy ? 'Signing in…' : 'Sign in'} disabled={busy || !email.trim() || !password} onPress={submit} />
        <GhostButton title="← Back" onPress={() => router.back()} />
      </Card>
    </Screen>
  );
}
