# Multi-Curriculum Mapping – Investigation & KPIs

**Date:** February 2026  
**Purpose:** Is multi-curriculum mapping working? What to improve? How to test it yourself.

---

## 1. What Is Multi-Curriculum Mapping?

The app supports multiple curricula so the same codebase can serve:

- **Ghana WASSCE** (e.g. SmartClass24 with country Ghana)
- **US Common Core** (e.g. Wisdom Warehouse, `curriculumId: 'us-common-core'`)
- **UK GCSE** (mappings exist; no tenant uses it yet)

Two mechanisms:

1. **Topic filtering by curriculum** – Which topics appear for a given subject + level (e.g. only US Common Core–mapped topics for Wisdom Warehouse SHS).
2. **Content transformation** – Same lesson text with tenant-specific wording (e.g. "JHS 1" → "Grade 7", "Ghana" → "your country") via `contentTransformationRules`.

---

## 2. What Is Working

### 2.1 Curriculum resolution

- **Tenant wins:** `resolveCurriculumId(tenant, country)` uses `tenant.curriculum.curriculumId` first (e.g. Wisdom Warehouse → `us-common-core`).
- **Otherwise country:** e.g. Ghana → `ghana-wassce`; other countries → no mapping (null).
- **Used in:** Subject topic list (SHS only).

**Code:** `src/lib/curriculum-mapping/resolver.ts` → `resolveCurriculumId`, `getCurriculumIdForCountry`.

### 2.2 SHS topic filtering (Lessons)

- **Where:** `src/app/subjects/[level]/[subjectSlug]/page.tsx` (SHS branch only).
- **Logic:** For each topic from `getSHSSubjectBySlug`:
  - Resolve `curriculumId` (tenant or country).
  - Resolve level alias (e.g. SHS 1 → Grade 9 for US Common Core).
  - If curriculum has mappings for this subject+level, **only show topics that exist in the mapping** (`isTopicInCurriculum`).
- **Result:** Wisdom Warehouse (us-common-core) sees only US Common Core–mapped topics for Core Mathematics, Integrated Science, Physics at the right grade levels. SmartClass24 with Ghana sees ghana-wassce-mapped topics.

**Code:** Subject page lines ~156–172; resolver `isTopicInCurriculum`, `hasMappedTopicsForSubject`, `resolveCurriculumLevel`.

### 2.3 Lesson content transformation

- **Where:** Lesson view `src/app/subjects/[level]/[subjectSlug]/[topicSlug]/[lessonSlug]/page.tsx` calls `contentAdapter.adaptLessonForTenant(lesson, tenant)`.
- **Effect:** For tenants with `contentTransformationRules` (e.g. Wisdom Warehouse), lesson title, introduction, objectives, key concepts, summary, quiz questions get string replacements (e.g. "JHS 1" → "Grade 7", "cedis" → "dollars", "BECE" → "assessment").
- **Result:** Same underlying lesson, different wording per tenant.

**Code:** `src/lib/curriculum-content-adapter.ts` → `adaptLessonForTenant`, `adaptQuizForTenant`; lesson page imports and uses `contentAdapter`.

### 2.4 Level label display

- **Tenant config:** Wisdom Warehouse has `educationLevelLabels` (Primary → Primary School, JHS → Middle School, SHS → High School) and `contentTransformationRules` for "JHS 1" → "Grade 7", etc.
- **Content adapter:** `getGradeLevelLabel(level, tenant)` returns tenant-friendly labels.
- **Used where:** Anywhere that displays level/grade and uses the adapter or tenant branding.

---

## 3. Gaps and Improvements

### 3.1 Question bank is not curriculum-filtered

- **Current:** `getChallengeQuestions(level, subject, classLevel, count, userId)` and `getArenaQuestionsForLargeScreen(...)` do **not** receive `curriculumId` or tenant. They filter only by level (Primary/JHS/SHS), subject name, and class level.
- **Effect:** Wisdom Warehouse students in Challenge Arena / Large Screen games get the same West African–oriented question bank (same questions as Ghana). Content transformation is **not** applied to challenge/arena question text.
- **Improvement options:**
  - **A)** Pass tenant (or curriculumId) into `getChallengeQuestions` and filter questions by curriculum tag if/when questions have `curriculumId` (or add such a field).
  - **B)** Apply `contentAdapter.transformText()` to question text when rendering for a tenant that has `contentTransformationRules` (so "cedis", "BECE", "in Ghana" etc. are replaced in the UI only).
  - **C)** Build a separate US-aligned question set and select by tenant (larger content effort).

