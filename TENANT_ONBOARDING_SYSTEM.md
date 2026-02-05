# Multi-Tenant Onboarding System

## Current State: Fast Manual Onboarding (v1)

### ✅ What's Already Built

The platform has a **production-ready multi-tenant architecture** that supports unlimited white-label clients:

1. **Tenant Registry System** (`src/tenancy/registry.ts`)
   - Centralized configuration for all tenants
   - No database queries needed - ultra-fast tenant resolution
   - ~30 minutes to add a new tenant

2. **Complete Data Isolation** (`firestore.rules`)
   - `tenantId`-based filtering on all collections
   - Students, quiz attempts, challenges, subscriptions isolated per tenant
   - `belongsToTenant()` helper ensures data security

3. **White-Label Branding**
   - Custom logos, colors, domains per tenant
   - Tenant-specific content (hero text, taglines, trust indicators)
   - Market-specific features (B2C vs B2B models)

4. **Feature Flags Per Tenant**
   - Enable/disable: Arena Challenge, Virtual Labs, Referrals, Pricing, Localization
   - JHS/SHS/University campus access control
   - Parent dashboard, offline mode toggles

5. **Preview Mode**
   - Test any tenant before going live: `?tenant=tenantslug`
   - No production database changes needed

### 📋 Manual Onboarding Process (Current)

**Time Required: 30 minutes**

#### Step 1: Gather Client Information (5 min)
```
- Institution name
- Target market (ghana, middle-east, us, global)
- Logo file (PNG/SVG, 300x300px minimum)
- Brand colors (primary, accent)
- Domain preference (subdomain or custom)
- Email for support
- Business model (B2C or B2B)
- Feature requirements (campuses, labs, arena, referrals)
```

#### Step 2: Add Logo (2 min)
```powershell
# Save logo to public/logos/
cp path/to/client-logo.png public/logos/clientname.png
```

#### Step 3: Update Tenant Registry (10 min)
Edit `src/tenancy/registry.ts`:

```typescript
clientname: {
  id: 'clientname',
  slug: 'clientname',
  name: 'Client Name',
  market: 'middle-east', // or 'ghana', 'us', 'global'
  branding: {
    name: 'Client Name',
    logoUrl: '/logos/clientname.png',
    primaryColor: '#1e40af',  // Client's brand color
    accentColor: '#f59e0b',   // Secondary color
    domain: 'learn.clientdomain.com',
    supportEmail: 'support@clientdomain.com',
  },
  features: {
    enableJHSCampus: true,
    enableSHSCampus: true,
    enableUniversityCampus: false,  // Usually false for B2B clients
    enableVirtualLabs: true,
    enableArenaChallenge: true,     // false for non-competitive models
    enableLocalization: false,      // false unless multi-country
    enableParentDashboard: true,
    enableOfflineMode: false,
    enableReferrals: false,         // false for B2B (they handle enrollment)
    enablePublicPricing: false,     // false for B2B-only
    enableB2BOnly: true,            // true if selling to institutions only
  },
  content: {
    subjectsEnabled: ['Mathematics', 'Science', 'English'],
    curriculumLabel: 'International Curriculum',
  },
  license: {
    tier: 'professional',           // 'starter', 'professional', 'enterprise'
    maxStudents: 5000,
  },
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
},
```

#### Step 4: Test Preview (3 min)
```
Visit: http://localhost:9002?tenant=clientname
Verify:
- Logo displays correctly
- Brand colors applied
- Features enabled/disabled properly
- No Ghana/SmartClass24 references for white-label clients
```

#### Step 5: Deploy (10 min)
```powershell
# Deploy Firestore rules (first time only)
firebase deploy --only firestore:rules

# Deploy to production
npm run build
firebase deploy --only hosting

# Or use GitHub Actions for automatic deployment
git add .
git commit -m "Add [Client Name] tenant"
git push origin main
```

#### Step 6: Custom Domain Setup (varies)
```
1. Client adds DNS records:
   CNAME: learn.clientdomain.com -> smartclass24.web.app
   
2. In Firebase Console:
   Hosting > Add custom domain > Follow wizard
   
3. SSL certificate auto-provisions (5-15 minutes)

4. Update tenant registry with final domain
```

---

## Future: Automated Self-Service Onboarding (v2)

### 🎯 Vision: Zero-Code Tenant Creation

