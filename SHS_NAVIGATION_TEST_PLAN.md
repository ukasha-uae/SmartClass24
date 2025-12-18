# SHS Navigation Implementation - Testing & Deployment Guide

## Changes Summary

### Files Created
1. **`src/app/shs/page.tsx`** (NEW)
   - SHS Hub landing page
   - Displays core subjects + programmes in unified view
   - Quick access to WASSCE resources

2. **`SHS_NAVIGATION_ARCHITECTURE.md`** (NEW)
   - Technical documentation of navigation structure
   - Data architecture explanation
   - Scalability considerations

3. **`SHS_NAVIGATION_VISUAL_GUIDE.md`** (NEW)
   - Visual guide with before/after comparisons
   - User journey maps
   - Component structure diagrams

### Files Modified
1. **`src/app/page.tsx`**
   - Line 79: Changed SHS href from `/subjects/shs` → `/shs`
   - Impact: Home page now directs to SHS Hub

2. **`src/app/subjects/[level]/page.tsx`**
   - Added imports: `Info`, `Home` icons, `Alert` component
   - Added SHS-specific alert banner (lines 81-95)
   - Updated page title for SHS: "SHS Core Subjects" instead of "SHS Subjects"
   - Updated description to clarify core subjects are required for all

---

## Quick Start Testing

### Test 1: Home to SHS Hub
```bash
1. Navigate to http://localhost:3000
2. Click "Enter Campus" on SHS card (violet/purple)
3. Verify URL is: http://localhost:3000/shs
4. Verify page shows:
   ✓ Hero section with "SHS Campus" title
   ✓ Core Subjects section (4 cards)
   ✓ Programmes section (8 cards)
   ✓ Quick Links section (4 cards)
```

### Test 2: Core Subject Navigation
```bash
1. On SHS Hub (/shs)
2. Click "Mathematics" card
3. Verify URL is: http://localhost:3000/subjects/shs/mathematics
4. Verify lesson content loads
5. Navigate back to /shs
6. Repeat for English, Science, Social Studies
```

### Test 3: Programme Navigation
```bash
1. On SHS Hub (/shs)
2. Click "General Science" programme card
3. Verify URL is: http://localhost:3000/shs-programmes/general-science
4. Verify elective subjects display (Physics, Chemistry, Biology, Elective Math)
5. Navigate back to /shs
6. Test other programmes
```

### Test 4: Alert Banner (Backward Compatibility)
```bash
1. Navigate directly to: http://localhost:3000/subjects/shs
2. Verify alert banner appears at top
3. Verify banner text: "Core Subjects Only: Looking for programme-specific electives?"
4. Click "Go to SHS Hub" button
5. Verify URL changes to: http://localhost:3000/shs
```

### Test 5: Quick Links
```bash
From SHS Hub (/shs), click each quick link:
1. NSMQ Battles → /challenge-arena
2. Virtual Labs → /virtual-labs
3. Past Questions → /past-questions
4. Study Groups → /study-groups
```

---

## Visual Verification Checklist

### SHS Hub Page (`/shs`)
- [ ] Page renders without errors
- [ ] Hero section displays with GraduationCap icon
- [ ] Quick stats badges show correct counts (4 core, 8 programmes)
- [ ] Core subjects section has violet gradient header
- [ ] 4 core subject cards display in grid
- [ ] Each core subject card has icon, name, description, topic count
- [ ] Hover effects work (shadow, scale, border color)
- [ ] Divider appears between core and programmes
- [ ] Programmes section has blue gradient header
- [ ] 6 programme cards visible initially
- [ ] "View All Programmes" button appears (if >6 programmes)
- [ ] Programme cards show elective badges
- [ ] Quick links section displays 4 resource cards
- [ ] All icons render correctly
- [ ] Dark mode works properly

### Core Subjects Page (`/subjects/shs`)
- [ ] Alert banner displays at top
- [ ] Banner has violet color scheme
- [ ] Info icon appears in banner
- [ ] "Go to SHS Hub" button is visible
- [ ] Button has Home icon
- [ ] Page title is "SHS Core Subjects" (not just "SHS Subjects")
- [ ] Description mentions "required for all programmes"
- [ ] 4 core subjects display correctly

### Responsive Design
- [ ] Desktop (>1024px): 4-col core, 3-col programmes
- [ ] Tablet (768-1023px): 2-col layouts, readable text
- [ ] Mobile (<768px): 1-col stack, no horizontal scroll
- [ ] Touch targets adequate size on mobile (min 44x44px)

---

## Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Samsung Internet (Android)

### Dark Mode
- [ ] Toggle dark mode on each page
- [ ] Verify colors adjust properly
- [ ] Verify text remains readable
- [ ] Verify gradients look correct

---

## Performance Checks

### Load Time
- [ ] SHS Hub loads in <2 seconds
- [ ] No console errors on page load
- [ ] Images/icons load properly
- [ ] No layout shift (CLS)

### Navigation Speed
- [ ] Clicking core subject → instant navigation
- [ ] Clicking programme → instant navigation
- [ ] Back button works without refresh
- [ ] Links don't cause full page reload (Next.js routing)

---

## Accessibility Testing

### Keyboard Navigation
```bash
1. Press Tab key repeatedly
2. Verify focus moves through:
   - Core subject cards
   - Programme cards
   - Quick link cards
   - All buttons and links
3. Verify focus indicator visible
4. Press Enter on focused card → navigates correctly
```

