# 🚀 Quick Start: Push Notifications

## 5-Minute Setup

### 1. Get VAPID Key (2 min)

```bash
# Go to Firebase Console
https://console.firebase.google.com/project/smartclass24-5e590/settings/cloudmessaging

# Copy the Web Push certificate VAPID key
```

### 2. Add to Environment (1 min)

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY_HERE
```

### 3. Update Root Layout (1 min)

`src/app/layout.tsx`:

```tsx
import { NotificationHandler } from '@/components/NotificationHandler';
import { NotificationPermissionPrompt } from '@/components/NotificationPermissionPrompt';

export default function RootLayout({ children }) {
  return (
    <FirebaseProvider {...sdks}>
      <NotificationHandler />
      <NotificationPermissionPrompt delay={5000} />
      {children}
    </FirebaseProvider>
  );
}
```

### 4. Deploy Rules (1 min)

```bash
firebase deploy --only firestore:rules
```

### 5. Test!

```bash
npm run dev
# Wait 5 seconds → See permission prompt
# Click "Enable" → Grant permission
# Check console for FCM token
```

---

## Send a Test Notification

```typescript
import { sendArenaNotificationViaFirestore } from '@/lib/arena-notifications';

await sendArenaNotificationViaFirestore(firestore, opponentUid, {
  type: 'arena_challenge_invite',
  challengeId: 'test-123',
  challengerName: 'John Doe',
  challengerUid: user.uid,
  subject: 'Mathematics',
});
```

---

## Production Setup (Cloud Function)

See full guide: [FIREBASE_PUSH_NOTIFICATIONS_GUIDE.md](./FIREBASE_PUSH_NOTIFICATIONS_GUIDE.md#-cloud-function-setup-required-for-production)

---

## Troubleshooting

**No prompt shows?**
- Check console for errors
- Verify VAPID key is set
- Clear browser cache

**Permission denied?**
- User previously denied
- Go to browser settings → Enable notifications for localhost

**Token not saving?**
- Run: `firebase deploy --only firestore:rules`
- Check user is signed in

---

**Full docs**: [FIREBASE_PUSH_NOTIFICATIONS_GUIDE.md](./FIREBASE_PUSH_NOTIFICATIONS_GUIDE.md)
