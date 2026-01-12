// Firebase configuration using environment variables
// NEVER commit API keys to the repository!
// Add these to your .env.local file:
// NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
// NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
// NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

// Environment variables validation is handled by initializeFirebase() at runtime
// Firebase App Hosting provides config automatically via initializeApp()
// Local development uses .env.local variables
// No validation needed during build - Firebase handles this automatically

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

