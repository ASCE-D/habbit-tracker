importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");
import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { getMessaging, onMessage } from "firebase/messaging";
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseApp = initializeApp({
  apiKey: "AIzaSyAypjz6KBVcDyzMQipkguq9sgabUvPSfIg",
  authDomain: "insightaction-78bd7.firebaseapp.com",
  projectId: "insightaction-78bd7",
  storageBucket: "insightaction-78bd7.appspot.com",
  messagingSenderId: "141002890917",
  appId: "1:141002890917:web:8bbab018a618c47035f74c",
  measurementId: "G-2EWCKCS0CN",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.




const messaging = getMessaging();
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});