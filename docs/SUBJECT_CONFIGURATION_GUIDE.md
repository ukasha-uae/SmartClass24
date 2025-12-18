# Country-Specific Subject Configuration System

## 🎯 Problem Solved

Different countries have different curricula:
- **Ghana** calls it **JHS** (Junior High School) with subjects like "Integrated Science", "Computing"
- **Nigeria** calls it **JSS** (Junior Secondary School) with subjects like "Basic Science", "Computer Studies", "Civic Education"

We needed a scalable way to handle these differences without duplicating lesson data.

---

## ✅ Solution Overview

### 3-Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: Subject Configuration (subject-config.ts)    │
│  - Defines all possible subjects                        │
│  - Maps subjects to countries                           │
│  - Handles country-specific names/descriptions          │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Hooks (useLocalizedSubjects.ts)              │
│  - Automatically filters subjects by country            │
│  - Returns localized names/descriptions                 │
│  - Reactive to country changes                          │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: UI Components                                 │
│  - Use hooks to display correct subjects                │
│  - Automatically show/hide based on country             │
│  - No hardcoded country checks needed                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 Subject Configuration (subject-config.ts)

### How Subjects Are Defined

```typescript
{
  id: '3',
  slug: 'basic-science',
  defaultName: 'Basic Science',
  countryNames: {
    'ghana': 'Integrated Science',    // Ghana calls it this
    'nigeria': 'Basic Science',       // Nigeria calls it this
  },
  countryDescriptions: {
    'ghana': 'Explore biology, chemistry, and physics concepts.',
    'nigeria': 'Study basic concepts in biology, chemistry, and physics.',
  },
  availability: {
    countries: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'],
    required: true,
    level: 'jss'
  }
}
```

### Key Features

1. **Universal Slug**: `basic-science` - same in database
2. **Country Names**: Different display names per country
3. **Availability**: Which countries teach this subject
4. **Required Status**: Mandatory vs optional

---

## 🔧 Usage in Components

### Example 1: Get All Subjects for Current Country

```typescript
import { useLocalizedSubjects } from '@/hooks/useLocalizedSubjects';

function JHSSubjectsPage() {
  const subjects = useLocalizedSubjects('jss');
  
  // For Ghana user, returns:
  // - "Integrated Science"
  // - "Computing"
  // - "Ghanaian Language"
  
  // For Nigeria user, returns:
  // - "Basic Science"
  // - "Computer Studies"
  // - "Nigerian Language"
  // - "Civic Education" (not in Ghana)
  
  return (
    <div>
      {subjects.map(subject => (
        <SubjectCard
          key={subject.id}
          name={subject.name}         // Already localized!
          description={subject.description} // Already localized!
        />
      ))}
    </div>
  );
}
```

### Example 2: Get Only Required Subjects

```typescript
import { useRequiredSubjects } from '@/hooks/useLocalizedSubjects';

function CoreSubjectsPage() {
  const coreSubjects = useRequiredSubjects();
  
  return (
    <div>
      <h2>Core Subjects (Required)</h2>
      {coreSubjects.map(subject => (
        <div key={subject.id}>{subject.name}</div>
      ))}
    </div>
  );
}
```

### Example 3: Get Optional/Elective Subjects

```typescript
import { useOptionalSubjects } from '@/hooks/useLocalizedSubjects';

function ElectiveSubjectsPage() {
  const electives = useOptionalSubjects();
  
  return (
    <div>
      <h2>Elective Subjects (Optional)</h2>
      {electives.map(subject => (
        <div key={subject.id}>{subject.name}</div>
      ))}
    </div>
  );
}
```

### Example 4: Get Single Subject Name

```typescript
import { useLocalizedSubjectName } from '@/hooks/useLocalizedSubjects';

function ScienceSubjectPage() {
  const scienceName = useLocalizedSubjectName('basic-science');
  
  // Ghana user sees: "Integrated Science"
  // Nigeria user sees: "Basic Science"
  
  return <h1>{scienceName}</h1>;
}
```

### Example 5: Check Subject Availability

```typescript
import { useSubjectAvailability } from '@/hooks/useLocalizedSubjects';

function CivicEducationPage() {
  const isAvailable = useSubjectAvailability('civic-education');
  
  if (!isAvailable) {
    return <div>This subject is not available in your country</div>;
  }
  
  return <div>Welcome to Civic Education</div>;
}
```

---

## 🌍 Country-Specific Subjects

### Ghana JHS Only
- **Integrated Science** (not Basic Science)
- **Computing** (not Computer Studies)
- **Ghanaian Language**
- **Religious and Moral Education (RME)**

### Nigeria JSS Only
- **Basic Science** (not Integrated Science)
- **Computer Studies** (not Computing)
- **Nigerian Language** (Hausa/Yoruba/Igbo)
- **Civic Education** (separate from Social Studies)
- **Christian Religious Studies / Islamic Studies** (separate)
- **Home Economics**
- **Business Studies**
- **Physical and Health Education**

