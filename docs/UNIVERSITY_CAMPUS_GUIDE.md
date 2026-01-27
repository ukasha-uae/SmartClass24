# S24 Innovation Academy Module - Complete Architecture Guide

## Overview

The S24 Innovation Academy is a **separate, standalone product** within SmartClass24 designed for technology-focused learning with hands-on projects. Unlike other campuses that redirect to the Arena Challenge system, S24 Innovation Academy provides a complete learning platform with:

- 🎓 **Structured Programs & Courses**
- 💻 **Integrated Code Editor** with live preview
- 🛡️ **Sandboxed Code Execution** for safety
- 📊 **Progress Tracking & Analytics**
- 🏆 **Project-Based Assessments**
- 📱 **Fully Responsive Design**

---

## Architecture Overview

### Technology Stack

- **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Database**: Firebase Firestore
- **Sandboxing**: iframe with CSP (Content Security Policy)
- **Auth**: Firebase Anonymous & Email/Password

### Key Components

```
src/
├── app/
│   └── university/
│       ├── page.tsx                          # Landing page
│       ├── programs/
│       │   └── [slug]/
│       │       ├── page.tsx                  # Program detail
│       │       └── courses/
│       │           └── [courseSlug]/
│       │               └── lessons/
│       │                   └── [lessonSlug]/
│       │                       └── page.tsx  # Lesson view
├── components/
│   └── university/
│       └── UniversityCodeEditor.tsx          # Core editor component
├── lib/
│   └── university-data.ts                    # Curriculum data
├── types/
│   └── university.ts                         # TypeScript definitions
└── firebase/
    └── university-hooks.ts                   # Firebase integration
```

---

## Core Features

### 1. Integrated Code Editor

**Component**: `UniversityCodeEditor.tsx`

Features:
- Monaco Editor with syntax highlighting
- Live preview in sandboxed iframe
- Console output capture
- Multi-file editing support
- Auto-save functionality
- Code validation & feedback
- Download/upload code files
- Fullscreen mode

**Supported Environments**:
- `html-css-js` - Web development
- `react` - React applications
- `vue` - Vue applications
- `python` - Python runtime
- `nodejs` - Node.js backend
- `typescript` - TypeScript
- `nextjs` - Next.js applications

**Security Measures**:
```typescript
const sandboxConfig = {
  allowedDomains: [],
  allowedAPIs: ['console', 'setTimeout', 'setInterval'],
  maxExecutionTime: 5000,
  maxMemory: 128,
  enableNetwork: false,
  enableStorage: false,
  cspPolicy: "default-src 'none'; script-src 'unsafe-inline';"
};
```

### 2. Sandboxed Code Execution

**How it works**:
1. User writes code in Monaco Editor
2. Code is wrapped in try-catch block
3. Executed in sandboxed iframe with strict CSP
4. Console messages captured via postMessage API
5. Results displayed in preview pane
6. Errors caught and displayed safely

**Safety Features**:
- No file system access
- No network access (configurable)
- No localStorage/cookies (configurable)
- Execution timeout (5 seconds default)
- Memory limits
- Blocked dangerous APIs

### 3. Data Architecture

**Program Structure**:
```
UniversityProgram
├── Courses
│   ├── Modules
│   │   ├── Lessons (theory + practice)
│   │   └── Projects (assessments)
│   └── Assessments (quizzes, exams)
└── Certificate
```

**Key Types** (see `src/types/university.ts`):
- `UniversityProgram` - Top-level program (e.g., Web Development)
- `UniversityCourse` - Individual course within program
- `CourseModule` - Collection of related lessons
- `Lesson` - Single learning unit (theory/practical/hybrid)
- `Project` - Major assessment with grading rubric
- `ProjectSubmission` - Student's submitted work

### 4. Firebase Integration

**Collections**:

1. **university-progress** - Student progress tracking
   ```
   {userId}_{programId}_{courseId}
   {
     studentId, programId, courseId,
     completedLessons: [],
     completedCheckpoints: [],
     completedProjects: [],
     currentModule,
     overallProgress,
     lastAccessedAt,
     timeSpent
   }
   ```

2. **university-submissions** - Project submissions
   ```
   {
     id, studentId, projectId,
     files: CodeFile[],
     submittedAt,
     status, grade, revisions
   }
   ```

