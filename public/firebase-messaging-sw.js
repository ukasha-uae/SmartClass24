// Firebase Cloud Messaging Service Worker
// Handles background push notifications when SmartClass24 is closed

// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
// Note: This config is read from the environment at build time
const firebaseConfig = {
  apiKey: "AIzaSyCSh-H5vOjSMvVEk7ap5g0q4n6AYZeRdq8",
  authDomain: "smartclass24-5e590.firebaseapp.com",
  projectId: "smartclass24-5e590",
  storageBucket: "smartclass24-5e590.firebasestorage.app",
  messagingSenderId: "409244053398",
  appId: "1:409244053398:web:e24f70df607ec16c70b7b7",
  measurementId: "G-BLRS8ZPM24"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  // Extract notification data
  const notificationTitle = payload.notification?.title || 'SmartClass24';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: payload.data?.type || 'general',
    data: payload.data || {},
    requireInteraction: payload.data?.requireInteraction === 'true',
    actions: [],
    vibrate: [200, 100, 200]
  };

  // Add action buttons based on notification type
  if (payload.data?.type === 'arena_challenge_invite') {
    notificationOptions.actions = [
      { action: 'accept', title: '⚔️ Accept Challenge' },
      { action: 'view', title: '👀 View' }
    ];
  } else if (payload.data?.type === 'arena_challenge_accepted') {
    notificationOptions.actions = [
      { action: 'start', title: '🎮 Start Game' },
      { action: 'view', title: '👀 View' }
    ];
  }

  // Show the notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);

  event.notification.close();

  const notificationData = event.notification.data;
  let targetUrl = '/';

  // Determine target URL based on notification type and action
  if (event.action === 'accept') {
    // User clicked "Accept Challenge"
    targetUrl = `/arena?accept=${notificationData.challengeId || ''}`;
  } else if (event.action === 'start') {
    // User clicked "Start Game"
    targetUrl = `/arena?start=${notificationData.challengeId || ''}`;
  } else if (event.action === 'view' || !event.action) {
    // User clicked the notification body or "View"
    if (notificationData.type === 'arena_challenge_invite' || 
        notificationData.type === 'arena_challenge_accepted') {
      targetUrl = '/arena';
    } else if (notificationData.url) {
      targetUrl = notificationData.url;
    }
  }

  // Open the app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            // Navigate to target URL and focus the window
            client.postMessage({
              type: 'NOTIFICATION_CLICK',
              url: targetUrl,
              data: notificationData
            });
            return client.focus();
          }
        }
        
        // No window open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  console.log('[firebase-messaging-sw.js] Message from client:', event.data);

  // Handle skip waiting request
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Service worker lifecycle events
self.addEventListener('install', (event) => {
  console.log('[firebase-messaging-sw.js] Service worker installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[firebase-messaging-sw.js] Service worker activated');
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
});
