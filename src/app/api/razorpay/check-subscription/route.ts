import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { razorpay } from "@/lib/razorpay";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // GET the user's subscription from the database
    const subscription = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId))
      .then((res) => res[0]);

    if (!subscription?.razorpaySubscriptionId) {
      return NextResponse.json({ active: false });
    }

    //   Fetch subscription deatils from Razorpay
    const razorpaySubscription = await razorpay.subscriptions.fetch(
      subscription.razorpaySubscriptionId
    );

    console.log("details from raozrpay", razorpaySubscription)

    // check if the subscription is active
    const isActive = razorpaySubscription.status === "active";

    return NextResponse.json({ active: isActive });
  } catch (error) {
    console.error("Error checking subscription: ", error);
    return new NextResponse("internal Server Error", { status: 500 });
  }
}
