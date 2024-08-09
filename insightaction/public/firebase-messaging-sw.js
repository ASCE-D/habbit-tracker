// importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAypjz6KBVcDyzMQipkguq9sgabUvPSfIg",
//   authDomain: "insightaction-78bd7.firebaseapp.com",
//   projectId: "insightaction-78bd7",
//   storageBucket: "insightaction-78bd7.appspot.com",
//   messagingSenderId: "141002890917",
//   appId: "1:141002890917:web:8bbab018a618c47035f74c",
//   measurementId: "G-2EWCKCS0CN"
// };

// firebase.initializeApp(firebaseConfig);

// class CustomPushEvent extends Event {
//     constructor(data) {
//         super('push');

//         Object.assign(this, data);
//         this.custom = true;
//     }
// }

// /*
//  * Overrides push notification data, to avoid having 'notification' key and firebase blocking
//  * the message handler from being called
//  */
// self.addEventListener('push', (e) => {
//     // Skip if event is our own custom event
//     if (e.custom) return;

//     // Kep old event data to override
//     const oldData = e.data;

//     // Create a new event to dispatch, pull values from notification key and put it in data key,
//     // and then remove notification key
//     const newEvent = new CustomPushEvent({
//         data: {
//             ehheh: oldData.json(),
//             json() {
//                 const newData = oldData.json();
//                 newData.data = {
//                     ...newData.data,
//                     ...newData.notification,
//                 };
//                 delete newData.notification;
//                 return newData;
//             },
//         },
//         waitUntil: e.waitUntil.bind(e),
//     });

//     // Stop event propagation
//     e.stopImmediatePropagation();

//     // Dispatch the new wrapped event
//     dispatchEvent(newEvent);
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//     // console.log('[firebase-messaging-sw.js] Received background message ', payload);

//     const { title, body, image, icon, ...restPayload } = payload.data;
//     const notificationOptions = {
//         body,
//         icon: image || '/icons/firebase-logo.png', // path to your "fallback" firebase notification logo
//         data: restPayload,
//     };
//     return self.registration.showNotification(title, notificationOptions);
// });

// self.addEventListener('notificationclick', (event) => {
//     if (event?.notification?.data && event?.notification?.data?.link) {
//         self.clients.openWindow(event.notification.data.link);
//     }

//     // close notification after click
//     event.notification.close();
// });




import { initializeApp } from "firebase/app";
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