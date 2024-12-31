/**
 * Stripe API route handler for managing subscriptions
 * @route GET /api/stripe
 * @description Handles subscription creation and management through Stripe
 * - For new users: Creates a new Stripe checkout session
 * - For existing subscribers: Creates a billing portal session
 * @returns {Promise<NextResponse>} JSON response with Stripe session URL or error message
 * @throws {NextResponse} 401 if user is unauthorized
 * @throws {NextResponse} 500 if there's an internal server error
 * @export
 * @dynamic 'force-dynamic' - Required for handling dynamic headers and Stripe sessions
 */

// Add this export configuration at the end of your file
export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const return_url = process.env.NEXT_BASE_URL || "http://localhost:3000";
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const _userSubscriptions = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId));

    if (_userSubscriptions[0] && _userSubscriptions[0].stripeCustomerId) {
      // trying to cancel at the billing portal
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: _userSubscriptions[0].stripeCustomerId,
        return_url,
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    // user's first time trying to subscribe
    // Create a new stripe session with user input
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: return_url,
      cancel_url: return_url,
      payment_method_types: ["card"],
      mode: "subscription",
      // following indian regulations
      billing_address_collection: "required",
      customer_email: user?.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "INR",
            product_data: {
              name: "Sakhi AI",
              description: "Unlimited PDF sessions!",
            },
            unit_amount: 150000,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });
    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.log("stripe error", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
