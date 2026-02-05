# 🌍 White-Label Multi-Tenant Architecture
## SmartClass24 Global Platform Strategy

> **Goal**: Build one global platform that can be easily customized and licensed to institutions worldwide without duplicating code.

---

## 📋 Executive Summary

This document outlines the comprehensive architecture for transforming SmartClass24 into a scalable white-label platform that supports multiple institutions (Dubai, other countries) while maintaining the West African localized experience.

### Current State (✅ Already Built)
- ✅ **Tenancy infrastructure** (`src/tenancy/`)
  - Tenant registry, branding, theme system
  - Domain-based tenant resolution
  - License tiers and feature flags
- ✅ **Localization system** (`src/lib/localization/`)
  - Multi-country support (Ghana, Nigeria, Sierra Leone, Liberia, Gambia)
  - Template variable system for content adaptation
  - Currency, exam, city localization
- ✅ **Campus architecture** (JHS, SHS, University)
- ✅ **Firebase authentication** (anonymous-first, upgradeable)

### What's Needed (🔧 Enhancement Required)
- 🔧 **Enhanced tenant configuration** (institution-level settings)
- 🔧 **Firestore multi-tenancy** (data isolation per institution)
- 🔧 **Content licensing system** (regional vs. custom content)
- 🔧 **Deployment strategy** (single Firebase project vs. per-tenant projects)
- 🔧 **Admin portal** for institution self-service
- 🔧 **Billing/license management integration**

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   SmartClass24 Global Platform               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Ghana      │  │   Dubai      │  │   Nigeria    │     │
│  │ smartclass24 │  │ dubainstitute│  │   lagos.ed   │     │
│  │   .app       │  │   .ae        │  │   .ng        │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                 │                 │               │
│         └─────────────────┴─────────────────┘               │
│                           │                                 │
│              ┌────────────▼────────────┐                    │
│              │  Tenant Resolution      │                    │
│              │  (Domain/Subdomain)     │                    │
│              └────────────┬────────────┘                    │
│                           │                                 │
│         ┌─────────────────┼─────────────────┐              │
│         │                 │                 │              │
│    ┌────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐        │
│    │ Branding │    │  Content  │    │  License  │        │
│    │  Layer   │    │   Layer   │    │   Layer   │        │
│    └──────────┘    └───────────┘    └───────────┘        │
│         │                 │                 │              │
│         └─────────────────┴─────────────────┘              │
│                           │                                 │
│              ┌────────────▼────────────┐                    │
│              │    Core Platform        │                    │
│              │  (Shared Codebase)      │                    │
│              └─────────────────────────┘                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Architecture

### 1. **Tenant Configuration (Enhanced)**

**Current Structure** (`src/tenancy/types.ts`):
```typescript
export interface TenantConfig {
  id: string;                    // Unique identifier
  slug: string;                  // URL-friendly name
  branding: TenantBranding;      // Logo, colors, domain
  features: TenantFeatures;      // Feature toggles
  licensing: TenantLicensing;    // Tier, seats, limits
  firebase: {
    projectId: string;
    region: string;
  };
  content: {
    curriculum: 'ghana' | 'custom';
    subjectsEnabled: string[];
  };
}
```

