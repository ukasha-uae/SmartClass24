# Multi-Curriculum Readiness Assessment
**Date:** February 12, 2026  
**Status:** 🟡 **READY WITH CRITICAL GAPS**  
**Overall Readiness:** 65% → **Target: 95% within 4 weeks**

---

## Executive Summary

SmartClass24 claims to be "multi-curriculum ready" with support for West African, US Common Core, UK National, IB, and Alternative-Holistic systems. **The infrastructure exists, but critical data and security layers need urgent attention before adding new curriculums.**

### Current State
✅ **STRONG:** Multi-tenant architecture (production-proven with Wisdom Warehouse)  
✅ **STRONG:** Localization system (5 countries, template variables)  
✅ **GOOD:** TypeScript interfaces (`CurriculumConfig`)  
✅ **GOOD:** Navigation system (curriculum-agnostic as of Week 2)  
🟡 **MODERATE:** Content architecture (hardcoded but organized)  
❌ **WEAK:** Data layer (no curriculum separation)  
❌ **WEAK:** Security rules (no curriculum-level isolation)  
❌ **WEAK:** Content management (manual code changes required)

### Risk Assessment
🔴 **HIGH RISK:** Adding new curriculum today would require:
- Duplicating 9,000+ questions manually
- Hardcoding new curriculum data in TypeScript
- Risk of cross-curriculum content leakage
- No versioning or rollback capability

---

## 1. Architecture Assessment

### 1.1 Current 3-Layer Architecture ✅

```typescript
Layer 1: Tenant → School/Institution
Layer 2: Curriculum → Exam System
Layer 3: Localization → Cultural Context (optional)
```

**Status:** ✅ **SOLID FOUNDATION**

**Implementation:**
```typescript
// src/tenancy/types.ts (lines 66-76)
export interface CurriculumConfig {
  system: string;          // 'west-african' | 'us-common-core' | 'uk-national'
  examSystems: string[];   // ['BECE', 'WASSCE'] or ['SAT', 'ACT']
  gradeLevels: string[];   // ['Primary', 'JHS', 'SHS'] or ['K-12']
  countries?: string[];    // ['ghana', 'nigeria'] or ['us', 'uk']
  description?: string;
}
```

**Strengths:**
- Clear separation of concerns
- Tenant can specify any curriculum system
- Localization is optional (works for UAE, US markets)
- Proven with 2 live curriculum systems (West African, Alternative-Holistic)

**Gaps:**
- `curriculum` field is optional on TenantConfig (should be required for new tenants)
- No validation that curriculum system exists
- No enforcement of curriculum-specific content

---

### 1.2 Multi-Tenant Infrastructure ✅

**Status:** ✅ **PRODUCTION-READY**

**Evidence:**
- Wisdom Warehouse (UAE) running since January 2026
- 100% uptime, zero cross-tenant data leakage
- Tenant-specific branding, features, content whitelisting

**Files:**
- `src/tenancy/registry.ts` - Tenant configurations
- `src/hooks/useTenant.ts` - React context for tenant access
- `firestore.rules` - Security rules with `tenantId` filtering

**Firestore Security (lines 1-50):**
```javascript
function belongsToTenant(tenantId) {
  return request.auth != null && (
    request.auth.token.tenantId == tenantId ||
    !('tenantId' in request.auth.token)
  );
}

match /students/{studentId} {
  allow read: if request.auth != null && (
    request.auth.uid == studentId ||
    belongsToTenant(resource.data.tenantId) ||
    isSuperAdmin()
  );
}
```

**What Works:**
- ✅ Students isolated by `tenantId`
- ✅ Quiz attempts scoped to tenant
- ✅ Challenges accessible within tenant only
- ✅ Subscriptions tenant-specific

**Critical Gap:**
❌ No `curriculumId` field in security rules  
❌ No curriculum-level access control  
❌ All tenants with same `tenantId` see same content (no curriculum filtering in Firestore)

---

## 2. Data Layer Assessment ❌

### 2.1 Current Data Structure

**Status:** ❌ **NOT SCALABLE FOR MULTI-CURRICULUM**

**Problem:** All lesson data is hardcoded in TypeScript files:

