# Quick Test Checklist ✅

**Open in Browser:** http://localhost:9002/virtual-labs/maths-equation-builder

---

## 🎯 Critical Tests (5 minutes)

### ✅ Test 1: Tutorial Dialog
1. Clear localStorage key: `equation_builder_vbs_tutorial_seen_v1`
2. Click **"Both Sides"** button
3. **Verify:**
   - Dialog opens with title "🎯 New Challenge: Variables on Both Sides!"
   - Shows example: 3x + 7 = x + 15 → x = 4
   - Has "Got it! Let's practice 🚀" button
4. Click button → dialog closes

---

### ✅ Test 2: Practice Missions
1. Observe equation displayed
2. **Verify:**
   - Format: `[a]x + [b] = [c]x + [d]`
   - Badge shows "Both Sides"
   - Message: "Variable on Both Sides practice loaded"

---

### ✅ Test 3: Solve One Mission
**Example: 3x + 7 = x + 15**

1. **Step 1:** Look for cyan "START HERE" banner, enter operation `-` and `x` → Check
2. **Step 2:** Enter simplified equation `2x = 8` (not "2x + 7 = 15") → Check
3. **Step 3:** Enter final answer `x = 4` → Check

**Verify:** 
- ✅ Green checkmarks at each step
- ✅ Blue tip banner on Step 2 explaining the simplified form
- ✅ Auto-advances to Mission 2

---

### ✅ Test 4: Custom Equation
1. Type: `3x + 7 = x + 15`
2. Click "Load"
3. **Verify:** No errors, mission loads

---

### ✅ Test 5: UI Elements
Check these are visible:
- [ ] "Both Sides" button (between Linear and Fraction)
- [ ] Tutorial dialog opening correctly
- [ ] Mode badge showing "Both Sides"
- [ ] Custom equation placeholder: "4x+8=36 or 3x+7=x+15"

---

## 🚨 If Anything Fails
1. Check browser console (F12) for errors
2. Note which test failed
3. Take screenshot
4. Report back before committing

---

**Testing Time:** ~5 minutes  
**Ready to commit if:** All 5 tests pass ✅
