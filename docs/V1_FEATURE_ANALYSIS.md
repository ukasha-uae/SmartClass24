# 🔍 V1 Feature Analysis: Practice Page & Study Groups

**Date:** January 2025  
**Decision:** What to keep/remove for V1

---

## 📋 Analysis

### 1. **Practice Page** (`/challenge-arena/practice`)

**What it is:**
- Dedicated page for creating practice challenges
- Part of Challenge Arena feature set
- Allows users to:
  - Select education level (Primary/JHS/SHS)
  - Select subject
  - Select class level (e.g., JHS 1, JHS 2, JHS 3)
  - Create practice challenges with custom question counts

**Relationship to Challenge Arena:**
- Practice Mode is one of the game modes in Challenge Arena
- The Practice page is the entry point to create practice challenges
- It's referenced in the Challenge Arena dashboard

**V1 Decision: ✅ KEEP**
- **Reason:** Practice Mode is a core Challenge Arena feature
- **Status:** Already part of V1 scope (Challenge Arena is V1)
- **Action:** No changes needed

---

### 2. **Study Groups** (`/study-groups`)

**What it is:**
- Social/community feature
- Users can:
  - Create study groups
  - Join study groups
  - Invite classmates with codes
  - Collaborate on studies
  - Share resources

**Relationship to V1 Features:**
- ❌ NOT part of Challenge Arena
- ❌ NOT part of Virtual Labs
- ✅ Social/community feature (V2)

**V1 Decision: ❌ REMOVE/DISABLE**
- **Reason:** Not part of V1 scope (Challenge Arena + Virtual Labs only)
- **Status:** Already hidden from navigation
- **Action:** Should be disabled/redirected for V1

---

## 🎯 Recommendations

### **Practice Page: ✅ KEEP**
- It's part of Challenge Arena
- Practice Mode is a core game mode
- Already accessible from Challenge Arena dashboard
- **No action needed**

### **Study Groups: ❌ DISABLE**
- Not part of V1 scope
- Social feature (V2)
- Should redirect to Challenge Arena or show "Coming in V2" message
- **Action:** Add route guard to redirect or disable

---

## 🔧 Implementation Plan

### **Study Groups - Disable for V1**

**Option 1: Route Guard (Recommended)**
- Add V1RouteGuard to `/study-groups` page
- Redirect to Challenge Arena with message: "Study Groups coming in V2"

**Option 2: Disable Page**
- Show "Coming Soon" message
- Redirect to Challenge Arena

**Option 3: Hide Completely**
- Return 404 or redirect immediately

---

## ✅ Final Decision

1. **Practice Page:** ✅ **KEEP** - Part of Challenge Arena (V1)
2. **Study Groups:** ❌ **DISABLE** - Social feature (V2)

---

**Last Updated:** January 2025



