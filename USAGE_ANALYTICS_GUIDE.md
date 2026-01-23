# 📊 Usage Analytics Guide

## Overview
The **Usage Analytics Dashboard** helps you understand what users do on SmartClass24, so you can prioritize upgrades and improvements where they matter most.

---

## 🎯 What Does It Track?

The analytics system tracks **question usage** in challenges and quizzes across:

### Data Collected:
- **Subject Popularity** - Which subjects are most used (Math, Science, English, etc.)
- **Level Distribution** - Usage across JHS, SHS levels
- **Topic Trends** - Most popular topics within subjects
- **Difficulty Patterns** - Which difficulty levels students prefer
- **Daily Usage** - Activity trends over time
- **Unique Users** - Number of active students

### Insights Provided:
✅ **Top performing subjects** - Know where to add more content  
✅ **Underutilized subjects** - Identify areas needing promotion  
✅ **Popular topics** - Focus quality improvements for maximum impact  
✅ **User engagement** - Average challenges per user  
✅ **Growth trends** - Daily/weekly activity patterns

---

## 🔑 How to Access Analytics

### Option 1: From Admin Dashboard
1. Go to: **https://www.smartclass24.com/admin/dashboard**
2. Sign in with your admin account
3. Click the **"📊 View Usage Analytics"** button at the top
4. Analytics dashboard will open

### Option 2: Direct URL
Navigate directly to: **https://www.smartclass24.com/admin/analytics**

### Admin Access Required
Only users with admin privileges can access the analytics dashboard. If you see "Access Denied", contact the super admin to add your email to the admin list.

---

## 📈 Using the Analytics Dashboard

### 1. Time Range Filter
Choose the data period:
- **Last 7 Days** - Recent activity
- **Last 30 Days** - Monthly trends
- **All Time** - Complete history

### 2. Summary Cards
Four key metrics at the top:
- **Total Events** - Number of challenges played
- **Unique Users** - Active students
- **Top Subject** - Most popular subject
- **Top Level** - Most active level (JHS/SHS)

### 3. Subject Popularity Chart
Visual bars showing which subjects students use most.

**What to do:**
- **High usage** → Add more questions and improve quality
- **Low usage** → Promote the subject or review content quality

### 4. Level Distribution
Shows which education levels are most active.

**What to do:**
- Focus content creation on active levels
- Investigate why certain levels have low engagement

### 5. Top 15 Topics
The most frequently used topics across all subjects.

**What to do:**
- Prioritize quality improvements for top topics
- Use popular topics to attract more users
- Create advanced content for trending topics

### 6. Daily Usage Trend
Activity over the last 14 days.

**What to do:**
- Identify peak usage days
- Schedule new content releases during high-activity periods
- Investigate drops in activity

### 7. Insights & Recommendations
AI-generated suggestions based on your data:
- 🔥 Hot subjects to prioritize
- ⚠️ Underperforming areas to improve
- 👥 User engagement patterns
- 🎯 Focus areas for maximum impact

---

## 🛠️ Technical Details

### Data Source
Analytics data is stored in Firestore at:
```
subjects/__analytics/questionUsage/{docId}
```

### Data Structure
Each event contains:
```typescript
{
  level: string;           // Primary, JHS, SHS
  subject: string;         // Mathematics, English, Science, etc.
  difficulty: string;      // easy/medium/hard
  topics: string[];        // Topics covered
  questionCount: number;   // Questions generated
  userId: string;          // User ID (authenticated only)
  timestamp: number;       // Unix timestamp
}
```

### Tracking Implementation
Analytics are automatically tracked when users:
1. Start a Challenge Arena match
2. Play against bot opponents (Sarah)
3. Generate quiz questions

**Code Location:** `src/lib/analytics.ts`  
**Tracking Function:** `trackQuestionUsage()`

---

## 🔧 Maintenance & Upgrades

### Current Status
✅ **Working:** Analytics tracking is active and collecting data  
✅ **Dashboard:** Visual analytics page created at `/admin/analytics`  
✅ **Security:** Only authenticated users are tracked (guest users excluded)

### Recommended Upgrades

