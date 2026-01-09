
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

  // Effect to subscribe to Firebase auth state changes
  useEffect(() => {
    if (!auth) { // If no Auth service instance, cannot determine user state
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not provided.") });
      return;
    }

    setUserAuthState({ user: null, isUserLoading: true, userError: null }); // Reset on auth instance change
    
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => { // Auth state determined
        console.log('[Auth] Auth state changed:', firebaseUser ? `User ${firebaseUser.uid} (${firebaseUser.isAnonymous ? 'anonymous' : 'email'})` : 'No user');
        
        // Clean up previous presence heartbeat if user changed
        if (presenceCleanupRef.current) {
          presenceCleanupRef.current();
          presenceCleanupRef.current = null;
        }
        
        setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null });
        
        // If we've just signed in, sync data from Firestore and start presence heartbeat
        if (firebaseUser && firestore) {
          try { 
            // Start global presence heartbeat (runs on all pages for authenticated users)
            presenceCleanupRef.current = startPresenceHeartbeat(firebaseUser.uid);
            
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
          } catch (e) { 
            // Don't break the app if sync fails
            console.warn('Error syncing data on sign in (non-critical):', e); 
          }
        } else if (!firebaseUser) {
          // No user - attempt anonymous sign-in
          console.log('[Auth] No user after auth state change, attempting anonymous sign-in...');
          try {
            initiateAnonymousSignIn(auth);
          } catch (err) {
            console.error('[Auth] Failed to initiate anonymous sign-in after auth state change:', err);
          }
        }
      },
      (error) => { // Auth listener error
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error });
        // Even on error, try to sign in anonymously
        if (auth && !auth.currentUser) {
          try {
            console.log('[Auth] Attempting anonymous sign-in after auth error...');
            initiateAnonymousSignIn(auth);
          } catch (err) {
            console.error('[Auth] Failed to initiate anonymous sign-in after error:', err);
          }
        }
      }
    );
    
    // After subscribing, if we don't have a user and the auth object exists, ensure anonymous signin is attempted
    if (auth) {
      // Wait a bit for the auth state to settle, then attempt anonymous sign-in if no user
      const checkAndSignIn = async () => {
        // Wait for initial auth state to be determined
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check again if still no user after auth state settles
        if (!auth.currentUser) {
          try {
            console.log('[Auth] No user detected, initiating anonymous sign-in...');
            initiateAnonymousSignIn(auth);
          } catch (err) {
            console.error('[Auth] Error initiating anonymous sign-in', err);
            // Retry after a delay if it fails
            setTimeout(() => {
              if (!auth.currentUser) {
                try {
                  console.log('[Auth] Retrying anonymous sign-in...');
                  initiateAnonymousSignIn(auth);
                } catch (retryErr) {
                  console.error('[Auth] Retry failed:', retryErr);
                }
              }
            }, 2000);
          }
        } else {
          console.log('[Auth] User already signed in:', auth.currentUser.uid, auth.currentUser.isAnonymous ? '(anonymous)' : '(email)');
        }
      };
      
      checkAndSignIn();
    }
    
    // Cleanup function
    return () => {
      unsubscribe();
      if (presenceCleanupRef.current) {
        presenceCleanupRef.current();
        presenceCleanupRef.current = null;
      }
    };
  }, [auth, firestore]); // Depends on the auth instance and firestore

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
