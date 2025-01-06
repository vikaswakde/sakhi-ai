import CancelSubscriptionButton from "@/components/CancelSubscriptionButton";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const { userId } = await auth();
  const isPro = await checkSubscription();

  if (!userId) {
    return redirect("/sign-in");
  }

  const subscription = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .then((res) => res[0]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Subscription Mangement</h1>

      {isPro ? (
        <div className="bg-gray-600/10 p-6 rounded-lg flex flex-col gap-5">
          <h2 className="text-xl mb-4">Active Subscription</h2>
          <p className="flex gap-4">
            <span>Next billing date: </span>
            {new Date(
              subscription.stripeCurrentPeriodEnd!
            ).toLocaleDateString()}
          </p>
          <CancelSubscriptionButton />
        </div>
      ) : (
        <p>You don't have an Active subscription</p>
      )}
    </div>
  );
}
