# 🎯 White-Label Architecture: Decision Matrix
## Quick Reference for Implementation Decisions

---

## 🏗️ Deployment Strategy

### Single Firebase Project (Recommended ✅)

| Factor | Assessment |
|--------|------------|
| **Cost** | ✅ Low ($50-200/month for all tenants) |
| **Complexity** | ✅ Low (one codebase, one deployment) |
| **Scalability** | ⚠️ Shared quotas (10K writes/sec, 50K reads/sec) |
| **Data Isolation** | ⚠️ Logical (Firestore rules + collections) |
| **Compliance** | ⚠️ Depends on regulations |
| **Best For** | 5-50 institutions, non-sensitive data |

**When to Use**:
- Starting out (first 10 institutions)
- Institutions in same region (GDPR/data residency not critical)
- Cost-conscious deployments
- Fast time-to-market

**Implementation**:
```typescript
// All tenants share one Firebase project
// Data isolated via collection naming:
smartclass24_students/
dubaiinstitute_students/
lagos_students/

// Security via Firestore rules:
match /{tenantId}_students/{studentId} {
  allow read: if belongsToTenant(tenantId);
}
```

---

### Dedicated Firebase Projects (Enterprise)

| Factor | Assessment |
|--------|------------|
| **Cost** | ⚠️ High ($50-200/month per tenant) |
| **Complexity** | ⚠️ High (multi-project management) |
| **Scalability** | ✅ Independent quotas per tenant |
| **Data Isolation** | ✅ Physical (separate databases) |
| **Compliance** | ✅ Full compliance (data residency) |
| **Best For** | Enterprise clients, regulated industries |

**When to Use**:
- Enterprise contracts (>$10K/year)
- Strict data residency requirements (EU GDPR, UAE data laws)
- High-volume institutions (>10K concurrent users)
- SLA guarantees needed

**Implementation**:
```typescript
// Each tenant gets own Firebase project
dubaiinstitute_firebase_project/
  - students/
  - content/
  
lagos_firebase_project/
  - students/
  - content/

// Deployment script deploys to multiple projects
firebase use dubaiinstitute
firebase deploy

firebase use lagos
firebase deploy
```

---

## 📚 Content Strategy

### Option 1: Regional Only

| Aspect | Details |
|--------|---------|
| **Content Source** | Shared West African curriculum |
| **Customization** | None (or minimal branding) |
| **Cost** | ✅ Lowest (no custom content) |
| **Time to Deploy** | ✅ 1-2 days |
| **Best For** | West African schools, similar curriculum |

**Example**: Nigerian school wants Ghana curriculum
```typescript
{
  contentStrategy: {
    mode: 'regional',
    regionalContent: {
      enabled: true,
      countries: ['ghana', 'nigeria'],
      localization: 'auto',  // Auto-adapt currency, exams
    },
    licensing: {
      includeJHS: true,
      includeSHS: true,
    },
  }
}
```

---

### Option 2: Custom Only

| Aspect | Details |
|--------|---------|
| **Content Source** | Institution-specific curriculum |
| **Customization** | Full (subjects, lessons, quizzes) |
| **Cost** | ⚠️ Highest (content creation cost) |
| **Time to Deploy** | ⚠️ 4-8 weeks (content upload) |
| **Best For** | Different curriculum (UAE, UK, IB) |

**Example**: Dubai school with UAE KHDA curriculum
```typescript
{
  contentStrategy: {
    mode: 'custom',
    customContent: {
      enabled: true,
      curriculum: 'UAE KHDA',
      subjectsEnabled: ['Math', 'Science', 'Arabic', 'Islamic Studies'],
    },
    licensing: {
      includeJHS: false,
      includeSHS: false,
      includeVirtualLabs: true,  // License only labs
    },
  }
}
```

---

### Option 3: Hybrid (Recommended for Most)

| Aspect | Details |
|--------|---------|
| **Content Source** | Regional + Custom |
| **Customization** | Partial (supplement with custom) |
| **Cost** | ⚠️ Medium |
| **Time to Deploy** | ⚠️ 2-4 weeks |
| **Best For** | Institutions wanting base + extras |