**Recommendation:** Short term, (B) is fastest so Wisdom doesn’t see raw "BECE"/"cedis" in quizzes. Medium term, (A) or (C) for true curriculum-aligned question sets.

### 3.2 JHS and Primary topic lists are not curriculum-filtered

- **Current:** Curriculum mapping filter is applied **only** in the SHS branch of the subject page. JHS and Primary use `subjectInfo.curriculum` from jhs-data/primary-data and show **all** topics for that subject/level; no `isTopicInCurriculum` check.
- **Effect:** For Wisdom Warehouse JHS, students see the full West African JHS topic list, not a US Common Core–aligned subset (and US Common Core mappings are currently SHS-focused: Grade 9–12).
- **Improvement:** If you add JHS-level mappings for us-common-core (e.g. Grade 7, Grade 8), extend the subject page to apply the same curriculum filtering for JHS (and Primary if needed), using `resolveCurriculumId` and `isTopicInCurriculum` for the selected level.

### 3.3 No observability (logging / analytics)

- **Current:** There is no logging or analytics when:
  - Curriculum is resolved (which curriculumId was chosen).
  - Topics are filtered (how many shown vs hidden per subject/level).
  - Content transformation is applied (which tenant, which rules).
- **Improvement:** Add optional debug logging or analytics events, e.g.:
  - `curriculum_resolved`: tenantId, curriculumId, source (tenant | country).
  - `topics_filtered`: curriculumId, level, subjectSlug, totalTopics, visibleTopics.
  - `content_adapted`: tenantId, lessonId (or screen), ruleCount.

Then you can add KPIs (see below) that depend on these.

---

## 4. KPIs That Show It’s Working (and how to test)

Use these to verify multi-curriculum mapping in reality.

### KPI 1: Correct curriculum is used per tenant/country

- **Metric:** For a given session, the effective `curriculumId` is tenant’s or country’s (e.g. Wisdom → `us-common-core`, Ghana → `ghana-wassce`).
- **How to test:**
  1. **Wisdom Warehouse:** Open as Wisdom (e.g. `?tenant=wisdomwarehouse` or custom domain). Go to **SHS** → **Core Mathematics** (or **Integrated Science**). Check topic list: you should see only a **subset** of topics (those in `us-common-core` mapping for that level), and level labels should say **Grade 9 / 10 / 11** (or similar), not "SHS 1/2/3" if your UI uses the adapter.
  2. **SmartClass24 Ghana:** Same path with country Ghana (or default). You should see **ghana-wassce** topic set (SHS 1/2/3), typically **more** topics than Wisdom for the same subject.
  3. **Optional:** Add a small debug line in the subject page (e.g. `console.log('curriculumId', curriculumId)` for SHS). Reload and confirm Wisdom logs `us-common-core` and Ghana logs `ghana-wassce`.

**Pass:** Wisdom sees a different (smaller, US-aligned) topic list for SHS; Ghana sees full WASSCE-aligned list.

---

### KPI 2: SHS topic list differs by curriculum

- **Metric:** Number and set of topics shown for the same subject + level differ when curriculum changes (e.g. Wisdom vs Ghana).
- **How to test:**
  1. **Wisdom:** SHS → Core Mathematics. Note how many topics appear for "Grade 9" (or High School 1).
  2. **Ghana (or default):** SHS → Core Mathematics. Note how many topics for "SHS 1".
  3. Compare: US Common Core mapping has a limited set of slugs for Core Mathematics (see `us-common-core.ts`); Ghana WASSCE has more. So Wisdom should see **fewer** topics per level for Core Mathematics (and similar for Integrated Science / Physics if you have mappings).

**Pass:** Topic counts and/or topic names differ between Wisdom and Ghana for the same subject and level.

---

