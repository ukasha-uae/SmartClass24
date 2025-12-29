# 🧪 Firebase Testing Guide - SmartClass24

**Project:** smartclass24-5e590  
**Status:** ✅ Ready for Testing

---

## ✅ Setup Complete

- ✅ Firebase Configuration Updated
- ✅ Authentication Enabled (Email/Password, Anonymous, Google)
- ✅ Firestore Database Created (Test mode with custom rules)
- ✅ Storage Bucket Created
- ✅ Security Rules Applied
- ✅ Blaze Plan Linked

---

## 🚀 Quick Test Checklist

### 1. Start Development Server

```bash
npm run dev
```

Open: http://localhost:9002

---

### 2. Test Authentication

#### Test Anonymous Sign-In (Automatic)
1. Open the app in a new incognito/private window
2. The app should automatically sign you in anonymously
3. Check browser console for any errors
4. Verify you can navigate the app

#### Test Email/Password Sign-Up
1. Click "Sign In" in the header
2. Click "Sign up" tab
3. Enter test email: `test@example.com`
4. Enter password: `Test123456!`
5. Click "Sign up"
6. **Expected:** Account created, signed in, profile setup dialog appears

#### Test Email/Password Sign-In
1. Sign out (if signed in)
2. Click "Sign In" in header
3. Enter credentials from sign-up
4. Click "Sign in"
5. **Expected:** Successfully signed in

#### Test Profile Creation
1. After sign-up, profile setup dialog should appear
2. Fill in:
   - Student Name: `Test Student`
   - Class: `SHS 1`
   - School Name: `Test School`
   - School Address: `Test Address`
   - Parent Phone: `+233123456789`
3. Click "Save"
4. **Expected:** Profile saved to Firestore

**Verify in Firebase Console:**
- Go to Firestore Database
- Check `students` collection
- Should see document with your user ID
- Verify all fields are saved correctly

---

### 3. Test Firestore Operations

#### Test Quiz Attempt Saving
1. Navigate to any lesson (e.g., `/subjects/shs/core-mathematics/shs1-types-of-numbers/shs1-types-of-numbers`)
2. Complete the lesson quiz
3. Submit answers
4. **Expected:** Quiz attempt saved to Firestore

**Verify in Firebase Console:**
- Go to Firestore Database
- Check `users/{userId}/quizAttempts` collection
- Should see quiz attempt document
- Verify quiz data is saved

#### Test Progress Tracking
1. Complete multiple quizzes
2. Check your profile page
3. **Expected:** Progress is tracked and displayed

**Verify in Firebase Console:**
- Check `students/{userId}` document
- Verify progress fields are updated

---

### 4. Test Storage (if used)

If your app uploads files (avatars, notes, etc.):

1. Upload a file through the app
2. **Expected:** File uploaded successfully

**Verify in Firebase Console:**
- Go to Storage
- Check files are uploaded
- Verify security rules allow access

---

## 🔍 Verification Steps

### Check Firebase Console

1. **Authentication → Users**
   - Should see your test user
   - Verify email is correct
   - Check sign-in methods

2. **Firestore Database**
   - Check `students` collection (profiles)
   - Check `users/{userId}/quizAttempts` (quiz data)
   - Verify data structure matches expectations

3. **Storage**
   - Check if any files are uploaded
   - Verify bucket is accessible

4. **Usage & Billing**
   - Monitor usage (should be minimal for testing)
   - Verify Blaze plan is active

---

## ⚠️ Common Issues & Solutions

### Issue: "Firebase: Error (auth/unauthorized-domain)"
**Solution:** 
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add `localhost` if not present
- Add your production domain when ready

### Issue: "Firestore: Missing or insufficient permissions"
**Solution:**
- Check Firestore Rules are published
- Verify rules match your data structure
- Check user is authenticated (`request.auth != null`)

### Issue: "Storage: User does not have permission"
**Solution:**
- Check Storage Rules are published
- Verify rules allow authenticated users
- Check bucket name matches config

### Issue: Anonymous sign-in not working
**Solution:**
- Verify Anonymous provider is enabled in Authentication
- Check browser console for errors
- Try clearing browser cache

---

## 📊 Expected Behavior

### On First Visit (Anonymous)
1. App loads
2. Automatically signs in anonymously
3. User can browse content
4. Progress saved locally (localStorage)
5. Can upgrade to email account later

### After Sign-Up
1. Account created
2. Anonymous session linked (if applicable)
3. Local progress migrated to Firestore
4. Profile setup dialog appears
5. Full access to all features

### After Sign-In
1. User authenticated
2. Profile loaded from Firestore
3. Progress loaded from Firestore
4. Full access to all features

---

## 🧹 Cleanup After Testing

### Remove Test Data (Optional)
1. Go to Firebase Console
2. **Authentication → Users:** Delete test users
3. **Firestore:** Delete test documents
4. **Storage:** Delete test files

**Or keep test data for reference during development.**

---

## ✅ Testing Checklist

- [ ] App loads without errors
- [ ] Anonymous sign-in works automatically
- [ ] Email/password sign-up works
- [ ] Email/password sign-in works
- [ ] Profile creation works
- [ ] Profile saved to Firestore correctly
- [ ] Quiz attempts save to Firestore
- [ ] Progress tracking works
- [ ] No console errors
- [ ] No Firebase errors in console
- [ ] Security rules working correctly
- [ ] Storage works (if applicable)

---

## 🚀 Next Steps After Testing

1. **Fix any issues found**
2. **Update production environment variables** (when ready)
3. **Deploy to staging** (test again)
4. **Deploy to production**
5. **Monitor Firebase Console** for errors

---

## 📝 Notes

- **Firestore in Test Mode:** This is fine since you have custom security rules. Test mode just means it's easier to develop, but your rules still apply.

- **Blaze Plan:** You're on the paid plan, so you have access to all features. Monitor usage to avoid unexpected costs.

- **Region:** Europe-West2 (London) - Good for users in Europe/Africa. Consider latency for your target users.

- **Old Project:** Keep `smartjhs-a20be` as backup for at least 1 month.

---

**Ready to test!** 🎉

Run `npm run dev` and start testing the authentication flow.

