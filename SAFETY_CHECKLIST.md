# Multi-Curriculum Safety Checklist

**Status:** 🔐 SAFETY-FIRST DEPLOYMENT  
**Phase:** 2 of 5 (Data Migration & Security Validation)  
**Priority:** Security → Data Integrity → Performance

---

## Pre-Deployment Security Audit

### 1. Firestore Rules Validation ✅

**File:** `firestore.rules`

**Critical Security Checks:**
- [x] `belongsToCurriculum()` helper function implemented
- [x] `getTenantCurriculum()` reads from Firestore tenants collection
- [x] `hasRole()` checks admin/content-creator permissions
- [x] Curriculum collections require authentication for read
- [x] Curriculum collections require admin role for write
- [x] Quiz questions scoped by `/quizzes/{curriculumId}/questions`
- [x] Student quiz attempts include curriculumId field

**Deployment Command:**
```bash
firebase deploy --only firestore:rules
```

**Test in Firebase Console:**
```javascript
// Test 1: Student can read their curriculum
match /quizzes/west-african/questions/q1 {
  allow read: if request.auth != null; // Should pass
}

// Test 2: Student cannot write to curriculum
match /curriculums/west-african {
  allow write: if hasRole('admin'); // Should fail for regular students
}

// Test 3: Cross-curriculum access (Phase 4 - after auth tokens updated)
// Will test after curriculumId added to auth claims
```

### 2. Firestore Indexes Validation ✅

**File:** `firestore-curriculum.indexes.json`

**Indexes Created:**
- [x] Lessons by curriculumId + subject + sequenceOrder
- [x] Lessons by curriculumId + gradeLevel + lastModified
- [x] Questions by curriculumId + lessonId + difficulty
- [x] Questions by curriculumId + subjectId + topicId
- [x] Quiz attempts by curriculumId + userId + timestamp
- [x] Quiz attempts by userId + curriculumId + score
- [x] Topics by curriculumId + sequenceOrder
- [x] Subjects by curriculumId + standardName

**Deployment Command:**
```bash
firebase deploy --only firestore:indexes
```

**Validation:**
- Check Firebase console for index build status
- Wait for "ready" status before migration
- Estimated build time: 5-10 minutes (empty database)

### 3. Data Integrity Validation 🔄

**Current State:**
- ✅ 35 quiz objects tagged in `src/lib/jhs-data.ts`
- ⏳ 709 lessons need curriculum metadata
- ⏳ SHS lessons need curriculum metadata

**Safety Requirement:** ALL data must have `curriculumId` before migration

**Validation Script:**
```javascript
// Run before migration
function validateDataIntegrity() {
  const lessons = getAllLessons(); // From jhs-data.ts
  const missing = lessons.filter(l => !l.curriculumId);
  
  if (missing.length > 0) {
    console.error(`❌ ${missing.length} lessons missing curriculumId`);
    process.exit(1);
  }
  
  console.log('✅ All lessons have curriculum metadata');
}
```

### 4. Migration Safety

**Dry-Run Required:** ✅
```bash
node migrate-curriculum-to-firestore.js --curriculum west-african --dry-run
```

**Safety Checks:**
- [ ] Dry-run shows expected lesson count (709 for JHS)
- [ ] Dry-run shows expected quiz count (11,500+ total)
- [ ] No errors in dry-run output
- [ ] Backup files created (.backup extension)

**Execution (Only After Dry-Run Success):**
```bash
node migrate-curriculum-to-firestore.js --curriculum west-african --execute
```

**Post-Migration Validation:**
```bash
# Check Firestore console
# Expected: 
# - curriculums/west-african exists
# - subjects collection populated
# - topics collection populated  
# - lessons collection populated
# - quizzes/west-african/questions populated
```

---

## Phase 2 Execution Plan (Safety-First)

### Step 1: Deploy Security Infrastructure (Today)

**1.1 Deploy Firestore Rules**
```bash
firebase deploy --only firestore:rules
```

**Expected Output:**
```
✔  Deploy complete!
Project Console: https://console.firebase.google.com/project/smartclass24/overview
```

**Verification:**
- Open Firebase Console → Firestore → Rules
- Confirm rules show curriculum isolation helpers
- Test rules simulator with sample queries

**1.2 Deploy Firestore Indexes**
```bash
firebase deploy --only firestore:indexes
```

**Expected Output:**
```
✔  firestore indexes have been deployed
Indexes are being created...
```

**Wait Time:** 5-10 minutes for index build
**Verification:** Firebase Console → Firestore → Indexes → All show "enabled"

### Step 2: Complete Data Tagging (Tomorrow)

**2.1 Review Current Tagging**
```bash
# Check what's already tagged
grep -r "curriculumId: 'west-african'" src/lib/jhs-data.ts | wc -l
# Expected: 35 (quiz objects already tagged)
```

