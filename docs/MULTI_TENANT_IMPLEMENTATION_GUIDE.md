# 🚀 Multi-Tenant Implementation Guide
## Practical Steps to Enable White-Label Deployments

> **Goal**: Step-by-step guide to implement the white-label architecture for SmartClass24

---

## 📋 Prerequisites

Before starting implementation:
- ✅ Read [WHITE_LABEL_ARCHITECTURE.md](./WHITE_LABEL_ARCHITECTURE.md)
- ✅ Backup current Firebase database
- ✅ Test current tenant system (`src/tenancy/`)
- ✅ Have Dubai institution details ready

---

## 🎯 Implementation Phases

## Phase 1: Enhance Tenant Configuration (Day 1-2)

### Step 1.1: Update Tenant Types

**Edit** [src/tenancy/types.ts](../src/tenancy/types.ts):

```typescript
export type TenantTier = 'free' | 'standard' | 'premium' | 'enterprise';

export interface TenantBranding {
  name: string;
  shortName: string;
  logoUrl?: string;
  faviconUrl?: string;
  supportEmail?: string;
  domain: string;
  themeColor: string;
  colors: {
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    ring: string;
    background: string;
    foreground: string;
  };
}

// NEW: Institution details
export interface TenantInstitution {
  name: string;
  type: 'school' | 'district' | 'university' | 'corporate' | 'platform';
  country: string;              // ISO 3166-1 alpha-2 code
  timezone: string;             // IANA timezone
  language: string;             // Primary language (en, ar, fr, etc.)
  supportedLanguages?: string[]; // Additional languages
  contactEmail: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
}

// NEW: Content strategy configuration
export interface TenantContentStrategy {
  mode: 'regional' | 'custom' | 'hybrid';
  
  regionalContent?: {
    enabled: boolean;
    countries: ('ghana' | 'nigeria' | 'sierra-leone' | 'liberia' | 'gambia')[];
    localization: 'auto' | 'manual';
  };
  
  customContent?: {
    enabled: boolean;
    curriculum?: string;
    dataSource?: string;
    subjectsEnabled: string[];
  };
  
  licensing: {
    includeJHS: boolean;
    includeSHS: boolean;
    includeUniversity: boolean;
    includeVirtualLabs: boolean;
    includeArenaChallenge: boolean;
  };
}

// NEW: Deployment configuration
export interface TenantDeployment {
  mode: 'shared' | 'dedicated';
  firebaseProject?: string;
  customDomain?: string;
  cdn?: string;
  region?: string;
}

// NEW: Integration settings
export interface TenantIntegrations {
  paymentProvider?: 'stripe' | 'paypal' | 'mtn-momo' | 'custom';
  paymentApiKey?: string;
  smsProvider?: 'twilio' | 'custom';
  smsApiKey?: string;
  analytics?: 'google' | 'mixpanel' | 'custom';
  analyticsId?: string;
  lms?: {
    type: 'moodle' | 'canvas' | 'blackboard' | 'none';
    apiEndpoint?: string;
  };
}

// UPDATED: Main tenant config
export interface TenantConfig {
  id: string;
  slug: string;
  branding: TenantBranding;
  features: TenantFeatures;
  licensing: TenantLicensing;
  
  // NEW FIELDS
  institution: TenantInstitution;
  contentStrategy: TenantContentStrategy;
  deployment: TenantDeployment;
  integrations: TenantIntegrations;
  
  // Keep existing firebase config for backwards compatibility
  firebase: {
    projectId: string;
    region: string;
  };
  
  // DEPRECATED: Use contentStrategy instead
  content?: {
    curriculum: 'ghana' | 'custom';
    subjectsEnabled: string[];
  };
  
  // Metadata
  status?: 'active' | 'suspended' | 'trial';
  createdAt?: string;
  updatedAt?: string;
}
```

### Step 1.2: Update Existing Tenant Registry

**Edit** [src/tenancy/registry.ts](../src/tenancy/registry.ts):

