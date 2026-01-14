# 🔔 Firebase Web Push Notifications - Implementation Guide

## 📋 Overview

Complete implementation of Firebase Cloud Messaging (FCM) for web push notifications in SmartClass24. Users receive Arena Challenge notifications even when the app is closed.

## ✅ Implementation Status

All core components are implemented and ready to use:

- ✅ FCM messaging configuration
- ✅ Token management and storage
- ✅ Background notifications (service worker)
- ✅ Foreground notifications (in-app toasts)
- ✅ Firestore security rules
- ✅ Permission request UI
- ✅ Arena notification utilities
- ✅ Notification routing and click handling

---

## 🚀 Setup Instructions

### Step 1: Get Firebase VAPID Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **smartclass24-5e590**
3. Navigate to **Project Settings** > **Cloud Messaging** tab
4. Scroll to **Web Push certificates** section
5. If no key exists, click **Generate key pair**
6. Copy the VAPID key (looks like: `BN7xC...`)

### Step 2: Add VAPID Key to Environment

Add to `.env.local`:

```env
# Firebase Cloud Messaging VAPID Key
NEXT_PUBLIC_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY_HERE
```

Also add to `apphosting.yaml` for production:

```yaml
env:
  - variable: NEXT_PUBLIC_FIREBASE_VAPID_KEY
    value: YOUR_VAPID_KEY_HERE
    availability:
      - BUILD
      - RUNTIME
```

### Step 3: Register Service Worker

The service worker is already created at `public/firebase-messaging-sw.js`. Next.js will automatically serve it from the root path.

To verify it's accessible:
```
http://localhost:9002/firebase-messaging-sw.js
```

### Step 4: Add Components to Root Layout

Update `src/app/layout.tsx`:

```tsx
import { NotificationHandler } from '@/components/NotificationHandler';
import { NotificationPermissionPrompt } from '@/components/NotificationPermissionPrompt';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FirebaseProvider {...sdks}>
          {/* Handles foreground notifications */}
          <NotificationHandler />
          
          {/* Shows permission prompt after 5 seconds */}
          <NotificationPermissionPrompt delay={5000} />
          
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
```

### Step 5: Deploy Firestore Security Rules

```powershell
# Deploy updated rules with FCM token permissions
firebase deploy --only firestore:rules
```

### Step 6: Test Locally

```powershell
# Start dev server
npm run dev

# Open in browser
# You should see notification permission prompt after 5 seconds
```

---

## 📱 Usage Examples

### Send Arena Challenge Notification

```typescript
import { sendArenaNotificationViaFirestore } from '@/lib/arena-notifications';
import { useFirebase } from '@/firebase';

// In your challenge creation function
async function createChallenge(opponentUid: string) {
  const { firestore, user } = useFirebase();
  
  // Create challenge document first...
  const challengeRef = await addDoc(collection(firestore, 'challenges'), {
    challengerUid: user.uid,
    opponentUid,
    status: 'pending',
  });
  
  // Send notification to opponent
  await sendArenaNotificationViaFirestore(firestore, opponentUid, {
    type: 'arena_challenge_invite',
    challengeId: challengeRef.id,
    challengerName: user.displayName || 'A challenger',
    challengerUid: user.uid,
    subject: 'Mathematics',
    requireInteraction: true,
  });
}
```

### Check Notification Permission

```typescript
import { hasNotificationPermission } from '@/firebase/fcm-token';

if (hasNotificationPermission()) {
  console.log('User will receive push notifications');
} else {
  // Show banner encouraging user to enable
}
```

### Manually Request Permission

```typescript
import { NotificationPermissionButton } from '@/components/NotificationPermissionPrompt';

// In settings page
<NotificationPermissionButton />
```

---

## 🔧 Architecture

### Files Created

```
src/
├── firebase/
│   ├── messaging.ts              # FCM initialization and utilities
│   └── fcm-token.ts              # Token management and storage
├── components/
│   ├── NotificationHandler.tsx   # Foreground notification handler
│   └── NotificationPermissionPrompt.tsx  # Permission UI
└── lib/
    └── arena-notifications.ts    # Arena notification builders

public/
└── firebase-messaging-sw.js      # Background notification service worker

firestore.rules                   # Updated with FCM token rules
```

