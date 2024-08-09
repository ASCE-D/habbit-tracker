// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAypjz6KBVcDyzMQipkguq9sgabUvPSfIg",
  authDomain: "insightaction-78bd7.firebaseapp.com",
  projectId: "insightaction-78bd7",
  storageBucket: "insightaction-78bd7.appspot.com",
  messagingSenderId: "141002890917",
  appId: "1:141002890917:web:8bbab018a618c47035f74c",
  measurementId: "G-2EWCKCS0CN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
const analytics = getAnalytics(app);



export const initializeFirebaseMessaging = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const currentToken = await getToken(messaging, { vapidKey: 'BBX_f9fjH0X0V73vFk27HnG9G1AKZu7FF0c1oAP_AWLddR51an76OaJ7E3vkbFLbYztTuG-RupO__C1HKXvizA4' });
        if (currentToken) {
          await sendTokenToServer(currentToken);
          return currentToken;
        }
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
    }
  };
  
  export const onMessageListener = () =>
    new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        resolve(payload);
        console.log(":hfa",payload)
      });
    });
  