```typescript
import type { TenantConfig } from './types';

const DEFAULT_TENANT_ID = 'smartclass24';

export const TENANT_REGISTRY: Record<string, TenantConfig> = {
  smartclass24: {
    id: 'smartclass24',
    slug: 'smartclass24',
    status: 'active',
    
    // Existing branding
    branding: {
      name: 'Smartclass24',
      shortName: 'Smartclass24',
      domain: 'smartclass24.app',
      themeColor: '#7c3aed',
      colors: {
        primary: '18 35% 25%',
        primaryForeground: '0 0% 98%',
        accent: '0 0% 0%',
        accentForeground: '0 0% 98%',
        ring: '18 35% 25%',
        background: '34 50% 95%',
        foreground: '18 35% 15%',
      },
    },
    
    // NEW: Institution details
    institution: {
      name: 'SmartClass24',
      type: 'platform',
      country: 'GH',
      timezone: 'Africa/Accra',
      language: 'en',
      contactEmail: 'support@smartclass24.app',
      website: 'https://smartclass24.app',
    },
    
    // NEW: Content strategy
    contentStrategy: {
      mode: 'regional',
      regionalContent: {
        enabled: true,
        countries: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'],
        localization: 'auto',
      },
      customContent: {
        enabled: false,
        subjectsEnabled: [],
      },
      licensing: {
        includeJHS: true,
        includeSHS: true,
        includeUniversity: true,
        includeVirtualLabs: true,
        includeArenaChallenge: true,
      },
    },
    
    // NEW: Deployment config
    deployment: {
      mode: 'shared',
      region: 'europe-west3',
    },
    
    // NEW: Integrations
    integrations: {
      paymentProvider: 'stripe',
      analytics: 'google',
    },
    
    // Existing features
    features: {
      enableParentDashboard: true,
      enableOfflineMode: true,
      enableCustomContent: true,
      enableReferrals: true,
    },
    
    // Existing licensing
    licensing: {
      tier: 'enterprise',
      status: 'active',
      seatsPurchased: 0,
      seatsUsed: 0,
      limits: {
        maxStudents: 100000,
        maxTeachers: 2000,
        maxCampuses: 200,
      },
    },
    
    firebase: {
      projectId: 'smartclass24',
      region: 'europe-west3',
    },
    
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2026-02-02T00:00:00Z',
  },
  
  // NEW: Dubai tenant
  dubaiinstitute: {
    id: 'dubaiinstitute',
    slug: 'dubaiinstitute',
    status: 'active',
    
    branding: {
      name: 'Dubai International Institute',
      shortName: 'DII',
      domain: 'dii.smartclass24.app',
      logoUrl: 'https://storage.googleapis.com/smartclass24-assets/tenants/dubaiinstitute/logo.png',
      faviconUrl: 'https://storage.googleapis.com/smartclass24-assets/tenants/dubaiinstitute/favicon.ico',
      supportEmail: 'support@dubaiinstitute.ae',
      themeColor: '#D4AF37',
      colors: {
        primary: '42 100% 50%',
        primaryForeground: '0 0% 10%',
        accent: '210 100% 50%',
        accentForeground: '0 0% 100%',
        ring: '42 100% 50%',
        background: '0 0% 98%',
        foreground: '0 0% 10%',
      },
    },
    
    institution: {
      name: 'Dubai International Institute',
      type: 'school',
      country: 'AE',
      timezone: 'Asia/Dubai',
      language: 'en',
      supportedLanguages: ['en', 'ar'],
      contactEmail: 'admin@dubaiinstitute.ae',
      website: 'https://dubaiinstitute.ae',
      address: {
        city: 'Dubai',
        country: 'AE',
      },
    },
    
    contentStrategy: {
      mode: 'custom',
      regionalContent: {
        enabled: false,
        countries: [],
        localization: 'manual',
      },
      customContent: {
        enabled: true,
        curriculum: 'UAE KHDA',
        subjectsEnabled: [
          'Mathematics',
          'Science',
          'English Language',
          'Arabic',
          'Islamic Studies',
          'UAE Social Studies',
        ],
      },
      licensing: {
        includeJHS: false,
        includeSHS: false,
        includeUniversity: false,
        includeVirtualLabs: true,
        includeArenaChallenge: true,
      },
    },
    
    deployment: {
      mode: 'shared',
      customDomain: 'learning.dubaiinstitute.ae',
      region: 'europe-west3',
    },
    
    integrations: {
      paymentProvider: 'stripe',
      smsProvider: 'twilio',
      analytics: 'google',
    },
    
    features: {
      enableParentDashboard: true,
      enableOfflineMode: false,
      enableCustomContent: true,
      enableReferrals: false,
    },
    
    licensing: {
      tier: 'premium',
      status: 'active',
      seatsPurchased: 2000,
      seatsUsed: 0,
      renewalDate: '2027-02-01',
      billingEmail: 'billing@dubaiinstitute.ae',
      limits: {
        maxStudents: 2000,
        maxTeachers: 100,
        maxCampuses: 3,
      },
    },
    
    firebase: {
      projectId: 'smartclass24',
      region: 'europe-west3',
    },
    
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-02T00:00:00Z',
  },
};

// Existing functions
export function getDefaultTenant(): TenantConfig {
  return TENANT_REGISTRY[DEFAULT_TENANT_ID];
}

export function getTenantById(tenantId?: string | null): TenantConfig | null {
  if (!tenantId) return null;
  return TENANT_REGISTRY[tenantId] ?? null;
}

export function getTenantByHost(hostname?: string | null): TenantConfig | null {
  if (!hostname) return null;
  const normalizedHost = hostname.replace(/^www\./, '').toLowerCase();
  const match = Object.values(TENANT_REGISTRY).find(
    tenant => tenant.branding.domain.toLowerCase() === normalizedHost,
  );
  return match ?? null;
}

// NEW: Custom domain matching
export function getTenantByCustomDomain(hostname?: string | null): TenantConfig | null {
  if (!hostname) return null;
  const normalizedHost = hostname.replace(/^www\./, '').toLowerCase();
  const match = Object.values(TENANT_REGISTRY).find(
    tenant => tenant.deployment?.customDomain?.toLowerCase() === normalizedHost
  );
  return match ?? null;
}
```

