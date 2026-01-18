# Mobile Testing Checklist - Magnetic Field Lab

## 🧪 Pre-Testing Setup

### Access the Lab
1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:9002/virtual-labs/magnetic-field-mapping`
3. Or on production: `https://yourapp.com/virtual-labs/magnetic-field-mapping`

### Test Devices
- [ ] **iOS Safari** (iPhone 12 or newer)
- [ ] **Chrome Mobile** (Android 10+)
- [ ] **Samsung Internet** (Galaxy S21+)
- [ ] **Budget Android** (< 4GB RAM, if available)

## ✅ Critical Tests

### 1. Teacher Avatar Stability
**Issue:** Was blinking/shaky on mobile

**Test Steps:**
1. Open lab on mobile device
2. Observe teacher avatar in bottom-right corner
3. Tap "Start Learning" button
4. Watch avatar for 30 seconds

**Expected Results:**
- [ ] Avatar is **completely stable** (no movement)
- [ ] No blinking eyes
- [ ] No mouth animation
- [ ] No pulsing/scaling effects
- [ ] No sound wave circles
- [ ] Avatar maintains position without jitter

**Pass Criteria:** Zero visible motion or flickering

---

### 2. Magnet Dragging Performance
**Issue:** Magnets felt laggy/unresponsive

**Test Steps:**
1. Proceed to "Interactive Magnetic Field" step
2. Touch and drag **Magnet 1** (red/blue bar)
3. Move it smoothly across screen
4. Release and observe
5. Repeat with **Magnet 2**

**Expected Results:**
- [ ] Magnet follows finger **immediately** (< 100ms lag)
- [ ] Movement is **smooth** (no stuttering)
- [ ] No accidental page scrolling while dragging
- [ ] Magnet stays under finger during drag
- [ ] Release is instant (no "sticky" feeling)

**Pass Criteria:** Feels as responsive as native app

---

### 3. Attraction/Repulsion Animations
**Issue:** Force animations were choppy

**Test Steps:**
1. Drag magnets to opposite ends of canvas
2. Slowly bring them close together (opposite poles facing)
3. Watch them **snap together** (attraction)
4. Tap "Flip Poles" on Magnet 1
5. Watch them **push apart** (repulsion)

**Expected Results:**
- [ ] Attraction is **smooth and immediate**
- [ ] Repulsion feels **natural and fluid**
- [ ] No frame drops during movement
- [ ] Force arrows animate smoothly
- [ ] Green/red indicators appear correctly

**Pass Criteria:** 20+ FPS during all interactions

---

### 4. Touch Event Reliability
**Issue:** Touch events might conflict with scroll

**Test Steps:**
1. Tap magnet to start drag
2. Hold for 2 seconds without moving
3. Drag magnet in small circles
4. Drag magnet to edge of canvas
5. Drag magnet quickly across canvas
6. Release outside canvas boundary

**Expected Results:**
- [ ] All touches are **registered immediately**
- [ ] No phantom touches or double-taps
- [ ] Page doesn't scroll while dragging magnet
- [ ] Magnets stay within canvas bounds (50-450 x, 50-350 y)
- [ ] Cursor changes to "grabbing" on touch

**Pass Criteria:** 100% reliable touch capture

---

### 5. Teacher Voice Performance
**Issue:** Background shimmer caused lag

**Test Steps:**
1. Observe teacher bubble when it appears
2. Look for background animation
3. Check if bubble lags when dragging
4. Minimize and maximize teacher

**Expected Results:**
- [ ] **No shimmer animation** on mobile (should be solid background)
- [ ] Bubble drags smoothly
- [ ] Minimize/maximize is instant
- [ ] Text is readable and clear

**Pass Criteria:** Completely static background, smooth interactions

---

## 📊 Performance Metrics

### Frame Rate Test
**Tool:** Chrome DevTools → Performance tab

1. Open DevTools on desktop, enable mobile emulation
2. Start recording
3. Drag magnets around for 10 seconds
4. Stop recording and check FPS

**Expected Results:**
- [ ] **Desktop:** 40-60 FPS (green line)
- [ ] **Mobile:** 20-30 FPS (green line)
- [ ] **No red drops** (frame drops)

---

### Memory Usage
**Tool:** Chrome DevTools → Memory tab

1. Take heap snapshot before opening lab
2. Open lab and interact for 2 minutes
3. Take second snapshot
4. Compare sizes

**Expected Results:**
- [ ] Memory increase < 50MB
- [ ] No continuous growth (memory leak)
- [ ] Detached DOM nodes < 100

---

### Battery Drain Test
**Tool:** Phone's battery settings

1. Note battery percentage before test
2. Use lab actively for 10 minutes
3. Note battery percentage after test

**Expected Results:**
- [ ] Battery drain < 5% per 10 minutes
- [ ] Phone doesn't get hot
- [ ] No battery warning appears

---

## 🐛 Bug Reporting

If any test fails, report with:

### Issue Template
```
**Device:** [iPhone 13, Samsung Galaxy S22, etc.]
**OS:** [iOS 16.5, Android 13, etc.]
**Browser:** [Safari, Chrome Mobile, etc.]
**Test Failed:** [Teacher Avatar Stability, etc.]

**Observed Behavior:**
[Describe what happened]

**Expected Behavior:**
[Describe what should happen]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Screenshot/Video:**
[Attach if possible]

**Performance Metrics:**
- FPS: [X FPS]
- Memory: [X MB]
- Battery: [X% over Y minutes]
```

---

## 🎯 Quick Pass/Fail Summary

After testing, fill out this summary:

| Test | Pass | Fail | Notes |
|------|------|------|-------|
| Teacher Avatar Stability | ⬜ | ⬜ | |
| Magnet Dragging | ⬜ | ⬜ | |
| Attraction/Repulsion | ⬜ | ⬜ | |
| Touch Event Reliability | ⬜ | ⬜ | |
| Teacher Voice Performance | ⬜ | ⬜ | |
| Frame Rate (>20 FPS) | ⬜ | ⬜ | |
| Memory (< 50MB increase) | ⬜ | ⬜ | |
| Battery (< 5% per 10min) | ⬜ | ⬜ | |

**Overall Result:** ⬜ PASS ⬜ FAIL

**Tester:** ___________________  
**Date:** ___________________  
**Device:** ___________________

---

## 🔄 Regression Tests (Desktop)

Verify desktop version still works:

- [ ] All animations work on desktop (teacher blinks, sound waves, etc.)
- [ ] Magnets drag smoothly (50 FPS)
- [ ] Background shimmer visible on desktop
- [ ] No performance degradation from changes

---

## 📞 Support

If you encounter issues during testing, contact the development team with the bug report template above.
