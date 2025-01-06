import { ArrowRight, CheckIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import SubscriptionButton from "../SubscriptionButton";
import { auth } from "@clerk/nextjs/server";
import { checkSubscription } from "@/lib/subscription";

type Props = {};

const Pricing = async (props: Props) => {
  const { userId } = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  const plansMap = [
    {
      id: "free",
      name: "Free Plan",
      description: "Get started with limited features!",
      price: "0",
      items: [
        "1 PDF Upload",
        "Limited Chat Interactions",
        "Basic AI Assistance",
      ],
    },
    {
      id: "pro",
      name: "Premium Plan",
      description: "Unlock unlimited features with our Premium Plan!",
      price: "1500",
      items: [
        "Unlimited PDF Uploads",
        "Unlimited Chat Interactions",
        "Advanced AI Assistance",
        "Priority Support",
        "Access to Exclusive Features",
      ],
      paymentLink: "https://razorpay.com/checkout/premium-plan",
      priceId: "",
    },
  ];
  return (
    <section className="relative overflow-hidden" id="pricing">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-12 lg:px-0">
        <div className="flex items-center justify-center w-full pb-6 pt-3">
          <h2 className="uppercase font-bold text-xl mb-8 text-purple-600">
            Pricing
          </h2>
        </div>
        <div className="relative flex flex-col justify-center lg:flex-row items-center lg:items-stretch gap-8">
          {plansMap.map(
            ({ name, price, description, items, id, paymentLink }, idx) => (
              <div className="relative w-full max-w-lg" key={idx}>
                <div
                  className={cn(
                    "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-gray-500/20 rounded-2xl shadow-lg transition-transform transform hover:scale-105",
                    id === "pro" &&
                      "border-violet-500 gap-5 border-2 bg-gradient-to-r from-purple-100 to-purple-300"
                  )}
                >
                  <div className="flex flex-col justify-center items-start gap-4">
                    <div>
                      <p className="font-bold text-lg lg:text-xl capitalize">
                        {name}
                      </p>
                      <p className="text-base/80 mt-2">{description}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-5xl tracking-tight font-extrabold">
                        <span className="pr-[1px]">₹</span>
                        {price}
                      </p>
                      <div className="flex flex-col justify-end mb-[4px]">
                        <p className="text-sm text-base-content/60 uppercase font-semibold">
                          INR
                        </p>
                        <p className="text-xs text-base-content/60">/month</p>
                      </div>
                    </div>
                    <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                      {items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckIcon size={18} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-2">
                      {id === "pro" ? (
                        <SubscriptionButton isPro={isPro} />
                      ) : (
                        <div className=" inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-1 shadow-xl">
                          <Button
                            variant="link"
                            className="border-2 bg-white/50 text-purple-700 hover:bg-purple-100  rounded-full shadow-lg"
                          >
                            <Link
                              href={isAuth ? "/chat" : "/sign-up"}
                              className="flex gap-1 items-center"
                            >
                              Get SakhiAI
                              <ArrowRight
                                size={22}
                                className="animate-pulse transition-colors ml-1"
                              />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
