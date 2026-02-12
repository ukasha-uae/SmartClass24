# Firestore Schema V2 - Multi-Curriculum Architecture

**Status:** 🚧 PLANNED - Implementation starting February 2026  
**Purpose:** Database structure for curriculum-scoped content isolation and scalability  
**Migration:** From hardcoded TypeScript → Firestore collections with curriculum tagging

---

## Overview

### Design Principles
1. **Curriculum Isolation**: Each curriculum system has its own data collections
2. **Tenant Access Control**: Firestore rules enforce curriculum boundaries
3. **Content Versioning**: Track lesson revisions and approvals
4. **Performance**: Denormalized structure for fast reads
5. **Scalability**: Support unlimited curriculum systems without code changes

### Collection Hierarchy
```
firestore/
├── tenants/{tenantId}                    # Tenant configuration
│   ├── curriculum: string                # e.g., 'west-african'
│   └── ... (existing tenant fields)
│
├── curriculums/{curriculumId}            # Curriculum metadata
│   ├── name: string                      # 'West African (BECE/WASSCE)'
│   ├── examSystems: string[]             # ['BECE', 'WASSCE', 'NECO']
│   ├── gradeLevels: string[]             # ['JHS 1', 'JHS 2', 'JHS 3']
│   ├── countries: string[]               # ['ghana', 'nigeria']
│   ├── subjects/{subjectId}              # Subjects in this curriculum
│   │   ├── name: string
│   │   ├── slug: string
│   │   ├── description: string
│   │   ├── standardName: string          # 'Mathematics'
│   │   └── topics/{topicId}              # Topics in this subject
│   │       ├── title: string
│   │       ├── slug: string
│   │       ├── gradeLevel: string
│   │       ├── sequenceOrder: number
│   │       └── lessons/{lessonId}        # Lessons in this topic
│   │           ├── title: string
│   │           ├── slug: string
│   │           ├── objectives: string[]
│   │           ├── introduction: string
│   │           ├── keyConcepts: array
│   │           ├── activities: object
│   │           ├── pastQuestions: array
│   │           ├── summary: string
│   │           ├── versionId: string
│   │           ├── approvalStatus: string
│   │           ├── lastModified: timestamp
│   │           └── author: string
│   └── ... (other curriculum fields)
│
├── students/{userId}                     # Student profiles
│   ├── tenantId: string                  # Which tenant they belong to
│   ├── curriculumId: string              # Which curriculum they're studying
│   ├── progress/{lessonId}               # Learning progress
│   │   ├── status: string                # 'not-started' | 'in-progress' | 'completed'
│   │   ├── lastAccessed: timestamp
│   │   ├── completionDate: timestamp
│   │   └── timeSpent: number
│   └── quizAttempts/{attemptId}          # Quiz results
│       ├── lessonId: string
│       ├── curriculumId: string          # IMPORTANT: Scoped to curriculum
│       ├── score: number
│       ├── totalQuestions: number
│       ├── timestamp: timestamp
│       └── answers: array
│
└── quizzes/{curriculumId}                # Quiz questions by curriculum
    └── questions/{questionId}
        ├── lessonId: string
        ├── question: string
        ├── options: string[]
        ├── correctAnswer: string
        ├── explanation: string
        ├── difficulty: string
        ├── examAlignment: string[]       # ['BECE 2020', 'WASSCE 2019']
        └── standardsAlignment: object
```

---

## Collection Design Details

### 1. `curriculums/{curriculumId}`

**Purpose:** Curriculum system metadata and content hierarchy  
**Access:** Public read for students, admin write only

