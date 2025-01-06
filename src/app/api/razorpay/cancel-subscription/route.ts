import { db } from "@/lib/db";
import { messages, userSubscriptions } from "@/lib/db/schema";
import { razorpay } from "@/lib/razorpay";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get Subscription from Database
    const subscription = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .then((res) => res[0]);

    if (!subscription?.razorpaySubscriptionId) {
      return new NextResponse("No Active Subscription", { status: 400 });
    }

    //   Cancel Subscription in Razorpay
    await razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId);

    // Update the Database
    await db
      .update(userSubscriptions)
      .set({
        stripeCurrentPeriodEnd: new Date(), // End subscription Immediately
      })
      .where(eq(userSubscriptions.userId, userId));

    return NextResponse.json({
      messages: "Subscription Cancelled successfully",
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
