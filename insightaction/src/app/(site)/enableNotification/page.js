'use client'

import { useEffect } from "react";

import { getToken } from "firebase/messaging";
import { getMessaging, onMessage } from "firebase/messaging";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import sendReminderNotification from '@/actions/habit'
export default function App() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // ...
    });
    
    async function saveTokenToFirestore(token) {
      try {
        // Assuming you want to save the token with a unique user ID
        // You might want to replace 'userId' with the actual user's ID
        await setDoc(doc(db, "users", "userId"), {
          token: token
        }, { merge: true });
        console.log("Token saved to Firestore");
      } catch (error) {
        console.error("Error saving token to Firestore:", error);
      }
    }
    
  async function requestPermission() {
    onMessage(messaging, (payload) => {
        console.log('heler')
      console.log('Message received. ', payload);
      // ...
    });
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
        "BBX_f9fjH0X0V73vFk27HnG9G1AKZu7FF0c1oAP_AWLddR51an76OaJ7E3vkbFLbYztTuG-RupO__C1HKXvizA4",
      });
      console.log("Token Gen", token);
      // Send this token  to server ( db)
       // Save token to Firestore
       await saveTokenToFirestore(token);
      await sendReminderNotification()
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img  className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
