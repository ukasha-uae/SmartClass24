
'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect, useRef } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { initiateAnonymousSignIn, migrateLocalAttemptsToFirestore } from './non-blocking-login';
import { syncSubscriptionFromFirestore } from '@/lib/monetization';
import { startPresenceHeartbeat } from '@/lib/user-presence';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: any;
}

// Internal state for user authentication
interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  storage: any; // Firebase Storage
  // User authentication state
  user: User | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null; // Error from auth listener
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: any; // Firebase Storage
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult { // Renamed from UserAuthHookResult for consistency if desired, or keep as UserAuthHookResult
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
  storage,
}) => {
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: null,
    isUserLoading: true, // Start loading until first auth event
    userError: null,
  });
  
  // Ref to store presence heartbeat cleanup function
  const presenceCleanupRef = useRef<(() => void) | null>(null);
  
  // Ref to store FCM cleanup functions
  const fcmCleanupRef = useRef<(() => void) | null>(null);

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth) { // If no Auth service instance, cannot determine user state
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not provided.") });
      return;
    }

    // CRITICAL: Set persistence to LOCAL before setting up auth listener
    // This ensures users stay logged in across browser sessions
    let unsubscribe: (() => void) | null = null;
    
    const initializeAuth = async () => {
      try {
        const { setPersistence, browserLocalPersistence, onAuthStateChanged } = await import('firebase/auth');
        
        // WAIT for persistence to be set before setting up listener
        await setPersistence(auth, browserLocalPersistence);
        console.log('[Auth] Persistence set to LOCAL - users will stay logged in');
        
        setUserAuthState({ user: null, isUserLoading: true, userError: null }); // Reset on auth instance change
        
        unsubscribe = onAuthStateChanged(
          auth,
          async (firebaseUser) => { // Auth state determined
        console.log('[Auth] Auth state changed:', firebaseUser ? `User ${firebaseUser.uid} (${firebaseUser.isAnonymous ? 'anonymous' : 'email'})` : 'No user');
        
            // Log persistence state for debugging
            if (typeof window !== 'undefined') {
              const persistedUser = window.localStorage.getItem(`firebase:authUser:${auth.config.apiKey}:[DEFAULT]`);
              console.log('[Auth] Persisted user in localStorage:', persistedUser ? 'EXISTS' : 'NONE');
            }
            
        
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
        
        // If we've just signed in, sync data from Firestore and start presence heartbeat
        if (firebaseUser && firestore) {
          try { 
            // Start global presence heartbeat (runs on all pages for authenticated users)
            presenceCleanupRef.current = startPresenceHeartbeat(firebaseUser.uid);
            
            // Initialize FCM for push notifications (non-blocking)
            initializeFCMForUser(firebaseUser.uid).catch(err => {
              console.warn('[FCM] Failed to initialize (non-critical):', err);
            });
            
            // Migrate local quiz attempts to Firestore
            migrateLocalAttemptsToFirestore(auth, firestore);
            // Sync subscription from Firestore to localStorage (for cross-device sync)
            // This may fail if rules aren't deployed - that's OK, it will use localStorage
            await syncSubscriptionFromFirestore(firebaseUser.uid, firestore, auth).catch(err => {
              // Silently handle permission errors - app will work with localStorage only
              if (err.code !== 'permission-denied') {
                console.warn('Subscription sync error (non-critical):', err.message);
              }
            });
            
            // Create referral code for new users (non-blocking)
            if (typeof window !== 'undefined') {
              try {
                const { createUserReferralCode } = await import('@/lib/referrals');
                const pendingReferrerUid = localStorage.getItem('pendingReferrerUid');
                // Check if user already has a referral code to avoid creating duplicates
                const { doc, getDoc } = await import('firebase/firestore');
                const userRef = doc(firestore, 'users', firebaseUser.uid);
                const userSnap = await getDoc(userRef);
                
                if (!userSnap.exists() || !userSnap.data()?.referralCode) {
                  // New user or no referral code yet - create one
                  const code = await createUserReferralCode(firebaseUser.uid, pendingReferrerUid);
                  if (code) {
                    // Store code in user document for easy access
                    const { setDoc } = await import('firebase/firestore');
                    await setDoc(userRef, { referralCode: code }, { merge: true });
                    // Clear pending referrer after code creation (code creation handles referral record)
                    localStorage.removeItem('pendingReferrerUid');
                  }
                } else if (pendingReferrerUid && pendingReferrerUid !== firebaseUser.uid) {
                  // Existing user came via referral link - create referral record
                  const { createReferralRecord } = await import('@/lib/referrals');
                  const userData = userSnap.data();
                  if (userData?.referralCode) {
                    await createReferralRecord(pendingReferrerUid, firebaseUser.uid, userData.referralCode);
                    localStorage.removeItem('pendingReferrerUid');
                  }
                } else if (pendingReferrerUid) {
                  // Clear invalid self-referral
                  localStorage.removeItem('pendingReferrerUid');
                }
              } catch (referralError) {
                // Non-critical - don't break sign-in flow
                console.warn('[Referrals] Error creating referral code (non-critical):', referralError);
              }
            }
          } catch (e) { 
            // Don't break the app if sync fails
            console.warn('Error syncing data on sign in (non-critical):', e); 
          }
        }
        // REMOVED: Automatic anonymous sign-in on null user
        // This was causing logged-in users to be signed out during persistence operations
        // Anonymous sign-in is now handled only on first visit via checkAndSignIn() delayed call
      },
      (error) => { // Auth listener error
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
        // REMOVED: Don't sign in anonymously on errors - this can interrupt real user sessions
      }
    );
        
        // After subscribing, if we don't have a user and the auth object exists, ensure anonymous signin is attempted
        // PWA-OPTIMIZED: Wait for persistence to load, then check if we need anonymous sign-in
        const checkAndSignIn = async () => {
          // CRITICAL: Wait for Firebase to load persisted session from IndexedDB
          // 500ms is sufficient for PWA to read localStorage/IndexedDB
          // Longer delays cause poor UX on desktop PWA startup
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Check again if still no user after auth state has fully settled
          if (!auth.currentUser) {
            try {
              console.log('[Auth] No persisted user found, initiating anonymous sign-in...');
              initiateAnonymousSignIn(auth);
            } catch (err) {
              console.error('[Auth] Error initiating anonymous sign-in', err);
              // Single retry after 1s delay
              setTimeout(() => {
                if (!auth.currentUser) {
                  try {
                    console.log('[Auth] Retrying anonymous sign-in...');
                    initiateAnonymousSignIn(auth);
                  } catch (retryErr) {
                    console.error('[Auth] Retry failed:', retryErr);
                  }
                }
              }, 1000);
            }
          } else {
            console.log('[Auth] User session restored:', auth.currentUser.uid, auth.currentUser.isAnonymous ? '(anonymous)' : '(email)');
          }
        };
        
        checkAndSignIn();
        
      } catch (error) {
        console.error('[Auth] Failed to initialize auth:', error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error as Error });
      }
    };
    
    initializeAuth();
    
    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      if (presenceCleanupRef.current) {
        presenceCleanupRef.current();
        presenceCleanupRef.current = null;
      }
      if (fcmCleanupRef.current) {
        fcmCleanupRef.current();
        fcmCleanupRef.current = null;
      }
    };
  }, [auth, firestore]); // Depends on the auth instance and firestore
  
  // Helper function to initialize FCM for a user
  const initializeFCMForUser = async (userId: string) => {
    if (!firebaseApp || !firestore) return;
    
    try {
      // Dynamically import FCM modules (for code splitting)
      const { initializeMessaging } = await import('./messaging');
      const { initializeFCMToken, setupTokenRefreshListener } = await import('./fcm-token');
      
      // Initialize messaging
      const messaging = await initializeMessaging(firebaseApp);
      if (!messaging) {
        console.log('[FCM] Messaging not supported, skipping initialization');
        return;
      }
      
      // Initialize FCM token (will request permission if needed)
      const token = await initializeFCMToken(messaging, firestore, userId);
      if (token) {
        console.log('[FCM] Successfully initialized for user');
        
        // Setup token refresh listener
        const unsubscribe = setupTokenRefreshListener(messaging, firestore, userId);
        fcmCleanupRef.current = unsubscribe;
      }
    } catch (error) {
      console.error('[FCM] Error initializing:', error);
    }
  };

  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      storage: servicesAvailable ? storage : null,
      user: userAuthState.user,
      isUserLoading: userAuthState.isUserLoading,
      userError: userAuthState.userError,
    };
  }, [firebaseApp, firestore, auth, storage, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    storage: context.storage,
    user: context.user,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => { // Renamed from useAuthUser
  const { user, isUserLoading, userError } = useFirebase(); // Leverages the main hook
  return { user, isUserLoading, userError };
};