### Step 1.3: Create Tenant Hook

**Create** [src/hooks/useTenant.ts](../src/hooks/useTenant.ts):

```typescript
'use client';

import { useMemo } from 'react';
import { resolveTenantFromWindow } from '@/tenancy/resolveTenant';
import type { TenantConfig } from '@/tenancy/types';

export interface UseTenantResult {
  tenant: TenantConfig;
  tenantId: string;
  branding: TenantConfig['branding'];
  features: TenantConfig['features'];
  institution: TenantConfig['institution'];
  contentStrategy: TenantConfig['contentStrategy'];
  isEnterprise: boolean;
  isPremium: boolean;
  hasActiveLicense: boolean;
  isCustomContent: boolean;
  isRegionalContent: boolean;
  isHybridContent: boolean;
}

/**
 * Hook to access current tenant configuration
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { tenant, branding, isCustomContent } = useTenant();
 *   
 *   return (
 *     <div>
 *       <h1>{branding.name}</h1>
 *       {isCustomContent && <p>Custom curriculum enabled</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTenant(): UseTenantResult {
  const tenant = useMemo<TenantConfig>(() => resolveTenantFromWindow(), []);
  
  return {
    tenant,
    tenantId: tenant.id,
    branding: tenant.branding,
    features: tenant.features,
    institution: tenant.institution,
    contentStrategy: tenant.contentStrategy,
    
    // Computed properties
    isEnterprise: tenant.licensing.tier === 'enterprise',
    isPremium: tenant.licensing.tier === 'premium' || tenant.licensing.tier === 'enterprise',
    hasActiveLicense: tenant.licensing.status === 'active' || tenant.licensing.status === 'trial',
    isCustomContent: tenant.contentStrategy.mode === 'custom',
    isRegionalContent: tenant.contentStrategy.mode === 'regional',
    isHybridContent: tenant.contentStrategy.mode === 'hybrid',
  };
}
```

### Step 1.4: Update Tenant Resolution

**Edit** [src/tenancy/resolveTenant.ts](../src/tenancy/resolveTenant.ts):

