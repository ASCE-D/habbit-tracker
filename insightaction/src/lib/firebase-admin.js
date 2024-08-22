// // app/lib/firebase-admin.js
// import admin from 'firebase-admin';
// import {privateKey} from './insightaction-78bd7-firebase-adminsdk-m6r5n-efe14fe81a'

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       privateKey
//     }),
//   });
// }

// export const sendNotification = async (token, title, body) => {
//   try {
//     await admin.messaging().send({
//       token: token,
//       notification: { title, body },
//     });
//     return { success: true };
//   } catch (error) {
//     console.error('Error sending notification:', error);
//     return { success: false, error: error.message };
//   }
// };