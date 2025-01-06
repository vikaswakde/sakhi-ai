"use client";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function CancelSubscriptionButton() {
    const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) {
      return;
    }
    try {
      setIsLoading(true);
      await axios.post("/api/razorpay/cancel-subscription");
      toast.success("Subscription Cancelled Successfully");
      router.push("/")
    } catch (error) {
      toast.error("Failed to cancel subscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
      Cancel Subscription
    </Button>
  );
}
