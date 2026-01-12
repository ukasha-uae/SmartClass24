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

// Validate required environment variables at build time
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

// Only validate in production builds
if (process.env.NODE_ENV === 'production') {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingVars.join(', ')}\n` +
      'Please check your .env.local file or deployment environment variables.'
    );
  }
}

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
};

