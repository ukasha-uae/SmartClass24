'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// MODIFIED: Always use custom config from environment variables
// Firebase App Hosting's auto-injected config has expired API key
export function initializeFirebase() {
  if (!getApps().length) {
    // FORCE use of firebaseConfig from our environment variables (apphosting.yaml)
    // Firebase's auto-injected FIREBASE_WEBAPP_CONFIG has expired API key
    console.log('[Firebase Init] Using custom config from process.env.NEXT_PUBLIC_FIREBASE_*');
    const firebaseApp = initializeApp(firebaseConfig);

    const sdks = getSdks(firebaseApp);
    
    // Enable offline persistence for PWA support
    // This allows the app to work offline and sync when back online
    enableIndexedDbPersistence(sdks.firestore).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('Firestore persistence: Multiple tabs open, can only enable in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('Firestore persistence: Browser does not support offline persistence.');
      }
    });

    return sdks;
  }

  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp),
    storage: getStorage(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './use-collection';
export * from './use-doc';
export * from './non-blocking-updates';
export * from './messaging';
export * from './fcm-token';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