### Data Flow

```
1. User signs in
   ↓
2. Firebase Provider auto-initializes FCM
   ↓
3. Request notification permission (if not granted)
   ↓
4. Generate FCM token
   ↓
5. Store token in Firestore: users/{uid}/fcmTokens/{token}
   ↓
6. Token auto-refreshes when needed
```

### Notification Flow

```
SENDER (Client):
1. Create challenge
2. Call sendArenaNotificationViaFirestore()
3. Creates document in users/{opponentUid}/notifications/

CLOUD FUNCTION (Backend):
4. Firestore onCreate trigger fires
5. Fetches opponent's FCM tokens
6. Sends push via Firebase Admin SDK

RECIPIENT (Client):
7a. App closed → Service worker shows notification
7b. App open → NotificationHandler shows toast
8. User clicks → Routes to /arena
```

---

## ☁️ Cloud Function Setup (Required for Production)

Push notifications need a backend to send. Create Firebase Cloud Function:

### 1. Install Firebase Functions

```powershell
npm install -g firebase-tools
firebase init functions
```

### 2. Create Function

`functions/src/index.ts`:

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const sendArenaPushNotification = functions.firestore
  .document('users/{userId}/notifications/{notificationId}')
  .onCreate(async (snapshot, context) => {
    const notificationData = snapshot.data();
    
    // Only process pending push notifications
    if (!notificationData.pendingPush) {
      return null;
    }
    
    const userId = context.params.userId;
    
    // Get user's FCM tokens
    const tokensSnapshot = await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('fcmTokens')
      .get();
    
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);
    
    if (tokens.length === 0) {
      console.log('No FCM tokens for user:', userId);
      return null;
    }
    
    // Build notification
    let title = 'SmartClass24';
    let body = 'You have a new notification';
    
    if (notificationData.type === 'arena_challenge_invite') {
      title = '⚔️ Arena Challenge!';
      body = `${notificationData.challengerName} challenges you!`;
    } else if (notificationData.type === 'arena_challenge_accepted') {
      title = '🎮 Challenge Accepted!';
      body = `${notificationData.challengerName} accepted your challenge!`;
    }
    
    const payload = {
      notification: { title, body },
      data: notificationData,
    };
    
    // Send to all devices
    const response = await admin.messaging().sendToDevice(tokens, payload);
    
    // Mark as sent
    await snapshot.ref.update({ 
      pendingPush: false, 
      sentAt: admin.firestore.FieldValue.serverTimestamp() 
    });
    
    console.log('Notification sent:', response);
    return null;
  });
```

### 3. Deploy Function

```powershell
firebase deploy --only functions
```

---

## 🧪 Testing Guide

### Test Notification Permission

1. Open SmartClass24 in browser
2. Wait 5 seconds for prompt to appear
3. Click "Enable Notifications"
4. Check browser shows permission dialog
5. Grant permission
6. Check console for FCM token logged

### Test Background Notification

1. Close SmartClass24 tab
2. Use another device/browser to create a challenge
3. Should receive desktop notification
4. Click notification → SmartClass24 opens to /arena

### Test Foreground Notification

1. Keep SmartClass24 open
2. Receive a challenge
3. Should see toast notification in top-right
4. Click action button → Navigate to arena

### Test Service Worker

```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Registered service workers:', registrations);
});
```

---

## 🎨 Notification Copywriting Best Practices

### Arena Challenge Invite
✅ **Good**: "John challenges you to a Math battle! 🔥"
❌ **Bad**: "You have a new challenge"

### Challenge Accepted
✅ **Good**: "Sarah accepted! Time to prove yourself! 💪"
❌ **Bad**: "Challenge was accepted"

### Challenge Completed
✅ **Good**: "Battle results are in! Did you win? 🏆"
❌ **Bad**: "Challenge finished"

---

## 🛡️ Security & Privacy

### Token Storage
- Tokens stored at `users/{uid}/fcmTokens/{token}`
- Only owner can read/write their tokens
- Tokens auto-refresh and clean up

### Notification Throttling
```typescript
import { shouldSendNotification } from '@/lib/arena-notifications';

