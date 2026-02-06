"use server";

import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function createStripeCheckout() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const APP_URL = mustEnv("APP_URL");
  const PRICE_ID = mustEnv("STRIPE_PREMIUM_PLAN_PRICE_ID");

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],

    client_reference_id: userId,
    metadata: { clerk_user_id: userId },

    subscription_data: {
      metadata: { clerk_user_id: userId },
    },

    line_items: [{ price: PRICE_ID, quantity: 1 }],

    success_url: `${APP_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${APP_URL}/subscription`,
  });

  return { sessionId: session.id, url: session.url };
}
