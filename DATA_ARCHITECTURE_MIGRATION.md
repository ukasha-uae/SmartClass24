# JHS Data Architecture Migration Guide

## 🎯 **Problem Solved**

**Before:** Loading `jhs-data.ts` (9,020 lines, 870 KB) on EVERY page that needed subject data, even just to show subject names.

**After:** Load only what you need, when you need it:
- **Subject list:** 5 KB metadata
- **Single subject:** ~100 KB on-demand
- **Single lesson:** ~20 KB direct access

## 📊 **Performance Improvements**

| Scenario | Old Size | New Size | Improvement |
|----------|----------|----------|-------------|
| Subject navigation page | 870 KB | 5 KB | **99.4% smaller** |
| Single subject page | 870 KB | ~100 KB | **88% smaller** |
| Single lesson page | 870 KB | ~20 KB | **97.7% smaller** |
| Homepage (no subjects) | 870 KB | 0 KB | **100% smaller** |

## 🚀 **Migration Patterns**

### Pattern 1: Subject Listings

**❌ OLD (loads all 870 KB):**
```typescript
import { subjects } from '@/lib/jhs-data';

export default function SubjectsPage() {
  return (
    <div>
      {subjects.map(subject => (
        <SubjectCard key={subject.id} subject={subject} />
      ))}
    </div>
  );
}
```

**✅ NEW (loads only 5 KB):**
```typescript
import { getSubjectsList } from '@/lib/data/jhs';

export default function SubjectsPage() {
  const subjects = getSubjectsList(); // Synchronous, lightweight
  
  return (
    <div>
      {subjects.map(subject => (
        <SubjectCard key={subject.id} metadata={subject} />
      ))}
    </div>
  );
}
```

### Pattern 2: Single Subject Page

**❌ OLD:**
```typescript
import { subjects } from '@/lib/jhs-data';

export default function SubjectPage({ params }: { params: { slug: string } }) {
  const subject = subjects.find(s => s.slug === params.slug);
  // ... render
}
```

**✅ NEW:**
```typescript
import { getSubjectBySlug } from '@/lib/data/jhs';

export default async function SubjectPage({ params }: { params: { slug: string } }) {
  const subject = await getSubjectBySlug(params.slug);
  if (!subject) notFound();
  
  // ... render
}
```

### Pattern 3: Lesson Page

**❌ OLD (search through all subjects):**
```typescript
import { subjects } from '@/lib/jhs-data';

export default function LessonPage({ params }) {
  let lesson = null;
  for (const subject of subjects) {
    for (const curr of subject.curriculum) {
      const topic = curr.topics.find(t => t.slug === params.topicSlug);
      if (topic) {
        lesson = topic.lessons.find(l => l.slug === params.lessonSlug);
        if (lesson) break;
      }
    }
    if (lesson) break;
  }
  // ... render
}
```

**✅ NEW (direct access):**
```typescript
import { getLesson } from '@/lib/data/jhs';

export default async function LessonPage({ params }) {
  const lesson = await getLesson(
    params.subjectSlug,
    params.topicSlug,
    params.lessonSlug
  );
  
  if (!lesson) notFound();
  // ... render
}
```

### Pattern 4: Search Functionality

**❌ OLD (load everything, then search in memory):**
```typescript
import { subjects } from '@/lib/jhs-data';

function searchLessons(query: string) {
  const results = [];
  for (const subject of subjects) {
    for (const curr of subject.curriculum) {
      for (const topic of curr.topics) {
        for (const lesson of topic.lessons) {
          if (lesson.title.includes(query)) {
            results.push(lesson);
          }
        }
      }
    }
  }
  return results;
}
```

**✅ NEW (optimized search with lazy loading):**
```typescript
import { searchLessons } from '@/lib/data/jhs';

async function searchLessons(query: string) {
  const results = await searchLessons(query, {
    limit: 10, // Stop after 10 matches
    level: 'JHS 2', // Optional filter
  });
  return results;
}
```

## 🔧 **API Reference**

### Lightweight Operations (Synchronous)

```typescript
// Get subject metadata (names, icons, descriptions)
const subjects = getSubjectsList();
// Returns: SubjectMetadata[] (5 KB)

// Get single subject metadata
const englishMeta = getSubjectMetadata('english-language');
// Returns: SubjectMetadata | undefined
```

### Full Data Operations (Async)

