import crypto from "crypto";
//@ts-ignore
import { listAllSubscriptions } from "lemonsqueezy.ts";
import { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type LemonsqueezySubscription = Awaited<ReturnType<typeof listAllSubscriptions>>["data"][number];

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

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
    webhook_id: string;
  };
  data: {
    id: string;
    type: string;
    attributes: {
      user_email: string;
      [key: string]: any;
    };
    relationships: {
      [key: string]: any;
    };
  };
};

export const POST = async (request: NextRequest) => {
  try {
    const text = await request.text();
    const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SECRET !);

    const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
    const signature = Buffer.from(request.headers.get("x-signature") as string, "utf8");
//@ts-ignore
    if (!crypto.timingSafeEqual(digest, signature)) {
      return new Response("Invalid signature.", {
        status: 400,
      });
    }

    const payload = JSON.parse(text) as Payload;
    console.log(payload);

    const email = payload.data.attributes.user_email;
    const {
      meta: { event_name: eventName },
      data,
    } = payload;

    if (!email) {
      throw new Error('Missing email');
    }

    switch (eventName) {
      case "order_created":
        await prisma.user.update({
          where: { email },
          data: { isPaid: true },
        });
        break;
      case "order_refunded":
        await prisma.user.update({
          where: { email },
          data: { isPaid: false },
        });
        break;
      case "subscription_created":
      case "subscription_resumed":
      case "subscription_payment_success":
      case "subscription_payment_recovered":
        await prisma.user.update({
          where: { email },
          data: { isPaid: true },
        });
        break;
      case "subscription_cancelled":
      case "subscription_expired":
      case "subscription_payment_failed":
        await prisma.user.update({
          where: { email },
          data: { isPaid: false },
        });
        break;
      case "subscription_paused":
      case "subscription_unpaused":
        console.log(data);
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