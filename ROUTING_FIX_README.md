# Routing Issue Prevention Guide

## Issue: Duplicate Slug in URL
If you see URLs like `/subjects/shs/integrated-science/chem-shs1-intro-nature-scope/chem-shs1-intro-nature-scope` causing redirects or pages not opening, this is the **CORRECT** URL pattern for SHS lessons.

## Why This Happens
- For SHS (Senior High School), **topics ARE lessons** (no nested structure)
- The URL pattern requires both a `topicSlug` and `lessonSlug` parameter
- Both parameters use the same value: the lesson's slug
- This is intentional and correct

## The Fix (Already Applied)
In `src/app/subjects/[level]/[subjectSlug]/page.tsx`, we use:
```tsx
href={`/subjects/${levelParam}/${subjectSlug}/${lesson.slug}/${lesson.slug}`}
```

**DO NOT** change it back to:
```tsx
href={`/subjects/${levelParam}/${subjectSlug}/${topic.slug}/${lesson.slug}`}
```

## If Issues Persist After Restart

### Quick Fix
Run this command from the project root:
```powershell
.\clear-cache.ps1
```

### Manual Steps
1. **Clear Next.js cache:**
   ```powershell
   Remove-Item -Path ".next" -Recurse -Force
   ```

2. **Clear node_modules cache:**
   ```powershell
   Remove-Item -Path "node_modules\.cache" -Recurse -Force
   ```

3. **Restart dev server:**
   - Stop the server (Ctrl+C)
   - Run `npm run dev`

4. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click refresh button → "Empty Cache and Hard Reload"
   - Or use Ctrl+Shift+Delete

5. **Unregister Service Worker (if using PWA):**
   - Open DevTools → Application tab → Service Workers
   - Click "Unregister" for the service worker
   - Refresh the page

## Root Cause
The issue persists because:
- Next.js caches compiled routes in `.next/` directory
- Browser caches pages and routes
- PWA Service Workers cache assets and routes
- Browser localStorage might cache old navigation data

## Prevention
- Always clear cache after pulling code changes
- Use the `clear-cache.ps1` script before starting work
- Add `.next/` to your `.gitignore` (already done)

## Technical Details
### URL Structure
- **Primary/JHS:** `/subjects/{level}/{subject}/{topicSlug}/{lessonSlug}`
  - Topic and lesson are separate entities
- **SHS:** `/subjects/{level}/{subject}/{lessonSlug}/{lessonSlug}`
  - Topics ARE lessons (same slug used twice)

### Code Location
- Link generation: `src/app/subjects/[level]/[subjectSlug]/page.tsx` (line ~277)
- Lesson loading: `src/app/subjects/[level]/[subjectSlug]/[topicSlug]/[lessonSlug]/page.tsx` (line ~207)
- Data structure: `src/lib/shs-data.ts`

## Contact
If you continue experiencing this issue after following all steps above, please:
1. Check the browser console for errors (F12 → Console)
2. Verify the exact URL causing issues
3. Check if other SHS lessons work correctly