```typescript
// Load single subject
const english = await getSubjectBySlug('english-language');
// Returns: Subject | null (~100 KB)

// Load specific lesson (most efficient)
const lesson = await getLesson('english-language', 'grammar', 'nouns');
// Returns: Lesson | null (~20 KB)

// Load topics only (no lesson content)
const topics = await getTopicsForSubject('mathematics', 'JHS 2');
// Returns: Topic[] (~30 KB)

// Get curriculum structure (navigation tree)
const structure = await getSubjectCurriculumStructure('science');
// Returns: Simplified hierarchy (~15 KB)

// Search across subjects
const results = await searchLessons('photosynthesis', {
  subjectSlug: 'integrated-science',
  level: 'JHS 2',
  limit: 5,
});
// Returns: Array of matching lessons with scores
```

## 📝 **Step-by-Step Migration**

### Step 1: Update Imports

**Find all instances of:**
```typescript
import { subjects } from '@/lib/jhs-data';
```

**Replace with appropriate method:**
```typescript
// For listings/navigation:
import { getSubjectsList } from '@/lib/data/jhs';

// For full subject data:
import { getSubjectBySlug } from '@/lib/data/jhs';

// For specific lesson:
import { getLesson } from '@/lib/data/jhs';
```

### Step 2: Convert to Async/Await

If your component needs full data, make it async:

```typescript
// Before (Client Component)
'use client';
export default function MyComponent() {
  const subjects = subjects; // Synchronous
}

// After (Server Component - preferred)
export default async function MyComponent() {
  const subjects = await loadSubjects([...]);
}

// OR After (Client Component with useEffect)
'use client';
export default function MyComponent() {
  const [subjects, setSubjects] = useState([]);
  
  useEffect(() => {
    getSubjectsList().then(setSubjects);
  }, []);
}
```

### Step 3: Test Data Loading

Check that:
- [ ] Subject lists load correctly
- [ ] Individual subjects load when clicked
- [ ] Lessons display properly
- [ ] Search functionality works
- [ ] Navigation remains fast

## 🐛 **Troubleshooting**

### Issue: "Cannot use await in non-async function"

**Solution:** Make your component/function async:
```typescript
export default async function MyPage() {
  const data = await getSubjectBySlug('english');
  // ...
}
```

### Issue: "Subject data is undefined"

**Solution:** Check for null returns:
```typescript
const subject = await getSubjectBySlug(slug);
if (!subject) {
  return <div>Subject not found</div>;
}
```

### Issue: "Data loads slowly"

**Solution:** Use React Suspense for better UX:
```typescript
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SubjectContent />
    </Suspense>
  );
}
```

## ⚠️ **Breaking Changes**

### subjects Array No Longer Available Synchronously

**Before:**
```typescript
const allSubjects = subjects; // Available immediately
```

**After:**
```typescript
// For metadata only (preferred):
const metadata = getSubjectsList(); // Still synchronous

// For full data:
const allSubjects = await loadSubjects([...slugs]); // Now async
```

### getSubjectBySlug Now Returns Promise

**Before:**
```typescript
const subject = subjects.find(s => s.slug === 'english');
```

**After:**
```typescript
const subject = await getSubjectBySlug('english');
```

## 📈 **Expected Results**

After migration:

✅ **Initial Page Load:** 70-90% faster  
✅ **Bundle Size:** 99% smaller for most pages  
✅ **Dev Server:** Faster compilation  
✅ **Memory Usage:** Reduced by 85%  
✅ **Scalability:** Can add 10x more content without slowdown  

## 🎓 **Best Practices**

1. **Use Server Components when possible** - They handle async naturally
2. **Load only what you need** - Don't load full subjects for navigation
3. **Cache aggressively** - Data loader has built-in caching
4. **Prefetch on hover** - Load subject data when user hovers over links
5. **Use Suspense boundaries** - Better loading UX

## 📚 **Further Reading**

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns)
- [React Suspense](https://react.dev/reference/react/Suspense)

## ❓ **Need Help?**

1. Check this guide first
2. Look at migrated examples in `src/app/subjects/[level]/page.tsx`
3. Review the API reference above
4. Test in development before deploying

---

**Migration Status:** 
- [ ] Homepage
- [ ] Subject listing pages
- [ ] Individual subject pages
- [ ] Lesson pages
- [ ] Search functionality
- [ ] Quiz components
- [ ] Admin/seeding scripts

**Target Completion:** End of this sprint
