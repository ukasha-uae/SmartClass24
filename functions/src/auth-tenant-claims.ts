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
import * as crypto from 'crypto';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

type TenantAccessKeyDoc = {
  tenantId: string;
  label: string;
  createdBy: string;
  createdAt: admin.firestore.FieldValue;
  expiresAt?: admin.firestore.Timestamp;
  maxUses?: number;
  uses: number;
  isActive: boolean;
};

function isPrivilegedCaller(context: functions.https.CallableContext): boolean {
  if (!context.auth) return false;
  return context.auth.token.superAdmin === true || context.auth.token.admin === true;
}

function normalizeAccessKey(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '');
}

function hashAccessKey(normalizedKey: string): string {
  return crypto.createHash('sha256').update(normalizedKey).digest('hex');
}

function generateAccessKey(tenantId: string): string {
  const prefix = tenantId.slice(0, 6).toUpperCase();
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  const timePart = Date.now().toString(36).toUpperCase().slice(-4);
  return `${prefix}-${timePart}-${randomPart}`;
}

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

/**
 * Create tenant access key (admin only).
 */
export const createTenantAccessKey = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  if (!isPrivilegedCaller(context)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const tenantId = typeof data?.tenantId === 'string' ? data.tenantId.trim() : '';
  const label = typeof data?.label === 'string' ? data.label.trim() : '';
  const expiresAtRaw = typeof data?.expiresAt === 'string' ? data.expiresAt.trim() : '';
  const maxUsesRaw = typeof data?.maxUses === 'number' ? data.maxUses : undefined;

  if (!tenantId || !/^[a-z0-9-]{2,40}$/.test(tenantId)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid tenantId');
  }
  if (!label) {
    throw new functions.https.HttpsError('invalid-argument', 'label is required');
  }

  let expiresAt: admin.firestore.Timestamp | undefined;
  if (expiresAtRaw) {
    const dt = new Date(expiresAtRaw);
    if (Number.isNaN(dt.getTime())) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid expiresAt');
    }
    expiresAt = admin.firestore.Timestamp.fromDate(dt);
  }

  const maxUses = maxUsesRaw && maxUsesRaw > 0 ? Math.floor(maxUsesRaw) : undefined;

  const key = generateAccessKey(tenantId);
  const keyHash = hashAccessKey(normalizeAccessKey(key));

  const docData: TenantAccessKeyDoc = {
    tenantId,
    label,
    createdBy: context.auth.uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    uses: 0,
    isActive: true,
  };
  if (expiresAt) {
    docData.expiresAt = expiresAt;
  }
  if (typeof maxUses === 'number') {
    docData.maxUses = maxUses;
  }

  await db.collection('tenantAccessKeys').doc(keyHash).set(docData);

  return {
    success: true,
    tenantId,
    accessKey: key,
    keyHash,
    message: 'Tenant access key created',
  };
});

/**
 * List tenant access keys (admin only).
 */
export const listTenantAccessKeys = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  if (!isPrivilegedCaller(context)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const snapshot = await db.collection('tenantAccessKeys').orderBy('createdAt', 'desc').limit(100).get();
  const keys = snapshot.docs.map((doc) => {
    const d = doc.data();
    return {
      keyHash: doc.id,
      tenantId: d.tenantId ?? null,
      label: d.label ?? '',
      uses: d.uses ?? 0,
      maxUses: d.maxUses ?? null,
      isActive: d.isActive === true,
      expiresAt: d.expiresAt?.toDate?.()?.toISOString?.() ?? null,
      createdAt: d.createdAt?.toDate?.()?.toISOString?.() ?? null,
      createdBy: d.createdBy ?? null,
    };
  });

  return { success: true, keys };
});

/**
 * Revoke tenant access key (admin only).
 */
export const revokeTenantAccessKey = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  if (!isPrivilegedCaller(context)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const keyHash = typeof data?.keyHash === 'string' ? data.keyHash.trim() : '';
  if (!keyHash) {
    throw new functions.https.HttpsError('invalid-argument', 'keyHash is required');
  }

  await db.collection('tenantAccessKeys').doc(keyHash).set(
    {
      isActive: false,
      revokedAt: admin.firestore.FieldValue.serverTimestamp(),
      revokedBy: context.auth.uid,
    },
    { merge: true }
  );

  return { success: true };
});

