# Welcome Intro - Temporarily Disabled

**Status:** 🔴 **DISABLED**  
**Date:** February 11, 2026  
**Reason:** Scene navigation issues - auto-advances to third scene, cannot go back

---

## Current State

The welcome intro is **hidden from all users** by default. It will only show if:
- User manually adds `?welcome=true` to the URL
- Developers click the dev button (in development mode)

**Normal users will NOT see the intro** - it's completely disabled for production use.

---

## Known Issues to Fix

1. **Auto-advances past user control** - Goes to scene 3 automatically
2. **Cannot navigate backwards** - Back button or swipes don't work properly
3. **Carousel controls not responsive** - Scene transitions need debugging

---

## To Re-Enable (After Fixing)

### Step 1: Fix the Issues
Test thoroughly with `?welcome=true` parameter

### Step 2: Update `src/app/page.tsx`

Find this line (~line 89):
```typescript
const shouldShowWelcome = forceWelcome; // ONLY show when forced via ?welcome=true
```

Change it back to:
```typescript
const shouldShowWelcome = forceWelcome || !hasSeenWelcome || (!storedName && user?.isAnonymous);
```

### Step 3: Remove the TODO comments
Remove these comments from the same file:
```typescript
// WELCOME INTRO TEMPORARILY DISABLED
// TODO: Fix the carousel/scene navigation issues before re-enabling
```

### Step 4: Update dev button styling
Change the button from amber (warning) back to violet (normal):
```typescript
className="... bg-violet-600 hover:bg-violet-700 ..."
```

And update the text:
```typescript
Show Welcome
```

---

## Testing While Disabled

You can still test the feature:

**Method 1: Query Parameter**
```
http://localhost:9002/?welcome=true
```

**Method 2: Dev Button**
Look for the amber "Show Welcome (Disabled)" button at bottom-right in dev mode.

---

## Debug Strategy

### Likely Issues:

1. **Auto-advance logic in `useEffect`**
   - Check the speech synthesis completion handler
   - May be advancing too quickly
   - Look for `useEffect` with `isSpeaking` dependency

2. **Direction state not updating**
   - `setDirection()` calls may not be working
   - Animation states getting stuck

3. **Swipe gesture threshold**
   - May need adjustment for better UX
   - Check `handleDragEnd` function

### Files to Check:

- `src/components/IntelligentWelcome.tsx` - Main component
- Look for `useEffect` that handles `isSpeaking` state
- Check `handleNext`, `handlePrevious` functions
- Review `AnimatePresence` logic

---

## Recommended Fixes

### 1. Add Manual Control Option
```typescript
const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(false); // Default to manual
```

Make auto-play opt-in instead of default.

### 2. Improve Scene Navigation
Add clear previous/next buttons that always work, regardless of audio state.

### 3. Add Pause-All Button
Single button to stop all auto-advancement and audio.

### 4. Reduce to 2 Scenes
Simplify the intro:
- Scene 1: Welcome + key features
- Scene 2: Ready to start

Shorter = less chance of issues.

---

## Timeline

**Priority:** Low (not blocking)  
**Estimated Fix Time:** 2-4 hours  
**Testing Time:** 1 hour  
**Total:** 3-5 hours

**When to fix:**
- After more urgent features
- When you have dedicated time to test thoroughly
- Before major user onboarding campaigns

---

## Workaround for Now

If users ask "Why no welcome screen?", the homepage itself is clear and intuitive. They can:
1. See the hero section with clear call-to-actions
2. Browse campus options immediately
3. Start learning without friction

Sometimes **no intro is better** than a buggy intro. ✅

---

## Notes

- Component code is solid and well-structured
- Issues are likely timing/state management
- Once fixed, it will be a great feature
- Better to ship without it than with bugs

---

**Status:** Can be re-enabled anytime after debugging  
**Location:** `src/app/page.tsx` (line ~73-105)  
**Test URL:** `/?welcome=true`
