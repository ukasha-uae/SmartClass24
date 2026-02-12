# Week 2: Navigation & SEO Optimization

**Timeline**: 19 hours total  
**Priority**: HIGH - Completes global positioning foundation  
**Prerequisites**: Week 1 complete ✅

---

## Task Breakdown

### Task 1: Navigation Architecture Restructure (6 hours)
**Priority**: CRITICAL  
**Goal**: Separate platform-wide features from region-specific content

#### Current State
```
Navigation has mixed content:
- Challenge Arena (platform feature)
- Virtual Labs (platform feature)
- Past Questions (could be global or regional)
- Study by Level → JHS/SHS (Ghana-centric)
```

#### Target State
```
PLATFORM SECTION:
├── Challenge Arena (all regions)
├── Virtual Labs (all regions)
├── Learning Paths (new - curated courses)
└── Community (study groups, forums)

REGIONAL SECTION (if country selected):
├── [Country] Primary Exam Prep
├── [Country] Secondary Exam Prep
├── Past Questions ([Exam Name])
└── Regional Resources

GLOBAL SECTION (no country selected):
├── Explore Curriculums
├── International Resources
├── Choose Your Region
└── For Schools (B2B link)
```

#### Implementation Steps
1. **Create new navigation config** (`src/lib/navigation-config.ts`)
   ```typescript
   export const PLATFORM_NAV = [
     { label: 'Challenge Arena', href: '/challenge-arena', icon: '⚔️' },
     { label: 'Virtual Labs', href: '/virtual-labs', icon: '🔬' },
     { label: 'Learning Paths', href: '/learning-paths', icon: '🎯' }
   ];
   
   export const getRegionalNav = (country: CountryConfig | null) => [
     { 
       label: `${country?.examSystem.primary || 'Primary'} Prep`, 
       href: `/prep/primary`,
       icon: '📚' 
     },
     // ...
   ];
   ```

2. **Update Header component** (`src/components/Header.tsx`)
   - Use `useLocalization()` to check country selection
   - Conditionally render nav sections based on country
   - Add visual separator between platform/regional sections

3. **Create NavigationDrawer enhancement**
   - Collapsible sections: Platform / Regional / Account
   - Dynamic badges ("Global" vs country flag)

4. **Test all navigation paths**
   - Without country selected → Platform + Global nav only
   - With Ghana selected → Platform + Ghana nav
   - With UAE tenant → Platform + UAE nav

---

### Task 2: Route Renaming - /wassce-questions → /past-questions (3 hours)
**Priority**: MEDIUM  
**Goal**: Make route names globally appropriate

#### Changes Required

1. **Create new route** `src/app/past-questions/page.tsx`
   - Copy from `src/app/wassce-questions/page.tsx`
   - Update breadcrumbs: "WASSCE Questions" → dynamic exam name
   - Use `getSecondaryExam()` for page titles
   
2. **Update internal links**
   ```bash
   # Search and replace across codebase
   /wassce-questions → /past-questions
   ```
   
3. **Add redirect** in `src/app/wassce-questions/page.tsx`
   ```typescript
   export default function WaSSCEQuestionsRedirect() {
     redirect('/past-questions');
   }
   ```

4. **Update navigation config**
   - Change all `/wassce-questions` references
   - Label: "Past Questions" (generic) or `{getSecondaryExam()} Questions` (localized)

5. **Update homepage links**
   - Feature links section
   - Campus cards

**Files to Update**:
- `src/app/page.tsx` (homepage links)
- `src/components/Header.tsx` (nav items)
- `src/lib/navigation-config.ts` (if created in Task 1)
- Any hardcoded links in components

---

### Task 3: Deprecate /shs-campus Routes (4 hours)
**Priority**: MEDIUM  
**Goal**: Remove legacy Ghana-specific routes

#### Context
From copilot-instructions.md:
> **Legacy routes**: `src/app/shs-campus/*` is deprecated; use dynamic campus routes instead

