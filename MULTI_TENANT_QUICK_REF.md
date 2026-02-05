# Multi-Tenant Quick Reference

## Core Files Updated

| File | Purpose | Status |
|------|---------|--------|
| `src/tenancy/types.ts` | Type definitions | ✅ Complete |
| `src/tenancy/registry.ts` | Tenant configurations | ✅ Complete |
| `src/tenancy/resolveTenant.ts` | Tenant resolution | ✅ Complete |
| `src/tenancy/theme.ts` | CSS theming | ✅ Complete |
| `src/hooks/useTenant.ts` | React hook | ✅ Complete |
| `src/components/tenancy/TenantLogo.tsx` | Logo component | ✅ Complete |
| `firestore-multitenant.rules` | Security rules | ✅ Complete |
| `functions/src/auth-tenant-claims.ts` | Cloud Functions | ✅ Complete |

## Quick Start

### 1. Use Tenant in Components
```tsx
import { useTenant } from '@/hooks/useTenant';

function MyComponent() {
  const { 
    tenantId,        // 'wisdomwarehouse'
    branding,        // { name, primaryColor, accentColor, logoUrl }
    hasVirtualLabs,  // true/false
    hasLocalization, // false for Wisdom Warehouse
  } = useTenant();
  
  return <div style={{ color: branding.primaryColor }}>...</div>;
}
```

### 2. Preview Mode (Testing/Demos)
```
http://localhost:9002?tenant=wisdomwarehouse
https://smartclass24.app?tenant=demo
```

### 3. Add New Tenant (5 minutes)
```typescript
// src/tenancy/registry.ts
export const TENANT_REGISTRY = {
  newtenant: {
    id: 'newtenant',
    name: 'New School',
    market: 'us',
    branding: {
      primaryColor: '#3b82f6',
      accentColor: '#10b981',
      logoUrl: '/logos/newtenant.svg',
    },
    features: {
      enableJHSCampus: true,
      enableVirtualLabs: true,
      enableLocalization: false,
    },
    // ... rest of config
  },
};
```

## Tenant Configurations

### Wisdom Warehouse (First Client)
- **Market**: US 🇺🇸
- **Features**: JHS, SHS, Virtual Labs, Arena
- **Localization**: Disabled (American students)
- **Domain**: `learning.wisdomwarehouse.com`

### SmartClass24 (Platform Owner)
- **Market**: Ghana/West Africa 🇬🇭
- **Features**: All campuses, all features
- **Localization**: Enabled (5 countries)
- **Domain**: `smartclass24.app`

### Demo (QA/Testing)
- **Market**: Global 🌍
- **Features**: All features enabled
- **Localization**: Enabled (show all capabilities)
- **Domain**: `demo.smartclass24.app`

## Feature Flags

```typescript
interface TenantFeatures {
  // Campus access
  enableJHSCampus: boolean;
  enableSHSCampus: boolean;
  enableUniversityCampus: boolean;
  
  // Core features
  enableVirtualLabs: boolean;
  enableArenaChallenge: boolean;
  
  // Optional features
  enableLocalization?: boolean;      // Default: false
  enableParentDashboard?: boolean;   // Default: false
}
```

## Firestore Security Pattern

```javascript
// All documents must have tenantId field
{
  tenantId: 'wisdomwarehouse',
  // ... rest of data
}

// Security rule checks claim
function belongsToTenant(tenantId) {
  return request.auth.token.tenantId == tenantId;
}

// Example: Only read own tenant's data
allow read: if belongsToTenant(resource.data.tenantId);
```

## Cloud Functions

### Automatic Tenant Assignment (Email Domain)
```
user@wisdomwarehouse.com → tenantId='wisdomwarehouse'
user@smartclass24.app → tenantId='smartclass24'
user@gmail.com → tenantId='smartclass24' (default)
```

### Manual Assignment (Super Admin)
```typescript
const setTenant = httpsCallable(functions, 'setUserTenantClaim');
await setTenant({ userId: 'abc123', tenantId: 'wisdomwarehouse' });
```

## Deployment Commands

```bash
# Deploy all
npm run build
firebase deploy

# Deploy specific
firebase deploy --only firestore:rules
firebase deploy --only functions
firebase deploy --only hosting
```

## Testing Checklist

- [ ] Preview mode works (`?tenant=xyz`)
- [ ] Logo changes per tenant
- [ ] Colors change per tenant
- [ ] Virtual Labs visible for Wisdom Warehouse
- [ ] Localization disabled for Wisdom Warehouse
- [ ] User claims set on signup
- [ ] Firestore rules enforce tenant isolation

## Common Patterns

### Conditional Rendering (Features)
```tsx
const { hasVirtualLabs, hasArenaChallenge } = useTenant();

{hasVirtualLabs && <VirtualLabsButton />}
{hasArenaChallenge && <ArenaButton />}
```

### Conditional Rendering (Market)
```tsx
const { market } = useTenant();

{market === 'us' && <USContent />}
{market === 'ghana' && <GhanaContent />}
```

### Conditional Localization
```tsx
const { hasLocalization } = useTenant();

{hasLocalization ? (
  <LocalizationProvider>
    {children}
  </LocalizationProvider>
) : (
  {children}
)}
```

## Debug Commands

### Check Tenant in Console
```javascript
// Browser console
window.location.href // Check ?tenant= parameter
```

### Check User Claims
```typescript
const user = auth.currentUser;
const token = await user.getIdTokenResult();
console.log(token.claims.tenantId);
```

### Check Document tenantId
```typescript
const doc = await getDoc(docRef);
console.log(doc.data().tenantId);
```

## Key Design Principles

1. **Shared Collections** - One `students` collection with `tenantId` field (not separate collections)
2. **Claims-Based** - tenantId stored in Firebase Auth claims (not localStorage)
3. **Preview Mode** - `?tenant=xyz` for demos/QA (highest priority)
4. **Optional Localization** - Disabled by default (US market doesn't need it)
5. **2-Color Branding** - Primary + accent (not 7 colors)
6. **Fast Onboarding** - <1 day to add new institution

## Migration Notes

### Existing Data (Need to Add tenantId)
```typescript
// Run migration script to add tenantId='smartclass24' to existing documents
// See: scripts/migrate-add-tenant-id.ts
```

### Collections That Need Migration
- `students`
- `challenges`
- `quizAttempts`
- `subscriptions`
- `referrals`
- `university-progress`
- `university-submissions`
- `university-code-saves`

## Support Contacts

- **Wisdom Warehouse**: First real client (US market)
- **SmartClass24**: Platform owner (Ghana/West Africa)
- **Demo**: Internal testing only

---

**Implementation: COMPLETE ✅**  
**Ready for Review: YES ✅**  
**Time to Production: <1 Day ✅**
