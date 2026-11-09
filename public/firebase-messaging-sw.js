// Firebase Cloud Messaging Service Worker for Orbit by ByteCraft Studio
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'demo-api-key',
  projectId: 'orbit-bytecraft',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'Orbit Academic Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'Upcoming class or submission reminder.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
