import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { razorpay } from "@/lib/razorpay";

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

    // Construct the string to verify
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY!)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");


    const isAuthentic = generatedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.log("Generated:", generatedSignature);
      console.log("Received:", razorpay_signature);
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 400 }
      );
    }

    // Update Subscription in Database
    await db.insert(userSubscriptions).values({
      userId,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySubscriptionId: razorpay_subscription_id,
      // Set subscription end date to 1 month from now
      stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

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
