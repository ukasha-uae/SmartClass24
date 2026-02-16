/**
 * Admin Configuration - Production Safe
 *
 * Uses environment variables and Firestore for admin management.
 * No hardcoded secrets: set NEXT_PUBLIC_SUPER_ADMIN_EMAIL in Firebase hosting / .env.local.
 */

import { logger } from '@/lib/logger';

function getSuperAdminEmail(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL?.trim();
  if (!raw) {
    if (process.env.NODE_ENV === 'production') {
      logger.warn('[Admin Config] NEXT_PUBLIC_SUPER_ADMIN_EMAIL is not set; no super admin access.');
    } else {
      logger.debug('[Admin Config] NEXT_PUBLIC_SUPER_ADMIN_EMAIL not set (dev).');
    }
    return null;
  }
  return raw;
}

/**
 * Check if a user is the super admin
 */
export function isSuperAdmin(userEmail: string | null | undefined): boolean {
  if (!userEmail) return false;
  const superAdmin = getSuperAdminEmail();
  if (!superAdmin) return false;
  const result = userEmail.toLowerCase() === superAdmin.toLowerCase();
  if (process.env.NODE_ENV === 'development') {
    logger.debug('[Admin Config] isSuperAdmin check result', { result });
  }
  return result;
}

/**
 * Check if a user has admin privileges
 * Checks both super admin status and Firestore admin collection
 */
export async function isAdmin(userEmail: string | null | undefined): Promise<boolean> {
  if (!userEmail) {
    logger.debug('[Admin Config] isAdmin: no email provided');
    return false;
  }

  if (isSuperAdmin(userEmail)) return true;

  try {
    const { initializeFirebase } = await import('@/firebase');
    const { firestore } = initializeFirebase();
    if (!firestore) {
      logger.warn('[Admin Config] Firestore not initialized');
      return false;
    }

    const { doc, getDoc } = await import('firebase/firestore');
    const adminDoc = await getDoc(doc(firestore, `admins/${userEmail.toLowerCase()}`));
    return adminDoc.exists() && adminDoc.data()?.isActive === true;
  } catch (error) {
    logger.error('[Admin Config] Error checking admin status', error as Error);
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
    
    // Always include super admin in the list if configured
    const superAdminEmail = getSuperAdminEmail();
    if (superAdminEmail) {
      const superAdminInList = admins.some(a => isSuperAdmin(a.email));
      if (!superAdminInList) {
        admins.unshift({
          email: superAdminEmail,
          addedBy: 'System',
          addedAt: null,
          isSuperAdmin: true,
        });
      }
    }

    return admins;
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err?.code === 'permission-denied') {
      logger.warn('[Admin] Permission denied - cannot access admins collection');
    } else {
      logger.error('[Admin] Error getting admins', error instanceof Error ? error : new Error(String(error)));
    }
    const superAdminEmail = getSuperAdminEmail();
    if (superAdminEmail) {
      return [{
        email: superAdminEmail,
        addedBy: 'System',
        addedAt: null,
        isSuperAdmin: true,
      }];
    }
    return [];
  }
}
