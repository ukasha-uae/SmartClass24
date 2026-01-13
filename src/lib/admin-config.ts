/**
 * Admin Configuration
 * 
 * This file defines who has admin access to the admin dashboard.
 * Only users whose email is in the ADMIN_EMAILS array can access /admin/dashboard
 * 
 * SECURITY: Keep this list minimal and only include trusted administrators
 */

/**
 * List of email addresses with admin privileges
 * Add your admin email(s) here
 */
export const ADMIN_EMAILS = [
  'your-admin-email@example.com', // Replace with your actual admin email
  // Add more admin emails as needed
  // Example: 'admin@smartclass24.com',
];

/**
 * Check if a user has admin privileges
 * @param userEmail - The email address to check
 * @returns true if the user is an admin
 */
export function isAdmin(userEmail: string | null | undefined): boolean {
  if (!userEmail) return false;
  return ADMIN_EMAILS.includes(userEmail.toLowerCase());
}

/**
 * Check if a user ID has admin privileges (by looking up their email in Firebase Auth)
 * This is used when only the UID is available
 */
export async function isAdminByUid(uid: string | null | undefined): Promise<boolean> {
  if (!uid) return false;
  
  try {
    const { initializeFirebase } = await import('@/firebase');
    const { firestore } = initializeFirebase();
    if (!firestore) return false;
    
    const { doc, getDoc } = await import('firebase/firestore');
    const studentDoc = await getDoc(doc(firestore, `students/${uid}`));
    
    if (studentDoc.exists()) {
      const email = studentDoc.data()?.email;
      return isAdmin(email);
    }
    
    return false;
  } catch (error) {
    console.error('[Admin] Error checking admin status:', error);
    return false;
  }
}
