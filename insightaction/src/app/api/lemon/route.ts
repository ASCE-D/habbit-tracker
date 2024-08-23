
import crypto from "crypto";
//@ts-ignore
import { listAllSubscriptions } from "lemonsqueezy.ts";
import { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
// Put this in your billing lib and just import the type instead
type LemonsqueezySubscription = Awaited<ReturnType<typeof listAllSubscriptions>>["data"][number];

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

// Add more events here if you want
// https://docs.lemonsqueezy.com/api/webhooks#event-types
type EventName =
  | "order_created"
  | "order_refunded"
  | "subscription_created"
  | "subscription_cancelled"
  | "subscription_resumed"
  | "subscription_expired"
  | "subscription_paused"
  | "subscription_unpaused"
  | "subscription_payment_failed"
  | "subscription_payment_success"
  | "subscription_payment_recovered";

type Payload = {
  meta: {
    test_mode: boolean;
    event_name: EventName;
  };
  // Possibly not accurate: it's missing the relationships field and any custom data you add
  data: LemonsqueezySubscription;
};



export const POST = async (request: NextRequest) => {
 
  try {
    const text = await request.text();
    const hmac = crypto.createHmac("sha256", process.env["LEMON_SQUEEZY_WEBHOOK_SECRET"] || "ashish");
    const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
    const signature = Buffer.from(request.headers.get("x-signature") as string, "utf8");

  //@ts-ignore
    if (!crypto.timingSafeEqual(digest, signature)) {
      return new Response("Invalid signature.", {
        status: 400,
      });
    }

    const payload = JSON.parse(text) as Payload;
    const {
      meta: { event_name: eventName },
      data: subscription,
     data,
    } = payload as Payload;
   // Ensure we have a user_id in custom_data
   if (!data.attributes.customer_email) {
    throw new Error('Missing user_id in custom_data');
  }

  const email = data.attributes.customer_email;

    switch (eventName) {
      case "order_created":
        // Do stuff here if you are using orders
        await prisma.user.update({
          where: { email: email as string },
          data: { isPaid: true },
        });
        break;
      case "order_refunded":
        // Do stuff here if you are using orders
        await prisma.user.update({
          where: { email: email as string },
          data: { isPaid: true },
        });
        break;
      case "subscription_created":
      case "subscription_cancelled":
      case "subscription_resumed":
      case "subscription_expired":
      case "subscription_paused":
      case "subscription_unpaused":
      case "subscription_payment_failed":
        case "subscription_payment_success":
          case "subscription_payment_recovered":
            await prisma.user.update({
              where: { email: email as string },
              data: { isPaid: true },
            });
            break;
          case "subscription_cancelled":
          case "subscription_expired":
          case "subscription_payment_failed":
            await prisma.user.update({
              where: { email: email as string },
              data: { isPaid: true },
            });
            break;
          case "subscription_paused":
          case "subscription_unpaused":
        // Do something with the subscription here, like syncing to your database
        
        console.log(subscription);   
        console.log(`Subscription ${eventName} for user ${email}`);
        break;
      
      default:
        throw new Error(`🤷‍♀️ Unhandled event: ${eventName}`);
    }
  } catch (error: unknown) {
    if (isError(error)) {
      return new Response(`Webhook error: ${error.message}`, {
        status: 400,
      });
    }

    return new Response("Webhook error", {
      status: 400,
    });
  }

  return new Response(null, {
    status: 200,
  });
};