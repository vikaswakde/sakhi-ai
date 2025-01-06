import { razorpay } from "@/lib/razorpay";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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