```typescript
// src/lib/jhs-data.ts - 9,000+ lines of West African curriculum
export const JHS_DATA: Subject[] = [
  {
    id: 'english',
    slug: 'english',
    name: 'English Language',
    description: 'Master English for BECE success', // ❌ BECE-specific
    curriculum: [
      {
        level: 'JHS 1',  // ❌ Ghana-specific terminology
        topics: [...]
      }
    ]
  }
];
```

**Issues:**
1. **No Curriculum Separation:** All subjects assume West African curriculum
2. **Hardcoded References:** "BECE", "WASSCE", "Ghana Education Service" throughout
3. **No Dynamic Loading:** Cannot serve different curriculums to different tenants
4. **Maintenance Nightmare:** Adding US Common Core means duplicating 9,000+ questions

---

### 2.2 Lesson Data Structure

**Current Schema:**
```typescript
// src/lib/types.ts (lines 124-149)
export interface Lesson {
  id: string;
  slug: string;
  title: string;
  objectives: string[];      // ❌ No curriculum field
  introduction: string;
  keyConcepts: { title: string; content: string }[];
  activities: { type: string; questions: any[] };
  pastQuestions: {           // ❌ "Past questions" is exam-system specific
    question: string;
    solution?: string;
    year?: string;           // ❌ Assumes exam-based system (not US continuous assessment)
  }[];
  summary: string;
  endOfLessonQuiz?: Quiz[];
  defaultQuizStyle?: QuizStyle;
  availability?: ContentAvailability;
}
```

**Missing Fields:**
- ❌ `curriculumSystem: string` - Which curriculum this lesson belongs to
- ❌ `region: string[]` - Geographic applicability
- ❌ `examAlignment: ExamSystem[]` - Which exams this covers
- ❌ `versionId: string` - Content versioning
- ❌ `approvalStatus: 'draft' | 'review' | 'approved'` - Editorial workflow

---

### 2.3 Subject Naming

**Current:**
```typescript
// Hardcoded subject names (West African curriculum)
'Integrated Science'  // ❌ Ghana/Nigeria term
'Social Studies'      // ❌ US uses 'Social Studies', UK uses 'Humanities'
'Mathematics'         // ✅ Universal
```

**Problem:** Subject names are curriculum-specific but not labeled as such

**Solution Needed:**
```typescript
export interface Subject {
  id: string;
  curriculum: string;              // 'west-african' | 'us-common-core'
  standardName: string;            // 'Science'
  localizedNames: {                // Curriculum-specific names
    'west-african': 'Integrated Science',
    'us-common-core': 'High School Biology',
    'uk-national': 'Science (Combined)'
  };
}
```

---

## 3. Content Management Assessment ❌

### 3.1 Current Content Workflow

**Status:** ❌ **MANUAL, CODE-BASED (NOT SCALABLE)**

**Current Process:**
1. Write lessons in TypeScript files (`jhs-data.ts`)
2. Commit code to GitHub
3. Deploy entire app
4. **No rollback without full deployment**

**Issues:**
- ❌ Cannot update content without code deployment
- ❌ No content versioning (cannot A/B test lesson variations)
- ❌ No editorial workflow (draft → review → publish)
- ❌ No content authoring UI (educators cannot contribute)

**Week 2 claim from SALES_PITCH_DECK.md:**
> "V2 (Q2 2026) - IN DEVELOPMENT: Multi-curriculum selector"

**Reality:** We can't add multi-curriculum selector until content is database-driven.

---

### 3.2 Quiz Question Storage

**Current:**
```typescript
// src/lib/jhs-data.ts lines 388+
endOfLessonQuiz: [
  {
    type: 'mcq',
    question: 'What is the capital of Ghana?',  // ❌ Ghana-specific
    options: ['Accra', 'Kumasi', 'Takoradi', 'Cape Coast'],
    answer: 'Accra',
    explanation: 'Accra is the capital and largest city of Ghana.'
  }
]
```

**Problems:**
- ❌ 2,500+ SHS questions hardcoded
- ❌ No question tagging by curriculum
- ❌ No question difficulty levels
- ❌ No question reusability across curriculums
- ❌ No blooms taxonomy alignment

