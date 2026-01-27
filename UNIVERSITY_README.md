# 🎓 S24 Innovation Academy - Quick Reference

## Access Points

| Page | URL | Purpose |
|------|-----|---------|
| **Landing** | `/university` | Browse all programs |
| **Demo** | `/university/demo` | Try code editor (no sign-in) |
| **Program** | `/university/programs/web-development-fundamentals` | View program details |
| **Lesson** | `/university/programs/.../lessons/html-tags-elements` | Interactive lesson with code editor |

## Key Files

```
📁 Project Structure
├── 📄 src/types/university.ts                    # All TypeScript types
├── 📄 src/lib/university-data.ts                 # Curriculum data
├── 📄 src/components/university/UniversityCodeEditor.tsx  # Code editor
├── 📄 src/firebase/university-hooks.ts           # Firebase hooks
├── 📁 src/app/university/                        # All routes
│   ├── page.tsx                                  # Landing
│   ├── demo/page.tsx                             # Demo
│   └── programs/[slug]/...                       # Dynamic routes
├── 📄 firestore.rules                            # Security rules
└── 📄 docs/UNIVERSITY_CAMPUS_GUIDE.md           # Full documentation
```

## Installation

```powershell
# 1. Install Monaco Editor
npm install @monaco-editor/react

# 2. Deploy Firestore rules
firebase deploy --only firestore:rules

# 3. Run dev server
npm run dev

# 4. Open browser
# http://localhost:9002/university
```

## Code Editor Usage

```tsx
import UniversityCodeEditor from '@/components/university/UniversityCodeEditor';

<UniversityCodeEditor
  initialFiles={[
    { path: 'index.html', language: 'html', content: '...' }
  ]}
  environment="html-css-js"
  showPreview={true}
  showConsole={true}
  onExecute={(result) => console.log(result)}
  onSave={(files) => console.log(files)}
/>
```

## Firebase Hooks

```tsx
// Progress tracking
const { markLessonComplete } = useUniversityProgress();
await markLessonComplete(programId, courseId, lessonId);

// Project submission
const { submitProject } = useProjectSubmissions();
const submissionId = await submitProject(projectId, files);

// Code auto-save
const { saveCode, loadCode } = useCodeSaves();
await saveCode(lessonId, files);
const saved = await loadCode(lessonId);
```

## Adding New Program

1. Define in `src/lib/university-data.ts`:
```typescript
export const myProgram: UniversityProgram = {
  id: 'my-program',
  slug: 'my-program-slug',
  title: 'My Program',
  // ... rest of config
};
```

2. Add to exports:
```typescript
export const UNIVERSITY_PROGRAMS = [
  webDevelopmentProgram,
  myProgram,  // <-- Add here
];
```

3. Access at: `/university/programs/my-program-slug`

## Environment Support

| Environment | Status | Use Case |
|-------------|--------|----------|
| `html-css-js` | ✅ Implemented | Web development |
| `react` | 🔜 Coming | React apps |
| `python` | 🔜 Coming | Python programming |
| `nodejs` | 🔜 Coming | Backend development |
| `typescript` | 🔜 Coming | TypeScript |
| `vue` | 🔜 Coming | Vue apps |
| `nextjs` | 🔜 Coming | Next.js apps |

## Security Features

- ✅ Sandboxed iframe execution
- ✅ Content Security Policy (CSP)
- ✅ No file system access
- ✅ No network access (configurable)
- ✅ Execution timeout (5s)
- ✅ Memory limits
- ✅ User-scoped Firestore rules
- ✅ XSS prevention

## Common Tasks

### Check errors
```powershell
npm run typecheck
```

### Build for production
```powershell
npm run build
```

### Deploy Firestore rules
```powershell
firebase deploy --only firestore:rules
```

### Test locally
```powershell
npm run dev
# Open: http://localhost:9002/university/demo
```

## Documentation

- 📖 **Full Guide**: `docs/UNIVERSITY_CAMPUS_GUIDE.md`
- 📦 **Installation**: `UNIVERSITY_INSTALLATION.md`
- 📊 **Summary**: `UNIVERSITY_IMPLEMENTATION_SUMMARY.md`
- 📝 **This File**: `UNIVERSITY_README.md`

## Support

### Troubleshooting
1. **Editor not loading**: Check Monaco Editor installation
2. **Preview not updating**: Check iframe sandbox and CSP
3. **Code not saving**: Verify Firebase auth and Firestore rules

### Get Help
- Review documentation files above
- Check component implementation
- Test with demo page first

---

**Version**: 1.0.0
**Status**: ✅ Production Ready
**Last Updated**: January 24, 2026