**Example**: Dubai school wants virtual labs + custom subjects
```typescript
{
  contentStrategy: {
    mode: 'hybrid',
    regionalContent: {
      enabled: true,
      countries: ['ghana'],  // License labs/challenges
      localization: 'manual',  // Keep Ghana context
    },
    customContent: {
      enabled: true,
      curriculum: 'UAE KHDA',
      subjectsEnabled: ['Arabic', 'Islamic Studies', 'UAE Social Studies'],
    },
    licensing: {
      includeJHS: false,
      includeSHS: false,
      includeVirtualLabs: true,
      includeArenaChallenge: true,
    },
  }
}
```

---

## 🔐 Authentication Strategy

### Option 1: Shared Authentication

| Factor | Assessment |
|--------|------------|
| **Setup** | ✅ Simple (one Auth instance) |
| **User Management** | ✅ Easy (one admin console) |
| **Cross-Tenant** | ⚠️ Possible (user can switch tenants) |
| **Best For** | Shared Firebase project |

**Implementation**:
- One Firebase Authentication instance
- Tenant ID stored in user claims
- Security rules enforce tenant boundaries

```typescript
// User token:
{
  uid: 'abc123',
  tenantId: 'dubaiinstitute',
  admin: false,
}

// Firestore rules:
function belongsToTenant(tenantId) {
  return request.auth.token.tenantId == tenantId;
}
```

---

### Option 2: Separate Authentication

| Factor | Assessment |
|--------|------------|
| **Setup** | ⚠️ Complex (multiple Auth instances) |
| **User Management** | ⚠️ Per-tenant admin |
| **Cross-Tenant** | ✅ Impossible (separate accounts) |
| **Best For** | Dedicated Firebase projects |

**Implementation**:
- Each tenant has own Firebase Auth
- Users can't access other tenants
- Complete isolation

---

## 🎨 Branding Customization

### Level 1: Basic Branding

| Customization | Included |
|---------------|----------|
| **Logo** | ✅ Yes |
| **Colors** | ✅ Primary, accent (2-3 colors) |
| **Domain** | ✅ Subdomain (school.smartclass24.app) |
| **Support Email** | ✅ Yes |
| **Pricing** | Standard tier |

**Time to Deploy**: 1-2 days

---

### Level 2: Full Branding

| Customization | Included |
|---------------|----------|
| **Logo** | ✅ Full logo + favicon |
| **Colors** | ✅ All colors (7+ variables) |
| **Domain** | ✅ Custom domain (school.edu) |
| **Support Email** | ✅ Yes |
| **Fonts** | ✅ Custom fonts |
| **Welcome Messages** | ✅ Custom text |
| **Pricing** | Premium/Enterprise tier |

**Time to Deploy**: 3-5 days

---

### Level 3: White-Label

| Customization | Included |
|---------------|----------|
| **Everything in Level 2** | ✅ Yes |
| **No SmartClass24 branding** | ✅ Completely hidden |
| **Custom login page** | ✅ Yes |
| **Custom email templates** | ✅ Yes |
| **Custom mobile app** | ⚠️ Optional (extra cost) |
| **Pricing** | Enterprise tier |

**Time to Deploy**: 1-2 weeks

---

## 💰 Pricing Decision Matrix

### For SmartClass24 (Platform Owner)

| Tenant Type | Monthly Cost | Revenue | Profit Margin |
|-------------|--------------|---------|---------------|
| **Standard** (5-50 tenants shared) | $200 total | $500/tenant | ~$300/tenant |
| **Premium** (custom content) | $200 + dev time | $1,500/tenant | ~$1,000/tenant |
| **Enterprise** (dedicated project) | $200/tenant | $5,000/tenant | ~$4,000/tenant |

---

### For Institutions (Clients)

| Tier | Price | Students | Content | Support |
|------|-------|----------|---------|---------|
| **Standard** | $500/mo | 1,000 | Regional | Email |
| **Premium** | $1,500/mo | 5,000 | Regional + Custom | Priority |
| **Enterprise** | Custom | Unlimited | Full Custom | Dedicated |

---

## 🚀 Time-to-Market Estimates

### Ghana School (Regional Content)
- **Setup**: 1-2 days
- **Content**: 0 days (already available)
- **Testing**: 1 day
- **Total**: 2-3 days ✅

### Dubai School (Custom Content)
- **Setup**: 3-5 days
- **Content Upload**: 2-4 weeks (client provides content)
- **Testing**: 1 week
- **Total**: 4-6 weeks ⚠️

