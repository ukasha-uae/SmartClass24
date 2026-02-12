# Testing the Welcome Intro Experience

**⚠️ STATUS: TEMPORARILY DISABLED - See [WELCOME_INTRO_DISABLED.md](WELCOME_INTRO_DISABLED.md)**

**Issue:** Auto-advances to third scene, cannot navigate back properly  
**Solution:** Disabled for all users until fixed  
**Testing:** Only available via `?welcome=true` parameter

---

## Current Behavior

The welcome intro is **hidden by default** and will NOT show to regular users. It only appears when:
1. Explicitly requested via `?welcome=true` URL parameter
2. Triggered by dev button in development mode

---

## How to Test (While Disabled)

### ✅ Method 1: Query Parameter (Recommended)

### ✅ Method 1: Query Parameter (Recommended)

**Test the feature:**
```
http://localhost:9002/?welcome=true
```

This will force-show the welcome intro even though it's disabled by default.

---

### ✅ Method 2: Dev Button (Development Only)

Look for the **amber "Show Welcome (Disabled)"** button at the bottom-right of the homepage in dev mode.

Click it to instantly trigger the welcome experience.

---

### ✅ Method 3: Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Type:
```javascript
window.location.href = '/?welcome=true'
```
4. Press Enter

---

## Known Issues Being Fixed

1. **Auto-advances to scene 3** - Carousel doesn't respect user control
2. **Cannot go back** - Previous button/swipe doesn't work reliably  
3. **Scene transitions too fast** - Need better timing control

**These issues are why the feature is currently disabled for all users.**

---

## Re-Enabling After Fixes

See [WELCOME_INTRO_DISABLED.md](WELCOME_INTRO_DISABLED.md) for:
- Detailed fix instructions
- Code locations to update
- Testing checklist before re-enabling

---

## Original Documentation (For Reference)

The sections below describe the INTENDED behavior once bugs are fixed.

---

### Method 4 (Original): Fresh Incognito Window

1. Open browser DevTools (F12)
2. Go to Console tab
3. Type:
```javascript
localStorage.removeItem('hasSeenWelcome')
```
4. Press Enter
5. Reload the page (Ctrl+R or F5)

---

### ✅ Method 4: Fresh Incognito Window

**Important:** Open a **NEW incognito/private WINDOW**, not just a new tab.

- Chrome/Edge: `Ctrl+Shift+N` (Windows/Linux) or `Cmd+Shift+N` (Mac)
- Firefox: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Safari: `Cmd+Shift+N` (Mac)

Each new private window starts with fresh localStorage.

---

### ✅ Method 5: Code (For Programmatic Control)

```typescript
import { resetWelcome } from '@/hooks/useWelcomeExperience';

// Call this function anywhere in your code
resetWelcome();

// Then reload or navigate to homepage
```

---

## Why This Happens

### localStorage Behavior in Private Mode:

| Action | localStorage State |
|--------|-------------------|
| Open new private window | Fresh (no data) ✅ |
| Open tab in same window | Shared with other tabs ⚠️ |
| Complete/skip welcome | Sets `hasSeenWelcome='true'` |
| Close private window | All data cleared ✅ |
| Reload same tab | Data persists in session ⚠️ |

**Bottom line:** Private mode doesn't mean "always show intro" - it means "forget after closing window".

---

## Troubleshooting

### Still not showing?

1. **Check Console for Logs:**
   ```
   [HomePage] Showing welcome: { forceWelcome: true, ... }
   ```

2. **Verify localStorage is empty:**
   ```javascript
   console.log(localStorage.getItem('hasSeenWelcome'))
   // Should be null to show welcome
   ```

3. **Check if you have userName stored:**
   ```javascript
   console.log(localStorage.getItem('userName'))
   // If set, intro might skip for returning users
   ```

4. **Clear all localStorage:**
   ```javascript
   localStorage.clear()
   location.reload()
   ```

---

## For Testing in Production

**Use the query parameter method:**

```
https://yourdomain.com/?welcome=true
```

This works even if the user has seen the welcome before.

---

## Development Tips

### Auto-trigger on homepage load (temp):

In `src/app/page.tsx`, temporarily add:

```typescript
useEffect(() => {
  setShowWelcome(true); // Force show for testing
}, []);
```

**Remember to remove this before committing!**

---

### Check detection logic:

The welcome shows when:
- ✅ `?welcome=true` in URL
- ✅ `localStorage.getItem('hasSeenWelcome')` is `null`
- ✅ User is anonymous AND has no stored name
- ✅ `user.isFirstLogin === true` (if using auth hook)

---

## Video Demo Testing Workflow

1. Open new private window
2. Navigate to homepage → Welcome shows ✅
3. Complete or skip welcome
4. Reload page → Welcome doesn't show (expected)
5. Add `?welcome=true` to URL → Welcome shows again ✅
6. Close private window
7. Open NEW private window → Welcome shows again ✅

---

## Production Behavior

In production, users will see the welcome intro:

- ✅ First time they visit the site (no localStorage)
- ✅ After clearing browser data
- ✅ In a fresh private/incognito window
- ❌ On subsequent visits (welcome already seen)

This is the expected and desired behavior.

---

## Questions?

**Q: Why not show every time in private mode?**  
A: That would be annoying. Users might refresh the page or navigate back, and don't want to see the intro repeatedly in one session.

**Q: How do I force show for a specific user?**  
A: Set `isFirstLogin: true` in the user object, or use the query parameter.

**Q: Can I customize when it shows?**  
A: Yes! Edit the logic in `src/app/page.tsx`:

```typescript
const shouldShowWelcome = /* your custom logic */;
if (shouldShowWelcome) {
  setShowWelcome(true);
}
```

---

**Last Updated:** February 11, 2026  
**Status:** Working as designed ✅