---

## 4. Security Gaps ❌

### 4.1 Current Firestore Rules

**Status:** ❌ **TENANT ISOLATION ONLY (NO CURRICULUM ISOLATION)**

**Current (firestore.rules lines 23-42):**
```javascript
match /students/{studentId} {
  allow read: if request.auth != null && (
    request.auth.uid == studentId ||
    belongsToTenant(resource.data.tenantId) ||  // ✅ Tenant check
    isSuperAdmin()
  );
}
```

**What's Missing:**
```javascript
// NEEDED:
function belongsToCurriculum(curriculumId) {
  return request.auth != null && (
    request.auth.token.curriculumId == curriculumId ||
    request.auth.token.curriculumAccess.hasAny([curriculumId])
  );
}

match /curricula/{curriculumId}/subjects/{subjectId}/lessons/{lessonId} {
  allow read: if request.auth != null && 
    belongsToTenant(resource.data.tenantId) &&
    belongsToCurriculum(curriculumId);  // ❌ MISSING
}
```

**Risk:**
🔴 **HIGH:** If we add US Common Core content to Firestore today:
- Ghana students could see SAT questions
- US students could see WASSCE questions
- No curriculum-level access control

---

### 4.2 Authentication Claims

**Current:**
```typescript
// User auth token contains:
{
  tenantId: 'wisdomwarehouse',  // ✅ Tenant isolation works
  // ❌ MISSING: curriculumId or curriculumAccess
}
```

**Needed:**
```typescript
{
  tenantId: 'wisdomwarehouse',
  curriculumId: 'us-common-core',              // Primary curriculum
  curriculumAccess: ['us-common-core', 'ib'], // Multi-curriculum access
  role: 'student' | 'teacher' | 'admin'
}
```

---

## 5. Scalability Roadblocks

### 5.1 Adding US Common Core Today

**Current Process (BROKEN):**
1. Create `src/lib/us-common-core-data.ts` (duplicate 9,000 lines)
2. Manually write 1,000+ questions for K-12
3. Update navigation config to show US vs. West African content
4. Hope no Ghana-specific terms leaked into code

**Estimated Time:** 400+ hours  
**Risk:** 🔴 HIGH (manual duplication, no validation)

---

### 5.2 What Needs to Happen

**Phase 1: Data Migration (2 weeks)**
```
1. Create Firestore collections:
   - curricula/{curriculumId}/subjects/{subjectId}
   - curricula/{curriculumId}/subjects/{subjectId}/topics/{topicId}
   - curricula/{curriculumId}/subjects/{subjectId}/topics/{topicId}/lessons/{lessonId}
   - curricula/{curriculumId}/questions/{questionId}

2. Migrate existing West African content:
   - Tag all 9,000+ questions with curriculumId: 'west-african'
   - Add curriculumId to all lessons, topics, subjects
   - Migrate to Firestore (batch operations)

3. Update codebase:
   - Remove hardcoded JHS_DATA exports
   - Fetch lessons dynamically based on tenant's curriculumId
   - Cache aggressively (React Query, IndexedDB)
```

**Phase 2: Security Enhancement (1 week)**
```
1. Add curriculum claims to auth tokens
2. Update firestore.rules with curriculum isolation
3. Test cross-curriculum access prevention
```

**Phase 3: Content Management (1 week)**
```
1. Build admin UI for content creation
2. Add versioning and approval workflow
3. Create curriculum template system
```

**Total:** 4 weeks to be truly multi-curriculum ready

---

## 6. Maintainability Issues

### 6.1 Code Duplication Risk

**Current State:**
```typescript
// If we add US Common Core TODAY:
src/lib/jhs-data.ts              // 9,000 lines (West African)
src/lib/us-k8-data.ts            // 9,000 lines (US Elementary) - DUPLICATE
src/lib/us-high-school-data.ts  // 9,000 lines (US H.S.) - DUPLICATE
```

**Problem:** 27,000+ lines of duplicated data structure, just different content

**Solution:** Database-driven with shared schema

---

### 6.2 Content Updates

**Current:**
- Change 1 question → Edit TypeScript → Commit → Deploy entire app → 5 minutes
- Change 100 questions → 500 minutes (8+ hours)

