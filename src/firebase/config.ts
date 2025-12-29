/**
 * Firebase Configuration
 * 
 * IMPORTANT: This file uses environment variables for security.
 * 
 * For local development:
 * 1. Copy .env.example to .env.local
 * 2. Fill in your Firebase credentials from Firebase Console
 * 3. .env.local is already in .gitignore and will NOT be committed
 * 
 * For production:
 * Set these environment variables in your hosting platform (Vercel, etc.)
 */

export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "smartclass24-5e590",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:409244053398:web:e24f70df607ec16c70b7b7",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBmAUER_YiYQZfZBUEW9nOO-y26FGEgxTs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "smartclass24-5e590.firebaseapp.com",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "smartclass24-5e590.firebasestorage.app",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-BLRS8ZPM24",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "409244053398"
};

// Validate that required environment variables are set (in production)
if (process.env.NODE_ENV === 'production') {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('⚠️ Missing required Firebase environment variables:', missingVars);
    console.error('Please set these in your production environment.');
  }
}
