# 🚀 V1 Deployment Plan - Challenge Arena & Virtual Labs Only

**Date:** January 2025  
**Target:** Fast V1 deployment with 2 core features  
**Status:** In Progress

---

## 🎯 V1 Scope: 2 Features Only

### ✅ **Feature 1: Challenge Arena**
- **Access:** All levels (Primary, JHS, SHS)
- **Features:**
  - Practice Mode
  - Quick Match
  - Boss Battle
  - Tournaments
  - School vs School
  - Question Bank Limiting (5 for free, unlimited for premium)
  - Level-based filtering (Primary/JHS/SHS separation)

### ✅ **Feature 2: Virtual Labs**
- **Access:** SHS only (for V1)
- **Features:**
  - All labs unlocked (no restrictions)
  - Progress tracking (XP, streaks, badges)
  - Quiz system
  - Completion tracking

---

## 🔄 Changes Required for V1

### 1. **SHS Redirect to Challenge Arena** ✅
- **Current:** SHS students have access to lessons, virtual labs, and arena
- **V1 Change:** Redirect SHS to Challenge Arena (same as Primary/JHS)
- **Implementation:**
  - Update `V1RouteGuard` to redirect SHS from lessons to arena
  - Keep virtual labs accessible for SHS
  - Update homepage SHS card to point to arena

### 2. **Unlock All Virtual Labs** ✅
- **Current:** Virtual labs filtered by `v1VirtualLabs` array (limited selection)
- **V1 Change:** Remove filtering, unlock all labs
- **Implementation:**
  - Update `getAllVirtualLabs()` to return all labs (ignore V1 filter)
  - Update `getVirtualLabBySlug()` to allow all labs
  - Remove any premium/lock restrictions

### 3. **Hide/Disable Non-V1 Features** ✅
- **Lessons:** Hide for all levels (Primary, JHS, SHS)
- **SHS Programmes:** Hide
- **Study Groups:** Hide
- **Community:** Hide
- **Teacher/Parent Dashboards:** Hide
- **Past Questions:** Hide (or redirect to arena)

---

## 📋 V1 Deployment Checklist

### **Pre-Deployment**
- [x] Update SHS redirect to Challenge Arena
- [x] Unlock all Virtual Labs
- [x] Remove V1 virtual labs filtering
- [ ] Test SHS navigation flow
- [ ] Test Virtual Labs access
- [ ] Verify Challenge Arena works for all levels
- [ ] Hide non-V1 features in navigation
- [ ] Update homepage cards
- [ ] Test premium features (question bank limiting)

### **Features to Hide/Disable**
- [ ] Hide "SHS Programmes" from navigation
- [ ] Hide "Lessons" from navigation
- [ ] Hide "Study Groups" from navigation
- [ ] Hide "Community" from navigation
- [ ] Hide "Teacher Dashboard" from navigation
- [ ] Hide "Parent Dashboard" from navigation
- [ ] Update homepage to show only Arena + Virtual Labs

### **Testing**
- [ ] Primary student → Challenge Arena only
- [ ] JHS student → Challenge Arena only
- [ ] SHS student → Challenge Arena + Virtual Labs
- [ ] Virtual Labs → All labs accessible
- [ ] Challenge Arena → All game modes work
- [ ] Premium features → Question bank limiting works
- [ ] Mobile responsiveness
- [ ] Payment flow (WhatsApp)

---

## 🚫 Features Pushed to V2

### **Lessons & Learning Content**
- ❌ SHS Programmes
- ❌ Core Subjects (Math, English, Science)
- ❌ Lesson pages
- ❌ Topic pages
- ❌ Carousel mode

### **Social & Community**
- ❌ Study Groups
- ❌ Community Q&A
- ❌ Parent Dashboard
- ❌ Teacher Dashboard

### **Additional Features**
- ❌ Past Questions (standalone)
- ❌ WASSCE Questions (standalone)
- ❌ Study Schedule
- ❌ Bookmarks
- ❌ Advanced Analytics Dashboard
- ❌ Daily Challenges
- ❌ Streak Recovery

---

## 🎯 V1 User Experience

### **Primary Students:**
1. Homepage → Select Primary
2. Redirected to Challenge Arena
3. Can play all game modes
4. Limited to 5 questions per subject (free)
5. Can upgrade to premium for unlimited questions

### **JHS Students:**
1. Homepage → Select JHS
2. Redirected to Challenge Arena
3. Can play all game modes
4. Limited to 5 questions per subject (free)
5. Can upgrade to premium for unlimited questions

### **SHS Students:**
1. Homepage → Select SHS
2. Redirected to Challenge Arena (primary)
3. Can access Virtual Labs from navigation
4. All virtual labs unlocked
5. Can play all Challenge Arena game modes
6. Limited to 5 questions per subject (free)
7. Can upgrade to premium for unlimited questions

---

## 📊 V1 Success Metrics

### **Key Metrics:**
- User registration rate
- Challenge Arena engagement (challenges completed)
- Virtual Labs completion rate
- Premium conversion rate
- Daily active users
- Retention (Day 1, Day 7, Day 30)

### **Targets:**
- 1,000+ registered users in first month
- 10,000+ challenges completed
- 500+ virtual lab completions
- 2-5% premium conversion rate

---

## 🔧 Technical Changes

### **Files to Modify:**
1. `src/components/V1RouteGuard.tsx` - Update SHS redirect
2. `src/lib/virtual-labs-data.ts` - Remove V1 filtering
3. `src/lib/featureFlags.ts` - Update V1 flags
4. `src/components/Header.tsx` - Hide non-V1 navigation items
5. `src/app/page.tsx` - Update homepage cards
6. `src/app/virtual-labs/page.tsx` - Remove any locks

---

## ✅ Post-V1 Deployment

### **Immediate (Week 1):**
- Monitor user feedback
- Track error rates
- Monitor premium conversions
- Fix critical bugs

### **V2 Planning:**
- Lessons & Learning Content
- Advanced Analytics
- Daily Challenges
- Social Features
- Parent/Teacher Dashboards

---

**Last Updated:** January 2025