**🔧 Enhanced Structure** (Add these fields):
```typescript
export interface TenantConfig {
  // ... existing fields ...
  
  // NEW: Institution Details
  institution: {
    name: string;                    // "Dubai International Academy"
    type: 'school' | 'district' | 'university' | 'corporate';
    country: string;                 // ISO country code
    timezone: string;                // IANA timezone
    language: string;                // Primary language (en, ar, fr)
    supportedLanguages: string[];    // Multi-language support
    contactEmail: string;
    website?: string;
  };
  
  // NEW: Content Strategy
  contentStrategy: {
    mode: 'regional' | 'custom' | 'hybrid';
    
    // Regional content (West Africa curriculum)
    regionalContent: {
      enabled: boolean;
      countries: ('ghana' | 'nigeria' | 'sierra-leone' | 'liberia' | 'gambia')[];
      localization: 'auto' | 'manual';  // Auto-localize content
    };
    
    // Custom content (institution-specific)
    customContent: {
      enabled: boolean;
      curriculum: string;           // "UAE KHDA", "IB", "Cambridge"
      dataSource?: string;          // Custom data file reference
      subjectsEnabled: string[];
    };
    
    // Content licensing
    licensing: {
      includeJHS: boolean;
      includeSHS: boolean;
      includeUniversity: boolean;
      includeVirtualLabs: boolean;
      includeArenaChallenge: boolean;
    };
  };
  
  // NEW: Deployment Config
  deployment: {
    mode: 'shared' | 'dedicated';    // Shared Firebase vs. dedicated
    firebaseProject?: string;        // If dedicated
    customDomain?: string;           // Custom domain
    cdn?: string;                    // CDN configuration
  };
  
  // NEW: Integration Settings
  integrations: {
    paymentProvider?: 'stripe' | 'paypal' | 'mtn-momo' | 'custom';
    smsProvider?: 'twilio' | 'custom';
    analytics?: 'google' | 'mixpanel' | 'custom';
    lms?: {
      type: 'moodle' | 'canvas' | 'blackboard' | 'none';
      apiEndpoint?: string;
    };
  };
}
```

---

## 🗄️ Firestore Multi-Tenancy Schema

### Current Problem
- All data currently stored in single namespace
- No tenant isolation in Firestore paths

### Solution: Tenant-Scoped Collections

**NEW Firestore Structure**:
```
firestore/
├── tenants/                              # Tenant registry (admin only)
│   ├── {tenantId}/
│   │   ├── config/                       # Tenant configuration
│   │   │   └── current                   # Latest config
│   │   ├── branding/                     # Branding assets
│   │   │   └── current
│   │   ├── licensing/                    # License info
│   │   │   └── current
│   │   └── users/                        # Tenant user directory
│   │       └── {userId}                  # Basic user info
│   │
├── {tenantId}_students/                  # Tenant-scoped student data
│   └── {studentId}/
│       ├── profile/
│       ├── quizAttempts/
│       ├── progress/
│       └── achievements/
│
├── {tenantId}_content/                   # Tenant-scoped custom content
│   ├── subjects/
│   ├── lessons/
│   └── quizzes/
│
├── {tenantId}_challenges/                # Tenant-scoped challenges
│   └── {challengeId}/
│
├── shared_content/                       # Global content (West Africa)
│   ├── ghana/
│   │   ├── jhs/
│   │   └── shs/
│   ├── nigeria/
│   └── regional_labs/
│
└── analytics/                            # Platform-wide analytics
    └── {tenantId}/
```

**Key Benefits**:
- ✅ **Data isolation** per institution
- ✅ **Shared content** (West Africa curriculum) remains efficient
- ✅ **Custom content** stored per tenant
- ✅ **Easy backup/migration** per tenant
- ✅ **Security rules** per tenant scope

---

## 🔧 Firestore Security Rules (Enhanced)

