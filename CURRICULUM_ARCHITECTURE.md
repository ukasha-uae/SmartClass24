# SmartClass24 Curriculum Architecture
**Multi-Curriculum, Location-Agnostic Learning Platform**

---

## Core Design Principle

**Location ≠ Curriculum**

A school in Lagos can teach British IGCSE. A school in Dubai can teach US Common Core. A school in Accra can teach both WASSCE and IB tracks. Our architecture decouples these three concerns:

1. **Tenant** (Who's using the platform)
2. **Curriculum** (What's being taught)
3. **Localization** (Cultural/regional context)

---

## 3-Layer Architecture

### **Layer 1: Tenant (School/Institution)**

```typescript
{
  tenantId: "wisdom warehouse",
  name: "Wisdom Warehouse",
  market: "middle-east",
  curriculum: {
    system: "us-common-core",
    examSystems: ["SAT", "ACT", "AP"],
    gradeLevels: ["K-12"]
  },
  enableLocalization: false  // No country selector needed
}
```

**Purpose:** Identifies the institution and their curriculum needs

---

### **Layer 2: Curriculum System (What's Taught)**

```typescript
{
  curriculumId: "west-african",
  name: "West African Curriculum",
  examSystems: ["BECE", "WASSCE", "NECO"],
  countries: ["ghana", "nigeria", "sierra-leone", "liberia", "gambia"],
  gradeLevels: ["Primary", "JHS", "SHS"],
  subjects: [
    "Mathematics", 
    "Integrated Science", 
    "Social Studies",
    // ... 12+ subjects
  ]
}
```

**Purpose:** Defines what content is taught and how it's structured

---

### **Layer 3: Localization (Cultural Context - Optional)**

```typescript
{
  countryId: "ghana",
  name: "Ghana",
  currency: { symbol: "₵", code: "GHS" },
  examSystem: {
    primary: "BECE",
    secondary: "WASSCE"
  },
  culturalContext: {
    language: "English",
    sampleCities: ["Accra", "Kumasi", "Takoradi"],
    localExamples: true  // Use Ghanaian context in word problems
  }
}
```

**Purpose:** Provides cultural context for examples, currency in word problems, etc.

---

## Current Implementation Status

### ✅ **What's Working (V1 - Feb 2026)**

#### **B2C Model: Country → Curriculum Mapping**
- User selects country (Ghana, Nigeria, Sierra Leone, Liberia, Gambia)
- System auto-maps to West African curriculum (BECE/WASSCE/NECO)
- Localization provides cultural context (₵ vs ₦ in math problems)
- **Implementation:** `src/lib/localization/countries/*`

#### **B2B Model: Tenant → Curriculum Direct**
- Tenant config specifies curriculum explicitly
- `enableLocalization: false` hides country selector
- Content filtered by tenant's curriculum needs
- **Example:** Wisdom Warehouse (UAE) teaching US curriculum
- **Implementation:** `src/tenancy/registry.ts`

#### **Content Isolation**
- West African content never shown to Wisdom Warehouse
- US curriculum content (future) never shown to SmartClass24 B2C
- Firestore security rules enforce tenant isolation

---

## Usage Patterns

### **Pattern 1: B2C Public Platform (SmartClass24)**

```typescript
// Tenant: smartclass24
{
  enableLocalization: true,  // Show country selector
  curriculum: {
    system: "west-african",
    countries: ["ghana", "nigeria", ...]
  }
}

// User Flow:
1. Visit smartclass24.app
2. Select country (Ghana)
3. System loads WASSCE content with Ghanaian context
4. Currency in math problems: Ghana Cedis (₵)
```

---

### **Pattern 2: B2B White-Label (Wisdom Warehouse)**

```typescript
// Tenant: wisdomwarehouse
{
  enableLocalization: false,  // Hide country selector
  curriculum: {
    system: "us-common-core",
    examSystems: ["SAT", "ACT"]
  },
  market: "middle-east"
}

// User Flow:
1. Visit learn.wisdomwarehouseuae.com
2. No country selector shown
3. System loads US curriculum content
4. Currency in math problems: US Dollars ($)
```

---

### **Pattern 3: Hybrid School (Future - V2)**

```typescript
// Tenant: lagos-british-intl
{
  enableLocalization: true,  // Show country for context
  curriculum: {
    system: "multi-track",
    tracks: ["west-african", "uk-igcse"],
    allowStudentChoice: true
  },
  market: "west-africa"
}

// Student Flow:
1. Visit school's custom domain
2. Select country (Nigeria) for localization
3. Choose curriculum track (WASSCE or IGCSE)
4. System loads appropriate content
```

---

## Technical Implementation

### **Feature Flag: `enableLocalization`**

```typescript
if (tenant.enableLocalization) {
  // Show country selector
  <CountrySelector 
    countries={tenant.curriculum.countries}
    onSelect={(country) => setLocalContext(country)}
  />
} else {
  // Hide country selector, use tenant curriculum directly
  <TenantCurriculumDisplay curriculum={tenant.curriculum} />
}
```

### **Content Filtering**

```typescript
// All lessons tagged with curriculum system
{
  lessonId: "math-quadratic-equations",
  curriculum: "west-african",
  examSystems: ["WASSCE"],
  country: "ghana"  // Optional localization
}

// Query filter
const lessons = db.collection('lessons')
  .where('curriculum', '==', tenant.curriculum.system)
  .where('examSystems', 'array-contains-any', tenant.curriculum.examSystems)
  .get();
```

---

## Scalability Roadmap

### **V1.5 (Q1 2026) - Codify Current Pattern**
- ✅ Add explicit `curriculum` field to tenant config
- ✅ Document 3-layer architecture (this doc)
- ✅ Update TypeScript types

### **V2 (Q2 2026) - Multi-Curriculum Support**
- Add US Common Core content library
- Add UK National Curriculum content
- Allow students to switch curriculum tracks
- `<CurriculumSelector>` component for hybrid schools

### **V3 (Q3-Q4 2026) - Content Marketplace**
- Teachers create curriculum-tagged content
- Schools license curriculum modules à la carte
- Automated curriculum mapping (IGCSE → IB equivalents)

### **Beyond (2027+)**
- AI-powered curriculum conversion
- Auto-translate content between exam systems
- Global curriculum marketplace

---

## Market Positioning

### **Value Propositions by Market Segment**

| Segment | Value Prop | Example |
|---------|-----------|---------|
| **B2C Africa** | "Free access to your national curriculum" | Ghanaian student preparing for WASSCE |
| **B2B Africa** | "White-label platform with your curriculum" | Nigerian private school teaching IGCSE |
| **B2B International** | "Any curriculum, anywhere in the world" | Dubai school teaching US Common Core |
| **B2B Hybrid** | "Multi-track curriculum management" | Lagos school offering WASSCE + IB |

### **Sales Messaging**

❌ **Old:** "AI-powered learning platform for African students"  
✅ **New:** "Multi-curriculum platform for global education - proven with 750+ students across West Africa and Middle East"

❌ **Old:** "Master WASSCE exams"  
✅ **New:** "Master any curriculum: WASSCE, SAT, IGCSE, IB, and beyond"

---

## FAQ for Stakeholders

**Q: Is this only for African students?**  
A: No - we support any curriculum globally. We started with West African systems (200M students), but Wisdom Warehouse proves we deploy US/UK/IB anywhere.

**Q: Can a school in Nigeria teach British curriculum?**  
A: Absolutely. Location and curriculum are separate. Nigerian schools can teach IGCSE using Nigerian currency/context for localization.

**Q: How do you price multiple curriculums?**  
A: Per-student pricing is curriculum-agnostic ($299-$799/month). Custom curriculum creation is an add-on ($500-$2,000/subject).

**Q: What prevents content leakage between curriculums?**  
A: Tenant isolation via Firestore rules + content tagging. West African content never shows to US curriculum students and vice versa.

**Q: Can students switch curriculums mid-year?**  
A: V2 feature (Q2 2026). Currently, curriculum is set at tenant level. Future: student-level curriculum selection for hybrid schools.

---

## Technical Debt & Future Work

### **Known Limitations (V1)**
- Content library currently West African only
- No curriculum switching UI (tenant-level only)
- Localization limited to 5 West African countries
- No US/UK/IB content yet

### **Planned Improvements**
1. **V2:** Add curriculum selector component
2. **V2:** Create US Common Core content library (1,000+ questions)
3. **V3:** Build curriculum conversion tools (WASSCE → IGCSE mapping)
4. **V3:** Expand localization to 20+ countries

---

## Summary

**Current State:**  
✅ Architecture supports multi-curriculum (proven with Wisdom Warehouse)  
✅ B2C uses country → curriculum mapping  
✅ B2B uses direct tenant → curriculum config  
✅ Zero content leakage between tenants

**Future State:**  
🚀 Support any curriculum globally (US, UK, IB, Australian, etc.)  
🚀 Student-level curriculum selection for hybrid schools  
🚀 AI-powered curriculum conversion & marketplace  
🚀 Global platform with proven African traction

**Competitive Advantage:**  
We're not just "another EdTech for Africa" - we're a **global multi-curriculum platform** that happens to dominate the African market first.
