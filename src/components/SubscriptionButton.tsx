"use client";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { loadScript } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  isPro: boolean;
};

const SubscriptionButton = (props: Props) => {
  const [loading, setIsLoading] = useState(false);
  const handleSubscription = async () => {
    if (props.isPro) {
      // Redirect to billing management page
      window.location.href = "/settings/billing";
      return;
    }

    try {
      setIsLoading(true);

      // Load Razorpay SDK
      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!res) {
        alert("Razorpay SDK failed to load");
        return;
      }

      // Get order deatils from our API
      const { data } = await axios.get("/api/razorpay");
      // console.log("order deatils from our api", data);

      //  handle successfull payment

      const options = {
        key: data.keyId,
        subscription_id: data.subscriptionId,
        currency: data.currency,
        order_id: data.orderId,
        name: "Sakhi AI",
        description: "Monthly Pro Subscription",
        handler: async (response: any) => {
          try {
            await axios.post("/api/razorpay/verify", {
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            // Handle successful subscription
            toast.success("Subscription activated successfully!");
            window.location.reload();
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Subscription verification failed");
          }
        },
        prefill: {
          name: "User",
          email: "user@sakhiai.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Failed to initiate subscription");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className=" inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-[5px] py-[2px] shadow-xl">
      <Button
        disabled={loading}
        onClick={handleSubscription}
        variant="outline"
        className="rounded-full bg-white/60 text-purple-700 hover:bg-purple-100  shadow-lg"
      >
        {props.isPro ? "Manage Subscription" : "Get Pro"}
      </Button>
    </div>
  );
};

export default SubscriptionButton;
