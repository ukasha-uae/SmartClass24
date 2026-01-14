# ✅ Firebase Push Notifications - Implementation Checklist

## 🎯 Pre-Launch Checklist

### Environment Setup
- [ ] Get VAPID key from Firebase Console
- [ ] Add `NEXT_PUBLIC_FIREBASE_VAPID_KEY` to `.env.local`
- [ ] Add `NEXT_PUBLIC_FIREBASE_VAPID_KEY` to `apphosting.yaml`
- [ ] Restart dev server after adding environment variable

### Code Integration
- [ ] Add `NotificationHandler` to root layout
- [ ] Add `NotificationPermissionPrompt` to root layout
- [ ] Verify service worker accessible at `/firebase-messaging-sw.js`
- [ ] Run TypeScript check: `npm run typecheck`
- [ ] Run build: `npm run build`

### Firebase Console Setup
- [ ] Enable Cloud Messaging in Firebase Console
- [ ] Generate Web Push certificate (VAPID key)
- [ ] Deploy Firestore rules: `firebase deploy --only firestore:rules`
- [ ] Initialize Firebase Functions: `firebase init functions`
- [ ] Deploy Cloud Function: `firebase deploy --only functions`

### Testing - Local Development
- [ ] Start dev server: `npm run dev`
- [ ] Wait 5 seconds for permission prompt
- [ ] Click "Enable Notifications"
- [ ] Grant permission in browser dialog
- [ ] Check console for FCM token
- [ ] Verify token saved to Firestore
- [ ] Check service worker registered in DevTools

### Testing - Background Notifications
- [ ] Close SmartClass24 tab/window
- [ ] Trigger notification from another device/account
- [ ] Verify desktop notification appears
- [ ] Click notification
- [ ] Verify app opens and navigates to /arena
- [ ] Test action buttons (Accept, View, Start)

### Testing - Foreground Notifications
- [ ] Keep SmartClass24 open
- [ ] Trigger notification
- [ ] Verify toast notification appears (top-right)
- [ ] Test action buttons
- [ ] Verify navigation works
- [ ] Test auto-dismiss (10 seconds)
- [ ] Test manual dismiss (X button)

### Testing - Multiple Devices
- [ ] Sign in on Device A
- [ ] Sign in on Device B (same account)
- [ ] Create challenge from Device A
- [ ] Verify Device B receives notification
- [ ] Accept on Device B
- [ ] Verify Device A receives notification

### Testing - Browsers
- [ ] Chrome desktop
- [ ] Chrome mobile
- [ ] Firefox desktop
- [ ] Firefox mobile
- [ ] Safari desktop (if available)
- [ ] Safari iOS (if available)
- [ ] Edge desktop

### Testing - Edge Cases
- [ ] Permission denied scenario
- [ ] Browser doesn't support push
- [ ] Offline → Online transition
- [ ] Token refresh after expiry
- [ ] Multiple tabs open
- [ ] Service worker update
- [ ] App cache cleared

### Security Verification
- [ ] Firestore rules deployed
- [ ] Owner-only access to tokens
- [ ] Owner-only access to notifications
- [ ] Test with different accounts
- [ ] Verify no unauthorized access
- [ ] Check Cloud Function permissions

### Performance Testing
- [ ] Check bundle size impact
- [ ] Verify non-blocking initialization
- [ ] Test with slow network
- [ ] Test with many notifications
- [ ] Verify memory usage is acceptable
- [ ] Check for memory leaks

### Production Deployment
- [ ] VAPID key in production environment
- [ ] Cloud Function deployed and active
- [ ] Firestore rules deployed
- [ ] Service worker accessible in production
- [ ] Test production build locally
- [ ] Deploy to staging first
- [ ] Full test on staging
- [ ] Deploy to production
- [ ] Smoke test on production

---

## 🔍 Verification Commands

### Check Environment
```powershell
# Verify VAPID key is set
$env:NEXT_PUBLIC_FIREBASE_VAPID_KEY

# Should output your VAPID key (not empty)
```

### Check Service Worker
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service workers:', registrations);
});
```

### Check FCM Token
```javascript
// In browser console (after sign-in)
// Should log FCM token
```

### Check Firestore Rules
```powershell
firebase deploy --only firestore:rules --project smartclass24-5e590
```

### Check Cloud Function
```powershell
# List functions
firebase functions:list

