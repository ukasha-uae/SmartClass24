# Variable-Both-Sides Feature: Manual Testing Guide

**Created:** March 3, 2026  
**Dev Server:** http://localhost:9002  
**Test Page:** http://localhost:9002/virtual-labs/maths-equation-builder  
**Status:** Ready for Testing ✅

---

## 🎯 Testing Objectives

Verify that the complete variable-both-sides equation feature works correctly, including:
1. Tutorial dialog displays on first use
2. Practice mode generates valid missions
3. 4-step solving workflow functions properly
4. Custom equation parser accepts variable-both-sides format
5. Adaptive recommendation system suggests correct progression

---

## ✅ Pre-Testing Checklist

- [x] Dev server running on port 9002
- [x] No TypeScript compilation errors
- [x] Parser tests passed (6/6)
- [x] Tutorial dialog created
- [x] Bug fix applied (localStorage initialization)

---

## 🧪 Test Plan

### **Test 1: Tutorial Dialog (First-Time Experience)**

**Objective:** Verify tutorial shows on first variable-both-sides mode selection

**Steps:**
1. Open browser dev tools (F12)
2. Go to Application → Local Storage → http://localhost:9002
3. Delete key: `equation_builder_vbs_tutorial_seen_v1` (if it exists)
4. Navigate to: http://localhost:9002/virtual-labs/maths-equation-builder
5. Click **"Both Sides"** button in practice mode selector

**Expected Results:**
- ✅ Large dialog opens with title: "🎯 New Challenge: Variables on Both Sides!"
- ✅ Dialog shows worked example: 3x + 7 = x + 15 → x = 4
- ✅ Dialog has 4 sections: What's Different?, Strategy, Example, Pro Tips
- ✅ Button says: "Got it! Let's practice 🚀"

**Pass/Fail:** ___________

**Screenshot Location:** ___________

---

### **Test 2: Tutorial Persistence**

**Objective:** Verify tutorial doesn't show again after being dismissed

**Steps:**
1. Click "Got it! Let's practice 🚀" button
2. Switch to "Linear" mode
3. Switch back to "Both Sides" mode

**Expected Results:**
- ✅ Tutorial dialog does NOT reappear
- ✅ localStorage key `equation_builder_vbs_tutorial_seen_v1` = `"true"`
- ✅ Practice missions load normally

**Pass/Fail:** ___________

---

### **Test 3: Practice Mode Mission Generation**

**Objective:** Verify variable-both-sides missions generate correctly

**Steps:**
1. Click "Both Sides" button
2. Observe the first mission equation displayed

**Expected Results:**
- ✅ Equation format: `[a]x + [b] = [c]x + [d]` (e.g., "3x + 7 = x + 15")
- ✅ Badge shows "Both Sides" mode
- ✅ Mission counter shows "Mission 1/4"
- ✅ Success message: "Variable on Both Sides practice loaded. Start with Step 1."

**Sample Equations (should look similar):**
- 3x + 7 = x + 15
- 2x + 8 = x + 3
- 4x - 5 = x + 7
- 5x - 2 = 2x + 10

**Pass/Fail:** ___________

**Actual Equation Seen:** ___________

---

### **Test 4: 3-Step Solving Workflow**

**Objective:** Verify all 3 steps work correctly for variable-both-sides

**Test Equation:** 3x + 7 = x + 15

**Step 1: Choose Operation (Subtract Variable)**
1. Look for the cyan "START HERE" banner with helpful tips
2. In "symbol" box, type: `-`
3. In "value" box, type: `x`
4. Press Enter or click "Check Step"

**Expected:**
- ✅ Green checkmark appears
- ✅ Advances to Step 2 automatically
- ✅ Working history shows Step 1 confirmed

**Pass/Fail Step 1:** ___________

**Step 2: Enter Simplified Equation**
1. Notice the blue tip banner explaining to enter the fully simplified form
2. In the equation box, type: `2x = 8` (NOT "2x + 7 = 15")
3. Press Enter or click "Check Step"

**Expected:**
- ✅ Equation accepted as correct
- ✅ Advances to Step 3
- ✅ Note: System expects you to mentally combine the variable AND constant steps

**Pass/Fail Step 2:** ___________

**Step 3: Final Answer**
1. In the answer box, type: `x = 4`
2. Press Enter or click "Check Step"

**Expected:**
- ✅ Mission complete!
- ✅ Green success message
- ✅ Advances to Mission 2 automatically

**Pass/Fail Step 3:** ___________

**Important Note:** The system uses a 3-step approach (Operation → Simplified Equation → Answer), requiring mental math to combine steps. This builds algebraic fluency and matches the pattern of other equation modes.

---

### **Test 5: Custom Equation Support**

**Objective:** Verify custom variable-both-sides equations work

**Steps:**
1. In "Custom equation" section, type: `3x + 7 = x + 15`
2. Click "Load" button

**Expected Results:**
- ✅ No error message
- ✅ Custom mission loads as Mission 1
- ✅ 3 additional practice missions generated
- ✅ Success message: "Custom equation loaded. Start with Step 1."

**Pass/Fail:** ___________

**Additional Custom Equations to Test:**
- `5x - 2 = 2x + 10` (should work)
- `2x + 8 = x + 3` (should work)
- `x + 10 = 3x + 2` (should work)
- `4x = 2x + 8` (should work - zero constant on left)
- `3x + 7 = 22` (should work - falls back to basic linear parser)

**Pass/Fail for Each:** ___________

---

### **Test 6: Invalid Custom Equations**

**Objective:** Verify proper validation and error messages

