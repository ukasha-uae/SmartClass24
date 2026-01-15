# Virtual Lab Deployment Fix

## Issue
The virtual lab features on localhost (mobile responsiveness, "Mark Experiment as Complete" button, Lab Notes section) are not showing on the deployed/production site.

## Root Cause
**The production build is outdated** - it doesn't include the latest changes from the codebase. The local development server (`npm run dev`) shows the current code, but production shows an older cached version.

## Solution: Deploy Latest Changes

### Step 1: Clean Build
```powershell
# Clear Next.js cache
.\clear-cache.ps1

# Or manually:
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

### Step 2: Create Fresh Production Build
```powershell
npm run build
```

### Step 3: Test Production Build Locally (Optional but Recommended)
```powershell
# Start production server locally
npm start

# Visit http://localhost:3000/virtual-labs/[any-lab]
# Verify all features work:
# ✓ "Mark Experiment as Complete" button appears after interaction
# ✓ "Exam Preparation Tip" card shows
# ✓ Lab Notes section appears
# ✓ Mobile responsive (test with DevTools mobile view)
```

### Step 4: Deploy to Firebase Hosting
```powershell
firebase deploy --only hosting
```

**Wait 2-5 minutes for CDN cache to clear globally**

### Step 5: Clear Browser Cache
After deployment, users need to hard refresh:
- **Windows**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

## Verification Checklist

Visit your production URL: `https://your-app.web.app/virtual-labs/food-tests`

- [ ] "Mark Experiment as Complete" button appears after scrolling/clicking
- [ ] "Exam Preparation Tip" amber card displays
- [ ] Lab Notes textarea with example placeholder shows
- [ ] "Save Notes", "Print for Practice", "Delete" buttons work
- [ ] Mobile view (< 640px): All elements stack properly
- [ ] Progress indicator shows steps 1 & 2
- [ ] Post-lab quiz appears after completing experiment

## Current Features (Should All Be Live)

### 1. Interactive Experiment Completion Flow
- User must interact (scroll/click) to see completion button
- "Mark Experiment as Complete" button triggers quiz CTA
- Progress indicator shows experiment → quiz flow

### 2. Exam Preparation System
- **Amber tip card** reminds students to handwrite notes
- **Lab Notes textarea** for digital capture
- **Print for Practice** button generates handwriting-ready format
- **Character counter** shows 0 characters initially
- **Auto-save** preserves notes in localStorage

### 3. Mobile Responsiveness
All components use Tailwind responsive classes:
- `p-4 sm:p-6` - Padding scales with screen size
- `text-3xl sm:text-4xl` - Text scales for mobile
- `flex-col sm:flex-row` - Buttons stack on mobile
- `w-full sm:flex-1` - Full width buttons on mobile
- `min-h-[400px] sm:min-h-[500px]` - Smaller lab area on mobile

### 4. Enhanced Labs vs. Regular Labs
- **Enhanced labs** (e.g., ammonia-test, hydrogen-pop-test): Self-contained, render directly
- **Regular labs**: Wrapped with progress indicator, completion flow, and lab notes

## File Locations
- Main page: `src/app/virtual-labs/[labSlug]/page.tsx`
- Lab Notes component: `src/components/virtual-labs/LabNotes.tsx`
- Lab Progress store: `src/stores/lab-progress-store.ts`
- Lab Notes store: `src/stores/lab-notes-store.ts`

## Common Deployment Issues

### Issue 1: Firebase Cache
**Symptom**: Deployed but still seeing old version  
**Fix**: Wait 5 minutes for CDN propagation, then hard refresh browser

### Issue 2: Service Worker Cache
**Symptom**: PWA serving cached old version  
**Fix**: 
```javascript
// In browser DevTools → Application → Service Workers
// Click "Unregister" and hard refresh
```

### Issue 3: Build Not Including Latest Changes
**Symptom**: Changes work locally but not in build  
**Fix**: 
```powershell
# Ensure you're on the right branch
git status

# Check for uncommitted changes
git diff

# Clean install dependencies
Remove-Item -Recurse -Force node_modules
npm install

# Fresh build
Remove-Item -Recurse -Force .next
npm run build
```

## Testing After Deployment

```powershell
# Test production build locally before deploying
npm run build
npm start

# Open in browser
start http://localhost:3000/virtual-labs/food-tests

# Test mobile:
# 1. Open Chrome DevTools (F12)
# 2. Click mobile device icon (Ctrl+Shift+M)
# 3. Select "iPhone 12 Pro" or similar
# 4. Verify all elements are responsive
```

## Firebase CLI Commands Reference

```powershell
# Login (if needed)
firebase login

# Check which project you're deploying to
firebase projects:list
firebase use --add  # Select correct project

# Deploy only hosting (faster)
firebase deploy --only hosting

# Deploy everything (hosting + firestore rules)
firebase deploy

# View deployment history
firebase hosting:channel:list
```

## Rollback (If Something Goes Wrong)

```powershell
# View recent deployments
firebase hosting:channel:list

# Rollback to previous version
# (Go to Firebase Console → Hosting → Release History → Rollback)
```

## Next Steps After Deployment

1. **Test on real devices**: iPhone, Android, tablets
2. **Check all virtual labs**: Not just food-tests
3. **Verify auth works**: Anonymous users can see labs
4. **Test lab notes persistence**: Save, reload page, notes should remain
5. **Check quiz completion**: XP awarded, progress tracked

---

**Last Updated**: January 15, 2026  
**Issue**: Production deployment out of sync with localhost  
**Resolution**: Clean build + deploy + cache clear