3. **university-code-saves** - Auto-saved code
   ```
   {userId}_{lessonId}
   {
     studentId, lessonId,
     files: CodeFile[],
     savedAt
   }
   ```

**Hooks** (see `src/firebase/university-hooks.ts`):
- `useUniversityProgress()` - Progress tracking
- `useProjectSubmissions()` - Submit & retrieve projects
- `useCodeSaves()` - Auto-save/load code
- `useUniversityAnalytics()` - Time tracking

---

## Security & Scalability

### Security Considerations

1. **Code Execution**:
   - All code runs in sandboxed iframe
   - Strict Content Security Policy
   - No access to parent window
   - Timeout limits prevent infinite loops
   - Memory limits prevent DoS

2. **Firestore Rules**:
   - Students can only read/write their own data
   - Progress documents use `{userId}_*` pattern
   - Submissions tied to authenticated user
   - No deletion allowed (audit trail)

3. **Input Validation**:
   - File size limits (100KB default)
   - Execution timeout (5s default)
   - Blocked API patterns
   - XSS prevention in preview

### Scalability Design

1. **Data Structure**:
   - Curriculum data is static (no database queries for content)
   - Progress stored per-user, per-course (sharded)
   - Code saves use localStorage + Firestore (fallback)
   - Submissions indexed by student + project

2. **Performance**:
   - Monaco Editor loaded dynamically (code splitting)
   - Iframe preview uses blob URLs (no server requests)
   - Auto-save debounced (1s delay)
   - Lazy loading of program/course content

3. **Future Expansion**:
   - Plugin system for new environments (Python, Java)
   - Peer review functionality
   - Live coding sessions (WebRTC)
   - AI code assistance (GPT integration)
   - Automated grading system
   - Video lessons integration

---

## Campus Configuration

### Enabling S24 Innovation Academy

**File**: `src/lib/campus-config.ts`
```typescript
university: {
  id: 'university',
  name: 'university',
  displayName: 'S24 Innovation Academy',
  description: 'Technology-focused programs with hands-on projects...',
  icon: Building2,
  color: 'green',
  schools: ['Technology', 'Engineering', 'Business', ...],
  levels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  features: {
    hasSubjects: true,
    hasLessons: true,
    hasQuiz: true,
    hasGame: false,
    hasLeaderboard: false,
    hasChallengeArena: false,
  },
  active: true
}
```

**File**: `src/lib/featureFlags.ts`
```typescript
showUniversity: true,
universityHasLessons: true,
universityHasCodeEditor: true,
universityHasProjects: true,
```

---

## Adding New Programs

### Step 1: Define Program Data

**File**: `src/lib/university-data.ts`

```typescript
export const newProgram: UniversityProgram = {
  id: 'program-id',
  slug: 'program-slug',
  title: 'Program Title',
  discipline: 'technology',
  description: '...',
  duration: '3 months',
  difficulty: 'beginner',
  prerequisites: [],
  learningOutcomes: [],
  courses: [
    {
      id: 'course-1',
      slug: 'course-slug',
      title: 'Course Title',
      modules: [
        {
          id: 'module-1',
          lessons: [
            {
              id: 'lesson-1',
              type: 'practical',
              interactive: {
                type: 'code-editor',
                config: {
                  environment: 'html-css-js',
                  startingFiles: [...]
                }
              }
            }
          ],
          projects: [...]
        }
      ]
    }
  ],
  certificate: {...},
  tags: [],
  active: true
};
```

### Step 2: Add to Program List

```typescript
export const UNIVERSITY_PROGRAMS: UniversityProgram[] = [
  webDevelopmentProgram,
  newProgram,  // <-- Add here
];
```

### Step 3: Test Routes

- Landing: `/university`
- Program: `/university/programs/program-slug`
- Lesson: `/university/programs/program-slug/courses/course-slug/lessons/lesson-slug`

---

## Code Editor Usage

### Basic Implementation

```tsx
import UniversityCodeEditor from '@/components/university/UniversityCodeEditor';

<UniversityCodeEditor
  initialFiles={[
    {
      path: 'index.html',
      language: 'html',
      content: '<!DOCTYPE html>...'
    }
  ]}
  environment="html-css-js"
  showPreview={true}
  showConsole={true}
  onExecute={(result) => console.log(result)}
  onSave={(files) => console.log('Saved:', files)}
  instructions="Build a responsive website..."
/>
```

### With Validation