**Update** `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper: Check if user belongs to tenant
    function belongsToTenant(tenantId) {
      return request.auth.token.tenantId == tenantId;
    }
    
    // Helper: Get user's tenant from their profile
    function getUserTenant(userId) {
      return get(/databases/$(database)/documents/students/$(userId)).data.tenantId;
    }
    
    // =========================================================================
    // TENANT-SCOPED DATA
    // =========================================================================
    
    // Tenant-scoped students
    match /{tenantId}_students/{studentId} {
      allow read: if request.auth != null && (
        request.auth.uid == studentId ||
        belongsToTenant(tenantId)
      );
      allow create, update: if request.auth != null && 
        request.auth.uid == studentId &&
        belongsToTenant(tenantId);
      allow delete: if false;
      
      // Student sub-collections
      match /{subcollection}/{docId} {
        allow read, write: if request.auth != null && 
          request.auth.uid == studentId &&
          belongsToTenant(tenantId);
      }
    }
    
    // Tenant-scoped content
    match /{tenantId}_content/{document=**} {
      // Anyone in tenant can read
      allow read: if request.auth != null && belongsToTenant(tenantId);
      // Only admins can write (check in app code)
      allow write: if request.auth != null && 
        request.auth.token.admin == true &&
        belongsToTenant(tenantId);
    }
    
    // Tenant-scoped challenges
    match /{tenantId}_challenges/{challengeId} {
      allow read: if request.auth != null && belongsToTenant(tenantId);
      allow create, update: if request.auth != null && belongsToTenant(tenantId);
      allow delete: if false;
    }
    
    // =========================================================================
    // SHARED CONTENT (Read-only for all)
    // =========================================================================
    
    match /shared_content/{document=**} {
      allow read: if true;  // Public for all tenants
      allow write: if request.auth != null && 
        request.auth.token.superAdmin == true;  // Only super admin
    }
    
    // =========================================================================
    // TENANT REGISTRY (Admin only)
    // =========================================================================
    
    match /tenants/{tenantId} {
      allow read: if request.auth != null && belongsToTenant(tenantId);
      allow write: if request.auth != null && 
        request.auth.token.superAdmin == true;
      
      match /{subcollection}/{docId} {
        allow read: if request.auth != null && belongsToTenant(tenantId);
        allow write: if request.auth != null && 
          request.auth.token.superAdmin == true;
      }
    }
    
    // =========================================================================
    // ANALYTICS (Per-tenant, admin access)
    // =========================================================================
    
    match /analytics/{tenantId}/{document=**} {
      allow read: if request.auth != null && 
        belongsToTenant(tenantId) &&
        request.auth.token.admin == true;
      allow write: if request.auth != null && belongsToTenant(tenantId);
    }
  }
}
```

---

## 🎨 Branding Layer (Current + Enhancements)

### Current Implementation (✅ Good Foundation)
- `src/tenancy/types.ts` - `TenantBranding` interface
- `src/tenancy/theme.ts` - CSS variable injection
- `src/tenancy/registry.ts` - Tenant registry
- `src/components/tenancy/TenantThemeProvider.tsx` - Theme provider

### 🔧 Enhancements Needed

#### 1. **Logo Management**
**Create** `src/components/tenancy/TenantLogo.tsx`:
```tsx
'use client';

import Image from 'next/image';
import { useTenant } from '@/hooks/useTenant';

interface TenantLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon';
  className?: string;
}

export function TenantLogo({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}: TenantLogoProps) {
  const { tenant } = useTenant();
  
  const sizes = {
    sm: 24,
    md: 32,
    lg: 48,
    xl: 64,
  };
  
  const logoUrl = variant === 'icon' 
    ? tenant.branding.faviconUrl 
    : tenant.branding.logoUrl;
  
  if (!logoUrl) {
    // Fallback to text logo
    return (
      <div className={className}>
        <span className="font-bold">{tenant.branding.shortName}</span>
      </div>
    );
  }
  
  return (
    <Image
      src={logoUrl}
      alt={`${tenant.branding.name} logo`}
      width={sizes[size]}
      height={sizes[size]}
      className={className}
    />
  );
}
```

#### 2. **Custom Domain Detection**
**Enhance** `src/tenancy/resolveTenant.ts`:
```typescript
export function resolveTenant({
  tenantId,
  hostname,
}: {
  tenantId?: string | null;
  hostname?: string | null;
}): TenantConfig {
  // 1. Try environment variable (highest priority)
  if (tenantId) {
    const tenant = getTenantById(tenantId);
    if (tenant) return tenant;
  }
  
  // 2. Try domain matching
  if (hostname) {
    const tenant = getTenantByHost(hostname);
    if (tenant) return tenant;
    
    // 3. Try custom domain matching
    const customDomainTenant = getTenantByCustomDomain(hostname);
    if (customDomainTenant) return customDomainTenant;
  }
  
  // 4. Fallback to default
  return getDefaultTenant();
}

// NEW function
export function getTenantByCustomDomain(hostname: string): TenantConfig | null {
  const normalizedHost = hostname.replace(/^www\./, '').toLowerCase();
  const match = Object.values(TENANT_REGISTRY).find(
    tenant => tenant.deployment?.customDomain?.toLowerCase() === normalizedHost
  );
  return match ?? null;
}
```