### KPI 3: Lesson text is transformed for Wisdom (no Ghana-specific wording)

- **Metric:** On Wisdom, lesson and quiz text does not show raw "BECE", "WASSCE", "cedis", "in Ghana", "JHS 1" (or shows tenant-friendly equivalents).
- **How to test:**
  1. As **Wisdom Warehouse**, open any **SHS** lesson that originally contains "Ghana", "JHS 1", "cedis", or "BECE" (e.g. from Integrated Science or Core Mathematics).
  2. Read the lesson body and end-of-lesson quiz. You should see "your country", "Grade 7/8/9", "dollars", "assessment" (or similar) instead.
  3. Same lesson as **SmartClass24** (Ghana): original wording should remain (BECE, JHS 1, cedis, etc.).

**Pass:** Wisdom sees neutral/international wording; SmartClass24 sees Ghana-specific wording.

---

### KPI 4: Level labels match tenant (e.g. Grade 7 vs JHS 1)

- **Metric:** Where the UI shows level/grade (subject page, lesson header, settings), Wisdom sees "Grade 7/8/9" or "Middle School" and Ghana sees "JHS 1/2/3".
- **How to test:**
  1. Wisdom: Subject page and lesson page – labels should use tenant’s `educationLevelLabels` and `contentTransformationRules` (Grade 7, Middle School, etc.).
  2. Ghana: Same places show JHS 1, SHS 1, etc.

**Pass:** No "JHS 1" or "SHS 1" visible for Wisdom in main content; Ghana still sees JHS/SHS.

---

### KPI 5: Challenge / Arena questions (current limitation)

- **Metric (current):** Questions are the same for all tenants (level + subject + class only). No curriculum filter, no transformation of question text.
- **How to test:**
  1. As Wisdom, start a **Quick Match** or **Large Screen** game (e.g. Light Your City) for SHS, Core Mathematics.
  2. As SmartClass24 (Ghana), same flow.
  3. Compare: question text may be identical and may still mention "Ghana", "cedis", or "BECE" for both, because the question bank and Arena path do not use curriculum or content adapter yet.

**Pass (today):** You observe that Arena/Challenge questions are **not** curriculum-specific and **not** transformed – this matches current implementation.  
**Future KPI:** After implementing (B) or (A) above: Wisdom sees transformed or curriculum-filtered questions; Ghana sees original wording and full bank.

---

## 5. Quick Test Checklist (DIY)

| # | Action | Expected (Wisdom) | Expected (Ghana/default) |
|---|--------|-------------------|---------------------------|
| 1 | Open SHS → Core Mathematics (subject page) | Only US Common Core–mapped topics; labels like "Grade 9" | Full ghana-wassce topics; "SHS 1/2/3" |
| 2 | Open one SHS lesson (e.g. Integrated Science) | No "Ghana", "BECE", "cedis"; "Grade 9" etc. | Original "Ghana", "BECE", "JHS 1", etc. |
| 3 | Open Challenge Arena → Quick Match (SHS, Mathematics) | Same questions as Ghana; may still see "cedis"/"BECE" in text | Same questions; Ghana wording |
| 4 | Settings or profile “curriculum” | Shows tenant curriculum label (e.g. "US Common Core • Holistic…") | "West African (BECE/WASSCE/NECO)" or similar |

---

## 6. Summary

- **Working:** Curriculum resolution (tenant → us-common-core for Wisdom, country → ghana-wassce for Ghana). **SHS topic filtering** by curriculum. **Lesson (and quiz) content transformation** for tenants with rules. Level labels from tenant config.
- **Not yet:** **Question bank** filtering or transformation by curriculum; **JHS/Primary** topic filtering by curriculum; **observability** (logging/analytics) for curriculum and topic filtering.
- **KPIs to test:** (1) Correct curriculumId per tenant/country, (2) SHS topic list differs by curriculum, (3) Lesson text transformed for Wisdom, (4) Level labels tenant-appropriate, (5) Arena questions currently not curriculum-specific (document as known limit until you add filtering/transformation).

Using the checklist and KPIs above, you can validate in production or staging that multi-curriculum mapping behaves as designed and where it still falls short.
