import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { userSubscriptions } from "./db/schema";
import { eq } from "drizzle-orm";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export type SubscriptionStatus = {
  isSubscribed: boolean;
  subscription?: typeof userSubscriptions.$inferSelect;
  endDate?: Date;
  isGracePeriod: boolean;
};

export const checkSubscription = async (): Promise<SubscriptionStatus> => {
  const { userId } = await auth();
  if (!userId) {
    return { isSubscribed: false, isGracePeriod: false };
  }

  const subscription = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId))
    .then((res) => res[0]);

  if (!subscription) {
    return { isSubscribed: false, isGracePeriod: false };
  }

  const isActive = subscription.status === "active";
  const now = new Date();
  const endDate = subscription.currentPeriodEnd;
  const isGracePeriod = endDate
    ? endDate.getTime() + DAY_IN_MS > now.getTime()
    : false;
  return {
    isSubscribed:
      (isActive &&
        (isGracePeriod || (endDate && endDate.getTime() > now.getTime()))) ||
      false,
    subscription,
    endDate: endDate || undefined,
    isGracePeriod,
  };
};
