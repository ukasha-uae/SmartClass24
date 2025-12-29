# 🔧 Password Reset Email Troubleshooting

## Issue: Password Reset Email Not Arriving

---

## ✅ Quick Checks

### 1. Check Firebase Console - Authentication Settings

1. Go to **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**
2. Make sure your domain is listed:
   - `localhost` (for development)
   - Your production domain (when deployed)

### 2. Check Email Template Configuration

1. Go to **Firebase Console** → **Authentication** → **Templates**
2. Click on **"Password reset"** template
3. Verify:
   - **Subject:** Should be something like "Reset your password"
   - **Action URL:** Should point to your app or Firebase default
   - **Template is enabled:** Should be checked

### 3. Check Spam/Junk Folder

- Password reset emails often go to spam
- Check your email's spam/junk folder
- Wait 1-2 minutes (emails can be delayed)

### 4. Verify Email Address

- Make sure the email address exists in Firebase
- Go to **Authentication** → **Users** and verify the email is there

---

## 🔧 Common Issues & Solutions

### Issue 1: Action URL Not Configured

**Problem:** Firebase doesn't know where to redirect after password reset.

**Solution:**
1. Go to **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**
2. Add your domain if not present
3. Go to **Authentication** → **Templates** → **Password reset**
4. Set **Action URL** to:
   - Development: `http://localhost:9002` (or your dev URL)
   - Production: `https://yourdomain.com` (your production URL)

### Issue 2: Email Provider Not Configured

**Problem:** Firebase needs to send emails but provider isn't set up.

**Solution:**
1. Go to **Firebase Console** → **Authentication** → **Settings** → **Users**
2. Check if email provider is enabled
3. If using custom domain, configure SMTP settings

### Issue 3: Email Going to Spam

**Problem:** Email is sent but filtered as spam.

**Solution:**
- Check spam/junk folder
- Add Firebase email to contacts
- Check email provider's spam settings

### Issue 4: Too Many Requests

**Problem:** Firebase rate limits password reset emails.

**Solution:**
- Wait 5-10 minutes between requests
- Don't request multiple resets in quick succession

---

## 🧪 Testing Steps

### Step 1: Test Email Sending

1. Open browser console
2. Try password reset
3. Check for any errors in console
4. Check Firebase Console → **Authentication** → **Users** → **Recent activity**

### Step 2: Verify Email in Firebase

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Find the user's email
3. Check if there are any errors or restrictions

### Step 3: Test with Different Email

1. Try with a different email provider (Gmail, Outlook, etc.)
2. Some email providers block Firebase emails
3. Try with a test email you control

---

## 🔍 Debugging in Code

### Check if Email is Actually Being Sent

Add logging to see if the function is being called:

```typescript
// In handleForgotPassword function
console.log('Sending password reset to:', email);
await sendPasswordReset(auth, email);
console.log('Password reset email sent successfully');
```

### Check for Errors

The error handling should catch and display errors. Check:
- Browser console for errors
- Network tab for failed requests
- Firebase Console for authentication errors

---

## ⚙️ Firebase Configuration

### Required Settings in Firebase Console

1. **Authentication** → **Sign-in method** → **Email/Password** → **Enabled** ✅
2. **Authentication** → **Settings** → **Authorized domains** → Your domain listed ✅
3. **Authentication** → **Templates** → **Password reset** → Template enabled ✅
4. **Authentication** → **Templates** → **Password reset** → Action URL configured ✅

### Action URL Format

For development:
```
http://localhost:9002
```

For production:
```
https://yourdomain.com
```

Or use Firebase default (recommended for V1):
```
Leave as default - Firebase will handle redirect
```

---

## 🚀 Quick Fix: Use Firebase Default Action URL

If you're having issues, use Firebase's default action URL:

1. Go to **Firebase Console** → **Authentication** → **Templates** → **Password reset**
2. **Action URL:** Leave as default or set to:
   ```
   https://smartclass24-5e590.firebaseapp.com/__/auth/action
   ```
3. This will redirect to Firebase's default reset page
4. User can reset password there, then return to your app

---

## 📧 Email Delivery Checklist

- [ ] Email/Password authentication enabled
- [ ] Authorized domains configured
- [ ] Password reset template enabled
- [ ] Action URL configured (or using default)
- [ ] Email address exists in Firebase
- [ ] Checked spam/junk folder
- [ ] Waited 1-2 minutes for email
- [ ] Tried with different email provider
- [ ] No rate limiting errors
- [ ] Firebase project has Blaze plan (for production)

---

## 🆘 Still Not Working?

### Alternative: Manual Password Reset (Admin)

If emails still don't work, you can manually reset passwords:

1. Go to **Firebase Console** → **Authentication** → **Users**
2. Find the user
3. Click **"Reset password"** button
4. Firebase will send reset email

### Contact Firebase Support

If nothing works:
1. Check Firebase status page
2. Contact Firebase support
3. Check Firebase documentation for latest changes

---

## ✅ Expected Behavior

When password reset works correctly:

1. User clicks "Forgot password?"
2. Enters email
3. Clicks "Send Reset Link"
4. Sees success message: "Password reset email sent!"
5. Receives email within 1-2 minutes
6. Email contains link to reset password
7. Clicking link opens password reset page
8. User sets new password
9. User can sign in with new password

---

**Last Updated:** [Current Date]