#### 3. **Tenant Context Hook**
**Create** `src/hooks/useTenant.ts`:
```typescript
'use client';

import { useMemo } from 'react';
import { resolveTenantFromWindow } from '@/tenancy/resolveTenant';
import type { TenantConfig } from '@/tenancy/types';

export function useTenant() {
  const tenant = useMemo<TenantConfig>(() => resolveTenantFromWindow(), []);
  
  return {
    tenant,
    tenantId: tenant.id,
    branding: tenant.branding,
    features: tenant.features,
    contentStrategy: tenant.contentStrategy,
    isEnterprise: tenant.licensing.tier === 'enterprise',
    isPremium: tenant.licensing.tier === 'premium' || tenant.licensing.tier === 'enterprise',
    hasActiveLicense: tenant.licensing.status === 'active',
  };
}
```

---

## 📚 Content Licensing System

### Content Types

1. **Regional Content** (West Africa Curriculum)
   - JHS curriculum (Ghana-based, localizable)
   - SHS curriculum (Ghana-based, localizable)
   - Virtual labs (global)
   - Arena challenges (global)
   
2. **Custom Content** (Institution-specific)
   - Custom curriculum (UAE KHDA, IB, Cambridge, etc.)
   - Custom lessons
   - Custom quizzes
   - Custom branding

### Content Resolution Strategy

**Create** `src/lib/content-resolver.ts`:
```typescript
import type { TenantConfig } from '@/tenancy/types';

export type ContentSource = 'shared' | 'tenant' | 'hybrid';

export interface ResolvedContent {
  source: ContentSource;
  path: string;
  data: any;
}

/**
 * Resolve content based on tenant configuration
 */
export async function resolveContent(
  tenant: TenantConfig,
  contentType: 'jhs' | 'shs' | 'university' | 'labs' | 'challenges',
  resourceId?: string
): Promise<ResolvedContent> {
  const { contentStrategy } = tenant;
  
  // Mode 1: Regional content only
  if (contentStrategy.mode === 'regional') {
    return {
      source: 'shared',
      path: `shared_content/${contentStrategy.regionalContent.countries[0]}/${contentType}`,
      data: await loadSharedContent(contentType, contentStrategy.regionalContent.countries[0]),
    };
  }
  
  // Mode 2: Custom content only
  if (contentStrategy.mode === 'custom') {
    return {
      source: 'tenant',
      path: `${tenant.id}_content/${contentType}`,
      data: await loadTenantContent(tenant.id, contentType),
    };
  }
  
  // Mode 3: Hybrid (try custom first, fallback to regional)
  if (contentStrategy.mode === 'hybrid') {
    try {
      const customData = await loadTenantContent(tenant.id, contentType, resourceId);
      if (customData) {
        return {
          source: 'tenant',
          path: `${tenant.id}_content/${contentType}`,
          data: customData,
        };
      }
    } catch (error) {
      // Fallback to regional
    }
    
    return {
      source: 'shared',
      path: `shared_content/${contentStrategy.regionalContent.countries[0]}/${contentType}`,
      data: await loadSharedContent(contentType, contentStrategy.regionalContent.countries[0]),
    };
  }
  
  throw new Error(`Invalid content strategy mode: ${contentStrategy.mode}`);
}

async function loadSharedContent(contentType: string, country: string) {
  // Load from shared_content collection in Firestore
  // OR load from static data files (src/lib/jhs-data.ts, etc.)
  // Implementation depends on whether content is in DB or files
}

async function loadTenantContent(tenantId: string, contentType: string, resourceId?: string) {
  // Load from tenant-specific collection in Firestore
  // Implementation depends on tenant's custom content structure
}
```

