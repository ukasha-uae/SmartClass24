import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously, signInWithEmailAndPassword, signOut as fbSignOut } from 'firebase/auth';
import { AppState } from 'react-native';
import { auth } from './firebase';
import { getProfile, type PlayerProfile, registerPushToken, saveProfile, updatePresence } from './players';

interface Session {
  uid: string | null;
  isGuest: boolean;
  profile: PlayerProfile | null;
  suggestedName: string;
  loading: boolean;
  error: string | null;
  setProfile: (name: string, school: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [suggestedName, setSuggestedName] = useState('');
  const [profile, setProfileState] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // One listener covers startup, email sign-in and sign-out; signing out falls back to a guest session.
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null);
        setProfileState(null);
        try {
          await signInAnonymously(auth);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Failed to sign in.');
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      try {
        setIsGuest(user.isAnonymous);
        setSuggestedName(user.displayName || user.email?.split('@')[0] || '');
        const existing = await getProfile(user.uid);
        setProfileState(existing);
        setUid(user.uid);
        setError(null);
        if (existing) registerPushToken(user.uid).catch(() => {});
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load your profile.');
      } finally {
        setLoading(false);
      }
    });
  }, []);

  // Heartbeat so other players (mobile and web) can see this user as online.
  useEffect(() => {
    if (!uid || !profile) return;
    const beat = () => updatePresence(uid).catch(() => {});
    beat();
    const timer = setInterval(beat, 25_000);
    const sub = AppState.addEventListener('change', (s) => s === 'active' && beat());
    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [uid, profile]);

  const setProfile = useCallback(
    async (name: string, school: string) => {
      if (!uid) throw new Error('Not signed in');
      setProfileState(await saveProfile(uid, name, school));
      registerPushToken(uid).catch(() => {});
    },
    [uid],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(auth);
  }, []);

  return (
    <SessionContext.Provider
      value={{ uid, isGuest, profile, suggestedName, loading, error, setProfile, signIn, signOut }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): Session {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}
