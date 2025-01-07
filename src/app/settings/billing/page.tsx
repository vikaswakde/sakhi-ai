import CancelSubscriptionButton from "@/components/CancelSubscriptionButton";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const isPro = await checkSubscription();

  if (!userId || !isPro) {
    return redirect("/sign-in");
  }

  console.log("I am here ");

  // Fetch subscription data from the database
  const subscriptionData = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .then((res) => res[0]);

  // // Fetch subscription status from RazorPay
  // let isPro = false;
  // if (subscriptionData?.razorpaySubscriptionId) {
  //   try {
  //     const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/razorpay/check-subscription`;
  //     const { data } = await axios.get(apiUrl);
  //     console.log("Data from /razorpay/check-subscription", data);
  //     isPro = data.active;
  //   } catch (error) {
  //     console.error("Error fetching susbcription status:", error);
  //   }
  // }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Subscription Mangement</h1>

      {isPro ? (
        <div className="bg-gray-600/10 p-6 rounded-lg flex flex-col gap-5">
          <h2 className="text-xl mb-4">Active Subscription</h2>
          <p className="flex gap-4">
            <span>Next billing date: </span>
            {new Date(
              subscriptionData.stripeCurrentPeriodEnd!
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