### Common to Both
- Mathematics
- English Language
- Social Studies
- French
- Creative Arts
- Basic Technology / Career Technology

---

## 📊 Subject Comparison Table

| Subject | Ghana Name | Nigeria Name | Available In |
|---------|------------|--------------|--------------|
| Science | Integrated Science | Basic Science | Both |
| ICT | Computing | Computer Studies | Both |
| Language | Ghanaian Language | Nigerian Language | Both |
| Religion | RME | CRS/Islamic Studies | Both |
| Civics | (in Social Studies) | Civic Education | Nigeria only |
| Home Ec | - | Home Economics | Nigeria only |
| Business | - | Business Studies | Nigeria only |
| PE | - | Physical & Health Ed | Nigeria only |

---

## 🔄 How Country Switching Works

### Before (Old System - Hardcoded)
```typescript
// Ghana user sees Nigerian subjects!
<SubjectCard name="Civic Education" /> // Confusing for Ghana student
<SubjectCard name="Computer Studies" /> // Should be "Computing" for Ghana
```

### After (New System - Dynamic)
```typescript
const subjects = useLocalizedSubjects('jss');
// Ghana user automatically gets:
// - "Integrated Science"
// - "Computing" 
// - NO "Civic Education" (not available)

// Nigeria user automatically gets:
// - "Basic Science"
// - "Computer Studies"
// - "Civic Education" ✅
```

---

## 🚀 Adding a New Country

### Step 1: Update subject-config.ts

```typescript
{
  id: '3',
  slug: 'basic-science',
  countryNames: {
    'ghana': 'Integrated Science',
    'nigeria': 'Basic Science',
    'sierra-leone': 'General Science',  // 👈 ADD THIS
  },
  availability: {
    countries: ['ghana', 'nigeria', 'sierra-leone'], // 👈 ADD COUNTRY
    required: true,
    level: 'jss'
  }
}
```

### Step 2: That's it!

The hooks automatically pick up the new country. No component changes needed!

---

## 🎯 Best Practices

### ✅ DO:
- Use `useLocalizedSubjects()` instead of hardcoding subject lists
- Use `useLocalizedSubjectName()` for display names
- Define subjects once in `subject-config.ts`
- Let hooks handle filtering automatically

### ❌ DON'T:
- Hardcode subject names in components
- Check `country.id === 'nigeria'` manually
- Duplicate subject definitions
- Show subjects not available in user's country

---

## 📁 File Structure

```
src/
├── lib/
│   └── localization/
│       ├── subject-config.ts          ← Subject definitions
│       └── country-config.ts          ← Country configs
├── hooks/
│   ├── useLocalizedSubjects.ts        ← Subject hooks
│   └── useLocalization.ts             ← Country context
└── app/
    └── subjects/
        └── [level]/
            └── page.tsx               ← Use hooks here
```

---

## 🧪 Testing

### Test Scenario 1: Ghana User
1. Switch to Ghana
2. Navigate to JHS subjects
3. Should see: "Integrated Science", "Computing"
4. Should NOT see: "Civic Education", "Home Economics"

### Test Scenario 2: Nigeria User
1. Switch to Nigeria
2. Navigate to JSS subjects
3. Should see: "Basic Science", "Computer Studies", "Civic Education"
4. Should NOT see: "RME" (they have CRS/Islamic Studies instead)

---

## 🔧 Integration with Existing Code

### Update subjects/[level]/page.tsx

**Before:**
```typescript
const displaySubjects = getDisplaySubjects(); // Hardcoded list
```

**After:**
```typescript
import { useLocalizedSubjects } from '@/hooks/useLocalizedSubjects';

const localizedSubjects = useLocalizedSubjects('jss');
```

---

## 💡 Key Advantages

### 1. **Scalable**
Add new countries without touching component code

### 2. **Maintainable**
One source of truth for subjects

### 3. **Type-Safe**
TypeScript ensures correctness

### 4. **Automatic**
No manual country checks needed

### 5. **Flexible**
Easy to add/remove subjects per country

---

## 📝 Summary

**What we built:**
- ✅ Subject configuration system
- ✅ Country-specific filtering
- ✅ Automatic localization hooks
- ✅ Type-safe interfaces

**What it solves:**
- ✅ Nigeria JSS vs Ghana JHS differences
- ✅ Different subject names per country
- ✅ Country-specific subjects (Civic Education, Home Economics, etc.)
- ✅ Scalable to 50+ countries

**How to use:**
```typescript
const subjects = useLocalizedSubjects('jss');
// Done! Automatically filtered and localized
```

---

**Status:** 🟢 **READY FOR INTEGRATION**

Next step: Update `subjects/[level]/page.tsx` to use `useLocalizedSubjects()` hook!
