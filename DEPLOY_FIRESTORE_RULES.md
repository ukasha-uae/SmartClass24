# Deploy Firestore Rules for Subscription Sync

## Quick Fix: Deploy Rules via Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**
3. **Navigate to**: Firestore Database → Rules tab
4. **Copy the entire contents** of `firestore.rules` from your project
5. **Paste into the Firebase Console rules editor**
6. **Click "Publish"**

## Verify Rules Are Deployed

After deploying, the rules should include:
```javascript
match /subscriptions/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow create, update: if request.auth != null && request.auth.uid == userId;
  allow delete: if false;
}
```

## After Deployment

1. **On PC**: Click "🔄 Sync Subscription" button on Profile page
2. **On Phone**: Log out and log back in (or click sync button)
3. Both devices should now show the same subscription status

## Troubleshooting

If you still get permission errors:
- Make sure you're logged in with the same account on both devices
- Check that the user ID matches in the console logs
- Verify rules were published successfully in Firebase Console


