# Migration Dry-Run Guide (Phase 2, Day 9)

**Current Status:** Data tagged with curriculum metadata, ready for Firestore migration  
**Next Step:** Run migration script in dry-run mode to validate before production execution  
**Safety Level:** 🟢 HIGH (dry-run only, no actual writes)

---

## Prerequisites (5 minutes)

### 1. Get Firebase Service Account Key

**Why:** Migration script needs Firebase Admin SDK credentials to write to Firestore

**Steps:**
1. Open Firebase Console: https://console.firebase.google.com/project/smartclass24-5e590/settings/serviceaccounts/adminsdk
2. Click **"Generate new private key"**
3. Confirm download → saves `smartclass24-5e590-firebase-adminsdk-xxxxx.json`
4. Rename file to `serviceAccountKey.json`
5. Move to project root: `C:\Users\asus\OneDrive\Desktop\smartjhs\serviceAccountKey.json`

**Security:**
- ✅ Already in `.gitignore` (won't be committed)
- ⚠️ NEVER share this file (full admin access to Firebase)
- 🔒 Keep local only

### 2. Verify Data Tagging Complete

```powershell
# Check tagged lessons count
git diff HEAD~1 --shortstat src/lib/jhs-data.ts
# Expected: +704 lines

git diff HEAD~1 --shortstat src/lib/integrated-science-shs1-lessons-data.ts
# Expected: +88 lines
```

**Expected State:**
- ✅ 220+ objects tagged with `curriculumId`, `region`, `examAlignment`
- ✅ Type system supports curriculum metadata (Subject/Topic/Lesson)
- ✅ Firestore rules deployed to production
- ✅ Firestore indexes deployed (8 composite indexes)

---

## Dry-Run Execution (10 minutes)

### Command:
```powershell
node migrate-curriculum-to-firestore.js --curriculum west-african --dry-run
```

### Expected Output (Success):

```
╔═══════════════════════════════════════════════════════════════╗
║   Firestore Migration Script - DRY RUN MODE                  ║
╚═══════════════════════════════════════════════════════════════╝

Curriculum: west-african
Mode: 🔍 DRY RUN (no writes will be performed)
Timestamp: 2026-02-12T12:00:00.000Z

[1/5] Loading curriculum data...
   ✅ JHS Data: 709 lessons loaded
   ✅ SHS Integrated Science: 22 lessons loaded
   ✅ SHS English: 4 lessons loaded
   ✅ Total: 735 lessons

[2/5] Extracting quiz questions...
   ✅ 9,000+ JHS questions extracted
   ✅ 2,500+ SHS questions extracted
   ✅ Total: 11,500+ questions

[3/5] Enriching with curriculum metadata...
   ✅ All lessons have curriculumId: 'west-african'
   ✅ All lessons have region: ['ghana', 'nigeria', ...]
   ✅ All lessons have examAlignment: ['BECE', 'WASSCE', 'NECO']

[4/5] Validating data structure...
   ✅ No TypeScript errors
   ✅ All required fields present
   ✅ Curriculum hierarchy intact (Subject → Topic → Lesson)
   ✅ Quiz references valid (lessonId matches)

[5/5] Simulating Firestore writes...
   [DRY RUN] Would create: /curriculums/west-african
   [DRY RUN] Would write: 10 subjects
   [DRY RUN] Would write: 87 topics
   [DRY RUN] Would write: 735 lessons
   [DRY RUN] Would write: 11,500+ quiz questions
   [DRY RUN] Batch operations: 24 batches (500 docs each)

═══════════════════════════════════════════════════════════════
VALIDATION SUMMARY
═══════════════════════════════════════════════════════════════

✅ Data integrity: PASSED
✅ Structure validation: PASSED
✅ Curriculum metadata: COMPLETE
✅ Firestore schema compliance: PASSED
✅ Batch size limit compliance: PASSED (24 batches)

📊 Migration Statistics:
   - Total documents: 12,332
   - Estimated write time: 12-15 minutes
   - Estimated cost: $0.018 (11,500 writes × $0.18/100K)
   - Storage cost: ~2MB → $0.0005/month

✅ DRY RUN COMPLETE - Ready for production migration!

Next steps:
  1. Review output above for any warnings
  2. Backup Firestore before execution
  3. Run with --execute flag when ready
```

### What to Check:

**Critical Validations:**
1. ✅ Lesson count matches: 735 lessons (709 JHS + 26 SHS)
2. ✅ Quiz count matches: 11,500+ questions
3. ✅ All curriculum metadata present (curriculumId, region, examAlignment)
4. ✅ No TypeScript errors
5. ✅ Batch operations within Firestore limits (500 docs/batch)

**Red Flags (Stop if you see these):**
- ❌ "Missing curriculumId" warnings → Data tagging incomplete
- ❌ "TypeScript errors" → Fix type mismatches first
- ❌ "Schema validation failed" → Update types or migration script
- ❌ Lesson count < 700 → Data not fully loaded
- ❌ Quiz count < 10,000 → Missing quiz data

---

## Troubleshooting

### Error: "Cannot find module './serviceAccountKey.json'"

**Cause:** Service account key not downloaded or in wrong location  

**Fix:**
```powershell
# Check if file exists
Test-Path ./serviceAccountKey.json
# Should return: True

# If False, download from Firebase Console (see Prerequisites above)
```

### Error: "PERMISSION_DENIED: Missing or insufficient permissions"

**Cause:** Service account key doesn't have Firestore write permissions  

**Fix:**
1. Firebase Console → IAM & Admin
2. Find service account: `firebase-adminsdk-xxxxx@smartclass24-5e590.iam.gserviceaccount.com`
3. Ensure roles include: **Firebase Admin SDK Administrator Service Agent**

### Warning: "X lessons missing curriculumId"

**Cause:** Data tagging script didn't tag all lessons  

**Fix:**
```powershell
# Re-run tagging script on specific file
node tag-curriculum-data.js --file src/lib/[affected-file].ts --backup

# Commit changes
git add src/lib/[affected-file].ts
git commit -m "fix: Complete curriculum metadata tagging for [file]"
```

### Error: "FirebaseError: 7 PERMISSION_DENIED: false for 'create'"

**Cause:** Firestore security rules blocking write (expected in dry-run, but shouldn't appear)  

**Check:**
```bash
firebase deploy --only firestore:rules
# Verify rules deployed correctly
```

---

## After Successful Dry-Run

### Update Progress Tracker:

```powershell
# Open MULTI_CURRICULUM_IMPLEMENTATION.md
# Mark Safety Gate 4 as COMPLETE ✅
```

### Backup Firestore (Before Production Migration):

```powershell
# Create timestamp
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Export Firestore data
firebase firestore:export gs://smartclass24-5e590.appspot.com/backups/$timestamp

# Expected output:
# ✔ Firestore export completed
# Backup location: gs://smartclass24-5e590.appspot.com/backups/20260212_120000
```

**Why backup?**
- Rollback capability if migration fails
- Restore point for current production data
- Required before any destructive operations

### Execute Production Migration:

**Only proceed if:**
1. ✅ Dry-run validation PASSED with zero errors
2. ✅ Firestore backup created successfully
3. ✅ You've reviewed all migration output carefully
4. ✅ Service account key is correct
5. ✅ You're ready to commit ~12,000 documents to Firestore

**Command:**
```powershell
node migrate-curriculum-to-firestore.js --curriculum west-african --execute
```

**Monitor in real-time:**
- Open Firebase Console → Firestore Database
- Watch collections appear as migration runs
- Expected duration: 12-15 minutes
- Do NOT interrupt the process

**Post-Migration Verification:**
1. Check Firestore Console:
   - `/curriculums/west-african` exists
   - `/subjects` collection has 10 documents
   - `/topics` collection has 87 documents
   - `/lessons` collection has 735 documents
   - `/quizzes/west-african/questions` has 11,500+ documents

2. Test queries in Firestore console:
   ```
   Collection: lessons
   Where: curriculumId == 'west-african'
   Limit: 10
   ```

3. Verify indexes enabled:
   - Firebase Console → Firestore → Indexes
   - All 8 composite indexes show "Enabled" status

---

## Cost Analysis

**One-Time Migration Cost:**
- 12,000 document writes × $0.18/100K = **$0.022** (2 cents)
- Negligible storage cost: ~2MB → $0.0005/month

**Ongoing Monthly Cost (25K active students):**
- 2.75M reads/month × $0.06/100K = $1.65
- 275K writes/month × $0.18/100K = $0.50
- 2MB storage × $0.18/GB = $0.0004
- **Total: ~$2.15/month** (scales with usage)

**Conclusion:** Migration is extremely cost-effective. Firebase scales efficiently.

---

## Safety Gates Checklist

Before executing production migration, verify:

- [ ] ✅ **Gate 1:** Security rules deployed and tested
- [ ] ✅ **Gate 2:** Firestore indexes deployed and enabled
- [ ] ✅ **Gate 3:** Data tagged with curriculum metadata (220+ objects)
- [ ] ✅ **Gate 4:** Dry-run completed with ZERO errors
- [ ] ⏳ **Gate 5:** Firestore backup created (before execution)

**All gates MUST be green before proceeding to production migration.**

---

## Next Steps After Migration

### Phase 3: Code Updates (Days 11-15)

**Replace TypeScript imports with Firestore queries:**

```typescript
// OLD (current):
import { subjects } from '@/lib/jhs-data';

// NEW (after migration):
import { useSubjects } from '@/hooks/useCurriculumData';
const { subjects, loading } = useSubjects('west-african');
```

**Create React hooks:**
- `useCurriculumMetadata()` - Fetch curriculum info
- `useSubjects(curriculumId)` - Fetch subjects by curriculum
- `useLessons(curriculumId, filters)` - Query lessons with filters
- `useQuizQuestions(lessonId)` - Fetch quiz questions

### Phase 4: Security Enhancement (Days 16-18)

**Add curriculumId to Firebase Auth custom claims:**
```typescript
admin.auth().setCustomUserClaims(uid, {
  tenantId: 'smartclass24',
  curriculumId: 'west-african',
  role: 'student'
});
```

**Enable strict Firestore rules:**
```javascript
// Only allow reads/writes for user's curriculum
match /lessons/{lessonId} {
  allow read: if belongsToCurriculum(request.auth.token.curriculumId);
  allow write: if hasRole('admin');
}
```

### Phase 5: Validation & Rollout (Days 19-28)

**Testing:**
- Full QA regression testing
- Performance benchmarking (Firestore vs. TypeScript)
- Cross-curriculum isolation testing
- Security penetration testing

**Gradual Rollout:**
- 10% of users (Day 19-21)
- 50% of users (Day 22-24)
- 100% of users (Day 25-28)

---

## Contact & Support

**If migration fails or you see errors:**
1. Do NOT re-run migration (avoid duplicates)
2. Check error message carefully
3. Restore from backup if needed
4. Review troubleshooting section above

**Rollback Procedure:**
```powershell
# Restore from backup
firebase firestore:import gs://smartclass24-5e590.appspot.com/backups/[timestamp]

# Clear failed migration data
# (Manual cleanup in Firestore Console if needed)
```

---

**Ready?** Run the dry-run command and review the output carefully!

```powershell
node migrate-curriculum-to-firestore.js --curriculum west-african --dry-run
```
