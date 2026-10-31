'use client';
import {
  Auth, // Import Auth type for type hinting
  User,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  // REMOVED: browserSessionPersistence - causes PWA logout issues
  // Desktop PWA MUST use browserLocalPersistence for login persistence
} from 'firebase/auth';
import { Firestore, collection, query, where, getDocs, addDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { resolveTenantFromWindow } from '@/tenancy/resolveTenant';
import { getLocalQuizAttempts, clearLocalQuizAttempts } from '@/lib/local-quiz-attempts';

const AUTH_TRANSITION_STORAGE_KEY = 'smartclass24_auth_transition';
const CREDENTIAL_TRANSITION_MAX_AGE_MS = 20_000;

function markAuthTransition(type: 'email-sign-in' | 'email-sign-up' | 'link-anonymous'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TRANSITION_STORAGE_KEY, JSON.stringify({ type, ts: Date.now() }));
}

export function hasRecentCredentialAuthTransition(maxAgeMs: number = CREDENTIAL_TRANSITION_MAX_AGE_MS): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const raw = localStorage.getItem(AUTH_TRANSITION_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { type?: string; ts?: number };

    const isCredentialTransition =
      parsed.type === 'email-sign-in' ||
      parsed.type === 'email-sign-up' ||
      parsed.type === 'link-anonymous';

    if (!isCredentialTransition || typeof parsed.ts !== 'number') return false;
    return Date.now() - parsed.ts <= maxAgeMs;
  } catch {
    return false;
  }
}

export function clearAuthTransitionFlag(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TRANSITION_STORAGE_KEY);
}

/** Initiate anonymous sign-in (non-blocking). */
export async function initiateAnonymousSignIn(authInstance: Auth): Promise<void> {
  try {
    // Set persistence to LOCAL to ensure long-term session persistence
    await setPersistence(authInstance, browserLocalPersistence);
    console.log('[Auth] Anonymous sign-in persistence set to LOCAL');
  } catch (error) {
    console.warn('[Auth] Failed to set persistence for anonymous sign-in:', error);
    // Continue with sign-in even if persistence setting fails
  }
  
  // Call signInAnonymously - auth state change is handled by onAuthStateChanged listener
  signInAnonymously(authInstance).catch(error => {
    console.error('[Auth] Anonymous sign-in failed:', error);
  });
}

/** Initiate email/password sign-up (returns promise to catch errors like email-already-in-use). */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string, stayLoggedIn: boolean = true): Promise<any> {
  // CRITICAL: Always use LOCAL persistence for desktop PWA login persistence
  // browserSessionPersistence causes users to be logged out on PWA restart
  try {
    await setPersistence(authInstance, browserLocalPersistence);
    console.log('[Auth] Sign-up persistence set to LOCAL (stays logged in)');
  } catch (error) {
    console.warn('[Auth] Failed to set auth persistence:', error);
    // Continue with sign-up even if persistence setting fails
  }

  markAuthTransition('email-sign-up');
  
  // Return the promise so caller can catch errors (e.g., email-already-in-use)
  // Note: createUserWithEmailAndPassword automatically signs the user in
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in (returns promise to catch errors). */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string, stayLoggedIn: boolean = true): Promise<any> {
  // CRITICAL: Always use LOCAL persistence for desktop PWA login persistence
  // This ensures users remain logged in after closing and reopening the PWA
  try {
    await setPersistence(authInstance, browserLocalPersistence);
    console.log('[Auth] Sign-in persistence set to LOCAL (stays logged in)');
  } catch (error) {
    console.warn('[Auth] Failed to set auth persistence:', error);
    // Continue with sign-in even if persistence setting fails
  }

  markAuthTransition('email-sign-in');
  
  // Return the promise so caller can catch errors (e.g., wrong-password, user-not-found)
  return signInWithEmailAndPassword(authInstance, email, password);
}

/**
 * Attempt to link the currently signed-in anonymous user with an email credential.
 * Returns a promise so callers can handle errors (e.g., email already in use).
 */
export async function linkAnonymousToEmail(authInstance: Auth, email: string, password: string) {
  if (!authInstance.currentUser) throw new Error('No current user available for linking');
  markAuthTransition('link-anonymous');
  const cred = EmailAuthProvider.credential(email, password);
  return linkWithCredential(authInstance.currentUser, cred);
}

