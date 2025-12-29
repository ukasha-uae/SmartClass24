# 🔥 Firebase Project Migration Guide

**Migrating from:** `ukashayussif4@gmail.com` (smartjhs-a20be)  
**Migrating to:** `ukasha.uae@gmail.com` (smartclass24-5e590)  
**Status:** ✅ Migration Complete - Ready for Testing

---

## 📋 Pre-Migration Checklist

### Step 1: Create New Firebase Project

1. **Sign in to Firebase Console**
   - Go to https://console.firebase.google.com/
   - Sign in with `ukasha.uae@gmail.com`

2. **Create New Project**
   - Click "Add project" or "Create a project"
   - Project name: `smartclass24` ✅
   - Enable Google Analytics (optional but recommended)
   - Click "Create project"
   - **Note:** Firebase will generate a Project ID (e.g., `smartclass24-xxxxx`). You can customize this during creation if you want it to match exactly, or use the auto-generated one.

3. **Note Your Project Details**
   - Project ID: `_________________` (will be generated)
   - Project number: `_________________`

---

### Step 2: Enable Required Services

#### Authentication
1. Go to **Authentication** → **Get started**
2. Enable **Email/Password** provider
3. Enable **Anonymous** provider (for instant access)
4. Configure authorized domains (add your domain)

#### Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Choose **Production mode** (we'll update rules later)
3. Select a location (choose closest to your users, e.g., `us-central1` or `europe-west`)
4. Click "Enable"

#### Storage
1. Go to **Storage** → **Get started**
2. Start in **Production mode**
3. Use same location as Firestore
4. Click "Done"

#### Hosting (Optional for V1)
1. Go to **Hosting** → **Get started**
2. Follow setup instructions if you plan to use Firebase Hosting

---

### Step 3: Get New Firebase Configuration

1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to **Your apps** section
3. Click **Web** icon (`</>`) to add a web app
4. Register app name: `SmartClass24 Web`
5. Copy the configuration object

**New Firebase Config:**
```javascript
{
  apiKey: "YOUR_NEW_API_KEY",
  authDomain: "YOUR_NEW_PROJECT_ID.firebaseapp.com",  // e.g., smartclass24-xxxxx.firebaseapp.com
  projectId: "YOUR_NEW_PROJECT_ID",                  // e.g., smartclass24-xxxxx
  storageBucket: "YOUR_NEW_PROJECT_ID.appspot.com",  // e.g., smartclass24-xxxxx.appspot.com
  messagingSenderId: "YOUR_NEW_MESSAGING_SENDER_ID",
  appId: "YOUR_NEW_APP_ID"
}
```

**Note:** The Project ID will likely be `smartclass24-xxxxx` (with a suffix) unless you customize it during project creation. Both the display name and Project ID can be "smartclass24" if you customize it.

---

### Step 4: Update Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Copy the rules from `firestore.rules` in this repo
3. Paste and click "Publish"

**Current Rules (from firestore.rules):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students collection: users can only read/write their own profile
    match /students/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Quiz attempts: users can only read/write their own attempts
    match /quizAttempts/{attemptId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Lessons collection: read-only for authenticated users
    match /lessons/{lessonId} {
      allow read: if request.auth != null;
      allow write: if false; // No writes allowed
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

### Step 5: Update Storage Rules

1. Go to **Storage** → **Rules**
2. Add appropriate rules (if you have storage usage)

**Example Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid != null;
    }
  }
}
```

---

### Step 6: Data Migration Strategy

#### Option A: Fresh Start (Recommended for V1)
- **Best for:** V1 launch with new users
- **Action:** Start fresh, no data migration needed
- **Pros:** Clean slate, no migration complexity
- **Cons:** Lose existing user data (if any)

#### Option B: Export/Import Data
If you have existing data to migrate:

1. **Export from Old Project:**
   ```bash
   # Install Firebase CLI if not installed
   npm install -g firebase-tools
   
   # Login
   firebase login
   
   # Export Firestore data
   firebase firestore:export gs://YOUR_BUCKET/backup
   ```

2. **Import to New Project:**
   ```bash
   # Switch to new project
   firebase use NEW_PROJECT_ID
   
   # Import data
   firebase firestore:import gs://YOUR_BUCKET/backup
   ```

3. **Migrate Storage Files:**
   - Use Firebase Console to download/upload files
   - Or use `gsutil` to copy between buckets

---

### Step 7: Update Codebase Configuration

#### Update `src/firebase/config.ts`

Replace the old config with your new config:

```typescript
export const firebaseConfig = {
  projectId: "YOUR_NEW_PROJECT_ID",
  appId: "YOUR_NEW_APP_ID",
  apiKey: "YOUR_NEW_API_KEY",
  authDomain: "YOUR_NEW_PROJECT_ID.firebaseapp.com",
  storageBucket: "YOUR_NEW_PROJECT_ID.appspot.com",
  measurementId: "YOUR_NEW_MEASUREMENT_ID", // If using Analytics
  messagingSenderId: "YOUR_NEW_MESSAGING_SENDER_ID"
};
```

#### Update Environment Variables (if using)

If you have `.env.local` or `.env.production` files:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_NEW_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_NEW_PROJECT_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_NEW_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_NEW_PROJECT_ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_NEW_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_NEW_APP_ID
```

