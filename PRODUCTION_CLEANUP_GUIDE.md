# Production Cleanup & Leaderboard Guide

## 🎯 Overview
This guide explains how to clean up test users and enable the real leaderboard system with Sarah the Robot as an AI competitor.

## 📊 What Changed

### 1. **Real Leaderboard System**
- ✅ Leaderboard now fetches **real users from Firestore** instead of mock data
- ✅ Rankings based on actual XP earned by students
- ✅ Includes **Sarah the Robot** as an AI competitor to motivate students
- ✅ Shows user's current rank among all players
- ✅ Displays school information for each student

### 2. **Sarah the Robot 🤖**
Sarah is an AI competitor with the following stats:
- **XP**: 3,500 (challenging but beatable)
- **Level**: 18
- **Streak**: 42 days
- **Average Quiz Score**: 92%
- **Purpose**: Motivates students to work harder and provides a competitive benchmark

### 3. **User Count Accuracy**
- Clean up test/demo users to get accurate real user counts
- Removes anonymous users (anon-xxx)
- Removes sample data users (Sarah K., Michael A., etc.)

---

## 🧹 Step 1: Clean Up Test Users

### Prerequisites

**⚠️ SECURITY CRITICAL: Protect Your Service Account Key**

Your `serviceAccountKey.json` file has **admin access** to your entire Firebase project. Never commit it to Git!

1. **Download your Firebase service account key:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click ⚙️ (Settings) → Project Settings
   - Go to "Service Accounts" tab
   - Click "Generate New Private Key"
   - **Save as `serviceAccountKey.json` in your project root**
   - ✅ Verify it's in `.gitignore` (already added for you)

2. **Install firebase-admin:**
```powershell
npm install firebase-admin
```

**✅ Safe Implementation (Already Done):**
```javascript
// This is how the script safely loads your key:
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

**❌ NEVER Do This:**
```javascript
// DON'T hardcode credentials
// DON'T commit serviceAccountKey.json
// DON'T share it publicly
// DON'T use it in client-side code
```

### Run the Cleanup Script

**STEP 1: Preview what will be deleted**
```powershell
node cleanup-test-users.js
```

This will show you:
- 📊 How many real users exist
- 🗑️ Which test users will be deleted
- 👥 List of users that will remain

**STEP 2: Actually delete test users**
1. Open `cleanup-test-users.js`
2. Find the section with this comment:
   ```javascript
   // UNCOMMENT THE CODE BELOW TO ACTUALLY DELETE THE USERS
   ```
3. Uncomment the deletion code (remove the `//` from each line)
4. Run again:
   ```powershell
   node cleanup-test-users.js
   ```

### What Gets Deleted?
Users matching these patterns:
- ❌ Names containing: `test`, `demo`, `sample`, `fake`
- ❌ Anonymous users: `anon-xxxxx`
- ❌ Mock leaderboard users: `Sarah K.`, `Michael A.`, `Emma T.`, etc.

### What Gets Kept?
- ✅ Real student accounts with proper names
- ✅ Accounts with valid email addresses
- ✅ Any user that doesn't match test patterns

---

## 📈 Step 2: Verify Leaderboard

After cleanup, verify the leaderboard is working:

### 1. **Check Leaderboard Page**
Navigate to: `https://yourapp.com/leaderboard`

You should see:
- 🤖 Sarah the Robot (with purple/pink gradient background)
- 👥 Real students ranked by XP
- 🏆 Your current rank highlighted
- 📊 Your performance stats at top

### 2. **How Rankings Work**
- **Primary Sort**: Total XP (highest first)
- **Sarah's Position**: Dynamically ranks based on her XP vs real users
- **Your Rank**: Highlighted with blue border
- **Bot Indicator**: Sarah has a special gradient background and 🤖 emoji

### 3. **Expected Behavior**
- If no real users have > 3,500 XP: Sarah will be #1
- As students earn more XP, they can beat Sarah
- Leaderboard updates in real-time (refresh to see changes)
- Shows top 20 users by default

---

## 🎓 Step 3: Understand XP System

### How Students Earn XP
| Action | XP Earned |
|--------|-----------|
| Complete a lesson | +10 XP |
| Finish a quiz | +Score% XP (e.g., 85% = 85 XP) |
| Unlock achievement | Bonus XP (varies) |
| Study streak bonus | 2x XP multiplier |

