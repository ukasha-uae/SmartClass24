/**
 * Cloud Functions for Multi-Tenant Auth Claims
 * 
 * Sets tenantId claim on user tokens automatically
 * - onUserCreate: Sets default tenant on user creation
 * - setUserTenantClaim: Callable function for manual tenant assignment
 * 
 * @module functions/auth-tenant-claims
 * @version 1.0.0 (Simplified)
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Resolve tenant for a user
 * 
 * Priority:
 * 1. Explicitly assigned tenant (from admins/manual assignment)
 * 2. Email domain matching (e.g., @wisdomwarehouse.com → wisdomwarehouse)
 * 3. Default tenant (smartclass24)
 * 
 * @param email - User's email address
 * @returns tenantId string
 */
async function resolveTenantForUser(email: string): Promise<string> {
  if (!email) return 'smartclass24'; // Default tenant
  
  // Check for domain-based tenant assignment
  const domain = email.split('@')[1];
  
  // Domain mapping (expand as needed)
  const domainToTenant: Record<string, string> = {
    'wisdomwarehouse.com': 'wisdomwarehouse',
    'wisdomwarehouse.org': 'wisdomwarehouse',
    'smartclass24.app': 'smartclass24',
    'smartclass24.com': 'smartclass24',
  };
  
  if (domain && domainToTenant[domain]) {
    return domainToTenant[domain];
  }
  
  // Default to smartclass24 tenant
  return 'smartclass24';
}

/**
 * Cloud Function: Set tenant claim on user creation
 * 
 * Triggered automatically when a new user is created
 * Sets tenantId claim based on email domain
 * 
 * @example
 * // User signs up with user@wisdomwarehouse.com
 * // → tenantId claim set to 'wisdomwarehouse'
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const { uid, email } = user;
  
  console.log('[onUserCreate] Processing user:', { uid, email });
  
  // Resolve tenant for the user
  const tenantId = await resolveTenantForUser(email || '');
  
  console.log('[onUserCreate] Resolved tenant:', { uid, tenantId });
  
  // Set custom claim
  try {
    await admin.auth().setCustomUserClaims(uid, {
      tenantId,
      admin: false,
      superAdmin: false,
    });
    
    console.log('[onUserCreate] Claims set successfully:', { uid, tenantId });
    
    // Update user metadata in Firestore (optional, for analytics)
    await db.collection('users').doc(uid).set({
      email,
      tenantId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    
    return { success: true, tenantId };
  } catch (error) {
    console.error('[onUserCreate] Error setting claims:', error);
    throw new functions.https.HttpsError('internal', 'Failed to set tenant claim');
  }
});

/**
 * Cloud Function: Manually set user tenant claim
 * 
 * Callable function for admins to assign users to tenants
 * Requires superAdmin=true claim on calling user
 * 
 * @example
 * ```typescript
 * const setTenant = httpsCallable(functions, 'setUserTenantClaim');
 * await setTenant({ 
 *   userId: 'abc123', 
 *   tenantId: 'wisdomwarehouse' 
 * });
 * ```
 */
export const setUserTenantClaim = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  
  // Check authorization (must be super admin)
  if (!context.auth.token.superAdmin) {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Only super admins can set tenant claims'
    );
  }
  
  const { userId, tenantId } = data;
  
  // Validate inputs
  if (!userId || typeof userId !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'userId is required');
  }
  
  if (!tenantId || typeof tenantId !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'tenantId is required');
  }
  
  // Validate tenant exists (check tenant registry)
  const validTenants = ['smartclass24', 'wisdomwarehouse', 'demo'];
  if (!validTenants.includes(tenantId)) {
    throw new functions.https.HttpsError(
      'invalid-argument', 
      `Invalid tenant: ${tenantId}`
    );
  }
  
  console.log('[setUserTenantClaim] Setting tenant claim:', { 
    userId, 
    tenantId, 
    callerUid: context.auth.uid 
  });
  
  try {
    // Get existing claims
    const user = await admin.auth().getUser(userId);
    const existingClaims = user.customClaims || {};
    
    // Update claims with new tenantId
    await admin.auth().setCustomUserClaims(userId, {
      ...existingClaims,
      tenantId,
    });
    
    console.log('[setUserTenantClaim] Claims updated:', { userId, tenantId });
    
    // Update user metadata in Firestore
    await db.collection('users').doc(userId).set({
      tenantId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: context.auth.uid,
    }, { merge: true });
    
    return { 
      success: true, 
      userId, 
      tenantId,
      message: `User ${userId} assigned to tenant ${tenantId}` 
    };
  } catch (error) {
    console.error('[setUserTenantClaim] Error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to set tenant claim');
  }
});

/**
 * Cloud Function: Set super admin claim
 * 
 * Callable function to promote user to super admin
 * Requires existing superAdmin claim on calling user
 * 
 * @example
 * ```typescript
 * const setSuperAdmin = httpsCallable(functions, 'setSuperAdminClaim');
 * await setSuperAdmin({ userId: 'abc123' });
 * ```
 */
export const setSuperAdminClaim = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  
  // Check authorization (must be super admin)
  if (!context.auth.token.superAdmin) {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Only super admins can set super admin claims'
    );
  }
  
  const { userId } = data;
  
  if (!userId || typeof userId !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'userId is required');
  }
  
  console.log('[setSuperAdminClaim] Setting super admin claim:', { 
    userId, 
    callerUid: context.auth.uid 
  });
  
  try {
    // Get existing claims
    const user = await admin.auth().getUser(userId);
    const existingClaims = user.customClaims || {};
    
    // Update claims
    await admin.auth().setCustomUserClaims(userId, {
      ...existingClaims,
      superAdmin: true,
      admin: true,
    });
    
    console.log('[setSuperAdminClaim] Super admin claim set:', { userId });
    
    // Update user metadata in Firestore
    await db.collection('users').doc(userId).set({
      superAdmin: true,
      admin: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: context.auth.uid,
    }, { merge: true });
    
    return { 
      success: true, 
      userId,
      message: `User ${userId} is now a super admin` 
    };
  } catch (error) {
    console.error('[setSuperAdminClaim] Error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to set super admin claim');
  }
});