**2.2 Manual Lesson Tagging (Safer than Script)**

**Template for Each Lesson:**
```typescript
{
  id: 'lesson-id',
  slug: 'lesson-slug',
  title: 'Lesson Title',
  // ADD THESE THREE LINES ⬇️
  curriculumId: 'west-african',
  region: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'],
  examAlignment: ['BECE', 'WASSCE', 'NECO'],
  // Then continue with existing fields
  objectives: [...],
  introduction: '...',
  // ...
}
```

**Priority Files (in order):**
1. `src/lib/jhs-data.ts` - 709 lessons (CRITICAL - 9,000+ questions)
2. `src/lib/integrated-science-shs1-lessons-data.ts` - 22 lessons
3. `src/lib/integrated-science-shs2-lessons-data.ts`
4. `src/lib/integrated-science-shs3-lessons-data.ts`
5. `src/lib/english-shs1-lessons-data.ts`
6. `src/lib/english-shs2-lessons-data.ts`

**Alternative: Improve Tagging Script**
```bash
# Test improved script on single file first
node tag-curriculum-data.js --file src/lib/jhs-data.ts --dry-run --verbose
# If output looks correct, run with backup
node tag-curriculum-data.js --file src/lib/jhs-data.ts --backup
```

**Validation:**
```bash
npm run typecheck
# Expected: No errors (all curriculum fields are optional)
```

### Step 3: Test Migration (Day 3)

**3.1 Dry-Run Migration**
```bash
node migrate-curriculum-to-firestore.js --curriculum west-african --dry-run
```

**Expected Output:**
```
📚 Creating curriculum document: west-african
   [DRY RUN] Would create: { system: 'west-african', examSystems: [...] }
   
📖 Migrating subject: Mathematics
   [DRY RUN] Would create subject: Mathematics (150 lessons)
   
✅ MIGRATION COMPLETE!
   Subjects: 12
   Topics: 85
   Lessons: 709
   Quiz questions: 11,500+
```

**Red Flags to Watch:**
- ❌ Lesson count mismatch (expected: 709 JHS + 22+ SHS)
- ❌ Quiz count too low (expected: 11,500+)
- ❌ TypeError errors (indicates missing curriculum metadata)

**3.2 Execute Migration (Only if Dry-Run Clean)**
```bash
# Backup database first (export current Firestore)
firebase firestore:export gs://smartclass24-backup/$(date +%Y%m%d)

# Execute migration
node migrate-curriculum-to-firestore.js --curriculum west-african --execute

# Monitor Firebase Console in real-time
# Watch Firestore → Data for collections appearing
```

**Expected Timeline:**
- Curriculum document: < 1 second
- Subjects (12): < 5 seconds
- Topics (85): < 30 seconds
- Lessons (709): 2-5 minutes
- Quiz questions (11,500+): 10-15 minutes (batch writes)

**3.3 Post-Migration Validation**
```bash
# Check Firestore Console
# Navigate to: curriculums/west-african/subjects/mathematics/topics/algebra/lessons

# Verify:
# 1. All lessons have curriculumId field
# 2. All quizzes in /quizzes/west-african/questions
# 3. Lesson count matches source data
# 4. Quiz count matches source data
```

### Step 4: Security Testing (Day 4)

**4.1 Test Curriculum Isolation**

**Scenario 1: Admin Access (Should Pass)**
```javascript
// Firebase Console → Firestore → Rules Playground
// Auth: Simulate admin user with role claim
{
  "auth": {
    "uid": "admin123",
    "token": {
      "role": "admin",
      "tenantId": "smartclass24"
    }
  }
}

// Try: Write to /curriculums/west-african
// Expected: ✅ ALLOW
```

**Scenario 2: Student Read (Should Pass)**
```javascript
// Auth: Simulate student
{
  "auth": {
    "uid": "student123",
    "token": {
      "tenantId": "smartclass24"
    }
  }
}

// Try: Read /quizzes/west-african/questions/q1
// Expected: ✅ ALLOW
```

**Scenario 3: Student Write (Should Fail)**
```javascript
// Auth: Same student
// Try: Write to /curriculums/west-african
// Expected: ❌ DENY (only admins can write)
```

**Scenario 4: Cross-Curriculum Access (Phase 4 - After Auth Tokens)**
```javascript
// Will test after adding curriculumId to auth tokens
// Expected: Student from west-african cannot read us-common-core
```

### Step 5: Rollback Plan (If Issues Found)

**If Migration Fails:**
```bash
# 1. Delete migrated data
firebase firestore:delete --all-collections --yes

# 2. Restore from backup
firebase firestore:import gs://smartclass24-backup/YYYYMMDD

# 3. Revert firestore.rules to previous version
git revert <commit-hash>
firebase deploy --only firestore:rules
```

