'use client'

import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { db, getMessagingInstance } from "../../../../firebase";

export default function App() {
    const [messaging, setMessaging] = useState(null);

    useEffect(() => {
        const messagingInstance = getMessagingInstance();
        setMessaging(messagingInstance);
    }, []);

    async function saveTokenToFirestore(token) {
        try {
            await setDoc(doc(db, "users", "userId"), {
                token: token
            }, { merge: true });
            console.log("Token saved to Firestore");
        } catch (error) {
            console.error("Error saving token to Firestore:", error);
        }
    }
    
    async function requestPermission() {
        if (!messaging) return;

        onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
        });

        try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                const token = await getToken(messaging, {
                    vapidKey: "BBX_f9fjH0X0V73vFk27HnG9G1AKZu7FF0c1oAP_AWLddR51an76OaJ7E3vkbFLbYztTuG-RupO__C1HKXvizA4",
                });
                console.log("Token Gen", token);
                await saveTokenToFirestore(token);
            } else if (permission === "denied") {
                console.log("Notification permission denied");
            }
        } catch (error) {
            console.error("An error occurred while requesting permission", error);
        }
    }

    useEffect(() => {
        if (messaging) {
            requestPermission();
        }
    }, [messaging]);

    return (
        <div className="App">
            {/* Your component JSX */}
        </div>
    );
}