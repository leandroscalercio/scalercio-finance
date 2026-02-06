"use client";

import { Button } from "@/app/_components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useTransition } from "react";
import { createStripeCheckout } from "../_actions/create-stripe-checkout";
import { createBillingPortalSession } from "../_actions/create-billing-portal-session";

const AcquirePlanButton = () => {
  const { user, isLoaded } = useUser();
  const [pending, startTransition] = useTransition();

  if (!isLoaded) return null;

  const hasPremiumPlan = user?.publicMetadata.subscriptionPlan === "premium";

  const onClick = () => {
    startTransition(async () => {
      if (hasPremiumPlan) {
        const { url } = await createBillingPortalSession();
        window.location.href = url;
        return;
      }

      const { url } = await createStripeCheckout();
      if (!url) throw new Error("Stripe checkout URL not returned");
      window.location.href = url;
    });
  };

  return (
    <Button
      className="w-full rounded-full font-bold"
      onClick={onClick}
      disabled={pending}
    >
      {pending
        ? "Aguarde..."
        : hasPremiumPlan
          ? "Gerenciar plano"
          : "Adquirir plano"}
    </Button>
  );
};

export default AcquirePlanButton;
