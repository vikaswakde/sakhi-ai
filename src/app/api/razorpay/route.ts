import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { razorpay } from "@/lib/razorpay";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the user already has a subscription
    const existingSubscription = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .then((res) => res[0]);

    if (existingSubscription) {
      // IF a subscirption exists, you might want to return an error or update it
      return new NextResponse("User already has an acitve subscription", {
        status: 400,
      });
    }

    // Create a Razorpay Subscription Plan if not exists
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Sakhi AI Pro",
        amount: 1500 * 100,
        currency: "INR",
        description: "Montly subscription for Sakhi AI Pro",
      },
    });

    // Create a Subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      customer_notify: 1,
      total_count: 12, // number of billing cycles
      notes: {
        userId: userId,
      },
    });

    // Insert the subscription into the Database
    await db.insert(userSubscriptions).values({
      userId,
      razorpaySubscriptionId: subscription.id,
      stripeCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set the period end date
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      amount: plan.item.amount,
      currency: plan.item.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("Razorpay error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