/**
 * Ensure student profile exists after login so challenge/friend flows are always available
 * even if this account was previously created on another platform.
 */
export async function ensureStudentProfileDocument(
  firebaseUser: User,
  firestoreInstance: Firestore,
  tenantId?: string,
): Promise<void> {
  const resolvedTenantId = tenantId || resolveTenantFromWindow().id || 'smartclass24';
  const studentRef = doc(firestoreInstance, 'students', firebaseUser.uid);
  const studentSnap = await getDoc(studentRef);

  const fallbackName =
    firebaseUser.displayName ||
    firebaseUser.email?.split('@')[0] ||
    `Student ${firebaseUser.uid.slice(-4)}`;

  const baseData: Record<string, any> = {
    tenantId: resolvedTenantId,
    studentName: fallbackName,
    userName: fallbackName,
    email: firebaseUser.email || null,
    schoolName: 'Unknown School',
    studentClass: 'JHS 1',
    rating: 1200,
    wins: 0,
    losses: 0,
    draws: 0,
    totalGames: 0,
    winStreak: 0,
    highestStreak: 0,
    xp: 0,
    coins: 0,
    achievements: [],
    lastSeen: serverTimestamp(),
  };

  if (!studentSnap.exists()) {
    await setDoc(studentRef, baseData, { merge: true });
    return;
  }

  const existingData = studentSnap.data();
  const nextName = existingData.studentName || fallbackName;
  await setDoc(
    studentRef,
    {
      tenantId: existingData.tenantId || resolvedTenantId,
      studentName: nextName,
      userName: existingData.userName || nextName,
      email: existingData.email || firebaseUser.email || null,
      lastSeen: serverTimestamp(),
    },
    { merge: true },
  );
}

/**
 * Attempt to migrate local quiz attempts saved in localStorage into user's Firestore collection
 * If Firestore already contains an attempt with the same createdAtISO and lessonId, skip adding
 */
export async function migrateLocalAttemptsToFirestore(authInstance: Auth, firestoreInstance?: Firestore): Promise<number> {
  if (!authInstance.currentUser) return 0;
  if (authInstance.currentUser.isAnonymous) return 0;
  if (!firestoreInstance) return 0;
  const localAttempts = getLocalQuizAttempts();
  if (!localAttempts || localAttempts.length === 0) return 0;
  const uid = authInstance.currentUser.uid;
  const attemptsRefPath = `users/${uid}/quizAttempts`;
  let migratedCount = 0;
  for (const attempt of localAttempts) {
    try {
      // Query by createdAtISO and lessonId if present
      const q = attempt.createdAt ?
        query(collection(firestoreInstance, attemptsRefPath), where('createdAtISO', '==', attempt.createdAt)) :
        null;
      if (q) {
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          // already migrated
          continue;
        }
      }
      await addDoc(collection(firestoreInstance, attemptsRefPath), {
        lessonId: attempt.lessonId || null,
        subjectSlug: attempt.subjectSlug || null,
        topicSlug: attempt.topicSlug || null,
        lessonSlug: attempt.lessonSlug || null,
        createdAtISO: attempt.createdAt || new Date().toISOString(),
        scorePercent: attempt.scorePercent,
        rawScore: attempt.rawScore,
        total: attempt.total,
        report: attempt.report || null,
        migrated: true,
      });
    } catch (err: any) {
      const isPermissionDenied =
        err?.code === 'permission-denied' ||
        (typeof err?.message === 'string' && err.message.includes('Missing or insufficient permissions'));
      if (isPermissionDenied) {
        console.warn('[Auth] Permission denied - skipping local attempt migration');
      } else {
        console.error('Failed to migrate local attempt to Firestore', err);
      }
      // Continue with other attempts
    }
    migratedCount++;
  }
  // Clear local attempts after trying to migrate
  clearLocalQuizAttempts();
  return migratedCount;
}

export async function doSignOut(authInstance: Auth) {
  return signOut(authInstance);
}

/** Send password reset email to the user */
export async function sendPasswordReset(authInstance: Auth, email: string): Promise<void> {
  return sendPasswordResetEmail(authInstance, email);
}