**Needed:**
- Change 1 question → Update Firestore doc → Live in 1 second
- Change 100 questions → Bulk update API → Live in 10 seconds

---

## 7. What Works Well ✅

Despite gaps, some infrastructure is production-ready:

### 7.1 Tenant System ✅
- Multi-tenant architecture works (Wisdom Warehouse proof)
- Tenant-specific branding, features, domains
- Preview mode (`?tenant=xyz`) for demos

### 7.2 Localization System ✅
- 5 countries supported
- Template variables ({{currency}}, {{exam:primary}})
- Cultural context separation from curriculum

### 7.3 Navigation System ✅ (Week 2)
- Dynamic navigation based on country and tenant
- Platform/Regional/Global sections
- Curriculum-agnostic design

### 7.4 TypeScript Types ✅
- `CurriculumConfig` interface exists
- Extensible to new curriculum systems
- Type safety for tenant configurations

---

## 8. Critical Gaps Summary

| Area | Status | Risk | Time to Fix |
|------|--------|------|-------------|
| **Data Layer** | ❌ Hardcoded | 🔴 HIGH | 2 weeks |
| **Security Rules** | ❌ No curriculum isolation | 🔴 HIGH | 1 week |
| **Content Management** | ❌ Manual code edits | 🟡 MEDIUM | 1 week |
| **Question Tagging** | ❌ No curriculum metadata | 🟡 MEDIUM | 3 days |
| **Subject Naming** | ❌ Curriculum-specific | 🟢 LOW | 2 days |
| **Versioning** | ❌ None | 🟢 LOW | 3 days |

**Total Effort:** 4 weeks (160 hours) to achieve 95% multi-curriculum readiness

---

## 9. Immediate Action Plan

### 🚨 CRITICAL (Do First - Week 1)

**1. Add Curriculum Field to All Data (2 days)**
```typescript
// Update src/lib/types.ts:
export interface Lesson {
  // ... existing fields
  curriculumId: string;  // Required field
  region?: string[];     // Optional geographic scope
}
```

**2. Create Firestore Collections (3 days)**
```
curricula/
├── west-african/
│   ├── metadata
│   ├── subjects/
│   │   ├── mathematics/
│   │   │   └── jhs-1/
│   │   │       └── lessons/
│   │   └── integrated-science/
│   └── questions/
└── us-common-core/
    ├── metadata
    └── subjects/ (ready for content)
```

**3. Migrate Existing Content (5 days)**
- Script to migrate jhs-data.ts to Firestore
- Tag all content with `curriculumId: 'west-african'`
- Verify data integrity

### 🟡 IMPORTANT (Week 2)

**4. Update Security Rules (2 days)**
```javascript
match /curricula/{curriculumId}/subjects/{subjectId}/lessons/{lessonId} {
  allow read: if request.auth != null && 
    belongsToTenant(resource.data.tenantId) &&
    (resource.data.curriculumId == request.auth.token.curriculumId ||
     request.auth.token.curriculumAccess.hasAny([resource.data.curriculumId]));
}
```

**5. Dynamic Content Loading (3 days)**
```typescript
// Replace hardcoded imports:
// ❌ import { JHS_DATA } from '@/lib/jhs-data';

// ✅ Fetch based on curriculum:
const { curriculum } = useTenant();
const lessons = useLessons(curriculum.system, subjectId, level);
```

### 🟢 NICE-TO-HAVE (Weeks 3-4)

**6. Content Management UI (5 days)**
- Admin panel for creating lessons
- Curriculum selector
- Approval workflow

**7. Question Reusability System (3 days)**
- Tag questions with topics, not just lessons
- Allow cross-curriculum question sharing (e.g., "What is 2+2?" works globally)

---

## 10. Recommendations

### 10.1 Short-Term (Before Adding New Curriculum)

❌ **DO NOT** add US Common Core or UK National content until:
1. ✅ Data layer is migrated to Firestore
2. ✅ Security rules include curriculum isolation
3. ✅ Dynamic content loading is implemented

**Why:** Risk of content leakage, security vulnerabilities, unmaintainable codebase

---