#### Current Issues
- `/shs-campus/integrated-science` → Should use `/campus/shs/integrated-science`
- Inconsistent with campus architecture
- Ghana-centric naming

#### Implementation

1. **Audit existing /shs-campus routes**
   ```bash
   # Find all SHS campus routes
   ls src/app/shs-campus/
   ```

2. **Create redirects** in each legacy route file
   ```typescript
   // src/app/shs-campus/[subject]/page.tsx
   import { redirect } from 'next/navigation';
   
   export default function LegacySHSRedirect({ params }: { params: { subject: string } }) {
     redirect(`/campus/shs/${params.subject}`);
   }
   ```

3. **Update all internal links**
   - Search codebase for `/shs-campus/`
   - Replace with `/campus/shs/`
   - Test each updated link

4. **Add deprecation notice** in legacy route files
   ```typescript
   /**
    * @deprecated Use /campus/shs/{subject} instead
    * This route maintained for backward compatibility only
    * Will be removed in v2.0
    */
   ```

5. **Update documentation**
   - `CAMPUS_ARCHITECTURE.md` - mark routes as deprecated
   - Add migration guide for any external integrations

**Files to Search/Update**:
- `src/app/page.tsx`
- `src/components/CampusSelector.tsx`
- `src/lib/jhs-data.ts` (any route references)
- `src/lib/*-shs-lessons-data.ts` files

---

### Task 4: Global SEO Meta Tags (2 hours)
**Priority**: HIGH  
**Goal**: Update meta tags for international audience

#### Current State (Ghana-centric)
```tsx
title: "SmartClass24 - Ghana's #1 AI-Powered Education Platform"
description: "Master BECE & WASSCE with Ghana's leading platform"
keywords: ["Ghana education", "BECE", "WASSCE"]
```

#### Target State (Global-first)
```tsx
// Default (no country)
title: "SmartClass24 - AI-Powered Learning Platform for Africa & Beyond"
description: "Personalized education for JHS, SHS, and beyond. Aligned with West African curriculums (Ghana, Nigeria, Sierra Leone, Liberia, Gambia) and expanding globally."
keywords: ["online learning", "AI education", "BECE", "WASSCE", "NECO", "West Africa"]

// With country selected (e.g., Ghana)
title: "SmartClass24 - Ghana's AI-Powered BECE & WASSCE Platform"
description: "Master BECE & WASSCE with Ghana's leading AI-powered platform..."
keywords: ["Ghana education", "BECE prep", "WASSCE prep", "Ghana learning"]
```

#### Implementation