**Goal:** Institutions pay online → Platform automatically provisions → Go live in 5 minutes

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client Journey                        │
├─────────────────────────────────────────────────────────┤
│ 1. Visit smartclass24.app/partners                      │
│ 2. Choose plan (Starter/Pro/Enterprise)                 │
│ 3. Pay via Stripe/Paystack                              │
│ 4. Automated setup wizard:                              │
│    - Upload logo                                         │
│    - Choose brand colors (color picker)                 │
│    - Select features (checkboxes)                        │
│    - Enter domain preference                            │
│ 5. System provisions tenant automatically                │
│ 6. Receive login credentials + tenant URL               │
│ 7. Access admin dashboard to manage institution         │
└─────────────────────────────────────────────────────────┘
```

### Required Components

#### 1. **Partner Portal** (Priority: High)
**Location:** `src/app/partners/`

**Pages:**
- `/partners` - Marketing page for institutions
- `/partners/pricing` - Pricing tiers for B2B clients
- `/partners/signup` - Registration + payment
- `/partners/onboarding` - Setup wizard after payment
- `/partners/dashboard` - Tenant admin portal

**Features:**
- Plan comparison (Starter: $299/mo, Pro: $799/mo, Enterprise: Custom)
- Stripe/Paystack checkout integration
- Logo upload with preview (Cloudinary/Firebase Storage)
- Color picker for branding
- Feature toggles (visual checkboxes)
- Domain name input with validation

#### 2. **Tenant Management API** (Priority: High)
**Location:** `src/app/api/tenants/`

**Endpoints:**
```typescript
POST /api/tenants/create
  - Validates payment
  - Uploads logo to storage
  - Writes tenant config to Firestore
  - Sends welcome email
  - Returns tenant credentials

GET /api/tenants/:tenantId
  - Fetches tenant configuration
  - Used by useTenant() hook

PUT /api/tenants/:tenantId
  - Updates tenant settings
  - Revalidates cache

POST /api/tenants/:tenantId/domain
  - Triggers custom domain setup
  - Updates DNS records via Cloudflare API
```

#### 3. **Dynamic Tenant Registry** (Priority: High)
**Current:** Static object in `registry.ts`
**Future:** Firestore collection + Redis cache

```typescript
// Firestore collection: /tenants
{
  id: 'wisdomwarehouse',
  slug: 'wisdomwarehouse',
  name: 'Wisdom Warehouse',
  market: 'middle-east',
  branding: { ... },
  features: { ... },
  subscription: {
    plan: 'professional',
    status: 'active',
    stripeCustomerId: 'cus_xxxxx',
    stripeSubscriptionId: 'sub_xxxxx',
    billingPeriodEnd: '2026-03-04T00:00:00Z',
  },
  license: { ... },
  createdAt: '2026-02-04T00:00:00Z',
  updatedAt: '2026-02-04T00:00:00Z',
}
```

**Benefits:**
- No code deployment needed to add tenants
- Tenants can update their own branding
- Real-time configuration changes
- Automatic billing integration

#### 4. **Tenant Admin Dashboard** (Priority: Medium)
**Location:** `src/app/admin/tenant/`

**Features for Institution Admins:**
- View student enrollment & activity stats
- Manage teachers/staff accounts
- Upload custom content (if Enterprise plan)
- Update branding (logo, colors)
- Configure features (enable/disable campuses)
- Billing & invoice management
- Support ticket system
- Analytics dashboard (engagement, completion rates)

#### 5. **Automated Domain Setup** (Priority: Low)
**Integration:** Cloudflare API

```typescript
// Automatic DNS configuration
async function setupCustomDomain(tenantId: string, domain: string) {
  // 1. Verify domain ownership (TXT record)
  await verifyDomainOwnership(domain);
  
  // 2. Add CNAME via Cloudflare API
  await addCNAMERecord(domain, 'smartclass24.web.app');
  
  // 3. Request SSL certificate
  await provisionSSL(domain);
  
  // 4. Update tenant config
  await updateTenantDomain(tenantId, domain);
  
  // 5. Send confirmation email
  await sendDomainReadyEmail(tenantId);
}
```

#### 6. **Logo Upload System** (Priority: Medium)
**Options:**
- **Firebase Storage:** Free, integrated, CDN via Cloud Storage
- **Cloudinary:** Advanced image optimization, transformations
- **AWS S3 + CloudFront:** Enterprise-grade CDN

**Implementation:**
```typescript
// Upload component with preview
<LogoUploader
  onUpload={(url) => setTenantLogo(url)}
  maxSize={2MB}
  acceptedFormats={['png', 'svg', 'jpg']}
  dimensions={{ min: 300, max: 2000 }}