```tsx
<UniversityCodeEditor
  // ... other props
  initialFiles={[...]}
  environment="html-css-js"
  sandboxConfig={{
    ...DEFAULT_SANDBOX_CONFIG,
    validation: [
      {
        type: 'code-pattern',
        description: 'Uses semantic HTML',
        validate: '<(header|nav|main|footer)',
        points: 20
      }
    ]
  }}
/>
```

---

## Project Assessment System

### Grading Rubric Structure

```typescript
{
  rubric: {
    totalPoints: 100,
    passingScore: 70,
    criteria: [
      {
        id: 'criterion-1',
        name: 'Code Quality',
        description: 'Clean, well-formatted code',
        maxPoints: 30,
        levels: [
          { score: 30, description: 'Excellent' },
          { score: 20, description: 'Good' },
          { score: 10, description: 'Needs improvement' },
          { score: 0, description: 'Poor' }
        ]
      }
    ]
  }
}
```

### Automated Validation

Supports:
- **Code Pattern Matching** - Regex validation
- **Output Testing** - Expected output comparison
- **Test Cases** - Unit test execution
- **Visual Testing** - Screenshot comparison (future)

---

## Future Enhancements

### Phase 2 (Next 3 months)
- ✅ Python environment support
- ✅ React project templates
- ✅ Automated grading system
- ✅ Peer code review
- ✅ Video lessons integration

### Phase 3 (6-12 months)
- ✅ Live coding sessions (WebRTC)
- ✅ AI code assistant (GPT-4 integration)
- ✅ Team projects & collaboration
- ✅ Industry certifications
- ✅ Job placement support

### Expansion to Other Disciplines
- **Engineering**: CAD simulations, circuit design
- **Business**: Case studies, financial modeling
- **Science**: Virtual labs, data analysis
- **Arts**: Design tools, portfolio builder
- **Health**: Medical simulations, anatomy 3D

---

## Development Guidelines

### Adding New Lesson

1. Create lesson data in `university-data.ts`
2. Include interactive code editor config
3. Add validation rules for auto-grading
4. Test code execution in sandbox
5. Add resources and checkpoints
6. Update module structure

### Testing Checklist

- [ ] Code executes without errors
- [ ] Preview renders correctly
- [ ] Console captures messages
- [ ] Validation rules work
- [ ] Auto-save functions
- [ ] Security sandbox active
- [ ] Mobile responsive
- [ ] Firestore rules applied

### Performance Tips

- Use dynamic imports for Monaco
- Debounce auto-save (1000ms)
- Lazy load course content
- Cache program data
- Use blob URLs for preview
- Limit console message buffer

---

## Deployment

### Required Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... other Firebase config
```

### Firestore Security Rules

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### Package Dependencies

```json
{
  "@monaco-editor/react": "^4.6.0",
  "firebase": "^10.x",
  "next": "^14.x",
  "react": "^18.x",
  "lucide-react": "latest"
}
```

---

## API Reference

### University Hooks

**useUniversityProgress()**
```typescript
const { getProgress, updateProgress, markLessonComplete } = useUniversityProgress();
```

**useProjectSubmissions()**
```typescript
const { submitProject, getSubmission, getStudentSubmissions } = useProjectSubmissions();
```

**useCodeSaves()**
```typescript
const { saveCode, loadCode } = useCodeSaves();
```

**useUniversityAnalytics()**
```typescript
const { trackLessonTime } = useUniversityAnalytics();
```

---

## Support & Troubleshooting

### Common Issues

1. **Editor not loading**
   - Check Monaco Editor import
   - Verify SSR disabled (`ssr: false`)
   - Check browser console for errors

2. **Preview not updating**
   - Check iframe sandbox attributes
   - Verify CSP policy
   - Check postMessage listeners

3. **Code not saving**
   - Verify Firebase auth
   - Check Firestore rules
   - Test localStorage fallback

4. **Execution timeout**
   - Increase timeout in config
   - Check for infinite loops
   - Optimize code complexity

---

## Contact & Resources

- **Documentation**: `/docs/UNIVERSITY_CAMPUS_GUIDE.md`
- **Examples**: `src/lib/university-data.ts`
- **Component**: `src/components/university/UniversityCodeEditor.tsx`
- **Types**: `src/types/university.ts`
- **Issues**: File issue in project repo

---

**Last Updated**: January 24, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