# View logs
firebase functions:log --only sendArenaPushNotification
```

---

## 🐛 Troubleshooting Checklist

### No Permission Prompt Shows
- [ ] Check console for errors
- [ ] Verify VAPID key is set
- [ ] Check `NotificationPermissionPrompt` is in layout
- [ ] Wait full delay period (5 seconds)
- [ ] Check if previously dismissed (localStorage)
- [ ] Clear browser cache and try again

### Permission Denied
- [ ] User previously denied permission
- [ ] Guide user to browser settings
- [ ] Chrome: Site Settings → Notifications → Allow
- [ ] Firefox: Permissions → Notifications → Allow
- [ ] Can't be changed programmatically

### Token Not Generating
- [ ] Check VAPID key is correct
- [ ] Verify HTTPS or localhost
- [ ] Check browser console for errors
- [ ] Verify Firebase Messaging enabled
- [ ] Check browser supports push notifications

### Token Not Saving to Firestore
- [ ] Deploy Firestore rules
- [ ] Check user is authenticated
- [ ] Verify Firestore connection
- [ ] Check console for permission errors
- [ ] Check Firestore rules in Firebase Console

### Service Worker Not Found
- [ ] Verify file at `public/firebase-messaging-sw.js`
- [ ] Check file is accessible: `/firebase-messaging-sw.js`
- [ ] Clear browser cache
- [ ] Unregister old service workers
- [ ] Check Next.js isn't blocking it

### Background Notifications Not Received
- [ ] Check service worker is registered
- [ ] Verify FCM tokens exist in Firestore
- [ ] Check Cloud Function is deployed
- [ ] Check Cloud Function logs for errors
- [ ] Verify app is completely closed (not minimized)
- [ ] Check browser allows notifications when closed

### Foreground Notifications Not Showing
- [ ] Check `NotificationHandler` in layout
- [ ] Verify user is signed in
- [ ] Check browser console for errors
- [ ] Verify FCM is initialized
- [ ] Check foreground listener is setup

### Cloud Function Not Sending
- [ ] Check function is deployed: `firebase functions:list`
- [ ] Check function logs: `firebase functions:log`
- [ ] Verify notification has `pendingPush: true`
- [ ] Check FCM tokens exist for user
- [ ] Verify Firebase Admin SDK initialized
- [ ] Check API keys and permissions

### Notifications Sent But Not Received
- [ ] Verify tokens are valid
- [ ] Check tokens haven't expired
- [ ] Test with fresh token
- [ ] Check FCM console for delivery status
- [ ] Verify browser is online
- [ ] Check firewall/antivirus isn't blocking

---

## 📊 Success Metrics

### Immediate Metrics (Day 1)
- [ ] Permission grant rate > 30%
- [ ] Zero critical errors in logs
- [ ] Token generation success > 95%
- [ ] Notification delivery rate > 90%

### Short-term Metrics (Week 1)
- [ ] Permission grant rate > 40%
- [ ] Click-through rate > 20%
- [ ] Arena engagement increase > 10%
- [ ] User retention stable or improved

### Long-term Metrics (Month 1)
- [ ] Permission grant rate > 50%
- [ ] Click-through rate > 30%
- [ ] Arena engagement increase > 30%
- [ ] Daily active users increase > 15%

---

## 🎯 Post-Launch Tasks

### Monitoring Setup
- [ ] Setup error monitoring (Sentry, etc.)
- [ ] Track permission grant events
- [ ] Track notification delivery
- [ ] Track notification clicks
- [ ] Monitor Cloud Function costs
- [ ] Set up alerts for errors

### Optimization
- [ ] A/B test notification copy
- [ ] Optimize send timing
- [ ] Test different permission prompts
- [ ] Analyze click-through rates
- [ ] Improve notification UX based on feedback

### Documentation
- [ ] Update team documentation
- [ ] Create user help articles
- [ ] Document troubleshooting steps
- [ ] Share best practices with team
- [ ] Create video tutorial (optional)

### Feature Expansion
- [ ] Add notification preferences
- [ ] Implement quiet hours
- [ ] Add notification history
- [ ] Support more notification types
- [ ] Add rich notifications with images

---

## 🔗 Quick Links

- **Full Guide**: [FIREBASE_PUSH_NOTIFICATIONS_GUIDE.md](./FIREBASE_PUSH_NOTIFICATIONS_GUIDE.md)
- **Quick Start**: [PUSH_NOTIFICATIONS_QUICKSTART.md](./PUSH_NOTIFICATIONS_QUICKSTART.md)
- **Architecture**: [PUSH_NOTIFICATIONS_ARCHITECTURE_DIAGRAM.md](./PUSH_NOTIFICATIONS_ARCHITECTURE_DIAGRAM.md)
- **Summary**: [PUSH_NOTIFICATIONS_IMPLEMENTATION_SUMMARY.md](./PUSH_NOTIFICATIONS_IMPLEMENTATION_SUMMARY.md)
- **Cloud Function**: [functions-example.ts](./functions-example.ts)
- **Firebase Console**: https://console.firebase.google.com/project/smartclass24-5e590
- **FCM Docs**: https://firebase.google.com/docs/cloud-messaging

---

## ✅ Sign-Off

When all items are checked:

**Developer**: _________________________ Date: _________

**QA**: _______________________________ Date: _________

**Product Owner**: ____________________ Date: _________

---

**Ready for Production**: ☐ YES  ☐ NO

**Notes**:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