```typescript
import type { TenantConfig } from './types';
import { 
  getDefaultTenant, 
  getTenantByHost, 
  getTenantById,
  getTenantByCustomDomain 
} from './registry';

export function resolveTenant({
  tenantId,
  hostname,
}: {
  tenantId?: string | null;
  hostname?: string | null;
}): TenantConfig {
  // Priority 1: Environment variable (highest priority)
  if (tenantId) {
    const tenant = getTenantById(tenantId);
    if (tenant) {
      console.log('[Tenant] Resolved from environment:', tenantId);
      return tenant;
    }
  }
  
  // Priority 2: Primary domain matching (smartclass24.app, dii.smartclass24.app)
  if (hostname) {
    const tenant = getTenantByHost(hostname);
    if (tenant) {
      console.log('[Tenant] Resolved from domain:', hostname);
      return tenant;
    }
    
    // Priority 3: Custom domain matching (learning.dubaiinstitute.ae)
    const customDomainTenant = getTenantByCustomDomain(hostname);
    if (customDomainTenant) {
      console.log('[Tenant] Resolved from custom domain:', hostname);
      return customDomainTenant;
    }
  }
  
  // Priority 4: Default tenant
  console.log('[Tenant] Using default tenant');
  return getDefaultTenant();
}

export function resolveTenantFromWindow(): TenantConfig {
  if (typeof window === 'undefined') {
    return getDefaultTenant();
  }

  const hostname = window.location.hostname;
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID ?? null;
  return resolveTenant({ tenantId, hostname });
}
```

---

## Phase 2: Firestore Multi-Tenancy (Day 3-4)

### Step 2.1: Update Firestore Security Rules

**Edit** [firestore.rules](../firestore.rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================
    
    // Check if user belongs to a specific tenant
    function belongsToTenant(tenantId) {
      return request.auth != null && 
             request.auth.token.tenantId == tenantId;
    }
    
    // Check if user is super admin (can access all tenants)
    function isSuperAdmin() {
      return request.auth != null && 
             request.auth.token.superAdmin == true;
    }
    
    // Check if user is admin of their tenant
    function isTenantAdmin(tenantId) {
      return request.auth != null && 
             belongsToTenant(tenantId) &&
             request.auth.token.admin == true;
    }
    
    // =========================================================================
    // TENANT REGISTRY (Super Admin Only)
    // =========================================================================
    
    match /tenants/{tenantId} {
      // Allow tenant users to read their own tenant config
      allow read: if belongsToTenant(tenantId) || isSuperAdmin();
      // Only super admins can write
      allow write: if isSuperAdmin();
      
      match /{subcollection}/{docId} {
        allow read: if belongsToTenant(tenantId) || isSuperAdmin();
        allow write: if isSuperAdmin();
      }
    }
    
    // =========================================================================
    // TENANT-SCOPED COLLECTIONS
    // =========================================================================
    
    // Tenant-scoped students
    match /{tenantId}_students/{studentId} {
      allow read: if request.auth != null && (
        request.auth.uid == studentId ||
        belongsToTenant(tenantId) ||
        isSuperAdmin()
      );
      allow create, update: if request.auth != null && 
        request.auth.uid == studentId &&
        (belongsToTenant(tenantId) || isSuperAdmin());
      allow delete: if false;
      
      // Student sub-collections (quizAttempts, progress, etc.)
      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null && 
          request.auth.uid == studentId &&
          (belongsToTenant(tenantId) || isSuperAdmin());
      }
    }
    
    // Tenant-scoped content (custom curriculum)
    match /{tenantId}_content/{document=**} {
      // Anyone in tenant can read
      allow read: if belongsToTenant(tenantId) || isSuperAdmin();
      // Only tenant admins can write
      allow write: if isTenantAdmin(tenantId) || isSuperAdmin();
    }
    
    // Tenant-scoped challenges
    match /{tenantId}_challenges/{challengeId} {
      allow read: if belongsToTenant(tenantId) || isSuperAdmin();
      allow create, update: if belongsToTenant(tenantId) || isSuperAdmin();
      allow delete: if isTenantAdmin(tenantId) || isSuperAdmin();
    }
    
    // Tenant-scoped notifications
    match /{tenantId}_users/{userId}/notifications/{notificationId} {
      allow read: if request.auth != null && 
        request.auth.uid == userId &&
        belongsToTenant(tenantId);
      allow create: if request.auth != null && belongsToTenant(tenantId);
      allow update, delete: if request.auth != null && 
        request.auth.uid == userId &&
        belongsToTenant(tenantId);
    }
    
    // =========================================================================
    // SHARED CONTENT (Read-only for all tenants)
    // =========================================================================
    
    match /shared_content/{document=**} {
      // Public read for all authenticated users
      allow read: if request.auth != null;
      // Only super admins can write
      allow write: if isSuperAdmin();
    }
    
    // =========================================================================
    // ANALYTICS (Per-tenant, admin access)
    // =========================================================================
    
    match /analytics/{tenantId}/{document=**} {
      allow read: if isTenantAdmin(tenantId) || isSuperAdmin();
      allow write: if belongsToTenant(tenantId) || isSuperAdmin();
    }
    
    // =========================================================================
    // LEGACY COLLECTIONS (Backwards compatibility)
    // =========================================================================
    
    // Legacy students collection (redirect to smartclass24_students)
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
        request.auth.uid == studentId;
      allow delete: if false;
    }
    
    // Legacy challenges (redirect to smartclass24_challenges)
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null;
      allow delete: if false;
    }
    
    // Catch-all (deny by default)
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 2.2: Create Firestore Utilities