### Dubai School (Hybrid - Labs Only)
- **Setup**: 3-5 days
- **Content**: 3-5 days (enable labs, disable JHS/SHS)
- **Testing**: 1 week
- **Total**: 2-3 weeks ✅

---

## 📊 Scalability Limits

### Single Firebase Project

| Resource | Limit | Notes |
|----------|-------|-------|
| **Firestore Writes** | 10,000/sec | Shared across all tenants |
| **Firestore Reads** | 50,000/sec | Usually not a problem |
| **Storage** | 50 GB/day download | Shared |
| **Auth Users** | Unlimited | But check performance |
| **Recommendations** | 5-50 tenants | 10K-50K total students |

### Multiple Firebase Projects

| Resource | Limit | Notes |
|----------|-------|-------|
| **Each project** | Independent quotas | No sharing |
| **Management** | More complex | CI/CD needed |
| **Recommendations** | 5-20 tenants | Enterprise only |

---

## 🎯 Recommended Approach for Dubai Client

### Phase 1: Quick Launch (Week 1-2)
```typescript
{
  id: 'dubaiinstitute',
  contentStrategy: {
    mode: 'hybrid',
    regionalContent: {
      enabled: true,
      countries: ['ghana'],
    },
    customContent: {
      enabled: true,
      subjectsEnabled: ['Arabic', 'Islamic Studies'],  // Start small
    },
    licensing: {
      includeJHS: false,
      includeSHS: false,
      includeVirtualLabs: true,  // High value, fast deploy
      includeArenaChallenge: true,
    },
  },
  deployment: {
    mode: 'shared',  // Start with shared
    customDomain: 'learning.dubaiinstitute.ae',
  },
  licensing: {
    tier: 'premium',
    seatsPurchased: 2000,
  },
}
```

**Benefits**:
- ✅ Launch in 2 weeks
- ✅ Virtual labs immediately available
- ✅ Custom branding from day 1
- ✅ Can add custom content later

### Phase 2: Full Custom Content (Month 2-3)
- Upload full UAE KHDA curriculum
- Create custom lessons
- Test with pilot classes
- Scale to all students

### Phase 3: Dedicated Project (Year 2)
- If usage grows beyond 10K concurrent users
- If data residency becomes critical
- Migrate to dedicated Firebase project

---

## 🔄 Migration Paths

### Path 1: Shared → Dedicated
**Trigger**: High usage, compliance needs  
**Effort**: Medium (Cloud Functions for data export/import)  
**Downtime**: ~2 hours

### Path 2: Regional → Custom
**Trigger**: Institution wants own curriculum  
**Effort**: Low (just upload content)  
**Downtime**: 0 (seamless)

### Path 3: Custom → Hybrid
**Trigger**: Institution wants labs/challenges  
**Effort**: Low (license regional content)  
**Downtime**: 0 (seamless)

---

## ✅ Decision Checklist

Before onboarding a new institution, answer:

1. **Content**
   - [ ] Do they want regional content? (Ghana/West Africa)
   - [ ] Do they need custom content? (Own curriculum)
   - [ ] Do they want virtual labs?
   - [ ] Do they want challenge arena?

2. **Branding**
   - [ ] Basic branding (logo, colors)?
   - [ ] Full white-label (no SmartClass24)?
   - [ ] Custom domain needed?

3. **Scale**
   - [ ] How many students? (<1K, 1K-5K, >5K)
   - [ ] Expected growth rate?
   - [ ] Concurrent users estimate?

4. **Compliance**
   - [ ] Data residency requirements?
   - [ ] Industry regulations (education, healthcare)?
   - [ ] SLA needed?

5. **Budget**
   - [ ] Standard ($500/mo)?
   - [ ] Premium ($1,500/mo)?
   - [ ] Enterprise (custom)?

---

## 🎯 Recommendations Summary

| Institution Type | Deployment | Content | Tier | Time |
|------------------|------------|---------|------|------|
| **West African School** | Shared | Regional | Standard | 2-3 days |
| **International School (Small)** | Shared | Hybrid | Premium | 2-3 weeks |
| **International School (Large)** | Dedicated | Custom | Enterprise | 4-8 weeks |
| **Corporate Training** | Dedicated | Custom | Enterprise | 6-12 weeks |

---

**Document Status**: ✅ Complete  
**Last Updated**: February 2, 2026  
**Version**: 1.0
