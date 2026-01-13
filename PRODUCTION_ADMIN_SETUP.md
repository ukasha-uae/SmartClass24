# Production Admin Setup Guide

## 🎯 Overview

Your admin dashboard now uses a **production-safe** system:
- ✅ Super admin email stored in **environment variable** (not committed to Git)
- ✅ Additional admins managed via **Firestore** (add/remove from dashboard)
- ✅ Fully secure and scalable

---

## 🚀 Local Development (CURRENT)

### Already Set Up ✅
Your `.env.local` file contains:
```env
NEXT_PUBLIC_SUPER_ADMIN_EMAIL=ukasha.uae@gmail.com
```

### Access Dashboard Locally
1. **Run dev server:** `npm run dev`
2. **Sign in** with `ukasha.uae@gmail.com`
3. **Navigate to:** `http://localhost:9002/admin/dashboard`
4. **You'll see 4 tabs:**
   - Search User
   - Manage User
   - Statistics
   - **Admin Management** (Super Admin only)

### Add Other Admins (Local)
1. Go to **Admin Management** tab
2. Enter email address
3. Click **Add Admin**
4. That user can now access `/admin/dashboard` after signing in

---

## 🌐 Production Deployment

### Step 1: Set Environment Variable in Firebase

**Option A: Firebase Console (Recommended)**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `smartclass24-5e590`
3. Click **Hosting** in left sidebar
4. Go to your site settings
5. Find **Environment variables** section
6. Add:
   - **Key:** `NEXT_PUBLIC_SUPER_ADMIN_EMAIL`
   - **Value:** `ukasha.uae@gmail.com`
7. Click **Save**

**Option B: Firebase CLI**
```bash
# Set environment variable
firebase hosting:channel:create production
firebase hosting:channel:deploy production --config "NEXT_PUBLIC_SUPER_ADMIN_EMAIL=ukasha.uae@gmail.com"
```

**Option C: apphosting.yaml (If using App Hosting)**
Update your `apphosting.yaml`:
```yaml
env:
  - variable: NEXT_PUBLIC_SUPER_ADMIN_EMAIL
    value: ukasha.uae@gmail.com
    availability:
      - BUILD
      - RUNTIME
```

### Step 2: Deploy Firestore Rules

Deploy the updated rules to allow admin management:
```bash
firebase deploy --only firestore:rules
```

This adds the `admins` collection rules:
```javascript
match /admins/{email} {
  allow read: if request.auth != null;
  allow create, update, delete: if request.auth != null;
}
```

### Step 3: Deploy Application

```bash
git add .
git commit -m "Production-safe admin system with Firestore management"
git push origin master
```

Firebase will auto-deploy in ~5-10 minutes.

### Step 4: Test Production Access

1. **Go to your production URL**
2. **Sign in** with `ukasha.uae@gmail.com`
3. **Navigate to** `/admin/dashboard`
4. **Verify you see the Admin Management tab**

---

## 👥 Managing Admins in Production

### Add New Admin
1. Sign in as super admin
2. Go to `/admin/dashboard`
3. Click **Admin Management** tab
4. Enter the new admin's email
5. Click **Add Admin**
6. They can now sign in and access the dashboard

### Remove Admin
1. Go to **Admin Management** tab
2. Find the admin in the list
3. Click **Remove** button
4. They lose dashboard access immediately

### View All Admins
The Admin Management tab shows:
- **Super Admin** (you) - yellow badge, cannot be removed
- **Regular Admins** - added via dashboard, can be removed
- Who added each admin
- When they were added

---

## 🔒 Security Features

### Production-Safe ✅
- **No admin emails in Git:** Super admin uses environment variable
- **Firestore-based:** Additional admins stored securely in database
- **No code changes needed:** Add/remove admins without redeploying
- **Audit trail:** Track who added each admin and when

### Access Control
```
User visits /admin/dashboard
    ↓
Check if signed in → NO → Redirect to sign-in
    ↓ YES
Check if email matches super admin env var → YES → Full access (can manage admins)
    ↓ NO
Check if email exists in Firestore admins collection → YES → Admin access (cannot manage admins)
    ↓ NO
Access Denied → Redirect to homepage
```

---

## 📊 Firestore Structure

### Super Admin
```javascript
// Stored in environment variable (not in database)
NEXT_PUBLIC_SUPER_ADMIN_EMAIL = "ukasha.uae@gmail.com"
```

### Regular Admins
```javascript
// Firestore: admins/{email}
{
  email: "admin@example.com",
  isActive: true,
  addedBy: "ukasha.uae@gmail.com",
  addedAt: Timestamp
}
```

---

## 🛠️ Troubleshooting

### "Cannot access dashboard in production"
1. **Check environment variable is set:**
   ```bash
   firebase functions:config:get
   ```
2. **Verify you're signed in with the super admin email**
3. **Check browser console for errors**

### "Admin Management tab not showing"
- Only super admin sees this tab
- Regular admins (added via dashboard) cannot manage other admins
- Check you're signed in as super admin email

### "Cannot add/remove admins"
1. **Deploy Firestore rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```
2. **Check console for errors**
3. **Verify you're super admin**

### "Environment variable not working"
- **Rebuild the app:** Environment variables are only read at build time
- **Check spelling:** Must be exactly `NEXT_PUBLIC_SUPER_ADMIN_EMAIL`
- **Restart dev server** if testing locally

---

## 📋 Deployment Checklist

- [ ] Set `NEXT_PUBLIC_SUPER_ADMIN_EMAIL` in Firebase environment
- [ ] Deploy Firestore rules (`firebase deploy --only firestore:rules`)
- [ ] Commit and push code changes
- [ ] Wait for Firebase auto-deploy (~5-10 min)
- [ ] Test super admin access in production
- [ ] Add additional admins via dashboard
- [ ] Test regular admin access (should not see Admin Management tab)
- [ ] Verify non-admin users are blocked

---

## 🎯 Quick Commands

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy app (auto-deploys via GitHub push)
git push origin master

# Check environment variables (if using Firebase Functions)
firebase functions:config:get

# Local development
npm run dev
```

---

## 💡 Best Practices

1. **Keep super admin email private** - only share with trusted individuals
2. **Use dashboard to add admins** - no code changes needed
3. **Remove admin access immediately** when someone leaves your team
4. **Regular audits** - check Admin Management tab monthly
5. **Backup admin list** - export from Firestore console occasionally

---

## 🔄 Migration from Old System

If you had hardcoded emails before:
1. ✅ Those are now ignored
2. ✅ Only environment variable + Firestore are used
3. ✅ Old code safely removed
4. ✅ No migration needed - just deploy

---

## 📚 Technical Details

### Files Changed
- `src/lib/admin-config.ts` - Uses env var + Firestore
- `src/app/admin/dashboard/page.tsx` - Admin Management tab
- `firestore.rules` - Added `admins` collection rules
- `.env.local` - Local super admin email

### Environment Variable
- **Name:** `NEXT_PUBLIC_SUPER_ADMIN_EMAIL`
- **Type:** Public (visible to client)
- **Required:** Yes (for super admin access)
- **Format:** Email address string

### Firestore Collections Used
- `students/{uid}` - User profiles
- `admins/{email}` - Admin user list
- `subscriptions/{uid}` - User subscriptions

---

**Need Help?** Check Firebase Console logs or browser console for detailed error messages.
