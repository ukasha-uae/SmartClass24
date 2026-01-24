/**
 * Utility functions for displaying user information consistently
 * across the application. This ensures that user names are always
 * displayed in a user-friendly way, never showing "Unknown".
 */

import { User } from 'firebase/auth';

/**
 * Extract a display name from a Firebase user object or user data.
 * Priority order:
 * 1. studentName (from Firestore profile)
 * 2. displayName (from Firebase Auth)
 * 3. Email username (part before @)
 * 4. Fallback to 'Player' (never 'Unknown')
 */
export function getUserDisplayName(userData: {
  studentName?: string;
  displayName?: string;
  email?: string;
  userName?: string;
} | User | null | undefined): string {
  if (!userData) return 'Player';

  // Check for studentName (Firestore profile)
  if ('studentName' in userData && userData.studentName) {
    return userData.studentName.trim();
  }

  // Check for userName (already processed)
  if ('userName' in userData && userData.userName && userData.userName !== 'Unknown') {
    return userData.userName.trim();
  }

  // Check for displayName (Firebase Auth)
  if ('displayName' in userData && userData.displayName) {
    return userData.displayName.trim();
  }

  // Extract from email
  if ('email' in userData && userData.email) {
    const emailUsername = userData.email.split('@')[0];
    if (emailUsername) {
      return emailUsername.trim();
    }
  }

  // Final fallback
  return 'Player';
}

/**
 * Get initials from a display name for avatars.
 * Returns 2 uppercase characters.
 */
export function getUserInitials(displayName: string): string {
  if (!displayName || displayName === 'Player' || displayName === 'Unknown') {
    return 'U';
  }

  const parts = displayName.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  
  return displayName.substring(0, 2).toUpperCase();
}

/**
 * Format a user's display name for UI display.
 * Ensures proper capitalization and removes extra whitespace.
 */
export function formatDisplayName(name: string | undefined | null): string {
  if (!name) return 'Player';
  
  const trimmed = name.trim();
  if (!trimmed || trimmed === 'Unknown') return 'Player';
  
  // Capitalize first letter of each word
  return trimmed
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