/**
 * Redeem tenant access key (authenticated users).
 */
export const redeemTenantAccessKey = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }

  const rawKey = typeof data?.accessKey === 'string' ? data.accessKey : '';
  if (!rawKey.trim()) {
    throw new functions.https.HttpsError('invalid-argument', 'accessKey is required');
  }

  const normalized = normalizeAccessKey(rawKey);
  const keyHash = hashAccessKey(normalized);
  const userId = context.auth.uid;

  const keyRef = db.collection('tenantAccessKeys').doc(keyHash);
  const redemptionRef = db.collection('tenantAccessRedemptions').doc(`${keyHash}_${userId}`);

  const tenantId = await db.runTransaction(async (tx) => {
    const keySnap = await tx.get(keyRef);
    if (!keySnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Invalid access key');
    }

    const keyData = keySnap.data() as {
      tenantId: string;
      isActive?: boolean;
      uses?: number;
      maxUses?: number;
      expiresAt?: admin.firestore.Timestamp;
    };

    if (!keyData.isActive) {
      throw new functions.https.HttpsError('failed-precondition', 'This access key has been disabled');
    }

    if (keyData.expiresAt && keyData.expiresAt.toDate().getTime() < Date.now()) {
      throw new functions.https.HttpsError('failed-precondition', 'This access key has expired');
    }

    const uses = keyData.uses ?? 0;
    const maxUses = keyData.maxUses;
    if (typeof maxUses === 'number' && uses >= maxUses) {
      throw new functions.https.HttpsError('resource-exhausted', 'This access key has reached its usage limit');
    }

    const existingRedemption = await tx.get(redemptionRef);
    if (!existingRedemption.exists) {
      tx.set(redemptionRef, {
        keyHash,
        tenantId: keyData.tenantId,
        userId,
        redeemedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      tx.update(keyRef, {
        uses: uses + 1,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return keyData.tenantId;
  });

  const user = await admin.auth().getUser(userId);
  const existingClaims = user.customClaims || {};
  await admin.auth().setCustomUserClaims(userId, {
    ...existingClaims,
    tenantId,
  });

  await db.collection('users').doc(userId).set(
    {
      tenantId,
      tenantAccessGrantedAt: admin.firestore.FieldValue.serverTimestamp(),
      tenantAccessSource: 'access_key',
    },
    { merge: true }
  );

  return {
    success: true,
    tenantId,
    message: 'Access key redeemed. Please refresh or sign in again to apply access.',
  };
});

/**
 * Tenant billing overview (admin only).
 * Returns current user counts and key posture per tenant.
 */
export const listTenantBillingOverview = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  if (!isPrivilegedCaller(context)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const [usersSnap, keysSnap] = await Promise.all([
    db.collection('users').get(),
    db.collection('tenantAccessKeys').get(),
  ]);

  const userCounts = new Map<string, number>();
  usersSnap.forEach((doc) => {
    const tenantId = (doc.data()?.tenantId as string | undefined)?.trim();
    if (!tenantId) return;
    userCounts.set(tenantId, (userCounts.get(tenantId) ?? 0) + 1);
  });

  const keyCounts = new Map<string, { activeKeys: number; totalKeys: number }>();
  keysSnap.forEach((doc) => {
    const data = doc.data();
    const tenantId = (data?.tenantId as string | undefined)?.trim();
    if (!tenantId) return;
    const current = keyCounts.get(tenantId) ?? { activeKeys: 0, totalKeys: 0 };
    current.totalKeys += 1;
    if (data?.isActive === true) current.activeKeys += 1;
    keyCounts.set(tenantId, current);
  });

  const tenantIds = new Set<string>([...userCounts.keys(), ...keyCounts.keys()]);
  const tenants = Array.from(tenantIds)
    .map((tenantId) => ({
      tenantId,
      userCount: userCounts.get(tenantId) ?? 0,
      activeKeys: keyCounts.get(tenantId)?.activeKeys ?? 0,
      totalKeys: keyCounts.get(tenantId)?.totalKeys ?? 0,
    }))
    .sort((a, b) => b.userCount - a.userCount);

  return { success: true, tenants };
});

/**
 * Rotate tenant access key (admin only).
 * Creates a new key and revokes currently active keys for the tenant.
 */
export const rotateTenantAccessKey = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  if (!isPrivilegedCaller(context)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const tenantId = typeof data?.tenantId === 'string' ? data.tenantId.trim() : '';
  const label = typeof data?.label === 'string' ? data.label.trim() : '';
  const expiresAtRaw = typeof data?.expiresAt === 'string' ? data.expiresAt.trim() : '';
  const maxUsesRaw = typeof data?.maxUses === 'number' ? data.maxUses : undefined;

  if (!tenantId || !/^[a-z0-9-]{2,40}$/.test(tenantId)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid tenantId');
  }
  if (!label) {
    throw new functions.https.HttpsError('invalid-argument', 'label is required');
  }

  let expiresAt: admin.firestore.Timestamp | undefined;
  if (expiresAtRaw) {
    const dt = new Date(expiresAtRaw);
    if (Number.isNaN(dt.getTime())) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid expiresAt');
    }
    expiresAt = admin.firestore.Timestamp.fromDate(dt);
  }

  const maxUses = maxUsesRaw && maxUsesRaw > 0 ? Math.floor(maxUsesRaw) : undefined;

  const activeKeysSnap = await db
    .collection('tenantAccessKeys')
    .where('tenantId', '==', tenantId)
    .where('isActive', '==', true)
    .get();

  const key = generateAccessKey(tenantId);
  const keyHash = hashAccessKey(normalizeAccessKey(key));
  const now = admin.firestore.FieldValue.serverTimestamp();

  const batch = db.batch();
  activeKeysSnap.forEach((doc) => {
    batch.set(
      doc.ref,
      {
        isActive: false,
        revokedAt: now,
        revokedBy: context.auth?.uid ?? 'system',
        rotationReplacedBy: keyHash,
      },
      { merge: true }
    );
  });

  const docData: TenantAccessKeyDoc = {
    tenantId,
    label,
    createdBy: context.auth.uid,
    createdAt: now,
    uses: 0,
    isActive: true,
  };
  if (expiresAt) docData.expiresAt = expiresAt;
  if (typeof maxUses === 'number') docData.maxUses = maxUses;

  batch.set(db.collection('tenantAccessKeys').doc(keyHash), docData);
  await batch.commit();

  return {
    success: true,
    tenantId,
    accessKey: key,
    keyHash,
    revokedCount: activeKeysSnap.size,
    message: 'Tenant access key rotated',
  };
});

/**
 * Update maxUses for an existing tenant access key (admin only).
 */
export const updateTenantAccessKeyMaxUses = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  if (!isPrivilegedCaller(context)) {
    throw new functions.https.HttpsError('permission-denied', 'Admin access required');
  }

  const keyHash = typeof data?.keyHash === 'string' ? data.keyHash.trim() : '';
  const maxUsesRaw = typeof data?.maxUses === 'number' ? data.maxUses : null;
  if (!keyHash) {
    throw new functions.https.HttpsError('invalid-argument', 'keyHash is required');
  }
  if (maxUsesRaw !== null && (!Number.isFinite(maxUsesRaw) || maxUsesRaw <= 0)) {
    throw new functions.https.HttpsError('invalid-argument', 'maxUses must be a positive number or null');
  }

  const keyRef = db.collection('tenantAccessKeys').doc(keyHash);
  const snap = await keyRef.get();
  if (!snap.exists) {
    throw new functions.https.HttpsError('not-found', 'Access key not found');
  }

  await keyRef.set(
    {
      maxUses: maxUsesRaw === null ? admin.firestore.FieldValue.delete() : Math.floor(maxUsesRaw),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: context.auth.uid,
    },
    { merge: true }
  );

  return { success: true, keyHash };
});
