# Multi-Tenant SaaS Architecture (Branding + Licensing)

## Goals
- Allow multiple institutions to share one codebase and Firebase project.
- Keep branding, content, and users isolated per institution.
- Make onboarding new institutions fast and configuration-driven.
- Avoid duplicate code and keep core platform logic centralized.

## High-Level Architecture
- **Core platform**: shared UI, features, and learning logic.
- **Tenant configuration**: tenant-specific branding, licensing, and content rules.
- **Tenant data boundaries**: all user/content data lives under `tenants/{tenantId}`.
- **Tenant selection**: resolved by hostname or env override.

## Folder Structure (Proposed)
```
src/
  tenancy/
    types.ts
    registry.ts
    resolveTenant.ts
    theme.ts
    licensing.ts
    firestorePaths.ts
  components/
    tenancy/
      TenantThemeProvider.tsx
  hooks/
    useTenant.ts
  app/
    layout.tsx
docs/
  saas-multitenancy.md
```

## Tenant Resolution Strategy
Resolve tenant by hostname, with env override for staging or single-tenant deployments.
```
hostname -> tenant registry -> default tenant
NEXT_PUBLIC_TENANT_ID -> tenant registry -> default tenant
```

## Database Schema (Firestore)
All tenant-scoped data should live under a tenant root:
```
tenants/{tenantId}
  branding/
    current
  licensing/
    current
  users/{userId}
  content/{contentId}
  classes/{classId}
  lessons/{lessonId}
  analytics/{docId}
  auditLogs/{logId}
```

Shared or global data (optional):
```
global/
  publicContent/
  templates/
```

## Tenant Branding (Theme + Assets)
- Use CSS variables (`--primary`, `--accent`, etc.) to change colors per tenant.
- Update `meta[name="theme-color"]` based on tenant branding.
- Store `logoUrl` and `faviconUrl` per tenant for UI and PWA usage.

## Licensing Model (Scalable)
Each tenant includes a licensing object:
```
{
  tier: 'standard' | 'premium' | 'enterprise',
  status: 'active' | 'trial' | 'suspended',
  seatsPurchased: number,
  seatsUsed: number,
  limits: { maxStudents, maxTeachers, maxCampuses }
}
```
Use this to gate features and enforce limits in UI and server rules.

## Fast Onboarding Flow
1. Create tenant config entry (registry or Firestore).
2. Add domain mapping in DNS (CNAME to app domain).
3. Create initial branding + licensing docs in Firestore.
4. Provision admin user for the tenant.
5. Done. No code duplication.

## Example Usage (React/Next.js)
### Resolve Tenant + Apply Theme
```
import { resolveTenantFromWindow } from '@/tenancy/resolveTenant';
import { applyTenantTheme } from '@/tenancy/theme';

const tenant = resolveTenantFromWindow();
applyTenantTheme(tenant);
```

### Get Tenant Scoped Paths
```
import { tenantUsersCollection } from '@/tenancy/firestorePaths';

const path = tenantUsersCollection(tenant.id); // tenants/{tenantId}/users
```

### License Checks
```
import { getTenantEntitlements } from '@/tenancy/licensing';

const entitlements = getTenantEntitlements(tenant);
if (!entitlements.canInviteStudents) {
  // disable UI or show upgrade prompt
}
```

## Environment-Based Theming
- `NEXT_PUBLIC_TENANT_ID` forces a tenant for staging or demos.
- Hostname mapping supports multi-tenant domains at runtime.
- Branding can be stored in Firestore and hydrated into the registry.

## Firebase Rules (Concept)
Enforce tenant boundaries at the document level:
```
match /tenants/{tenantId}/{document=**} {
  allow read, write: if request.auth != null
    && request.auth.token.tenantId == tenantId;
}
```
Use custom claims to store `tenantId` per user.

## Notes
- This architecture supports both multi-tenant (shared project) and single-tenant (dedicated project).
- If a tenant needs full isolation, assign a dedicated Firebase project and switch config by tenant.
- Keep tenant configuration small and cacheable for fast app startup.
