import { collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { getExpoPushToken } from './push';

export const TENANT_ID = process.env.EXPO_PUBLIC_TENANT_ID ?? 'smartclass24';

// Same TTL as the web app (src/lib/user-presence.ts) so both platforms agree on "online".
const PRESENCE_TIMEOUT_MS = 90 * 1000;

export interface PlayerProfile {
  id: string;
  name: string;
  school: string;
  lastSeen?: number;
}

export const isOnline = (lastSeen?: number | null): boolean =>
  !!lastSeen && Date.now() - lastSeen < PRESENCE_TIMEOUT_MS;

// Web stores Firestore Timestamps; tolerate epoch numbers too.
const toMillis = (v: unknown): number | undefined => {
  if (typeof v === 'number') return v;
  const ts = v as { toMillis?: () => number } | null | undefined;
  return typeof ts?.toMillis === 'function' ? ts.toMillis() : undefined;
};

interface StudentDoc {
  studentName?: string;
  userName?: string;
  schoolName?: string;
  lastSeen?: unknown;
}

const toProfile = (id: string, data: StudentDoc): PlayerProfile => ({
  id,
  name: (data.studentName || data.userName || '').trim(),
  school: data.schoolName ?? '',
  lastSeen: toMillis(data.lastSeen),
});

// Challenge rating the web syncs onto the student doc; undefined for players who never played on the web.
export async function getRating(uid: string): Promise<number | undefined> {
  try {
    const snap = await getDoc(doc(db, 'students', uid));
    const rating = snap.data()?.rating;
    return typeof rating === 'number' ? rating : undefined;
  } catch {
    return undefined;
  }
}

// Players live in the same `students` collection as the web app, so web and mobile users see each other.
export async function getProfile(uid: string): Promise<PlayerProfile | null> {
  const snap = await getDoc(doc(db, 'students', uid));
  if (snap.exists()) {
    const profile = toProfile(uid, snap.data() as StudentDoc);
    if (profile.name) return profile;
  }
  // Profiles created by earlier mobile builds.
  const legacy = await getDoc(doc(db, 'arenaPlayers', uid));
  if (!legacy.exists()) return null;
  const { name, school } = legacy.data() as { name?: string; school?: string };
  return name ? await saveProfile(uid, name, school ?? '') : null;
}

export async function saveProfile(uid: string, name: string, school: string): Promise<PlayerProfile> {
  await setDoc(
    doc(db, 'students', uid),
    {
      userId: uid,
      studentName: name,
      userName: name,
      schoolName: school || 'Unknown School',
      tenantId: TENANT_ID,
      lastSeen: serverTimestamp(),
      isOnline: true,
    },
    { merge: true },
  );
  return { id: uid, name, school: school || 'Unknown School', lastSeen: Date.now() };
}

export async function updatePresence(uid: string): Promise<void> {
  await setDoc(
    doc(db, 'students', uid),
    { userId: uid, tenantId: TENANT_ID, lastSeen: serverTimestamp(), isOnline: true },
    { merge: true },
  );
}

// Directory is capped client-side; swap for a server-side prefix query when the player base grows.
export async function listPlayers(selfUid: string): Promise<PlayerProfile[]> {
  const snap = await getDocs(query(collection(db, 'students'), where('tenantId', '==', TENANT_ID), limit(200)));
  return snap.docs
    .map((d) => toProfile(d.id, d.data() as StudentDoc))
    .filter((p) => p.id !== selfUid && !p.id.startsWith('bot-') && p.name)
    .sort((a, b) => Number(isOnline(b.lastSeen)) - Number(isOnline(a.lastSeen)) || a.name.localeCompare(b.name));
}

// Token lives in an owner-only doc so other players can't read it.
export async function registerPushToken(uid: string): Promise<void> {
  const token = await getExpoPushToken();
  if (!token) return;
  await setDoc(doc(db, 'arenaPlayers', uid, 'private', 'push'), { expoPushToken: token, updatedAt: Date.now() });
}
