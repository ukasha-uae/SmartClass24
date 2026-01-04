# 🔧 Firebase Authentication API Fix

## Error: `auth/requests-to-this-api-identitytoolkit-method-google.cloud.identitytoolkit.v1.authenticationservice.signinwithpassword-are-blocked`

This error occurs when your Firebase API key has restrictions that block the Identity Toolkit API.

## ✅ Solution: Update API Key Restrictions

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account
3. Select your Firebase project: **smartclass24-5e590**

### Step 2: Navigate to API Key Settings

1. Go to **APIs & Services** → **Credentials**
2. Find your API key (the one in your `.env.local` file)
3. Click on the API key to edit it

### Step 3: Update API Restrictions

1. Scroll down to **"API restrictions"** section
2. Select **"Restrict key"** (if not already selected)
3. **IMPORTANT:** Make sure these APIs are enabled:
   - ✅ **Identity Toolkit API** (REQUIRED for email/password auth)
   - ✅ **Firebase Authentication API**
   - ✅ **Cloud Firestore API**
   - ✅ **Firebase Storage API**

4. If "Identity Toolkit API" is missing:
   - Click **"Select APIs"**
   - Search for "Identity Toolkit API"
   - Check the box to enable it
   - Click **"Save"**

### Step 4: Verify Application Restrictions

1. Scroll to **"Application restrictions"** section
2. Make sure it's set to one of:
   - **"None"** (for testing) - OR
   - **"HTTP referrers"** with your domains:
     - `localhost:9002/*`
     - `http://localhost:9002/*`
     - `https://yourdomain.com/*`
     - `https://*.vercel.app/*` (if using Vercel)

### Step 5: Enable Identity Toolkit API (if not enabled)

1. Go to **APIs & Services** → **Library**
2. Search for **"Identity Toolkit API"**
3. Click on it and click **"Enable"**
4. Wait for it to enable (may take a minute)

### Step 6: Verify Firebase Authentication is Enabled

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: **smartclass24-5e590**
3. Go to **Authentication** → **Sign-in method**
4. Make sure **"Email/Password"** is enabled:
   - Click on "Email/Password"
   - Toggle **"Enable"** to ON
   - Click **"Save"**

## 🔄 Alternative: Use Unrestricted API Key (Development Only)

**⚠️ WARNING: Only for local development!**

If you need a quick fix for local testing:

1. In Google Cloud Console → **Credentials**
2. Create a new API key
3. Set **"API restrictions"** to **"Don't restrict key"**
4. Set **"Application restrictions"** to **"None"**
5. Update your `.env.local` with the new key
6. **Remember to restrict it properly before production!**

## 📝 Quick Checklist

- [ ] Identity Toolkit API is enabled in API restrictions
- [ ] Identity Toolkit API is enabled in Google Cloud Console
- [ ] Email/Password authentication is enabled in Firebase Console
- [ ] Application restrictions allow your domain (or set to None for testing)
- [ ] Restart your dev server after making changes

## 🚨 Still Not Working?

If the issue persists:

1. **Check Firebase Console** → Authentication → Sign-in method
   - Ensure Email/Password is enabled
   - Check if there are any error messages

2. **Verify API Key in `.env.local`**
   - Make sure `NEXT_PUBLIC_FIREBASE_API_KEY` is set correctly
   - No extra spaces or quotes

3. **Clear browser cache and localStorage**
   - Open DevTools → Application → Clear storage
   - Or use incognito mode

4. **Check Firebase Project Billing**
   - Some APIs require billing to be enabled
   - Go to Firebase Console → Usage and billing

## 📞 Need Help?

If you're still having issues, check:
- Firebase Console for any error messages
- Google Cloud Console → APIs & Services → Enabled APIs
- Browser console for additional error details


