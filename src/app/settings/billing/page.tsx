import { Button } from "@/components/ui/button";
import CancelSubscriptionButton from "@/components/CancelSubscriptionButton";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function BillingPage() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const { isSubscribed, subscription, endDate, isGracePeriod } =
    await checkSubscription();

  if (!userId) {
    return redirect("/sign-in");
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subscription Status</CardTitle>
            <Badge variant={isSubscribed ? "secondary" : "destructive"}>
              {isSubscribed ? "Active" : "Inactive"}
            </Badge>
          </div>
          <CardDescription>
            Manage your Sakhi AI Pro subscription here
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {subscription ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1 text-sm">{subscription.status}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Plan</h3>
                  <p className="mt-1 text-sm">Sakhi AI Pro</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Current Period Start
                  </h3>
                  <p className="mt-1 text-sm">
                    {formatDate(subscription.currentPeriodStart)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Current Period End
                  </h3>
                  <p className="mt-1 text-sm">
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              </div>

              {isGracePeriod && (
                <div className="bg-yellow-50 p-4 rounded-md">
                  <p className="text-yellow-800">
                    Your subscription is in grace period. Access will be revoked
                    after {formatDate(endDate)}
                  </p>
                </div>
              )}

              {subscription.cancelAtPeriodEnd && (
                <div className="bg-orange-50 p-4 rounded-md">
                  <p className="text-orange-800">
                    Your subscription will be cancelled on{" "}
                    {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                {subscription.status === "active" &&
                  !subscription.cancelAtPeriodEnd && (
                    <CancelSubscriptionButton />
                  )}
                {subscription.status !== "active" && (
                  <Link href="/api/razorpay" className="inline-flex">
                    <Button variant="default">Reactivate Subscription</Button>
                  </Link>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-4">
                You don't have an active subscription
              </p>
              {/* <Button
                variant="default"
                onClick={() => (window.location.href = "/api/razorpay")}
              >
                Subscribe to Pro Plan
              </Button> */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
