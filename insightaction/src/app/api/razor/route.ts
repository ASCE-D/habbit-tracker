import crypto from "crypto";
import { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};



export const POST = async (request: NextRequest) => {
    console.log(request.body)
  try {
    const text = await request.text();
    const razorpaySignature = request.headers.get("x-razorpay-signature");

    if (!razorpaySignature) {
      return new Response("Missing Razorpay signature", { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    if (!secret) {
      throw new Error("RAZORPAY_WEBHOOK_SECRET is not set");
    }

    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(text)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return new Response("Invalid signature", { status: 400 });
    }

    const payload = JSON.parse(text) 
    console.log(payload);

    const { event } = payload;
    let email: string | undefined;

    if (payload.payload.payment) {
      email = payload.payload.payment.entity.email;
    } else if (payload.payload.subscription) {
      // Note: Razorpay doesn't include email in subscription events by default.
      // You might need to fetch the customer details separately or include it in notes.
      email = payload.payload.subscription.entity.notes.email;
    }

    if (!email) {
      throw new Error('Missing email');
    }

    switch (event) {
      case "payment.captured":
        await prisma.user.update({
            where: { email },
            data: { isPaid: true },
          });
          console.log(`Subscription ${event} for user ${email}`);
          break;
      case "subscription.activated":
      case "subscription.charged":
      case "subscription.resumed":
    
      case "payment.failed":
      case "subscription.cancelled":
      case "subscription.halted":
        await prisma.user.update({
          where: { email },
          data: { isPaid: false },
        });
        break;
      case "subscription.paused":
      case "subscription.completed":
        case"refund.processed":
        await prisma.user.update({
            where: { email },
            data: { isPaid: false },
          });
          console.log(`Subscription ${event} for user ${email}`);
       
        break;
        
      default:
        console.log(`Unhandled event: ${event}`);
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