---

### Step 8: Test the Migration

1. **Local Testing:**
   ```bash
   npm run dev
   ```
   - Test sign up
   - Test anonymous sign in
   - Test profile creation
   - Test quiz submission
   - Test progress tracking

2. **Verify Firestore:**
   - Check Firebase Console → Firestore
   - Verify data is being created correctly
   - Check security rules are working

3. **Verify Authentication:**
   - Test email/password sign up
   - Test anonymous sign in
   - Test sign out

---

### Step 9: Update Production Environment

1. **Update Production Environment Variables:**
   - Update your hosting platform (Vercel, Netlify, etc.)
   - Add new Firebase config as environment variables

2. **Deploy:**
   ```bash
   npm run build
   # Deploy to your hosting platform
   ```

3. **Test Production:**
   - Test all flows in production
   - Monitor Firebase Console for errors
   - Check Sentry (if configured) for issues

---

## 🔄 Migration Timeline

### Recommended Approach:
1. **Week 1:** Set up new project, update config, test locally
2. **Week 2:** Test thoroughly, fix any issues
3. **Week 3:** Deploy to staging, test with beta users
4. **Week 4:** Deploy to production, monitor closely

---

## ⚠️ Important Notes

1. **Keep Old Project Active:** Don't delete the old project immediately. Keep it as backup for at least 1 month.

2. **Update All Environments:**
   - Development
   - Staging
   - Production

3. **Notify Users (if applicable):**
   - If you have existing users, notify them about the migration
   - Provide instructions if they need to re-sign up

4. **Backup Old Data:**
   - Export all data from old project before migration
   - Store backups securely

5. **Monitor Closely:**
   - Watch Firebase Console for errors
   - Monitor authentication success rates
   - Check Firestore write/read operations

---

## 📝 Migration Checklist

- [ ] Create new Firebase project with `ukasha.uae@gmail.com`
- [ ] Enable Authentication (Email/Password + Anonymous)
- [ ] Create Firestore database
- [ ] Enable Storage
- [ ] Copy Firestore security rules
- [ ] Copy Storage rules
- [ ] Get new Firebase configuration
- [ ] Update `src/firebase/config.ts`
- [ ] Update environment variables (if any)
- [ ] Test locally (sign up, sign in, profile, quiz)
- [ ] Verify Firestore data creation
- [ ] Verify Storage (if used)
- [ ] Update production environment variables
- [ ] Deploy to staging
- [ ] Test staging thoroughly
- [ ] Deploy to production
- [ ] Monitor for 1 week
- [ ] Backup old project data
- [ ] (Optional) Delete old project after 1 month

---

## 🆘 Troubleshooting

### Issue: Authentication not working
- **Check:** Authorized domains in Firebase Console
- **Check:** API key is correct
- **Check:** Auth providers are enabled

### Issue: Firestore rules blocking access
- **Check:** Rules are published
- **Check:** User is authenticated
- **Check:** User ID matches document ID

### Issue: Storage upload fails
- **Check:** Storage rules allow writes
- **Check:** User is authenticated
- **Check:** Bucket name is correct

---

## 📞 Support

If you encounter issues during migration:
1. Check Firebase Console for error logs
2. Check browser console for client errors
3. Check Sentry (if configured) for error tracking
4. Review Firebase documentation

---

**Last Updated:** [Current Date]  
**Status:** Ready for Migration

