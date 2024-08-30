import admin from "firebase-admin";
import { MulticastMessage } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!)
  admin.initializeApp({
    //@ts-ignore
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(request: NextRequest) {
  console.log("Notification function triggered");

const { token, title, message, link } = await request.json();
  try {
    // Fetch all user tokens from Firestore
    const usersSnapshot = await admin.firestore().collection('users')
    .where('token', '!=', null) 
    .get(); 
    const tokens = usersSnapshot.docs.map(doc => doc.data().token)
    console.log(tokens)
    console.log("Fetched user tokens:", usersSnapshot.size);
    if (tokens.length === 0) {
      return NextResponse.json({ success: false, message: "No valid tokens found" });
    }

    const payload: MulticastMessage = {
      tokens,
      notification: {
        title: title,
        body: message,
      },
      webpush: link ? {
        fcmOptions: {
          link,
        },
      } : undefined,
    };
// console.log(payload)
    // Send notifications to all tokens
    const responses = await admin.messaging().sendEachForMulticast(
    
      payload
    );

    console.log(`${responses.successCount} notifications sent successfully`);

    if (responses.failureCount > 0) {
      const failedTokens : any = [];
      responses.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });
      console.log('List of tokens that caused failures: ' + failedTokens);
    }

    return NextResponse.json({ 
      success: true, 
      message: `${responses.successCount} notifications sent, ${responses.failureCount} failed. ${payload}` 
    });

  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json({ success: false, message: "Error sending notifications" });
  }
}