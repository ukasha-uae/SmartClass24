'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { Firestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getLocalQuizAttempts, clearLocalQuizAttempts } from '@/lib/local-quiz-attempts';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // Set persistence to LOCAL (default) to ensure long-term session persistence
  // This ensures users stay logged in across browser sessions, similar to Facebook/LinkedIn
  setPersistence(authInstance, browserLocalPersistence).catch((error) => {
    // Log but don't block - Firebase defaults to local persistence anyway
    console.warn('[Auth] Failed to set persistence for anonymous sign-in (non-critical):', error);
  });
  
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (returns promise to catch errors like email-already-in-use). */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string, stayLoggedIn: boolean = true): Promise<any> {
  // Set persistence based on user preference (before sign-up so it applies when user is auto-signed in)
  try {
    await setPersistence(
      authInstance, 
      stayLoggedIn ? browserLocalPersistence : browserSessionPersistence
    );
  } catch (error) {
    console.warn('Failed to set auth persistence, using default:', error);
    // Continue with sign-up even if persistence setting fails
  }
  
  // Return the promise so caller can catch errors (e.g., email-already-in-use)
  // Note: createUserWithEmailAndPassword automatically signs the user in
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiate email/password sign-in (returns promise to catch errors). */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string, stayLoggedIn: boolean = true): Promise<any> {
  // Set persistence based on user preference
  // LOCAL persistence (default) = stays logged in across browser sessions
  // SESSION persistence = only for current browser session
  try {
    await setPersistence(
      authInstance, 
      stayLoggedIn ? browserLocalPersistence : browserSessionPersistence
    );
  } catch (error) {
    console.warn('Failed to set auth persistence, using default:', error);
    // Continue with sign-in even if persistence setting fails
  }
  
  // Return the promise so caller can catch errors (e.g., wrong-password, user-not-found)
  return signInWithEmailAndPassword(authInstance, email, password);
}

/**
 * Attempt to link the currently signed-in anonymous user with an email credential.
 * Returns a promise so callers can handle errors (e.g., email already in use).
 */
export async function linkAnonymousToEmail(authInstance: Auth, email: string, password: string) {
  if (!authInstance.currentUser) throw new Error('No current user available for linking');
  const cred = EmailAuthProvider.credential(email, password);
  return linkWithCredential(authInstance.currentUser, cred);
}

/**
 * Attempt to migrate local quiz attempts saved in localStorage into user's Firestore collection
 * If Firestore already contains an attempt with the same createdAtISO and lessonId, skip adding
 */
export async function migrateLocalAttemptsToFirestore(authInstance: Auth, firestoreInstance?: Firestore): Promise<number> {
  if (!authInstance.currentUser) return 0;
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
    } catch (err) {
      console.error('Failed to migrate local attempt to Firestore', err);
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
