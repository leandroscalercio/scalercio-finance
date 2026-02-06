"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2025-02-24.acacia",
});

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function createBillingPortalSession() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const APP_URL = mustEnv("APP_URL");

  const user = await clerkClient().users.getUser(userId);
  const stripeCustomerId = user.privateMetadata?.stripeCustomerId as
    | string
    | undefined;

  if (!stripeCustomerId) throw new Error("No Stripe customer for this user");

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${APP_URL}/subscription`,
  });

  return { url: session.url };
}
