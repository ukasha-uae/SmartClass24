# Virtual Lab Issue: Localhost vs Production Differences

## Issue Summary
**Problem**: Virtual lab features visible on localhost are missing on the live/deployed site.

**Missing Features**:
1. ❌ "Mark Experiment as Complete" button
2. ❌ "Exam Preparation Tip" card (amber warning box)
3. ❌ Lab Notes textarea with character counter
4. ❌ "Print for Practice" button
5. ❌ Mobile responsive styling (elements don't stack properly on phones)

**Root Cause**: **PWA Service Worker Cache** + **Outdated Production Build**

---

## Why This Happens

### 1. Service Worker Caching (Primary Cause)
Your app is a Progressive Web App (PWA). When users visit the live site:
- A service worker installs in their browser
- It caches all pages for offline access
- **Even after you deploy updates, their browser serves the OLD cached version**
- Users see stale content until they manually clear cache

### 2. Build Not Deployed
If the localhost code hasn't been built and pushed to Firebase Hosting, the production site won't have the latest features.

---

## Fix: Complete Deployment Procedure

### Step 1: Deploy Latest Code

Run this PowerShell script I created:

```powershell
.\deploy-virtual-labs.ps1
```

Or manually:

```powershell
# 1. Clear Next.js cache
Remove-Item -Recurse -Force .next

# 2. Build production version
npm run build

# 3. (Optional) Test locally first
npm start
# Visit http://localhost:3000/virtual-labs/food-tests

# 4. Deploy to Firebase
firebase deploy --only hosting
```

### Step 2: Clear Service Worker Cache (CRITICAL!)

After deployment, **EVERY USER** needs to do this:

#### Method 1: Unregister Service Worker (Recommended)
1. Open your live site in Chrome/Edge
2. Press `F12` to open DevTools
3. Go to **Application** tab
4. Click **Service Workers** in left sidebar
5. Find your app's service worker
6. Click **"Unregister"** button
7. Close DevTools
8. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

#### Method 2: Clear Site Data
1. Open DevTools (`F12`)
2. Go to **Application** tab
3. Click **"Clear storage"** in left sidebar
4. Check "Unregister service workers"
5. Click **"Clear site data"** button
6. Reload page

#### Method 3: Hard Refresh (Simplest but may not always work)
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

---

## Verification Checklist

After deployment and cache clearing, visit:
`https://your-app.web.app/virtual-labs/food-tests`

✅ **Expected Behavior**:

1. **Page loads** - See experiment header with title and subject badge
2. **Scroll down** - After 1 second of interaction
3. **Button appears** - Blue "Mark Experiment as Complete" button shows
4. **Click button** - See green "Experiment Completed!" card
5. **Scroll down more** - See amber "📝 Exam Preparation Tip" card
6. **Lab Notes section** - Textarea with placeholder example
7. **Save button** - Should be disabled when empty
8. **Character counter** - Shows "0 characters"

---

## Mobile Testing

### Desktop Browser (Simulated Mobile)
1. Open Chrome DevTools (`F12`)
2. Click mobile device icon (`Ctrl + Shift + M`)
3. Select "iPhone 12 Pro" or "Pixel 5"
4. Refresh page
5. Verify:
   - Elements stack vertically
   - Buttons are full-width
   - Text is readable (not tiny)
   - No horizontal scrolling needed

### Real Mobile Device
1. Open live site on your phone
2. Test in both portrait and landscape
3. All interactive elements should be tappable
4. Text should scale appropriately

---

## Technical Details

### Current Code (Localhost - CORRECT)

**File**: `src/app/virtual-labs/[labSlug]/page.tsx`

The code includes:
- `userInteracted` state to trigger completion UI after scroll/click
- "Mark Experiment as Complete" button (line 282)
- "Exam Preparation Tip" card (line 320)
- `<LabNotes>` component (line 330)
- Responsive classes: `p-4 sm:p-6`, `text-3xl sm:text-4xl`

**File**: `src/components/virtual-labs/LabNotes.tsx`

Features:
- Textarea with 200px min-height
- Character counter
- "Save Notes" button
- "Print for Practice" button (amber styled)
- "Delete" button
- Responsive button layout: `flex-col sm:flex-row` (line 175)

### PWA Configuration

**File**: `next.config.ts`

```typescript
export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',  // Disabled in dev
  register: true,    // Auto-register service worker
  skipWaiting: true, // Update immediately on new deployment
})
```

**Note**: `skipWaiting: true` means new service workers should activate immediately, BUT users still need to hard refresh their tab.

### Service Worker Cache Strategy

Auto-generated `public/sw.js` caches:
- Static assets (images, fonts, CSS)
- JavaScript bundles
- Pages (using NetworkFirst strategy)
- API responses

**Cache Duration**: 24 hours (86400 seconds) for most assets

---

## For End Users (Communication Template)

Send this to users who report seeing old version:

---

**Subject**: How to Update SmartClass24 Virtual Labs

Hi! We've just deployed exciting new features to our virtual labs:
- Interactive completion tracking
- Digital lab notes with handwriting practice
- Better mobile experience

**To see the updates**, please:

1. **Clear your browser cache**:
   - Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
   - Select "Cached images and files"
   - Click "Clear data"

2. **Hard refresh** the page:
   - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

3. **On mobile**:
   - Close the SmartClass24 tab completely
   - Open a new tab and visit the site again

If you still don't see the new features, try using an incognito/private window as a test.

---

## Troubleshooting

### Issue: Deployment succeeds but I still see old version

**Solution**: Wait 5-10 minutes for Firebase CDN to propagate globally, then:
1. Open **incognito/private window**
2. Visit your site
3. If it works in incognito → Service worker cache issue (follow Step 2 above)
4. If it DOESN'T work in incognito → CDN still propagating, wait longer

### Issue: Some pages updated, virtual labs didn't

**Symptom**: Homepage shows updates, but `/virtual-labs/*` pages are old  
**Cause**: Service worker caches routes separately  
**Fix**: Unregister service worker (see Step 2, Method 1)

### Issue: Mobile view still broken after cache clear

**Check**:
1. Open DevTools on mobile (Chrome → Settings → More tools → Remote devices)
2. Inspect element classes
3. Look for `sm:` prefixes (e.g., `sm:p-6`, `sm:flex-row`)
4. If missing → Code not deployed, rebuild and redeploy
5. If present → CSS not loading, check Tailwind config

### Issue: "Mark Experiment as Complete" button never appears

**Debug**:
1. Open browser console (`F12` → Console tab)
2. Look for errors
3. Check `userInteracted` state:
   ```javascript
   // In console
   document.querySelector('[class*="purple-600"]')?.textContent
   // Should show button text if present
   ```
4. Try clicking and scrolling explicitly
5. If still not appearing → Old JavaScript bundle cached

---

## Prevention: Avoid This In Future

### Option 1: Force Cache Busting (Aggressive)
Update `next.config.ts`:

```typescript
export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: false,  // Disable cache on navigation
  reloadOnOnline: true,        // Reload when back online
})
```

### Option 2: Version Notifications
Add a "New Version Available" banner that prompts users to refresh when you deploy.

### Option 3: Shorter Cache TTL
Modify service worker settings to cache for shorter periods (not recommended for offline-first apps).

---

## Files Involved

| File | Purpose |
|------|---------|
| `src/app/virtual-labs/[labSlug]/page.tsx` | Main virtual lab page with completion flow |
| `src/components/virtual-labs/LabNotes.tsx` | Lab notes textarea component |
| `src/stores/lab-progress-store.ts` | Zustand store for tracking completions |
| `src/stores/lab-notes-store.ts` | Zustand store for saving notes |
| `next.config.ts` | PWA configuration |
| `public/sw.js` | Auto-generated service worker (don't edit) |
| `deploy-virtual-labs.ps1` | Deployment automation script |

---

## Summary: Quick Fix

**For You (Developer)**:
```powershell
.\deploy-virtual-labs.ps1
# Or:
Remove-Item -Recurse -Force .next; npm run build; firebase deploy --only hosting
```

**For Users**:
1. Open your app
2. Press F12 → Application → Service Workers → Unregister
3. Hard refresh (Ctrl+Shift+R)

**Result**: All virtual lab features should now be visible on production! 🎉

---

**Last Updated**: January 15, 2026  
**Status**: Localhost ✅ | Production ⚠️ (Needs deployment + cache clear)
