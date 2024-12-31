import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";

export async function POST(req: Request) {
  // console.log("this is what wehbook body loooks like:", req);
  const body = await req.text();

  // console.log("This is what headers look like", headers());
  const signature = headers().get("Stripe-Signature") as string;
  // console.log("this is what import stripe looks like", Stripe);

  let event: Stripe.Event | undefined;
  // console.log("this is what import stripe event looks like", event);

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.WEBHOOK_SIGNING_SECRET as string
    );
    // console.log(
    //   "this is what  new stirpe webhook event event looks like",
    //   event
    // );
  } catch (error) {
    return new NextResponse("webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  // console.log("This is what session looks like OR event.data.object", session);

  //   new subscription created
  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    if (!session?.metadata?.userId) {
      return new NextResponse("no userId", { status: 400 });
    }
    await db.insert(userSubscriptions).values({
      userId: session.metadata.userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
  }
  return new NextResponse(null, { status: 200 });
}
