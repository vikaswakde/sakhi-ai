import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { userSubscriptions } from "./db/schema";
import { eq } from "drizzle-orm";
import axios from "axios";

const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const checkSubscription = async () => {
  const { userId } = await auth();
  if (!userId) {
    return false;
  }

  // Fetch user subscriptions from the database
  const _userSubscriptions = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId));

  if (!_userSubscriptions[0]) {
    return false;
  }

  const userSubscription = _userSubscriptions[0];

  // Check if Razorpay subscription ID exists
  // if (userSubscription.razorpaySubscriptionId) {
  //   try {
  //     // Fetch subscription status from Razorpay
  //     const { data } = await axios.get("/api/razorpay/check-subscription");
  //     if (data.active) {
  //       // If Razorpay subscription is active, check the period end date
  //       const isValid =
  //         userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
  //         Date.now();
  //       return isValid;
  //     }
  //   } catch (error) {
  //     console.error("Error checking Razorpay subscription status:", error);
  //     return false; // Return false if there an error checking the status
  //   }
  // }

  // If Razorpay subscription ID does not exist, check the local period end date

  const isValid =
    userSubscription.razorpayPaymentId &&
    //  If withGracePeriod > today, subscription is valid
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!isValid;
};
