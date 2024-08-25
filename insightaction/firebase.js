// 'use client'
// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getMessaging } from "firebase/messaging";
// import { getFirestore } from "firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAypjz6KBVcDyzMQipkguq9sgabUvPSfIg",
//   authDomain: "insightaction-78bd7.firebaseapp.com",
//   projectId: "insightaction-78bd7",
//   storageBucket: "insightaction-78bd7.appspot.com",
//   messagingSenderId: "141002890917",
//   appId: "1:141002890917:web:8bbab018a618c47035f74c",
//   measurementId: "G-2EWCKCS0CN"
// };

// // Initialize Firebase


// export const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);

// // Only initialize these on the client side
// export const getMessagingInstance = () => {
//   if (typeof window !== 'undefined') {
//     const { getMessaging } = require("firebase/messaging");
//     return getMessaging(app);
//   }
//   return null;
// };


import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAypjz6KBVcDyzMQipkguq9sgabUvPSfIg",
  authDomain: "insightaction-78bd7.firebaseapp.com",
  projectId: "insightaction-78bd7",
  storageBucket: "insightaction-78bd7.appspot.com",
  messagingSenderId: "141002890917",
  appId: "1:141002890917:web:8bbab018a618c47035f74c",
  measurementId: "G-2EWCKCS0CN"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};

export { app, messaging };




  
  