**Test Cases:**

| Input | Expected Error |
|-------|---------------|
| `x + y = 10` | "This format is not supported yet" |
| `x^2 + 3x = 10` | "Quadratic/custom power equations are not in this builder yet" |
| `3x + 7 = x + 15.5` | Should work (decimals in constants) |
| `3x + 7 = 2x + 8` with non-integer solution | "This equation gives a non-integer answer" |

**Pass/Fail:** ___________

---

### **Test 7: Adaptive Recommendation System**

**Objective:** Verify progression logic works correctly

**Initial State:**
1. Clear localStorage: Delete `equation_builder_mode_stats_v1`
2. Reload page

**Phase 1: Linear Mastery**
1. Click "Linear" mode
2. Complete 4 missions with >75% score
3. Observe recommended mode

**Expected:**
- ✅ Recommended badge shows: "Suggested: Variable Both Sides"
- ✅ Reason: "You are ready for variables on both sides! Next level challenge."

**Pass/Fail:** ___________

**Phase 2: Variable-Both-Sides Mastery**
1. Click "Both Sides" mode
2. Complete 4 missions with >70% score
3. Return to practice selector

**Expected:**
- ✅ Recommended badge shows: "Suggested: Fraction Linear"
- ✅ Reason: "Great work! Time to tackle fraction equations."

**Pass/Fail:** ___________

**Phase 3: Fallback to Linear**
1. Click "Both Sides" mode
2. Intentionally score <60% or use >3 hints
3. Check recommended mode

**Expected:**
- ✅ Recommended badge shows: "Suggested: Linear"
- ✅ Reason: "A quick Linear round can rebuild confidence."

**Pass/Fail:** ___________

---

### **Test 8: Error Handling**

**Objective:** Verify graceful handling of wrong answers

**Steps:**
1. Load a variable-both-sides mission: `3x + 7 = x + 15`
2. In Step 1, enter wrong operation: `+`, `x`
3. Submit

**Expected:**
- ✅ Red error feedback appears
- ✅ Mistake counter increments
- ✅ Hint button becomes available
- ✅ Can retry without crashing

**Pass/Fail:** ___________

---

### **Test 9: Checkpoint Assessment**

**Objective:** Verify progression to checkpoints works

**Steps:**
1. Complete all 4 variable-both-sides missions
2. Observe checkpoint questions

**Expected:**
- ✅ Transitions to checkpoint stage
- ✅ 3 checkpoint questions appear
- ✅ Questions test variable-both-sides understanding (currently generic, may need update)
- ✅ Score calculated correctly

**Pass/Fail:** ___________

**Note:** Checkpoint questions may not be specific to variable-both-sides yet (Task #6 in todo list)

---

### **Test 10: Mobile Responsiveness**

**Objective:** Verify UI works on smaller screens

**Steps:**
1. Open browser dev tools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Test tutorial dialog and practice mode

**Expected:**
- ✅ Tutorial dialog is scrollable and readable
- ✅ "Both Sides" button is properly sized
- ✅ Equation input areas are accessible
- ✅ All buttons are tappable

**Pass/Fail:** ___________

---

## 🐛 Bug Reporting Template

If you find any issues during testing:

```
**Bug Title:** [Short description]

**Severity:** [Critical / High / Medium / Low]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Screenshot:** [Attach or describe]

**Browser/Device:** [Chrome 145 / Edge / Mobile]

**Console Errors:** [Copy from browser dev tools]
```

---

## ✅ Acceptance Criteria

All tests must pass before committing:

- [ ] Test 1: Tutorial dialog displays correctly
- [ ] Test 2: Tutorial persistence works
- [ ] Test 3: Missions generate correctly
- [ ] Test 4: 4-step workflow completes successfully
- [ ] Test 5: Custom equations load
- [ ] Test 6: Invalid equations rejected properly
- [ ] Test 7: Adaptive recommendations work
- [ ] Test 8: Error handling is graceful
- [ ] Test 9: Checkpoints accessible
- [ ] Test 10: Mobile responsive

**Overall Testing Status:** ⏳ PENDING

---

## 📊 Test Results Summary

**Date Tested:** ___________  
**Tested By:** ___________  
**Browser:** ___________  
**OS:** ___________

**Total Tests:** 10  
**Passed:** _____ / 10  
**Failed:** _____ / 10  
**Blocked:** _____ / 10

**Overall Assessment:** [PASS / FAIL / CONDITIONAL PASS]

**Recommendation:** [Ready to commit / Needs fixes / Requires discussion]

---

## 🚀 Next Steps After Testing

### If All Tests Pass:
1. Mark task #6 as in-progress (Update checkpoint quizzes)
2. Add 3 variable-both-sides specific checkpoint questions
3. Update lab description in `virtual-labs-data.ts`
4. Commit all changes with message: "FEATURE: Variable-Both-Sides Equations (Complete Package)"
5. Push to production

### If Tests Fail:
1. Document bugs using template above
2. Prioritize by severity
3. Fix critical/high severity bugs
4. Re-test
5. Repeat until all pass

---

## 📝 Notes Section

Use this space for additional observations during testing:

```
[Your notes here...]
```

---

## 🔗 Related Documentation

- [VARIABLE_BOTH_SIDES_IMPLEMENTATION.md](VARIABLE_BOTH_SIDES_IMPLEMENTATION.md) - Complete implementation details
- [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md) - Security assessment
- [EQUATION_BUILDER_AUDIT.md](EQUATION_BUILDER_AUDIT.md) - Feature roadmap

---

**Happy Testing! 🧪🚀**