// Limit to 10 notifications per hour
const canSend = await shouldSendNotification(
  firestore, 
  userId, 
  'arena_challenge_invite',
  10
);

if (canSend) {
  await sendArenaNotificationViaFirestore(...);
}
```

### Permission Persistence
- Permission saved in browser
- Prompt dismissed → Wait 7 days before asking again
- User can change in browser settings anytime

---

## 🐛 Troubleshooting

### "No VAPID key found"
- Add `NEXT_PUBLIC_FIREBASE_VAPID_KEY` to `.env.local`
- Restart dev server

### "Service worker not found"
- Check `public/firebase-messaging-sw.js` exists
- Verify accessible at `/firebase-messaging-sw.js`
- Clear browser cache

### "Permission denied"
- User previously denied permission
- Must enable in browser settings manually
- On Chrome: Site Settings → Notifications → Allow

### "Token not saving to Firestore"
- Deploy updated `firestore.rules`
- Check user is authenticated
- Verify Firestore rules allow write to `users/{uid}/fcmTokens/`

### "Notifications not received when app closed"
- Service worker must be registered
- Check `navigator.serviceWorker.ready` in console
- Verify HTTPS (or localhost)

### "Messages sent but not received"
- Check FCM tokens exist in Firestore
- Verify Cloud Function is deployed
- Check Cloud Function logs in Firebase Console

---

## 📊 Monitoring & Analytics

### Track Permission Grants

```typescript
<NotificationPermissionPrompt 
  onGranted={() => {
    // Track in analytics
    logEvent('notification_permission_granted');
  }}
  onDenied={() => {
    logEvent('notification_permission_denied');
  }}
/>
```

### Monitor Token Refresh

```typescript
// In firebase/fcm-token.ts
export async function refreshFCMToken(...) {
  // ... existing code
  
  // Log refresh for monitoring
  logEvent('fcm_token_refreshed', {
    userId: userId,
    oldTokenExists: !!oldToken,
  });
}
```

---

## 🚀 Next Steps

### Phase 2 Enhancements

1. **Rich Notifications**: Add images, action buttons
2. **Notification Preferences**: Let users choose notification types
3. **Quiet Hours**: Respect user's sleep schedule
4. **Notification History**: Show past notifications in-app
5. **Web Socket Fallback**: Real-time updates when notifications off

### Advanced Features

```typescript
// Notification preferences
interface NotificationPreferences {
  arenaInvites: boolean;
  challengeAccepted: boolean;
  challengeCompleted: boolean;
  friendRequests: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string;   // "08:00"
}
```

---

## 📚 Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Web Push Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Workers Guide](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notification Best Practices](https://web.dev/push-notifications-overview/)

---

## ✅ Checklist

Before going live:

- [ ] VAPID key added to `.env.local` and `apphosting.yaml`
- [ ] Service worker accessible at `/firebase-messaging-sw.js`
- [ ] Firestore rules deployed with FCM token rules
- [ ] Cloud Function deployed for sending notifications
- [ ] NotificationHandler added to root layout
- [ ] NotificationPermissionPrompt added to root layout
- [ ] Tested background notifications
- [ ] Tested foreground notifications
- [ ] Tested notification click routing
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] Tested on mobile PWA
- [ ] Analytics tracking implemented
- [ ] Error monitoring setup

---

## 🎉 Success Metrics

Track these KPIs:

1. **Permission Grant Rate**: % of users who enable notifications
2. **Notification Delivery Rate**: % of sent notifications delivered
3. **Click-Through Rate**: % of notifications clicked
4. **Arena Engagement**: Increase in challenges after notification
5. **User Retention**: Daily/weekly active users with notifications enabled

---

**Implementation completed by GitHub Copilot** 🤖
**Date**: January 14, 2026
**Status**: ✅ Ready for Testing