**Document Structure:**
```typescript
{
  id: string;                             // 'west-african', 'us-common-core', 'uk-national'
  name: string;                           // 'West African (BECE/WASSCE)'
  description: string;
  system: string;                         // 'west-african'
  examSystems: string[];                  // ['BECE', 'WASSCE', 'NECO']
  gradeLevels: string[];                  // ['JHS 1', 'JHS 2', 'JHS 3', 'SHS 1', 'SHS 2', 'SHS 3']
  countries: string[];                    // ['ghana', 'nigeria', 'sierra-leone']
  status: 'active' | 'beta' | 'archived'; // Content availability
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Subcollections:**
- `subjects/{subjectId}` → `topics/{topicId}` → `lessons/{lessonId}`

**Security Rules:**
```javascript
match /curriculums/{curriculumId} {
  allow read: if request.auth != null;  // All authenticated users can browse
  allow write: if hasRole('admin');     // Only admins can modify
  
  match /subjects/{subjectId} {
    allow read: if request.auth != null;
    allow write: if hasRole('admin');
    
    match /topics/{topicId} {
      allow read: if request.auth != null;
      allow write: if hasRole('admin');
      
      match /lessons/{lessonId} {
        allow read: if request.auth != null;
        allow write: if hasRole('admin') || hasRole('content-creator');
      }
    }
  }
}
```

---

### 2. `students/{userId}`

**Purpose:** Student profiles, progress, and quiz attempts  
**Access:** Owner-only read/write (enforced by firestore rules)

**Document Structure:**
```typescript
{
  uid: string;
  tenantId: string;                       // Which tenant's platform they use
  curriculumId: string;                   // Which curriculum they're studying
  displayName: string;
  email: string;
  campus: 'jhs' | 'shs' | 'tech-academy'; // Which campus section
  gradeLevel: string;                     // 'JHS 1', 'SHS 2', etc.
  country: string;                        // 'ghana', 'nigeria'
  profileComplete: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Subcollections:**
- `progress/{lessonId}` - Lesson completion tracking (scoped to curriculumId in parent doc)
- `quizAttempts/{attemptId}` - Quiz results (MUST include curriculumId field)

**CRITICAL:** Quiz attempts MUST include `curriculumId` field to prevent cross-curriculum data leakage:
```typescript
// quizAttempts/{attemptId}
{
  lessonId: string;
  curriculumId: string;                   // ⚠️ REQUIRED for isolation
  topicId: string;
  subjectId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: Timestamp;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}
```

**Security Rules:**
```javascript
match /students/{userId} {
  allow read, write: if request.auth.uid == userId && belongsToTenant(resource.data.tenantId);
  
  match /quizAttempts/{attemptId} {
    // ⚠️ CRITICAL: Enforce curriculum isolation
    allow read, write: if request.auth.uid == userId 
                       && belongsToTenant(resource.data.tenantId)
                       && request.resource.data.curriculumId == get(/databases/$(database)/documents/tenants/$(resource.data.tenantId)).data.curriculum;
  }
  
  match /progress/{lessonId} {
    allow read, write: if request.auth.uid == userId && belongsToTenant(resource.data.tenantId);
  }
}
```

---

### 3. `quizzes/{curriculumId}/questions/{questionId}`

**Purpose:** Quiz questions scoped by curriculum system  
**Access:** Public read for students in that curriculum, admin write

**Document Structure:**
```typescript
{
  id: string;
  curriculumId: string;                   // ⚠️ REQUIRED - which curriculum this belongs to
  lessonId: string;
  topicId: string;
  subjectId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examAlignment: string[];                // ['BECE 2020 Q15', 'WASSCE 2019 Q8']
  standardsAlignment?: {
    standard: string;                     // 'Common Core Math 8.G.A.1'
    description: string;
  }[];
  tags: string[];                         // ['geometry', 'angles', 'quadrilaterals']
  createdAt: Timestamp;
  updatedAt: Timestamp;
  author: string;                         // UID of content creator
}
```

**Security Rules:**
```javascript
match /quizzes/{curriculumId}/questions/{questionId} {
  // Students can read questions IF their tenant uses this curriculum
  allow read: if request.auth != null 
              && get(/databases/$(database)/documents/tenants/$(request.auth.token.tenantId)).data.curriculum == curriculumId;
  
  // Only admins and content creators can write
  allow write: if hasRole('admin') || hasRole('content-creator');
}
```

---

## Migration Plan

### Phase 1: Schema Setup (Week 1, Days 1-2)
1. Create Firestore indexes (firestore.indexes.json)
2. Update security rules with curriculum isolation
3. Deploy rules to Firebase console

### Phase 2: Data Tagging (Week 1, Days 3-5)
1. Add `curriculumId: 'west-african'` to all lessons in jhs-data.ts
2. Add `curriculumId: 'west-african'` to all shs-*.ts lesson data files
3. Add `region: ['ghana', 'nigeria']` and `examAlignment: ['BECE', 'WASSCE']`
4. Run TypeScript validation to ensure no breaking changes

### Phase 3: Firestore Migration (Week 2, Days 1-5)
1. Write migration script to upload west-african curriculum
2. Create `curriculums/west-african` document with metadata
3. Upload all subjects → topics → lessons to Firestore subcollections
4. Upload all quiz questions to `quizzes/west-african/questions`
5. Verify data integrity (spot-checks, automated tests)

### Phase 4: Code Updates (Week 2-3, Days 6-10)
1. Create Firestore data fetching hooks (e.g., `useCurriculumLessons()`)
2. Update lesson display components to fetch from Firestore
3. Add fallback to hardcoded data (during transition)
4. Update quiz components to use `/quizzes/{curriculumId}/questions`
5. Test with both hardcoded and Firestore data sources

### Phase 5: Validation (Week 3-4, Days 11-14)
1. Full QA testing with real students
2. Performance benchmarking (Firestore vs. hardcoded)
3. Security audit (curriculum isolation working?)
4. Content validation (no missing lessons, correct question counts)
5. Gradual rollout (10% → 50% → 100% of students)

---

## Performance Considerations

### Read Optimization
- **Denormalized data**: Include `topicTitle`, `subjectName` in lesson docs (avoid joins)
- **Indexing**: Create composite indexes for common queries
- **Caching**: Use Firebase local cache for offline support
- **Pagination**: Limit queries to 50 lessons per fetch

### Write Optimization
- **Batch writes**: Update multiple lessons in single transaction
- **Versioning**: Store previous versions in separate `versions` subcollection
- **Timestamps**: Use server timestamps to avoid client clock issues

### Query Patterns
```typescript
// Get all lessons for a subject in a curriculum
const lessonsRef = db
  .collection('curriculums')
  .doc('west-african')
  .collection('subjects')
  .doc('mathematics')
  .collection('topics')
  .doc('algebra')
  .collection('lessons')
  .orderBy('sequenceOrder', 'asc')
  .limit(50);

// Get quiz questions for a lesson
const questionsRef = db
  .collection('quizzes')
  .doc('west-african')
  .collection('questions')
  .where('lessonId', '==', 'algebra-factorization')
  .where('difficulty', 'in', ['easy', 'medium'])
  .limit(20);

// Student's quiz attempts (curriculum-scoped)
const attemptsRef = db
  .collection('students')
  .doc(userId)
  .collection('quizAttempts')
  .where('curriculumId', '==', 'west-african')
  .orderBy('timestamp', 'desc')
  .limit(10);
```

---

## Security Audit Checklist

### Before Going Live:
- [ ] All lessons have `curriculumId` field
- [ ] All quiz questions scoped by curriculum collection
- [ ] All student quiz attempts include `curriculumId`
- [ ] Firestore rules enforce `belongsToTenant()` check
- [ ] Firestore rules enforce curriculum matching tenant's curriculum
- [ ] Auth tokens include `tenantId` (already implemented)
- [ ] Test cross-curriculum access denial (student from west-african cannot access us-common-core)
- [ ] Test cross-tenant access denial (smartclass24 student cannot access wisdomwarehouse data)
- [ ] Validate admin access control (only admins can modify curriculum content)
- [ ] Content creator permissions (if applicable)

### Testing Scenarios:
1. **Positive:** West African student accesses BECE lesson → ✅ allowed
2. **Negative:** West African student tries to access US Common Core lesson → ❌ denied
3. **Negative:** SmartClass24 student tries to read Wisdom Warehouse quiz attempts → ❌ denied
4. **Positive:** Admin creates new lesson in any curriculum → ✅ allowed
5. **Negative:** Non-admin tries to update curriculum metadata → ❌ denied

---

## Cost Estimation

### Firestore Pricing (as of Feb 2026):
- **Reads**: $0.06 per 100K documents
- **Writes**: $0.18 per 100K documents
- **Storage**: $0.18 per GB/month

### Estimated Monthly Costs (25,000 students):
| Operation | Volume | Cost |
|-----------|--------|------|
| Lesson fetches (1M reads/month) | 1,000,000 | $0.60 |
| Quiz questions (500K reads) | 500,000 | $0.30 |
| Quiz attempt writes (100K/month) | 100,000 | $0.18 |
| Storage (2GB curriculum data) | 2 GB | $0.36 |
| **TOTAL** | - | **$1.44/month** |

**At scale (100K students):** ~$5.76/month for Firestore operations  
**Conclusion:** Database costs negligible compared to Firebase Hosting ($25/month) and team costs.

---

## Rollback Plan

### If Migration Fails:
1. **Immediate:** Revert codebase to fetch from hardcoded TypeScript files
2. **Firestore data preserved:** No deletion during transition
3. **Feature flag:** `USE_FIRESTORE_CURRICULUM = false` to disable Firestore fetches
4. **Student data safe:** Quiz attempts remain in Firestore (not affected)

### Success Criteria:
- ✅ 100% of lessons accessible via Firestore
- ✅ Zero performance degradation vs. hardcoded data
- ✅ No increase in error rates (monitored via Firebase Analytics)
- ✅ Students report no disruption

---

## Next Steps

1. **Review this schema** with team (validate structure)
2. **Create Firestore indexes** (firestore.indexes.json)
3. **Update security rules** (firestore.rules) with curriculum isolation
4. **Start data tagging** in jhs-data.ts (add curriculumId fields)
5. **Build migration script** (Node.js script to upload to Firestore)
6. **Test with sample curriculum** (one subject, one topic, five lessons)
7. **Deploy to production** after validation

**Timeline:** 4 weeks (Feb 12 - Mar 11, 2026)  
**Cost:** $100K investment (80% engineering time, 20% infrastructure/tools)  
**Outcome:** Production-ready multi-curriculum architecture supporting US Common Core, UK National, IB additions within weeks (not months).

---

**Document Version:** 1.0  
**Last Updated:** February 12, 2026  
**Owner:** Technical Team  
**Status:** 🚧 Implementation in Progress
