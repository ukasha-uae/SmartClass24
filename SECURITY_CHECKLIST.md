# 🔒 Security Checklist for Firebase Admin SDK

## ⚠️ CRITICAL: Service Account Key Security

Your `serviceAccountKey.json` has **FULL ADMIN ACCESS** to your Firebase project. Follow these rules:

### ✅ DO:
- ✅ Keep `serviceAccountKey.json` in `.gitignore`
- ✅ Store it only on secure servers (never in client apps)
- ✅ Use environment variables in production
- ✅ Rotate keys periodically
- ✅ Delete old keys from Firebase Console
- ✅ Limit who has access to download keys
- ✅ Use server-side scripts only (Node.js backend)

### ❌ DON'T:
- ❌ Commit to Git (checked `.gitignore` - ✅ protected)
- ❌ Share via email/Slack/Discord
- ❌ Hardcode credentials in code
- ❌ Use in client-side code (React/Vue/Angular)
- ❌ Upload to public repositories
- ❌ Store in plain text on unsecured servers
- ❌ Include in Docker images publicly

---

## 🔐 Current Implementation (Safe)

### cleanup-test-users.js
```javascript
// ✅ SAFE: Loads from file system (server-side only)
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

**Why This Is Safe:**
1. Runs on your local machine or secure server (not in browser)
2. File is in `.gitignore` (won't be committed)
3. Uses require() which only works server-side
4. Has error handling if file is missing

---

## 🚨 If Key Is Compromised

**Immediate Actions:**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Delete the compromised key
3. Generate a new key
4. Update your local `serviceAccountKey.json`
5. Review Firestore audit logs for suspicious activity
6. Change Firebase project authentication settings if needed

---

## 🌐 Production Deployment Options

### Option 1: Environment Variables (Recommended)
```javascript
// For production servers (Heroku, AWS, etc.)
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

### Option 2: Google Cloud Secret Manager
```javascript
// For Google Cloud Run, App Engine, Cloud Functions
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

async function getServiceAccount() {
  const [version] = await client.accessSecretVersion({
    name: 'projects/YOUR_PROJECT/secrets/firebase-admin-key/versions/latest',
  });
  return JSON.parse(version.payload.data.toString());
}
```

### Option 3: Default Credentials (Google Cloud)
```javascript
// Simplest for Cloud Functions/Cloud Run
admin.initializeApp(); // Automatically uses default credentials
```

---

## 🧪 Testing Security

### Verify .gitignore Protection
```powershell
# Check if serviceAccountKey.json would be committed
git status

# Should NOT show serviceAccountKey.json
# If it does, add to .gitignore immediately
```

### Check for Accidental Commits
```powershell
# Search Git history for sensitive files
git log --all --full-history -- "*serviceAccountKey*"

# If found, use BFG Repo Cleaner to remove:
# https://rtyley.github.io/bfg-repo-cleaner/
```

---

## 📋 Security Checklist

Before running cleanup script:
- [ ] `serviceAccountKey.json` is in `.gitignore`
- [ ] Key file is NOT in Git history
- [ ] Key file has restrictive permissions (chmod 600 on Linux/Mac)
- [ ] Only you have access to the key
- [ ] You're running script on secure machine (not public computer)
- [ ] You've verified the Firebase project is correct

After cleanup:
- [ ] Delete `serviceAccountKey.json` if no longer needed
- [ ] Or store in secure password manager
- [ ] Revoke key from Firebase Console if it's a one-time use

---

## 🛡️ Current Protection Status

Your project is protected with:
- ✅ `.gitignore` includes `serviceAccountKey.json`
- ✅ `.gitignore` includes `*-firebase-adminsdk-*.json` (wildcard pattern)
- ✅ Script checks if key exists before running
- ✅ Error handling prevents crashes
- ✅ Documentation warns about security

---

## 📞 If You Need Help

**Suspected security breach:**
1. Revoke key immediately (Firebase Console)
2. Check Firebase audit logs
3. Contact: +970589549030

**General questions:**
- Read: [Firebase Admin SDK Security Best Practices](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments)