#### 1. **Add Lesson Completion Tracking**
Track when users complete lessons (not just challenges).

**Implementation:**
```typescript
// In src/lib/analytics.ts
export interface LessonCompletionEvent {
  lessonSlug: string;
  subject: string;
  level: string;
  timeSpent: number;
  userId: string;
  timestamp: number;
}

export function trackLessonCompletion(event: LessonCompletionEvent): void {
  // Similar to trackQuestionUsage
}
```

#### 2. **Add Virtual Lab Analytics**
Track which virtual labs are most used.

**Implementation:**
Add tracking to virtual lab components:
```typescript
trackLabUsage({
  labName: 'Ohms Law Lab',
  subject: 'Integrated Science',
  timeSpent: 300000, // 5 minutes
  userId: user.uid,
  timestamp: Date.now()
});
```

#### 3. **Add Export Functionality**
Allow admins to export analytics as CSV/Excel.

**Implementation:**
Add export button to analytics page:
```typescript
<Button onClick={exportAnalytics}>
  <Download className="w-4 h-4 mr-2" />
  Export CSV
</Button>
```

#### 4. **Add Real-Time Updates**
Use Firestore listeners for live analytics updates.

**Implementation:**
Replace `getDocs` with `onSnapshot`:
```typescript
import { onSnapshot } from 'firebase/firestore';

onSnapshot(analyticsRef, (snapshot) => {
  // Update analytics in real-time
});
```

#### 5. **Add User Journey Tracking**
Track the sequence of actions users take.

**Example Flow:**
```
Homepage → Select Subject → Start Challenge → Complete Quiz → View Results
```

This helps identify drop-off points.

---

## 🚨 Troubleshooting

### "No analytics data available yet"
**Cause:** No users have played challenges yet.  
**Solution:** Wait for users to start playing, or test with a few challenges yourself.

### "Analytics data looks incomplete"
**Cause:** Old challenges before analytics were implemented.  
**Solution:** Only challenges after the analytics system was added are tracked.

### "Can't access analytics page"
**Cause:** Not logged in as admin.  
**Solution:** Go to `/admin/dashboard` and sign in with an admin account.

### "Firestore permission denied"
**Cause:** Firestore rules don't allow analytics writes.  
**Solution:** Your rules already allow this:
```javascript
match /subjects/{subjectId}/{document=**} {
  allow write: if request.auth != null;
}
```

---

## 📊 Sample Insights

### Example 1: Subject Prioritization
```
Mathematics: 1,200 questions used
Science: 850 questions used
English: 450 questions used
```

**Action:** Add more English questions since demand is lower - might be a content gap.

### Example 2: Level Focus
```
JHS: 1,800 questions used
SHS: 600 questions used
```

**Action:** Invest in JHS content expansion since that's where most users are.

### Example 3: Topic Trends
```
Top Topics:
1. Algebra - 320 uses
2. Fractions - 285 uses
3. Geometry - 210 uses
```

**Action:** Create advanced Algebra content and more practice for Fractions.

---

## 🎯 Next Steps

1. **Check analytics weekly** to spot trends
2. **Export data monthly** for reports (after export feature is added)
3. **Act on insights** - add content where demand is high
4. **Monitor engagement** - track if changes improve usage
5. **Communicate wins** - share growth metrics with your team

---

## 📞 Support

If you need help with analytics:
- Check this guide first
- Review the code in `src/lib/analytics.ts`
- Test the dashboard at `/admin/analytics`
- Contact: +970589549030

---

## ✅ Quick Reference

| What | Where |
|------|-------|
| **Analytics Dashboard** | https://www.smartclass24.com/admin/analytics |
| **Admin Dashboard** | https://www.smartclass24.com/admin/dashboard |
| **Tracking Code** | `src/lib/analytics.ts` |
| **Analytics Page** | `src/app/admin/analytics/page.tsx` |
| **Firestore Collection** | `subjects/__analytics/questionUsage` |
| **Security Rules** | `firestore.rules` (already configured) |

---

**Last Updated:** January 23, 2026  
**Status:** ✅ Fully Functional