1. **Update root layout** (`src/app/layout.tsx`)
   ```typescript
   export async function generateMetadata(): Promise<Metadata> {
     // This runs server-side, need to determine country from cookies/headers
     const cookieStore = await cookies();
     const countryId = cookieStore.get('user-country-id')?.value;
     const country = countryId ? getCountryConfig(countryId) : null;
     
     return {
       title: country 
         ? `SmartClass24 - ${country.name}'s AI-Powered Education Platform`
         : 'SmartClass24 - AI-Powered Learning Platform for Africa & Beyond',
       description: country
         ? `Master ${country.examSystem.primary} & ${country.examSystem.secondary} with ${country.name}'s leading AI platform`
         : 'Personalized education across West Africa and beyond. Challenge Arena, Virtual Labs, and AI-driven learning.',
       keywords: country
         ? [`${country.name} education`, country.examSystem.primary, country.examSystem.secondary]
         : ['online learning', 'AI education', 'West Africa', 'BECE', 'WASSCE', 'NECO'],
       openGraph: {
         title: country ? `SmartClass24 - ${country.name}` : 'SmartClass24 - Global Learning Platform',
         description: '...',
         images: ['/og-image-global.png'], // Create global vs regional OG images
       }
     };
   }
   ```

2. **Update homepage meta** (`src/app/page.tsx`)
   - Add page-specific metadata using `generateMetadata`
   - Dynamic based on country selection

3. **Create structured data** for SEO
   ```typescript
   // Add JSON-LD schema
   const structuredData = {
     "@context": "https://schema.org",
     "@type": "EducationalOrganization",
     "name": "SmartClass24",
     "description": "AI-Powered Learning Platform",
     "areaServed": country ? country.name : ["Ghana", "Nigeria", "Sierra Leone", "Liberia", "Gambia"],
     // ...
   };
   ```

4. **Update sitemap** (`src/app/sitemap.ts`)
   - Add `/partners` page
   - Add country-specific variants (if needed)

---

### Task 5: Business Development Assets (4 hours)
**Priority**: MEDIUM  
**Goal**: Create pitch deck and case study materials

#### Deliverables

1. **Sales Pitch Deck** (Markdown → Export to PDF)
   - File: `SALES_PITCH_DECK.md`
   - Sections:
     1. Problem Statement (fragmented education in Africa)
     2. Solution (SmartClass24 platform overview)
     3. Proof of Concept: Wisdom Warehouse UAE (case study)
     4. Technology Stack (multi-tenant, AI-powered)
     5. Traction (750 students, 2 live tenants, 96% satisfaction)
     6. Business Model (per-student pricing, white-label options)
     7. Roadmap (global expansion, new features)
     8. Investment Ask / Partnership Opportunities

2. **Wisdom Warehouse Case Study**
   - File: `CASE_STUDY_WISDOM_WAREHOUSE.md`
   - Template:
     ```markdown
     # Case Study: Wisdom Warehouse International School (UAE)
     
     ## Challenge
     - Needed custom learning platform for Middle East market
     - Required white-label branding
     - Wanted curriculum alignment with international standards
     
     ## Solution
     - Deployed SmartClass24 multi-tenant architecture
     - Custom branding (logo, colors, domain)
     - Localized content for UAE market
     
     ## Results
     - 100% uptime since launch
     - Zero Ghana-specific content leakage
     - Seamless student experience
     - School maintains full brand identity
     
     ## Testimonial
     "[Quote from Wisdom Warehouse administrator]"
     ```

3. **Feature Comparison Matrix**
   - File: `FEATURE_MATRIX.md`
   - Compare SmartClass24 vs competitors
   - Highlight: Multi-tenant, AI-powered, white-label, affordable

4. **ROI Calculator** (interactive component)
   - File: `src/app/partners/roi-calculator.tsx`
   - Input: Number of students
   - Output: Cost comparison vs traditional methods
   - Show savings in teacher time, materials, infrastructure

---

## Success Criteria

### Week 2 Complete When:
- [ ] Navigation clearly separates platform vs regional content
- [ ] All routes use globally appropriate names (no /wassce-questions)
- [ ] Legacy /shs-campus routes redirect properly
- [ ] Meta tags are dynamic and SEO-optimized for global market
- [ ] Sales materials ready for investor/school presentations
- [ ] Zero TypeScript errors
- [ ] All existing features still work (regression testing)
- [ ] Wisdom Warehouse tenant unaffected by changes

---

## Risk Assessment

### Low Risk
- Route renaming (additive changes with redirects)
- Meta tag updates (no functionality impact)
- Business docs (external deliverables)

### Medium Risk
- Navigation restructure (high user visibility)
- Mitigation: Test thoroughly, gradual rollout if needed

### High Risk
- None identified (Week 1 handled architectural risks)

---

## Testing Plan

1. **Manual Testing**
   - Navigate all sections without country selected
   - Select Ghana → verify regional nav appears
   - Switch to Wisdom tenant → verify nav appropriate
   - Test all redirects (/wassce-questions, /shs-campus/*)

2. **Automated Testing** (if time permits)
   - Write Playwright tests for navigation flows
   - Test redirect chains

3. **SEO Validation**
   - Use Google's SEO tester
   - Check Open Graph preview
   - Validate structured data

---

## Post-Week 2 Readiness

**Before Week 2**: 95% ready for global positioning  
**After Week 2**: 99% ready for production global launch

Remaining 1%:
- Real-world testing with international users
- A/B testing of messaging
- Localization of remaining edge cases