**Create** [src/lib/firestore-tenant-utils.ts](../src/lib/firestore-tenant-utils.ts):

```typescript
import type { TenantConfig } from '@/tenancy/types';
import { collection, doc, type Firestore } from 'firebase/firestore';

/**
 * Get tenant-scoped collection path
 */
export function getTenantCollection(
  tenantId: string,
  collectionName: 'students' | 'content' | 'challenges' | 'users'
): string {
  return `${tenantId}_${collectionName}`;
}

/**
 * Get tenant-scoped collection reference
 */
export function tenantCollection(
  firestore: Firestore,
  tenant: TenantConfig,
  collectionName: 'students' | 'content' | 'challenges' | 'users'
) {
  return collection(firestore, getTenantCollection(tenant.id, collectionName));
}

/**
 * Get tenant-scoped document reference
 */
export function tenantDoc(
  firestore: Firestore,
  tenant: TenantConfig,
  collectionName: 'students' | 'content' | 'challenges' | 'users',
  docId: string
) {
  return doc(firestore, getTenantCollection(tenant.id, collectionName), docId);
}

/**
 * Get shared content collection reference
 */
export function sharedContentCollection(
  firestore: Firestore,
  country: 'ghana' | 'nigeria' | 'sierra-leone' | 'liberia' | 'gambia',
  contentType: 'jhs' | 'shs' | 'labs'
) {
  return collection(firestore, 'shared_content', country, contentType);
}
```

---

## Phase 3: Authentication with Tenant Claims (Day 5-6)

### Step 3.1: Create Cloud Functions

**Create** [functions/src/auth.ts](../functions/src/auth.ts):

