# Admin Dashboard Setup Guide

## Overview
The Admin Dashboard at `/admin/dashboard` is now **fully secured** with email-based authentication. Only authorized users can access it.

## 🔐 Security Features Implemented

### 1. **Email-Based Authentication**
- Only users with emails in the `ADMIN_EMAILS` array can access the dashboard
- Authentication check happens on page load
- Unauthorized users are redirected to the homepage with an error message

### 2. **Firestore User Loading**
- Dashboard now loads **all registered users from Firestore** (the `students` collection)
- Also merges with localStorage data for complete coverage
- **FIX**: Previously only showed users in localStorage, now shows ALL Firebase Auth users

### 3. **Route Protection**
- Unauthenticated users redirected to `/profile` (sign-in page)
- Non-admin users redirected to `/` (homepage)
- Loading state prevents unauthorized access during auth check

## 📋 Setup Instructions

### Step 1: Add Your Admin Email

1. **Open `src/lib/admin-config.ts`**
2. **Replace the placeholder email** with your actual admin email:

```typescript
export const ADMIN_EMAILS = [
  'your-actual-email@example.com', // Replace this!
  // Add more admins as needed:
  // 'admin2@smartclass24.com',
];
```

**Example:**
```typescript
export const ADMIN_EMAILS = [
  'ukasha@smartclass24.com',
  'support@smartclass24.com',
];
```

### Step 2: Sign In with Admin Account

1. **Go to the app** (http://localhost:9002 or your deployed URL)
2. **Sign in or create an account** using the email you added in Step 1
3. **Complete your profile** if prompted (save your student profile)

### Step 3: Access the Dashboard

1. **Navigate to** `/admin/dashboard`
2. **You should see:**
   - Loading screen: "Verifying Admin Access..."
   - Then the full admin dashboard with all users

**If you see "Access Denied":**
- Double-check the email in `admin-config.ts` matches your account email EXACTLY
- Make sure you're signed in with that account
- Check the browser console for error messages

## 🚀 Accessing the Dashboard

### Direct URL
```
http://localhost:9002/admin/dashboard
```

### Or Create a Link (Optional)
You can add a link in the header or profile page for easy access:

```tsx
{isAdmin(user?.email) && (
  <Link href="/admin/dashboard">
    <Button variant="outline">
      <Shield className="h-4 w-4 mr-2" />
      Admin Dashboard
    </Button>
  </Link>
)}
```

## ✅ What the Dashboard Can Do

### User Management
- **Search users** by ID, email, or name
- **View user profiles** with full details
- **See subscription status** (Free, Premium, Full Bundle)

### Coin Management
- **Add custom coin amounts** to any user
- **Grant coin packages** (50, 100, 200, 500 coins)
- **Track total coins** distributed

### Subscription Management
- **Grant Premium subscriptions:**
  - Challenge Arena Premium (GHS 15/month)
  - Virtual Lab Premium (GHS 10/month)
  - Full Bundle (GHS 20/month - both features)
- **Choose duration:** Monthly or Annual
- **Cancel subscriptions** for any user
- **Quick grant** to your own account for testing

### Statistics
- **Total users** registered
- **Free vs Premium users** breakdown
- **Full Bundle subscribers** count
- **Total coins** in circulation
- **User lists** by subscription tier

## 🔍 Troubleshooting

### "Not all users are showing"
**FIXED!** The dashboard now:
1. Loads all users from Firestore `students` collection
2. Merges with localStorage data
3. Shows ALL registered Firebase Auth users who have created profiles

### "I can't access the dashboard"
1. **Check your email** is in `ADMIN_EMAILS` array
2. **Verify you're signed in** with that email
3. **Check the Firestore** - your profile should exist at `students/{uid}` with your email
4. **Look at browser console** for error messages

### "User not found when searching"
The search now checks:
- User ID (Firebase UID)
- Email address
- Student name
- Searches both Firestore AND localStorage

If still not found:
- The user may not have completed their profile setup
- Check Firebase Auth users vs Firestore `students` collection

### "Changes aren't persisting"
- Coin additions are saved to localStorage (will migrate to Firestore soon)
- Subscriptions are saved to both localStorage and Firestore
- Refresh the page to see updated data

## 🔒 Security Best Practices

1. **Keep admin emails minimal** - only add trusted administrators
2. **Use strong passwords** for admin accounts
3. **Enable 2FA** on admin Firebase accounts (in Firebase Console)
4. **Never share** your admin credentials
5. **Review Firestore rules** to ensure data security:

```javascript
// firestore.rules - Already configured
match /students/{studentId} {
  allow read: if request.auth != null;
  allow create, update: if request.auth != null && request.auth.uid == studentId;
  allow delete: if false;
}
```

## 📊 User Data Sources

The dashboard now loads users from:

1. **Firestore `students` collection** (PRIMARY)
   - All users who have completed profile setup
   - Contains email, name, school, etc.
   
2. **localStorage `challengePlayers`** (FALLBACK)
   - Users who only used Challenge Arena
   - May not have full profiles

**Data merge priority:** Firestore > localStorage

## 🎯 Next Steps

1. **Add your email** to `admin-config.ts`
2. **Sign in** with that account
3. **Test the dashboard** - verify you can see all users
4. **Grant yourself Full Bundle** for testing premium features
5. **Commit and deploy** the changes

## 📝 Migration Notes

**Changes in this update:**
- ✅ Added email-based admin authentication
- ✅ Fixed user loading to include ALL Firestore users
- ✅ Added loading states and better error handling
- ✅ Improved security with route protection
- ✅ Added admin badge and visual feedback

**Previous issues fixed:**
- ❌ No authentication - anyone could access
- ❌ Only showed localStorage users (missed Firestore users)
- ❌ No security checks or route protection

## 🚨 Deployment Checklist

Before deploying to production:

- [ ] Update `ADMIN_EMAILS` with real admin email(s)
- [ ] Test admin access with correct email
- [ ] Test rejection with non-admin email
- [ ] Verify all users show in dashboard
- [ ] Test granting/revoking subscriptions
- [ ] Test coin management
- [ ] Review Firestore security rules
- [ ] Enable Firebase Auth 2FA for admin accounts

---

**Need help?** Check the browser console for detailed error messages or review `src/app/admin/dashboard/page.tsx` for implementation details.
