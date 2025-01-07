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

    const subscription = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .then((res) => res[0]);

    if (!subscription?.razorpaySubscriptionId) {
      return new NextResponse("No active subscription", { status: 400 });
    }

    // Cancel in Razorpay
    const razorpaySubscription = await razorpay.subscriptions.cancel(
      subscription.razorpaySubscriptionId
    );

    // Update database
    await db
      .update(userSubscriptions)
      .set({
        status: razorpaySubscription.status,
        cancelAtPeriodEnd: true,
        updatedAt: new Date(),
      })
      .where(eq(userSubscriptions.userId, userId));

    return NextResponse.json({
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("Cancellation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