```typescript
import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Set custom claims for a user (tenant ID, admin status, etc.)
 */
export const setUserClaims = functions.https.onCall(async (request) => {
  const { userId, claims } = request.data;
  const caller = request.auth;
  
  // Verify caller is authenticated
  if (!caller) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to set claims'
    );
  }
  
  // Verify caller is super admin (has superAdmin claim)
  const callerToken = await admin.auth().getUser(caller.uid);
  if (!callerToken.customClaims?.superAdmin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only super admins can set user claims'
    );
  }
  
  // Set custom claims
  await admin.auth().setCustomUserClaims(userId, claims);
  
  return { success: true, claims };
});

/**
 * Automatically set tenant claim when user signs up
 * Triggered by Firebase Authentication onCreate event
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  // Determine tenant from environment or default
  const tenantId = process.env.TENANT_ID || 'smartclass24';
  
  console.log(`[onUserCreate] Setting tenant claim for user ${user.uid}: ${tenantId}`);
  
  // Set tenant claim
  await admin.auth().setCustomUserClaims(user.uid, {
    tenantId,
    createdAt: new Date().toISOString(),
  });
  
  // Create user document in tenant-scoped collection
  await admin.firestore()
    .collection(`${tenantId}_users`)
    .doc(user.uid)
    .set({
      tenantId,
      email: user.email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  
  return null;
});

/**
 * Migrate existing users to tenant-scoped collections
 * Call this once to migrate data
 */
export const migrateUsersToTenants = functions.https.onCall(async (request) => {
  const caller = request.auth;
  
  // Verify super admin
  if (!caller) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated');
  }
  
  const callerToken = await admin.auth().getUser(caller.uid);
  if (!callerToken.customClaims?.superAdmin) {
    throw new functions.https.HttpsError('permission-denied', 'Must be super admin');
  }
  
  // Get all users from legacy 'students' collection
  const studentsSnapshot = await admin.firestore().collection('students').get();
  
  let migrated = 0;
  let errors = 0;
  
  // Migrate each student
  for (const doc of studentsSnapshot.docs) {
    try {
      const studentData = doc.data();
      const userId = doc.id;
      
      // Default to smartclass24 tenant
      const tenantId = 'smartclass24';
      
      // Set tenant claim
      await admin.auth().setCustomUserClaims(userId, {
        tenantId,
        migratedAt: new Date().toISOString(),
      });
      
      // Copy to tenant-scoped collection
      await admin.firestore()
        .collection(`${tenantId}_students`)
        .doc(userId)
        .set({
          ...studentData,
          tenantId,
          migratedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      
      migrated++;
    } catch (error) {
      console.error(`Failed to migrate user ${doc.id}:`, error);
      errors++;
    }
  }
  
  return { migrated, errors };
});
```

### Step 3.2: Deploy Cloud Functions

```bash
# Initialize Firebase Functions (if not already done)
firebase init functions

# Install dependencies
cd functions
npm install firebase-admin firebase-functions

# Deploy functions
firebase deploy --only functions
```

### Step 3.3: Update Firebase Authentication

**Edit** [src/firebase/non-blocking-login.tsx](../src/firebase/non-blocking-login.tsx):

Add tenant-aware authentication:

```typescript
import { signInAnonymously, type Auth, type User } from 'firebase/auth';
import { httpsCallable, getFunctions } from 'firebase/functions';

/**
 * Sign in anonymously with tenant context
 */
export async function signInAnonymouslyWithTenant(
  auth: Auth,
  tenantId: string
): Promise<User> {
  // Sign in anonymously
  const userCredential = await signInAnonymously(auth);
  
  // Set tenant claim via Cloud Function
  const functions = getFunctions();
  const setClaimsFunction = httpsCallable(functions, 'setUserClaims');
  
  try {
    await setClaimsFunction({
      userId: userCredential.user.uid,
      claims: { tenantId },
    });
  } catch (error) {
    console.error('[Auth] Failed to set tenant claim:', error);
    // Continue anyway - claim will be set by onUserCreate trigger
  }
  
  return userCredential.user;
}
```

---

## Phase 4: Component Updates (Day 7-8)

### Step 4.1: Update Header Component

**Edit** [src/components/Header.tsx](../src/components/Header.tsx):

```typescript
import { useTenant } from '@/hooks/useTenant';

export default function Header() {
  const { branding } = useTenant();
  
  return (
    <header>
      <Link href="/">
        {branding.logoUrl ? (
          <Image
            src={branding.logoUrl}
            alt={branding.name}
            width={32}
            height={32}
          />
        ) : (
          <span className="font-bold">{branding.shortName}</span>
        )}
      </Link>
      {/* ... rest of header ... */}
    </header>
  );
}
```

### Step 4.2: Create Tenant Logo Component

**Create** [src/components/tenancy/TenantLogo.tsx](../src/components/tenancy/TenantLogo.tsx):

