import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { razorpay } from "@/lib/razorpay";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const {
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Get subscription details from Razorpay
    const subscription = await razorpay.subscriptions.fetch(
      razorpay_subscription_id
    );

    // Update subscription in database
    await db
      .update(userSubscriptions)
      .set({
        status: subscription.status,
        currentPeriodStart: subscription.current_start
          ? new Date(subscription.current_start * 1000)
          : null,
        currentPeriodEnd: subscription.current_end
          ? new Date(subscription.current_end * 1000)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.userId, userId));

    return NextResponse.json({
      message: "Subscription activated successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