---

## 🔐 Authentication & User Management

### Tenant-Scoped Authentication

**Enhance** `src/firebase/non-blocking-login.tsx`:

```typescript
/**
 * Sign in anonymously with tenant context
 */
export async function signInAnonymouslyWithTenant(
  auth: Auth,
  tenantId: string
): Promise<User> {
  const userCredential = await signInAnonymously(auth);
  
  // Add tenant claim to user
  await setCustomUserClaims(userCredential.user.uid, { tenantId });
  
  return userCredential.user;
}

/**
 * Set custom claims for user (called by Cloud Function)
 */
async function setCustomUserClaims(userId: string, claims: Record<string, any>) {
  // This should be called via Cloud Function for security
  // Client-side code calls the function, which sets claims
  const setClaimsFunction = httpsCallable(getFunctions(), 'setUserClaims');
  await setClaimsFunction({ userId, claims });
}
```

**NEW Cloud Function** `functions/src/auth.ts`:
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const setUserClaims = functions.https.onCall(async (data, context) => {
  const { userId, claims } = data;
  
  // Verify caller is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  // Set custom claims
  await admin.auth().setCustomUserClaims(userId, claims);
  
  return { success: true };
});

/**
 * Automatically set tenant claim on user creation
 */
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  // Determine tenant from environment or request context
  const tenantId = process.env.TENANT_ID || 'smartclass24';
  
  await admin.auth().setCustomUserClaims(user.uid, {
    tenantId,
    createdAt: new Date().toISOString(),
  });
});
```

---

## 🚀 Deployment Strategy

### Option 1: Single Firebase Project (Recommended for Phase 1)

**Pros**:
- ✅ Lower operational cost
- ✅ Easier to manage
- ✅ Shared resources (authentication, analytics)
- ✅ Single codebase deployment

**Cons**:
- ⚠️ Shared quota limits
- ⚠️ All tenants on same infrastructure

**Implementation**:
- Use tenant-scoped Firestore collections
- Domain/subdomain routing to same app
- Environment variable or request header for tenant detection

**Example Domains**:
```
smartclass24.app          → Default tenant (Ghana)
dubai.smartclass24.app    → Dubai tenant
lagos.smartclass24.app    → Lagos tenant
dubaiinstitute.ae         → Custom domain → Dubai tenant
```

### Option 2: Dedicated Firebase Projects (For Enterprise Clients)

**Pros**:
- ✅ Complete data isolation
- ✅ Independent quota
- ✅ Tenant-specific Firebase features
- ✅ Easier compliance (data residency)

**Cons**:
- ⚠️ Higher operational cost
- ⚠️ More complex deployment
- ⚠️ Shared content needs replication

**Implementation**:
- Each tenant gets their own Firebase project
- Deployment script deploys to multiple projects
- Shared content replicated or accessed via API

---

## 📦 Tenant Registry Database Schema

**Option 1: Environment Variables** (Current, simple)
```env
# .env.local or Firebase environment config
NEXT_PUBLIC_TENANT_ID=smartclass24
```

**Option 2: Database Registry** (Recommended for production)

**Create collection**: `tenants/{tenantId}`

```typescript
// Example: tenants/smartclass24
{
  id: 'smartclass24',
  slug: 'smartclass24',
  status: 'active',
  
  institution: {
    name: 'SmartClass24',
    type: 'platform',
    country: 'GH',
    timezone: 'Africa/Accra',
    language: 'en',
  },
  
  branding: {
    name: 'SmartClass24',
    domain: 'smartclass24.app',
    logoUrl: 'https://cdn.smartclass24.app/logos/default.png',
    colors: { /* ... */ },
  },
  
  contentStrategy: {
    mode: 'regional',
    regionalContent: {
      enabled: true,
      countries: ['ghana'],
    },
    customContent: {
      enabled: false,
    },
    licensing: {
      includeJHS: true,
      includeSHS: true,
      includeUniversity: true,
      includeVirtualLabs: true,
      includeArenaChallenge: true,
    },
  },
  
  licensing: {
    tier: 'enterprise',
    status: 'active',
    seatsPurchased: 0,  // Unlimited
    limits: {
      maxStudents: 100000,
      maxTeachers: 2000,
    },
  },
  
  deployment: {
    mode: 'shared',
  },
  
  integrations: {
    paymentProvider: 'stripe',
  },
  
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2026-02-02T00:00:00Z',
}
```

**Create collection**: `tenants/dubaiinstitute`

```typescript
{
  id: 'dubaiinstitute',
  slug: 'dubaiinstitute',
  status: 'active',
  
  institution: {
    name: 'Dubai International Institute',
    type: 'school',
    country: 'AE',
    timezone: 'Asia/Dubai',
    language: 'en',
    supportedLanguages: ['en', 'ar'],
    contactEmail: 'admin@dubaiinstitute.ae',
    website: 'https://dubaiinstitute.ae',
  },
  
  branding: {
    name: 'Dubai International Institute',
    shortName: 'DII',
    domain: 'dii.smartclass24.app',
    logoUrl: 'https://cdn.smartclass24.app/logos/dubaiinstitute.png',
    faviconUrl: 'https://cdn.smartclass24.app/favicons/dubaiinstitute.ico',
    themeColor: '#D4AF37',  // Gold
    colors: {
      primary: '42 100% 50%',     // Gold
      accent: '210 100% 50%',      // Blue
      // ... other colors
    },
  },
  
  contentStrategy: {
    mode: 'hybrid',
    
    regionalContent: {
      enabled: true,
      countries: ['ghana'],  // License West African content
      localization: 'manual',  // Don't auto-localize (keep Ghana context)
    },
    
    customContent: {
      enabled: true,
      curriculum: 'UAE KHDA',
      subjectsEnabled: [
        'Mathematics',
        'Science',
        'English',
        'Arabic',
        'Islamic Studies',
        'UAE Social Studies',
      ],
    },
    
    licensing: {
      includeJHS: false,        // No JHS for UAE
      includeSHS: false,        // No SHS for UAE
      includeUniversity: false,
      includeVirtualLabs: true,  // License virtual labs
      includeArenaChallenge: true,
    },
  },
  
  licensing: {
    tier: 'premium',
    status: 'active',
    seatsPurchased: 2000,
    seatsUsed: 450,
    renewalDate: '2027-02-01',
    billingEmail: 'billing@dubaiinstitute.ae',
    limits: {
      maxStudents: 2000,
      maxTeachers: 100,
      maxCampuses: 3,
    },
  },
  
  deployment: {
    mode: 'shared',
    customDomain: 'learning.dubaiinstitute.ae',
  },
  
  integrations: {
    paymentProvider: 'stripe',
    smsProvider: 'twilio',
  },
  
  createdAt: '2026-01-15T00:00:00Z',
  updatedAt: '2026-02-02T00:00:00Z',
}
```

---

## 🛠️ Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
1. ✅ **Enhance tenant types** (`src/tenancy/types.ts`)
   - Add `institution`, `contentStrategy`, `deployment`, `integrations` fields
2. ✅ **Update Firestore schema**
   - Create `tenants/{tenantId}` collection
   - Migrate current `TENANT_REGISTRY` to Firestore
3. ✅ **Implement tenant-scoped collections**
   - Update Firebase paths to use `{tenantId}_students`, `{tenantId}_content`, etc.
4. ✅ **Update security rules**
   - Add tenant-scoped rules
5. ✅ **Create `useTenant()` hook**
6. ✅ **Test with 2 tenants**
   - `smartclass24` (default)
   - `dubaiinstitute` (new)

### Phase 2: Content Resolution (Week 3-4)
1. ✅ **Implement content resolver** (`src/lib/content-resolver.ts`)
2. ✅ **Create shared content collections**
   - Migrate Ghana JHS/SHS data to `shared_content/ghana/`
3. ✅ **Build custom content upload system**
   - Admin UI for uploading institution-specific content
4. ✅ **Implement hybrid content loading**
   - Try custom first, fallback to regional

### Phase 3: Authentication & User Management (Week 5-6)
1. ✅ **Add tenant claims to user tokens**
2. ✅ **Create Cloud Functions** for user management
   - `setUserClaims`
   - `onUserCreate` (auto-assign tenant)
3. ✅ **Build admin dashboard**
   - User management per tenant
   - License usage tracking

### Phase 4: Deployment & Testing (Week 7-8)
1. ✅ **Set up domain routing**
   - Configure DNS for `*.smartclass24.app`
   - Set up custom domain (dubaiinstitute.ae)
2. ✅ **Deploy to production**
3. ✅ **Load testing** with multiple tenants
4. ✅ **Security audit**

### Phase 5: Self-Service Onboarding (Week 9-10)
1. ✅ **Build tenant registration flow**
2. ✅ **Billing integration** (Stripe)
3. ✅ **License management dashboard**
4. ✅ **Documentation for new institutions**

---

## 🔐 Security Considerations

### Data Isolation
- ✅ **Firestore rules** enforce tenant boundaries
- ✅ **User claims** include `tenantId`
- ✅ **API endpoints** validate tenant access
- ✅ **Cloud Functions** check tenant permissions

### Branding Security
- ✅ **Logo/asset URLs** validated before rendering
- ✅ **CSS injection** prevented (use whitelisted CSS variables)
- ✅ **Domain verification** required for custom domains

### Content Security
- ✅ **Shared content** is read-only for tenants
- ✅ **Custom content** only writable by tenant admins
- ✅ **Content licensing** enforced at API level

---

## 💰 Pricing Model for White-Label

### Tier 1: Standard ($500/month)
- Up to 1,000 students
- Regional content (West Africa curriculum)
- Virtual labs access
- Arena challenges
- Email support
- Subdomain hosting (e.g., `school.smartclass24.app`)

### Tier 2: Premium ($1,500/month)
- Up to 5,000 students
- Regional content + custom content upload
- Virtual labs + custom labs
- Arena challenges
- Priority support
- Custom domain
- Branding customization (logo, colors)

### Tier 3: Enterprise (Custom pricing)
- Unlimited students
- Dedicated Firebase project (optional)
- Full content customization
- White-label everything
- Dedicated support
- SLA guarantees
- Multiple campuses
- Custom integrations

---

## 📊 Example: Dubai Institute Setup

### 1. Create Tenant Entry
```typescript
// Add to Firestore: tenants/dubaiinstitute
{
  id: 'dubaiinstitute',
  institution: {
    name: 'Dubai International Institute',
    country: 'AE',
    language: 'en',
    supportedLanguages: ['en', 'ar'],
  },
  branding: {
    name: 'Dubai International Institute',
    domain: 'dii.smartclass24.app',
    logoUrl: 'https://dubaiinstitute.ae/logo.png',
    themeColor: '#D4AF37',
    colors: {
      primary: '42 100% 50%',
      // ...
    },
  },
  contentStrategy: {
    mode: 'custom',
    customContent: {
      enabled: true,
      curriculum: 'UAE KHDA',
      subjectsEnabled: ['Math', 'Science', 'Arabic', 'Islamic Studies'],
    },
    licensing: {
      includeVirtualLabs: true,
      includeArenaChallenge: true,
    },
  },
  licensing: {
    tier: 'premium',
    seatsPurchased: 2000,
  },
}
```

### 2. Configure Domain
```bash
# DNS Records
dii.smartclass24.app    CNAME    smartclass24.app
```

### 3. Upload Custom Content
```typescript
// Upload to Firestore: dubaiinstitute_content/subjects/mathematics
{
  id: 'mathematics',
  name: 'Mathematics',
  levels: ['Grade 7', 'Grade 8', 'Grade 9'],
  topics: [/* ... */],
}
```

### 4. Users Access
- Students go to: `https://dii.smartclass24.app`
- System detects tenant from domain
- Applies Dubai branding
- Loads custom UAE curriculum
- All data isolated in `dubaiinstitute_*` collections

