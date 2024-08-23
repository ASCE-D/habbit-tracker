import crypto from "crypto";
import { NextRequest } from "next/server";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

// type RazorpayEventName =
//   | "payment.authorized"
//   | "payment.captured"
//   | "payment.failed"
//   | "subscription.activated"
//   | "subscription.charged"
//   | "subscription.completed"
//   | "subscription.cancelled"
//   | "subscription.paused"
//   | "subscription.resumed"
//   | "subscription.halted";

// type RazorpayPayload = {
//   entity: string;
//   account_id: string;
//   event: RazorpayEventName;
//   contains: string[];
//   payload: {
//     payment?: {
//       entity: {
//         id: string;
//         amount: number;
//         currency: string;
//         status: string;
//         order_id: string;
//         invoice_id: string | null;
//         international: boolean;
//         method: string;
//         amount_refunded: number;
//         refund_status: string | null;
//         captured: boolean;
//         description: string | null;
//         card_id: string | null;
//         bank: string | null;
//         wallet: string | null;
//         vpa: string | null;
//         email: string;
//         contact: string;
//         notes: Record<string, string>;
//         fee: number;
//         tax: number;
//         error_code: string | null;
//         error_description: string | null;
//         error_source: string | null;
//         error_step: string | null;
//         error_reason: string | null;
//         created_at: number;
//       };
//     };
//     subscription?: {
//       entity: {
//         id: string;
//         plan_id: string;
//         status: string;
//         current_start: number;
//         current_end: number;
//         ended_at: number | null;
//         quantity: number;
//         notes: Record<string, string>;
//         charge_at: number;
//         start_at: number;
//         end_at: number | null;
//         auth_attempts: number;
//         total_count: number;
//         paid_count: number;
//         customer_notify: boolean;
//         created_at: number;
//         expire_by: number | null;
//         short_url: string;
//         has_scheduled_changes: boolean;
//         change_scheduled_at: number | null;
//         source: string;
//         payment_method: string;
//         offer_id: string | null;
//         remaining_count: number;
//       };
//     };
//   };
//   created_at: number;
// };

export const POST = async (request: NextRequest) => {
    console.log(request.body)
  try {
    const text = await request.text();
    const razorpaySignature = request.headers.get("x-razorpay-signature");

    if (!razorpaySignature) {
      return new Response("Missing Razorpay signature", { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "ashish";
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
//@ts-ignore
    const payload = JSON.parse(text) as RazorpayPayload;
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