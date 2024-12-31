"use client";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "./ui/button";

type Props = {
  isPro: boolean;
};

const SubscriptionButton = (props: Props) => {
  const [loading, setIsLoading] = useState(false);
  const handleSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button disabled={loading} onClick={handleSubscription} variant="outline">
      {props.isPro ? "Manage Subscription" : "Get Pro"}
    </Button>
  );
};

export default SubscriptionButton;
