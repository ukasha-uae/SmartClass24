# 📋 Past Questions Page - V1 Decision

**Date:** January 2025  
**Page:** `/past-questions`

---

## 🔍 Analysis

### **What the Page Does:**
1. Aggregates past questions from lessons (JHS/SHS)
2. Browse/search past questions by subject
3. View solutions
4. Links to lessons (`/subjects/jhs/...` or `/subjects/shs/...`)
5. Has "Adaptive AI Quiz" link (goes to `/quiz`)

### **Relationship to Challenge Arena:**
- ✅ Past questions are **ALREADY integrated** into Challenge Arena
- ✅ Challenge Arena uses `getPastQuestionsAsChallengeQuestions()` to include past questions
- ✅ Users can access past questions through Challenge Arena gameplay
- ❌ Standalone page is a **separate browsing interface**

### **Dependencies:**
- ❌ Links to lesson pages (`/subjects/jhs/...`) - **V2 feature**
- ❌ Depends on lesson data structure - **V2 feature**
- ❌ "Adaptive AI Quiz" link goes to `/quiz` - **Unknown if V1**

---

## 🎯 Recommendation: **PUSH TO V2**

### **Reasons:**

1. **Redundancy:**
   - Past questions are already accessible through Challenge Arena
   - Users can practice past questions via Practice Mode, Quick Match, etc.
   - Standalone browsing is not essential for V1

2. **V2 Dependencies:**
   - Page links to lesson pages (V2)
   - Depends on lesson data structure (V2)
   - Not core to Challenge Arena or Virtual Labs

3. **V1 Focus:**
   - Challenge Arena + Virtual Labs only
   - Past questions are already in Challenge Arena
   - No need for separate browsing interface

4. **User Experience:**
   - Users can access past questions through Challenge Arena
   - Practice Mode allows focused practice
   - Standalone page adds complexity without core value

---

## ✅ **Action: Disable for V1**

**Implementation:**
- Redirect `/past-questions` to Challenge Arena
- Show "Coming in V2" message
- Past questions remain accessible through Challenge Arena

---

## 📊 **Alternative: Keep but Simplify**

If you want to keep it for V1:
- Remove lesson links (V2 dependency)
- Remove "Adaptive AI Quiz" link (if not V1)
- Make it a simple browse/search interface
- Link to Challenge Arena instead of lessons

**But recommendation is still: PUSH TO V2**

---

**Decision:** ❌ **PUSH TO V2**

**Reason:** Past questions are already accessible through Challenge Arena. The standalone page is redundant and depends on V2 features (lessons).

---

**Last Updated:** January 2025