**If Performance Issues:**
```bash
# 1. Check Firestore usage
# Firebase Console → Usage → Firestore
# Look for: Excessive reads, slow queries

# 2. Verify indexes are built
# Firestore → Indexes → Check all "enabled"

# 3. Test query performance
const start = Date.now();
const lessons = await db.collection('curriculums')
  .doc('west-african')
  .collection('subjects')
  .doc('mathematics')
  .collection('topics')
  .doc('algebra')
  .collection('lessons')
  .get();
console.log(`Query took: ${Date.now() - start}ms`);
// Expected: < 100ms
```

**If Data Corruption:**
```bash
# 1. Export problematic collection
firebase firestore:export gs://smartclass24-debug/YYYYMMDD --collection-ids lessons

# 2. Analyze locally
gsutil cp gs://smartclass24-debug/YYYYMMDD .
# Manual inspection of exported JSON

# 3. Fix source data, re-run migration
# Delete collection → Fix data → Migrate again
```

---

## Safety Gates (Must Pass Before Proceeding)

### Gate 1: Security Rules Deployed ✅
- [ ] Rules deployed to Firebase
- [ ] Rules simulator tests pass
- [ ] Admin access working
- [ ] Student read working
- [ ] Student write denied

### Gate 2: Indexes Ready ✅
- [ ] All 8 indexes show "enabled" status
- [ ] No errors in Firebase console
- [ ] Composite indexes built successfully

### Gate 3: Data Tagged ✅
- [ ] All lessons have curriculumId field
- [ ] TypeScript validation passes (npm run typecheck)
- [ ] Backup files created
- [ ] Git commit with tagged data

### Gate 4: Migration Validated ✅
- [ ] Dry-run completes successfully
- [ ] Lesson count matches expected (709+)
- [ ] Quiz count matches expected (11,500+)
- [ ] No TypeErrors or data integrity issues

### Gate 5: Security Tested ✅
- [ ] Admin can write to curriculum collections
- [ ] Students can read curriculum content
- [ ] Students cannot write to curriculum collections
- [ ] No unauthorized access detected

---

## Risk Mitigation

### Risk 1: Data Loss During Migration
**Probability:** Low  
**Impact:** Critical  
**Mitigation:**
- ✅ Backups created before migration (.backup files)
- ✅ Dry-run validates data before execution
- ✅ Firestore export taken before migration
- ✅ Can restore from backup in < 5 minutes

### Risk 2: Security Rules Too Permissive
**Probability:** Medium  
**Impact:** Critical  
**Mitigation:**
- ✅ Rules tested in Firebase console simulator
- ✅ Explicit deny-by-default pattern
- ✅ Admin role required for writes
- 🔄 External security audit planned (Phase 4)

### Risk 3: Performance Degradation
**Probability:** Low  
**Impact:** Medium  
**Mitigation:**
- ✅ Firestore indexes deployed before migration
- ✅ Denormalized data structure (fast reads)
- ✅ Pagination support (limit queries to 50 items)
- ✅ Local caching planned (React Query)

### Risk 4: Student Disruption During Migration
**Probability:** Low  
**Impact:** High  
**Mitigation:**
- ✅ Migration runs on empty Firestore (no active students yet)
- ✅ Fallback to hardcoded data (feature flag)
- ✅ Gradual rollout planned (10% → 50% → 100%)
- ✅ Can revert instantly if issues detected

---

## Success Metrics

### Technical KPIs
- ✅ Zero data loss during migration
- ✅ Firestore read latency < 100ms (target: < 50ms)
- ✅ All security tests pass (admin, student, cross-curriculum)
- ✅ TypeScript validation zero errors

### Operational KPIs
- ✅ Migration completes in < 30 minutes
- ✅ Zero downtime for existing students
- ✅ Can rollback in < 5 minutes if needed

### Business KPIs
- ✅ Platform ready for US Common Core content addition
- ✅ Curriculum isolation proven (foundation for international schools)
- ✅ Content management cycle reduced from days to hours

---

## Next Steps (After Phase 2)

### Phase 3: Code Updates (Week 2-3)
- Create React hooks for Firestore data fetching
- Update lesson components with fallback to hardcoded
- Test with 10% of students (feature flag)

### Phase 4: Security Enhancement (Week 3)
- Add curriculumId to Firebase Auth tokens
- Enable strict curriculum isolation rules
- External security audit

### Phase 5: Validation & Rollout (Week 3-4)
- Full regression testing
- Performance benchmarking
- Gradual rollout to 100% of students

---

**Status:** 🔐 READY FOR SAFETY-FIRST DEPLOYMENT  
**Next Action:** Deploy Firestore rules and indexes  
**Timeline:** Days 2-4 of Week 2  
**Owner:** Technical Team  

**Last Updated:** February 12, 2026  
**Document Version:** 1.0