### Screen Reader
```bash
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate SHS Hub
3. Verify announces:
   - "SHS Campus" heading
   - "Core Subjects" heading with "Required for All" badge
   - Each subject name and description
   - "Programmes" heading with "Choose Your Path" badge
   - Each programme name and elective count
```

### Color Contrast
- [ ] Violet text on white background: Passes WCAG AA
- [ ] Button text on gradient: Passes WCAG AA
- [ ] Muted text readable in light and dark modes

---

## Known Issues & Limitations

### Current State
✅ **Working**:
- SHS Hub navigation
- Core subjects display and navigation
- Programmes display and navigation
- Alert banner on old route
- Responsive design
- Dark mode support

⚠️ **Limitations**:
- Programme lessons not yet created (only topic structure exists)
- User programme selection not persisted (no profile storage yet)
- No personalization based on selected programme
- No onboarding flow for first-time users

🔄 **Future Enhancements**:
- Save selected programme in user profile
- Personalized hub showing progress
- Onboarding wizard for new SHS students
- Smart recommendations based on programme

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests pass (above sections)
- [ ] No TypeScript errors: `npm run build`
- [ ] No console errors in browser
- [ ] Lighthouse score >90 (Performance, Accessibility, SEO)
- [ ] Verify all links functional

### Deployment Steps
```bash
# 1. Commit changes
git add .
git commit -m "feat: Add SHS Hub with unified core subjects and programmes navigation"

# 2. Push to repository
git push origin main

# 3. Deploy (if using Vercel/similar)
# Automatic deployment will trigger

# 4. Verify production
# - Visit production URL
# - Test core flows (Home → SHS Hub → Subjects/Programmes)
# - Check mobile responsiveness
```

### Post-Deployment
- [ ] Production site loads correctly
- [ ] Test all navigation flows on production
- [ ] Monitor analytics for user behavior
- [ ] Check for any error logs
- [ ] Verify no broken links

---

## Rollback Plan

If issues arise:

```bash
# Option 1: Revert home page href only
# In src/app/page.tsx line 79, change back to:
href: '/subjects/shs'

# Option 2: Full rollback
git revert [commit-hash]
git push origin main

# Option 3: Temporary redirect
# Add in src/app/shs/page.tsx:
useEffect(() => {
  router.push('/subjects/shs');
}, []);
```

---

## Monitoring

### Analytics to Track
1. **Navigation Paths**:
   - Home → SHS Hub (should be 100%)
   - SHS Hub → Core Subjects (track %)
   - SHS Hub → Programmes (track %)

2. **User Behavior**:
   - Time spent on SHS Hub
   - Which programmes viewed most
   - Core subject vs programme engagement

3. **Issues**:
   - 404 errors
   - Broken links
   - Slow page loads
   - Browser-specific errors

### Success Metrics
- [ ] >90% users navigate from home to /shs successfully
- [ ] <5% users land on alert banner page (direct link to /subjects/shs)
- [ ] >50% users explore programmes section
- [ ] Zero increase in error rate

---

## Support & Documentation

### For Developers
- **Architecture Doc**: `SHS_NAVIGATION_ARCHITECTURE.md`
- **Visual Guide**: `SHS_NAVIGATION_VISUAL_GUIDE.md`
- **Code Location**: `src/app/shs/page.tsx`

### For Users
- Hub provides clear labels and descriptions
- Alert banner guides users who land on old route
- Consistent color coding (violet = core, varied = programmes)

### For Content Creators
- Core subjects: Use `src/lib/shs-data.ts` → `coreSubjects`
- Programmes: Use `src/lib/shs-data.ts` → `shsProgrammes`
- Elective lessons: Follow pattern in `english-shs1-lessons-data.ts`

---

## Next Steps (Content Creation)

After deployment, focus on creating elective subject lessons:

### Priority 1: General Science Programme
```typescript
// Create files:
src/content/shs/physics-shs1-lessons-data.ts
src/content/shs/chemistry-shs1-lessons-data.ts
src/content/shs/biology-shs1-lessons-data.ts

// Add carousel intros:
src/components/lesson-intros/physics/shs1/...
```

### Priority 2: Business Programme
```typescript
// Create files:
src/content/shs/accounting-shs1-lessons-data.ts
src/content/shs/business-management-shs1-lessons-data.ts
```

### Priority 3: Remaining Programmes
- General Arts (Literature, History, Geography)
- Technical Studies
- Visual Arts
- Home Economics
- Agricultural Science
- ICT/Computing

---

## Summary

**Status**: ✅ Ready for Testing

**What Changed**:
- Added SHS Hub (`/shs`) as centralized landing page
- Updated home page to route to hub instead of core subjects directly
- Added helpful banner on old core subjects page

**What Works**:
- ✅ Unified navigation from single hub
- ✅ Clear separation of core vs electives
- ✅ Programme discovery built-in
- ✅ Backward compatibility maintained

**What's Next**:
- Test thoroughly using checklist above
- Deploy to production
- Monitor user behavior
- Create elective subject lessons

**Need Help?**
- Check `SHS_NAVIGATION_ARCHITECTURE.md` for technical details
- Check `SHS_NAVIGATION_VISUAL_GUIDE.md` for visual reference
- Review code in `src/app/shs/page.tsx`
