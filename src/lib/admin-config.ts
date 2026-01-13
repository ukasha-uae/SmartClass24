/**
 * Admin Configuration - Production Safe
 * 
 * This file uses environment variables and Firestore for admin management.
 * 
 * PRODUCTION SETUP:
 * 1. Set NEXT_PUBLIC_SUPER_ADMIN_EMAIL in Firebase hosting environment
 * 2. Super admin can then add other admins via the dashboard
 * 3. Admin list stored in Firestore admins/{email} collection
 */

/**
 * Get super admin email from environment variable
 * This should be set in Firebase hosting env vars, NOT committed to Git
 */
const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL || 'ukasha.uae@gmail.com';

/**
 * Check if a user is the super admin
 */
export function isSuperAdmin(userEmail: string | null | undefined): boolean {
  if (!userEmail) return false;
  return userEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

/**
 * Check if a user has admin privileges
 * Checks both super admin status and Firestore admin collection
 */
export async function isAdmin(userEmail: string | null | undefined): Promise<boolean> {
  if (!userEmail) return false;
  
  // Check if super admin
  if (isSuperAdmin(userEmail)) return true;
  
  // Check Firestore admins collection
  try {
    const { initializeFirebase } = await import('@/firebase');
    const { firestore } = initializeFirebase();
    if (!firestore) return false;
    
    const { doc, getDoc } = await import('firebase/firestore');
    const adminDoc = await getDoc(doc(firestore, `admins/${userEmail.toLowerCase()}`));
    
    return adminDoc.exists() && adminDoc.data()?.isActive === true;
  } catch (error) {
    console.error('[Admin] Error checking admin status:', error);
    return false;
  }
}

/**
 * Add a new admin user (can only be done by super admin)
 */
export async function addAdmin(
  email: string,
  addedBy: string,
  firestore: any
): Promise<void> {
  if (!firestore) throw new Error('Firestore not initialized');
  
  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
  
  await setDoc(doc(firestore, `admins/${email.toLowerCase()}`), {
    email: email.toLowerCase(),
    isActive: true,
    addedBy,
    addedAt: serverTimestamp(),
  });
}

/**
 * Remove an admin user (can only be done by super admin)
 */
export async function removeAdmin(email: string, firestore: any): Promise<void> {
  if (!firestore) throw new Error('Firestore not initialized');
  
  const { doc, deleteDoc } = await import('firebase/firestore');
  await deleteDoc(doc(firestore, `admins/${email.toLowerCase()}`));
}

/**
 * Get all admin users
 */
export async function getAllAdmins(firestore: any): Promise<Array<{ email: string; addedBy: string; addedAt: any; isSuperAdmin: boolean }>> {
  if (!firestore) return [];
  
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const adminsRef = collection(firestore, 'admins');
    const snapshot = await getDocs(adminsRef);
    
    const admins = snapshot.docs.map(doc => ({
      email: doc.data().email,
      addedBy: doc.data().addedBy || 'System',
      addedAt: doc.data().addedAt,
      isSuperAdmin: isSuperAdmin(doc.data().email),
    }));
    
    // Always include super admin in the list
    const superAdminInList = admins.some(a => isSuperAdmin(a.email));
    if (!superAdminInList) {
      admins.unshift({
        email: SUPER_ADMIN_EMAIL,
        addedBy: 'System',
        addedAt: null,
        isSuperAdmin: true,
      });
    }
    
    return admins;
  } catch (error) {
    console.error('[Admin] Error getting admins:', error);
    return [{
      email: SUPER_ADMIN_EMAIL,
      addedBy: 'System',
      addedAt: null,
      isSuperAdmin: true,
    }];
  }
}