/>
```

---

### 📊 Pricing Tiers (Suggested)

| Feature | Starter | Professional | Enterprise |
|---------|---------|--------------|------------|
| Monthly Cost | $299 | $799 | Custom |
| Students | Up to 500 | Up to 5,000 | Unlimited |
| Campuses | JHS + SHS | All (Primary, JHS, SHS) | All + Custom |
| Virtual Labs | ✅ 5 labs | ✅ All labs | ✅ All + Custom |
| Arena Challenge | ✅ | ✅ | ✅ |
| White-Label Branding | ✅ | ✅ | ✅ |
| Custom Domain | ❌ | ✅ | ✅ |
| Parent Dashboard | ❌ | ✅ | ✅ |
| API Access | ❌ | ❌ | ✅ |
| Custom Content | ❌ | ❌ | ✅ |
| Dedicated Support | Email | Priority Email | Phone + Slack |
| Analytics Dashboard | Basic | Advanced | Custom Reports |
| SLA | 99% | 99.9% | 99.99% |

---

### 🛠 Implementation Roadmap

#### Phase 1: Foundation (Complete ✅)
- [x] Multi-tenant architecture
- [x] Firestore security rules with tenantId filtering
- [x] Tenant registry system
- [x] White-label branding (logo, colors, content)
- [x] Feature flags per tenant
- [x] Preview mode (`?tenant=slug`)
- [x] Wisdom Warehouse as proof-of-concept

#### Phase 2: Self-Service Portal (8-12 weeks)
- [ ] Partner marketing page (`/partners`)
- [ ] Pricing page with plan comparison
- [ ] Stripe/Paystack payment integration
- [ ] Onboarding wizard:
  - [ ] Logo upload component
  - [ ] Color picker
  - [ ] Feature selection UI
  - [ ] Domain input
- [ ] Tenant creation API
- [ ] Welcome email automation
- [ ] Basic tenant dashboard

**Estimated Effort:** 200-300 hours

#### Phase 3: Dynamic Configuration (4-6 weeks)
- [ ] Migrate tenant registry to Firestore
- [ ] Redis cache layer for performance
- [ ] Tenant settings update API
- [ ] Real-time config revalidation
- [ ] Tenant admin branding editor

**Estimated Effort:** 100-150 hours

#### Phase 4: Advanced Features (6-8 weeks)
- [ ] Full tenant admin dashboard:
  - [ ] Student analytics
  - [ ] Teacher management
  - [ ] Content upload
  - [ ] Billing portal
- [ ] Automated custom domain setup (Cloudflare API)
- [ ] Advanced logo optimization (Cloudinary)
- [ ] Multi-user tenant admin accounts
- [ ] Support ticket system

**Estimated Effort:** 150-200 hours

#### Phase 5: Enterprise Features (8-12 weeks)
- [ ] Custom curriculum upload
- [ ] API access for integrations
- [ ] SSO (SAML, OAuth)
- [ ] Advanced analytics & reporting
- [ ] White-label mobile apps (React Native)
- [ ] Compliance (GDPR, COPPA, FERPA)

**Estimated Effort:** 250-400 hours

---

### 💰 Revenue Model

#### Subscription Tiers
- **Starter:** $299/month × 100 clients = $29,900/month
- **Professional:** $799/month × 50 clients = $39,950/month
- **Enterprise:** $2,000/month (avg) × 20 clients = $40,000/month

**Projected Revenue (Year 1):** $1.3M ARR with 170 institutional clients

#### Setup Fees (Optional)
- **Starter:** Free setup
- **Professional:** $500 one-time setup
- **Enterprise:** $2,500 custom onboarding

---

### 🔒 Security Considerations

1. **Tenant Isolation**
   - All Firestore queries filtered by `tenantId`
   - Redis cache keys namespaced: `tenant:{tenantId}:*`
   - JWT tokens include `tenantId` claim

2. **Admin Access Control**
   - Tenant admins can only access their own data
   - Super admin role for SmartClass24 team
   - Audit logs for all config changes

3. **Payment Security**
   - PCI compliance via Stripe/Paystack (no card data stored)
   - Webhook signature verification
   - Subscription status validation on every request

4. **Domain Verification**
   - TXT record verification before CNAME setup
   - SSL certificate auto-provisioning
   - Domain ownership validation

---

## Current Onboarding Cost Analysis

### Manual Process (v1)
- **Developer Time:** 30 minutes per tenant
- **Cost at $100/hr:** $50 per tenant
- **Scalability:** ~10 tenants/day max (with one developer)

### Automated Process (v2)
- **Developer Time:** 0 minutes (fully automated)
- **Infrastructure Cost:** ~$2/tenant/month (storage, compute)
- **Scalability:** Unlimited tenants/day

### ROI Calculation
- **Development Cost:** ~600 hours × $100/hr = $60,000
- **Break-Even:** 40 tenants (saves $50 each) × 30 months
- **After 100 tenants:** Save $5,000/month in manual onboarding time

---

## Conclusion

### Current State: Ready for Growth ✅
The multi-tenant foundation is **production-ready** and can support dozens of clients with fast manual onboarding. Wisdom Warehouse proves the system works perfectly.

### Recommended Approach
1. **Months 1-3:** Onboard 5-10 clients manually (validate demand, gather feedback)
2. **Months 4-6:** Build Phase 2 (self-service portal) based on client requests
3. **Months 7-9:** Launch automated onboarding (scale to 50+ clients)
4. **Months 10-12:** Add enterprise features (scale to 100+ clients)

### Quick Wins (Can Implement This Week)
1. **Partner Landing Page** - Market the white-label offering
2. **Pricing Calculator** - Help prospects estimate costs
3. **Tenant Setup Checklist** - Streamline manual onboarding
4. **Logo Upload Script** - Automate logo optimization

---

## Next Steps

### For Current Manual Onboarding
- [x] Document process (this file)
- [ ] Create onboarding checklist template
- [ ] Build logo optimization script
- [ ] Create tenant testing checklist

### For Future Automation
- [ ] Review this document with team
- [ ] Prioritize Phase 2 features
- [ ] Set timeline for automated portal
- [ ] Research payment providers (Stripe vs Paystack for Ghana)
- [ ] Design tenant dashboard mockups

---

**Last Updated:** February 4, 2026
**Status:** Manual onboarding ready, automation roadmap defined
**Next Review:** After 5 manual tenant onboardings