```typescript
'use client';

import Image from 'next/image';
import { useTenant } from '@/hooks/useTenant';

interface TenantLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  className?: string;
}

const sizes = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

export function TenantLogo({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}: TenantLogoProps) {
  const { branding } = useTenant();
  
  const logoUrl = variant === 'icon' 
    ? branding.faviconUrl || branding.logoUrl
    : branding.logoUrl;
  
  if (!logoUrl) {
    return (
      <div className={`flex items-center ${className}`}>
        <span className="font-bold text-lg">{branding.shortName}</span>
      </div>
    );
  }
  
  return (
    <Image
      src={logoUrl}
      alt={`${branding.name} logo`}
      width={sizes[size]}
      height={sizes[size]}
      className={className}
      priority
    />
  );
}
```

---

## Phase 5: Testing (Day 9-10)

### Step 5.1: Local Testing

```bash
# Test with default tenant (Ghana)
npm run dev
# Visit: http://localhost:9002

# Test with Dubai tenant (environment variable)
NEXT_PUBLIC_TENANT_ID=dubaiinstitute npm run dev
# Visit: http://localhost:9002
```

### Step 5.2: Domain Testing

Add to your `hosts` file for local testing:

```
# C:\Windows\System32\drivers\etc\hosts (Windows)
# /etc/hosts (Mac/Linux)

127.0.0.1 smartclass24.local
127.0.0.1 dii.smartclass24.local
127.0.0.1 learning.dubaiinstitute.local
```

Then visit:
- `http://smartclass24.local:9002` → Ghana tenant
- `http://dii.smartclass24.local:9002` → Dubai tenant
- `http://learning.dubaiinstitute.local:9002` → Dubai tenant (custom domain)

### Step 5.3: Production Deployment

```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy

# Deploy specific targets
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only functions
```

---

## 📊 Verification Checklist

### Tenant Resolution
- [ ] Default tenant (smartclass24.app) loads correctly
- [ ] Dubai tenant (dii.smartclass24.app) loads with Dubai branding
- [ ] Custom domain (learning.dubaiinstitute.ae) resolves to Dubai tenant
- [ ] Logo displays correctly for each tenant
- [ ] Theme colors apply correctly

### Data Isolation
- [ ] Students in Ghana tenant can't see Dubai tenant data
- [ ] Students in Dubai tenant can't see Ghana tenant data
- [ ] Challenges are tenant-scoped
- [ ] Quiz attempts are tenant-scoped

### Content Access
- [ ] Ghana tenant has access to JHS/SHS content
- [ ] Dubai tenant has access to custom content (if uploaded)
- [ ] Dubai tenant has access to virtual labs (if licensed)
- [ ] Arena challenges work for both tenants

### Authentication
- [ ] New users get correct tenant claim
- [ ] Existing users can be migrated with Cloud Function
- [ ] User tokens include `tenantId` claim
- [ ] Security rules enforce tenant boundaries

---

## 🚨 Common Issues & Solutions

### Issue 1: Tenant not resolving correctly
**Solution**: Check `console.log` in [resolveTenant.ts](../src/tenancy/resolveTenant.ts). Verify domain name matches exactly.

### Issue 2: Firestore permission denied
**Solution**: Check security rules. Make sure user token has `tenantId` claim. Run Cloud Function to set claims.

### Issue 3: Theme not applying
**Solution**: Check `TenantThemeProvider` is in layout. Verify CSS variables are correct format (HSL values).

### Issue 4: Logo not displaying
**Solution**: Check logo URL is accessible. Use fallback text logo if URL is missing.

---

## 📚 Next Steps

1. ✅ **Complete Phase 1-5** (base implementation)
2. **Build admin dashboard** for tenant management
3. **Implement content upload** for custom curriculum
4. **Add billing integration** (Stripe)
5. **Create onboarding flow** for new institutions
6. **Build analytics dashboard** per tenant
7. **Add multi-language support** (Arabic for Dubai)

---

## 📞 Support

For questions or issues:
- Review [WHITE_LABEL_ARCHITECTURE.md](./WHITE_LABEL_ARCHITECTURE.md)
- Check Firestore rules and security
- Test with `console.log` in tenant resolution
- Verify Cloud Functions are deployed

---

**Document Status**: ✅ Complete  
**Last Updated**: February 2, 2026  
**Version**: 1.0