### Levels
- **Level = Total XP ÷ 100**
- Example: 1,500 XP = Level 15
- Sarah is Level 18 (3,500 XP)

### Beat Sarah Challenge
Students need to:
1. Complete ~35 lessons (350 XP)
2. Score high on quizzes (~3,150 XP from quizzes)
3. Maintain streaks for bonus XP
4. Total: ~3,500+ XP to beat Sarah

This represents roughly **50-60 lessons** with good quiz scores.

---

## 📱 Step 4: Firebase Security Rules

Ensure your `firestore.rules` allows reading leaderboard data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students collection - read access for leaderboards
    match /students/{userId} {
      // Anyone can read public leaderboard data
      allow read: if true;
      
      // Only owner can write their own data
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Deploy rules:
```powershell
firebase deploy --only firestore:rules
```

---

## 🔄 Step 5: Deploy to Production

After cleanup and verification:

```powershell
# Stage changes
git add .

# Commit
git commit -m "Enable real leaderboard with Sarah the Robot AI competitor"

# Push to production
git push
```

Your hosting platform (Vercel, Firebase Hosting, etc.) will auto-deploy.

---

## 📊 Monitoring Real Users

### Firebase Console
1. Go to Firestore Database
2. Navigate to `students` collection
3. Check document count = real users
4. Sort by `totalXP` (descending) to see top students

### Admin Dashboard
Navigate to `/admin/dashboard` to see:
- Total registered users
- User activity
- Quiz completion rates
- Top performers

---

## 🎯 Best Practices

### 1. **Regular Backups**
```powershell
# Export Firestore data regularly
gcloud firestore export gs://your-bucket-name/backups
```

### 2. **Monitor Sarah's XP**
- Start at 3,500 XP (Level 18)
- Increase as students improve (keep her competitive)
- Update in `src/lib/user-progress.ts`:
  ```typescript
  export const SARAH_THE_ROBOT = {
    xp: 4000, // Increase this
    level: 20, // Adjust accordingly
    // ...
  };
  ```

### 3. **Prevent Gaming the System**
- XP limits per day (implement rate limiting)
- Validate quiz scores server-side
- Monitor for suspicious activity

---

## 🐛 Troubleshooting

### Leaderboard Not Showing Users
**Problem**: Only shows Sarah and "You"

**Solution**:
1. Check Firestore rules allow read access
2. Verify users have `totalXP` field in their documents
3. Check browser console for errors
4. Ensure Firebase SDK is initialized

### Sarah Not Appearing
**Problem**: Robot not in leaderboard

**Solution**:
1. Check `src/lib/user-progress.ts` has `SARAH_THE_ROBOT` export
2. Verify leaderboard query includes Sarah (line with `users.push(SARAH_THE_ROBOT)`)
3. Clear browser cache and reload

### Test Users Still Showing
**Problem**: Cleanup didn't work

**Solution**:
1. Verify you uncommented the deletion code
2. Check Firebase Console → Firestore → students collection manually
3. Delete problematic documents manually if needed
4. Re-run cleanup script

### XP Not Updating
**Problem**: User XP stuck

**Solution**:
1. Check `src/lib/user-progress.ts` → `recordLessonCompletion()` function
2. Verify Firestore write permissions
3. Check browser console for errors
4. Ensure user is authenticated

---

## 📞 Support

If you encounter issues:
1. Check Firebase Console → Firestore for data
2. Review browser console for errors
3. Test leaderboard locally first (`npm run dev`)
4. Contact: +970589549030

---

## ✅ Success Checklist

- [ ] Service account key downloaded and placed in project root
- [ ] Ran cleanup script in preview mode
- [ ] Uncommented deletion code and ran cleanup
- [ ] Verified test users removed in Firebase Console
- [ ] Leaderboard page loads successfully
- [ ] Sarah the Robot appears in rankings
- [ ] Real users appear in leaderboard
- [ ] Your rank highlighted correctly
- [ ] XP system working (complete lesson, check XP increase)
- [ ] Firebase rules deployed
- [ ] Changes pushed to production
- [ ] Live app tested and verified

---

## 🎉 Result

After completing this guide:
- ✅ Only real students in database
- ✅ Accurate user counts
- ✅ Competitive leaderboard with Sarah AI
- ✅ Students motivated to earn more XP
- ✅ Production-ready system

**Students can now see their real rank and compete with Sarah the Robot!** 🏆🤖
