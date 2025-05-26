importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDmy92xErLZlWzscn9YSRnoAwU_iBcmB5s",
  authDomain: "webnotificationsystem-95dfc.firebaseapp.com",
  projectId: "webnotificationsystem-95dfc",
  storageBucket: "webnotificationsystem-95dfc.firebasestorage.app",
  messagingSenderId: "807628758113",
  appId: "1:807628758113:web:319e39e8c5ccff70bdde20"
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload?.notification?.title, {
    body : payload?.notification?.body,
    icon: payload?.notification?.image_url
  });
});

