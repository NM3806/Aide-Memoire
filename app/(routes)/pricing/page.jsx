"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const proFeatures = [
  "Unlimited Documents",
  "AI-Powered Templates",
  "Priority Support",
  "Advanced Collaboration Tools",
  "Version History",
];

export default function PricingPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const onUpgrade = async () => {
    setLoading(true);
    try {
      // 1. Create a subscription on our server
      const response = await fetch("/api/razorpay/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: process.env.NEXT_PUBLIC_RAZORPAY_PRO_PLAN_ID,
          email: user?.primaryEmailAddress.emailAddress,
          userId: user?.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to create subscription.");
      
      const { subscriptionId, keyId } = await response.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: keyId,
        subscription_id: subscriptionId,
        name: "Aide-memoire Pro",
        description: "Monthly Subscription",
        handler: function (response) {
          toast.success("Payment successful! Your plan is now active.");
          window.location.href = "/dashboard";
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress.emailAddress || "",
        },
        theme: {
          color: "#6C63FF",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Razorpay Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/30 p-8">
      <Card className="max-w-md w-full shadow-lg border rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Upgrade to Pro</CardTitle>
          <CardDescription className="text-muted-foreground pt-2">
            Unlock all features and boost your productivity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <span className="text-4xl font-extrabold">₹800</span>
            <span className="text-muted-foreground">/ month</span>
          </div>
          <ul className="space-y-3">
            {proFeatures.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            onClick={onUpgrade}
            disabled={!user || loading}
            className="w-full bg-[#6C63FF] hover:bg-[#5b54d6] text-white rounded-xl text-lg py-6"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Upgrade Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}