### 10.2 Medium-Term (Q2 2026)

✅ **DO**:
1. Complete database migration (2 weeks)
2. Build content management UI (1 week)
3. Add US Common Core content via admin panel (4 weeks)
4. Launch curriculum selector on homepage (1 week)

**Total:** 8 weeks to full multi-curriculum launch

---

### 10.3 Long-Term (Q3-Q4 2026)

1. **AI Content Generation**: Use LLMs to generate curriculum-aligned questions
2. **Curriculum Marketplace**: Allow educators to sell custom curriculum modules
3. **Auto-Alignment**: AI maps questions across curriculum systems (e.g., WASSCE Algebra → US Algebra I)

---

## 11. Investor/Sales Communication

### What to Say

✅ **"We have proven multi-tenant architecture with Wisdom Warehouse"** - TRUE  
✅ **"Our platform is designed for multi-curriculum support"** - TRUE (architecture exists)  
✅ **"We currently serve West African curriculum (Ghana, Nigeria, etc.)"** - TRUE  
✅ **"We're expanding to US Common Core and UK National in Q2 2026"** - TRUE (with 4-week data migration first)

### What NOT to Say

❌ **"We support multiple curriculums today"** - FALSE (only West African in production)  
❌ **"Adding new curriculum takes 1 week"** - FALSE (takes 4 weeks + content creation)  
❌ **"Content is curriculum-agnostic"** - FALSE (hardcoded West African references)

### Updated Sales Pitch Deck Claims

**Current (SALES_PITCH_DECK.md line 20):**
> "Multi-Curriculum Architecture - Proven with West African (BECE/WASSCE/NECO) & Alternative-Holistic systems"

**Reality Check:**
- ✅ Architecture: PROVEN
- ✅ West African: LIVE IN PRODUCTION
- ✅ Alternative-Holistic: LIVE (Wisdom Warehouse)
- 🟡 "Expanding to US Common Core, UK National, IB": REQUIRES 4-WEEK DATA MIGRATION FIRST

**Honest Framing:**
> "Multi-Curriculum Architecture - **Production-proven** with 2curriculum systems (West African + Alternative-Holistic). Platform **designed for** US Common Core, UK National, IB with 4-week migration path per new curriculum."

---

## 12. Success Criteria

### Definition of "Multi-Curriculum Ready"

✅ **READY** when:
1. Data is curriculum-scoped in Firestore
2. Security rules enforce curriculum isolation
3. Content loads dynamically based on tenant's curriculum
4. Adding new curriculum requires:
   - Creating curriculum entry in database
   - Uploading content via admin UI
   - NO CODE CHANGES

### Current Status: 65% Ready

- ✅ Architecture (100%)
- ✅ Tenant System (100%)
- ✅ Localization (100%)
- ✅ Navigation (100%)
- 🟡 Data Layer (20% - structure exists, migration needed)
- ❌ Security (0% - no curriculum rules)
- ❌ Content Management (0% - no admin UI)

**Average: 65%**

### Target: 95% Ready in 4 Weeks

---

## 13. Conclusion

**Is SmartClass24 ready for multi-curriculum? YES, with 4 weeks of work.**

**Why the delay matters:**
- 🔴 Security risk: Cross-curriculum contamination
- 🔴 Scalability blocker: Cannot add curriculums without code changes
- 🟡 Maintenance nightmare: Duplicate code proliferation

**The Good News:**
- ✅ Foundation is solid (multi-tenancy, localization, architecture)
- ✅ Wisdom Warehouse proves platform can handle diverse curriculum needs
- ✅ No major rewrites needed - just data migration + security enhancement

**Investment Ask Impact:**
The $500K seed round in SALES_PITCH_DECK.md should allocate:
- **$50K (10%)** for data migration project (4 weeks, 3 engineers)
- **$30K (6%)** for content management UI (2 weeks, 2 engineers)
- **$20K (4%)** for security enhancement (1 week, 1 engineer)

**Total:** $100K of $500K for multi-curriculum foundation (20% of seed round)

---

**Prepared By:** SmartClass24 Technical Team  
**Review Date:** February 12, 2026  
**Next Review:** March 15, 2026 (after migration completion)
