# 🔐 API Key Regeneration Guide - URGENT

## ⚠️ Critical Security Issue

Your Firebase API key was exposed in a public GitHub repository. Google Cloud Platform has detected this and sent you a security warning.

**Status:** ✅ Credentials removed from current files and pushed to GitHub  
**Action Required:** ⚠️ **You MUST regenerate the API key immediately**

---

## 🚨 Immediate Actions Required

### Step 1: Regenerate the Compromised API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with `ukasha.uae@gmail.com`
   - Select project: **smartclass24-5e590**

2. **Navigate to Credentials**
   - Go to **APIs & Services** → **Credentials**
   - Find the API key: `AIzaSyBmAUER_YiYQZfZBUEW9nOO-y26FGEgxTs`
   - Click on the key to edit it

3. **Regenerate the Key**
   - Click **"Regenerate Key"** button
   - Confirm the regeneration
   - **Copy the new API key immediately** (you won't see it again)

4. **Add API Key Restrictions (Recommended)**
   - Under **"API restrictions"**, select **"Restrict key"**
   - Choose only the APIs you need:
     - Firebase Authentication API
     - Cloud Firestore API
     - Firebase Storage API
   - Under **"Application restrictions"**, select **"HTTP referrers"**
   - Add your domains:
     - `localhost:9002` (for development)
     - `https://yourdomain.com/*` (for production)
     - `https://*.vercel.app/*` (if using Vercel)

---

### Step 2: Update Local Environment

1. **Update `.env.local` file** (in your project root)

   Replace the old API key with the new one:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_NEW_API_KEY_HERE
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smartclass24-5e590.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=smartclass24-5e590
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smartclass24-5e590.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=409244053398
   NEXT_PUBLIC_FIREBASE_APP_ID=1:409244053398:web:e24f70df607ec16c70b7b7
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-BLRS8ZPM24
   ```

2. **Test Locally**
   ```bash
   npm run dev
   ```
   - Verify the app still works
   - Test authentication (sign up, sign in)
   - Check Firebase Console for any errors

---

### Step 3: Update Production Environment Variables

If you've already deployed to production (Vercel, Netlify, etc.):

1. **Vercel:**
   - Go to your project → **Settings** → **Environment Variables**
   - Update `NEXT_PUBLIC_FIREBASE_API_KEY` with the new key
   - Redeploy the application

2. **Netlify:**
   - Go to **Site settings** → **Environment variables**
   - Update `NEXT_PUBLIC_FIREBASE_API_KEY` with the new key
   - Trigger a new deployment

3. **Other Platforms:**
   - Update the environment variable in your hosting platform's dashboard
   - Redeploy the application

---

### Step 4: Verify Everything Works

1. **Local Testing:**
   - ✅ App loads without errors
   - ✅ Authentication works (sign up, sign in)
   - ✅ Firestore operations work
   - ✅ No console errors

2. **Production Testing:**
   - ✅ App loads correctly
   - ✅ Authentication works
   - ✅ All features function normally

---

## 📝 Important Notes

### Git History

⚠️ **Note:** The old API key is still in your Git history (in previous commits). While we've removed it from current files, it can still be found in commit history.

**Options:**
1. **Acceptable for most cases:** Just regenerate the key (recommended). The old key will be invalid, so it doesn't matter if it's in history.
2. **For maximum security:** Use `git filter-branch` or BFG Repo-Cleaner to remove it from history (advanced, requires force push).

**Recommendation:** Regenerating the key is sufficient. The old key will be disabled, so even if someone finds it in history, it won't work.

---

### API Key Restrictions

After regenerating, **strongly recommend** adding restrictions:

1. **API Restrictions:** Limit which APIs the key can access
2. **HTTP Referrer Restrictions:** Limit which domains can use the key
3. **IP Restrictions (if applicable):** Limit to specific IP addresses

This adds an extra layer of security even though Firebase Security Rules are your primary protection.

---

## ✅ Security Checklist

- [ ] Old API key regenerated in Google Cloud Console
- [ ] New API key copied and saved securely
- [ ] API key restrictions added (recommended)
- [ ] `.env.local` updated with new key
- [ ] Local testing successful
- [ ] Production environment variables updated
- [ ] Production deployment tested
- [ ] Firebase Console monitored for unusual activity

---

## 🆘 If Something Goes Wrong

### Issue: App stops working after key regeneration

**Solution:**
1. Double-check `.env.local` has the correct new key
2. Restart the development server
3. Clear browser cache
4. Check Firebase Console for errors

### Issue: Authentication fails

**Solution:**
1. Verify the new API key is correct
2. Check authorized domains in Firebase Console → Authentication → Settings
3. Ensure API restrictions allow Firebase Authentication API

### Issue: Firestore/Storage access denied

**Solution:**
1. Verify API restrictions include Cloud Firestore API and Firebase Storage API
2. Check Firestore/Storage security rules are still published
3. Verify user authentication is working

---

## 📞 Next Steps

1. **Immediately:** Regenerate the API key (Step 1)
2. **Today:** Update local and production environments (Steps 2-3)
3. **This Week:** Monitor Firebase Console for any unusual activity
4. **Ongoing:** Review security best practices regularly

---

**Last Updated:** After security incident  
**Status:** ⚠️ Action Required - Regenerate API Key


