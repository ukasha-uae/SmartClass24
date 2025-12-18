# 🎓 SHS Navigation - Quick Reference Card

## 📍 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| **SHS Hub** | `/shs` | Main landing page - shows EVERYTHING |
| Core Subjects | `/subjects/shs` | Only core subjects (Math, English, Science, Social) |
| Programmes Browser | `/shs-programmes` | List all 8 programmes |
| Programme Detail | `/shs-programmes/[slug]` | Specific programme with electives |
| Elective Subject | `/shs-programmes/[prog]/[subject]` | Specific elective subject |

---

## 🚀 Navigation Flow

```
HOME
  ↓ Click "Enter SHS Campus"
SHS HUB (/shs)
  ├─→ CORE SUBJECTS (Math, English, Science, Social)
  │   └─→ /subjects/shs/[subject]
  │       └─→ Topics & Lessons
  │
  └─→ PROGRAMMES (Science, Arts, Business, etc.)
      └─→ /shs-programmes/[programme]
          └─→ Elective Subjects
              └─→ /shs-programmes/[prog]/[subject]
                  └─→ Topics & Lessons
```

---

## 🎯 Quick Facts

### Core Subjects (Universal)
- **Count**: 4 subjects
- **Required**: Yes, for ALL students
- **Content**: Math SHS1-3, English SHS1-3, Science SHS1-3, Social SHS1-3
- **Access**: `/shs` → Click any core subject card

### Programmes (Specialized)
- **Count**: 8 programmes
- **Required**: Choose 1 based on career path
- **Electives**: 50+ subjects across all programmes
- **Access**: `/shs` → Click any programme card

### Programme List
1. **General Science** → Physics, Chemistry, Biology, Elective Math
2. **General Arts** → Literature, History, Geography, Government, Economics
3. **Business** → Accounting, Management, Economics
4. **Agricultural Science** → Crop Production, Animal Production, etc.
5. **Visual Arts** → Graphics, Sculpture, Painting, etc.
6. **Home Economics** → Food & Nutrition, Clothing & Textiles, etc.
7. **Technical Studies** → Technical Drawing, Electronics, etc.
8. **ICT/Computing** → Programming, Networks, Hardware, etc.

---

## 🎨 Color Scheme

| Element | Color | Gradient |
|---------|-------|----------|
| SHS Branding | Violet | `from-violet-600 to-purple-600` |
| Core Subjects | Violet | `from-violet-500 to-purple-500` |
| General Science | Blue-Cyan | `from-blue-500 to-cyan-500` |
| General Arts | Purple-Pink | `from-purple-500 to-pink-500` |
| Business | Green | `from-green-500 to-emerald-500` |
| Agriculture | Yellow-Orange | `from-yellow-500 to-orange-500` |

---

## ✅ What Students See

### On SHS Hub (`/shs`)
1. **Hero**: "SHS Campus" title with stats
2. **Core Section**: 4 cards (violet theme)
   - Each shows: Icon, Name, Description, Topic count
3. **Programme Section**: 8 cards (unique colors)
   - Each shows: Icon, Name, Description, Elective count, Subject badges
4. **Quick Links**: NSMQ, Labs, Past Questions, Study Groups

### On Core Subjects Page (`/subjects/shs`)
1. **Alert Banner**: "Core Subjects Only - Go to SHS Hub for electives"
2. **Title**: "SHS Core Subjects" (not just "SHS Subjects")
3. **4 Core Cards**: Same as hub, with links to lessons

---

## 🔧 Developer Reference

### File Structure
```
src/
├── app/
│   ├── page.tsx                    # Home (links to /shs)
│   ├── shs/
│   │   └── page.tsx                # NEW: SHS Hub
│   ├── subjects/
│   │   └── [level]/
│   │       └── page.tsx            # Modified: Added alert banner
│   └── shs-programmes/
│       ├── page.tsx                # Programme browser
│       └── [programmeSlug]/
│           └── page.tsx            # Programme detail
└── lib/
    └── shs-data.ts                 # Data: coreSubjects, shsProgrammes
```

### Key Components
```tsx
// SHS Hub imports
import { coreSubjects, shsProgrammes } from '@/lib/shs-data';
import { GraduationCap, ArrowRight, BookOpen, ... } from 'lucide-react';

// Core subjects iteration
{coreSubjects.map(subject => (
  <Link href={`/subjects/shs/${subject.slug}`}>
    <SubjectCard {...subject} />
  </Link>
))}

// Programmes iteration
{shsProgrammes.map(programme => (
  <Link href={`/shs-programmes/${programme.slug}`}>
    <ProgrammeCard {...programme} />
  </Link>
))}
```

---

## 🧪 Quick Test Commands

```bash
# Check for TypeScript errors
npm run build

# Start dev server
npm run dev

# Visit SHS Hub
# http://localhost:3000/shs

# Visit core subjects
# http://localhost:3000/subjects/shs

# Visit programme
# http://localhost:3000/shs-programmes/general-science
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Hub not loading | Check `src/app/shs/page.tsx` exists |
| Alert banner not showing | Check imports in `subjects/[level]/page.tsx` |
| Programmes not displaying | Check `shsProgrammes` in `shs-data.ts` |
| Links broken | Verify slug names match data |
| Styles not applying | Check Tailwind classes are valid |

---

## 📊 Content Status

### ✅ Has Lesson Content
- Mathematics (SHS 1-3)
- Integrated Science (SHS 1-3)
- English Language (SHS 1)

### ⏳ Structure Only (No Lessons)
- Social Studies
- All elective subjects (50+ subjects across 8 programmes)

### 🎯 Next Priority
- Create Physics SHS1 lessons
- Create Chemistry SHS1 lessons
- Create Biology SHS1 lessons

---

## 📝 Recent Changes Log

| Date | Change | File |
|------|--------|------|
| Today | Created SHS Hub | `src/app/shs/page.tsx` |
| Today | Updated home page link | `src/app/page.tsx` line 79 |
| Today | Added alert banner | `src/app/subjects/[level]/page.tsx` |

---

## 🎓 User Benefits

### Before
❌ Direct to core subjects only  
❌ No way to discover programmes  
❌ Confusing navigation  
❌ Dead-end user journey  

### After
✅ See everything in one place  
✅ Clear core vs electives distinction  
✅ Programme discovery built-in  
✅ Multiple entry points to content  
✅ Informed decision-making  

---

## 📞 Support

- **Architecture Doc**: `SHS_NAVIGATION_ARCHITECTURE.md`
- **Visual Guide**: `SHS_NAVIGATION_VISUAL_GUIDE.md`
- **Test Plan**: `SHS_NAVIGATION_TEST_PLAN.md`
- **Code**: `src/app/shs/page.tsx`

---

## ⚡ TL;DR

**What**: New SHS Hub at `/shs` showing both core subjects AND programmes

**Why**: Students need to see both universal core AND specialized electives

**How**: Home page now links to `/shs` instead of `/subjects/shs`

**Result**: Complete SHS navigation in one place with clear path to all content

**Status**: ✅ Implemented, ready for testing
