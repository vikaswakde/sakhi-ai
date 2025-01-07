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

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check existing subscription
    const existingSubscription = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .then((res) => res[0]);

    if (existingSubscription?.status === "active") {
      return new NextResponse("User already has an active subscription", {
        status: 400,
      });
    }

    // Create a plan
    const plan = await razorpay.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Sakhi AI Pro",
        amount: 1500 * 100,
        currency: "INR",
        description: "Monthly subscription for Sakhi AI Pro",
      },
    });

    // Create subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.id,
      customer_notify: 1,
      total_count: 12,
      notes: {
        userId: userId,
        name: user.firstName + " " + user.lastName,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    // Create or update subscription record
    await db
      .insert(userSubscriptions)
      .values({
        userId,
        razorpaySubscriptionId: subscription.id,
        razorpayPlanId: plan.id,
        status: subscription.status,
        currentPeriodStart: subscription.current_start
          ? new Date(subscription.current_start * 1000)
          : null,
        currentPeriodEnd: subscription.current_end
          ? new Date(subscription.current_end * 1000)
          : null,
      })
      .onConflictDoUpdate({
        target: [userSubscriptions.userId],
        set: {
          razorpaySubscriptionId: subscription.id,
          razorpayPlanId: plan.id,
          status: subscription.status,
          currentPeriodStart: subscription.current_start
            ? new Date(subscription.current_start * 1000)
            : null,
          currentPeriodEnd: subscription.current_end
            ? new Date(subscription.current_end * 1000)
            : null,
          updatedAt: new Date(),
        },
      });

    return NextResponse.json({
      subscriptionId: subscription.id,
      amount: plan.item.amount,
      currency: plan.item.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