---

## 🌍 Localization Strategy

### Ghana/West Africa Users
- Content remains in `shared_content/ghana/`
- Automatic localization via template variables
- Full JHS/SHS curriculum
- Regional context preserved

### Dubai Users
- Custom content in `dubaiinstitute_content/`
- Optional: License regional content for international curriculum
- Manual localization (keep Ghana examples if desired)
- UAE-specific subjects added

### Other Countries
- Each gets regional content collection if needed
- Template variable system adapts content
- Campus architecture supports any education system

---

## 🎯 Key Benefits

### For SmartClass24 (Platform Owner)
- ✅ **One codebase** for all institutions
- ✅ **Scalable architecture** (add tenants without code changes)
- ✅ **Recurring revenue** from licenses
- ✅ **Low marginal cost** per new institution
- ✅ **Preserve West African mission** (default tenant)

### For Institutions (Dubai, etc.)
- ✅ **Full branding control** (look & feel)
- ✅ **Custom or regional content**
- ✅ **Data isolation** (privacy & security)
- ✅ **Fast onboarding** (days, not months)
- ✅ **Cost-effective** (no custom development)

### For Students/Teachers
- ✅ **Familiar experience** (same UX across institutions)
- ✅ **Relevant content** (their curriculum)
- ✅ **Regional context** (if using shared content)
- ✅ **Seamless experience** (no sign it's multi-tenant)

---

## 📋 Next Steps

### Immediate (This Week)
1. ✅ **Review this architecture** with team
2. ✅ **Decide on deployment strategy** (shared vs. dedicated Firebase)
3. ✅ **Create Dubai tenant entry** in registry
4. ✅ **Test domain resolution** with subdomain

### Short-term (Next 2 Weeks)
1. ✅ **Implement enhanced tenant types**
2. ✅ **Update Firestore schema** and security rules
3. ✅ **Create `useTenant()` hook**
4. ✅ **Build content resolver**
5. ✅ **Test with 2 tenants**

### Medium-term (Next Month)
1. ✅ **Build admin dashboard** for tenant management
2. ✅ **Implement custom content upload**
3. ✅ **Add billing integration**
4. ✅ **Deploy Dubai instance**
5. ✅ **Create onboarding documentation**

---

## 📚 Related Documentation

- [Tenant Registry](../src/tenancy/registry.ts) - Current tenant configuration
- [Localization System](../src/lib/localization/README.md) - Country-specific content
- [Campus Architecture](./CAMPUS_ARCHITECTURE.md) - Multi-level education system
- [Firebase Security](../firestore.rules) - Current security rules

---

## ❓ FAQ

### Q: Will West African users be affected?
**A**: No. They'll continue using the default `smartclass24` tenant with full Ghana/West Africa curriculum. The platform is designed to preserve the original mission.

### Q: Can tenants have different payment systems?
**A**: Yes. Each tenant can configure their own payment provider (Stripe, PayPal, MTN MoMo, etc.) via the `integrations` config.

### Q: How much does it cost to add a new institution?
**A**: Marginal cost is ~$0 for shared Firebase deployment. Main cost is content customization if they need custom curriculum (can be passed to client).

### Q: Can tenants share content?
**A**: Yes. Tenants can license regional content (Ghana JHS/SHS) or create fully custom content. Hybrid mode allows both.

### Q: What about data privacy regulations (GDPR, etc.)?
**A**: Tenant-scoped collections provide data isolation. For strict compliance, use dedicated Firebase projects (enterprise tier).

### Q: Can a student move between tenants?
**A**: Not by default (accounts are tenant-scoped). Would require admin intervention and data migration.

---

**Document Status**: ✅ Complete  
**Last Updated**: February 2, 2026  
**Author**: SmartClass24 Architecture Team  
**Version**: 1.0
