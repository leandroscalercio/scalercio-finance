import Stripe from "stripe";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-01-28.clover" as Stripe.LatestApiVersion,
});

async function updateClerkUserSubscription(params: {
  clerkUserId: string;
  plan: "premium" | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}) {
  const { clerkUserId, plan, stripeCustomerId, stripeSubscriptionId } = params;

  await clerkClient.users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      subscriptionPlan: plan,
    },
    privateMetadata: {
      stripeCustomerId,
      stripeSubscriptionId,
    },
  });
}

function getStringId(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export const POST = async (request: Request) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 },
      );
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Missing STRIPE_WEBHOOK_SECRET" },
        { status: 500 },
      );
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    const payload = await request.text();

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const clerkUserId =
          session.metadata?.clerk_user_id ??
          (typeof session.client_reference_id === "string"
            ? session.client_reference_id
            : null);

        if (!clerkUserId) {
          return NextResponse.json(
            { error: "No clerk_user_id found in checkout session" },
            { status: 400 },
          );
        }

        const stripeCustomerId = getStringId(session.customer);
        const stripeSubscriptionId = getStringId(session.subscription);

        await updateClerkUserSubscription({
          clerkUserId,
          plan: "premium",
          stripeCustomerId,
          stripeSubscriptionId,
        });

        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;

        const stripeSubscriptionId = getStringId(invoice.subscription);
        if (!stripeSubscriptionId) break;

        const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        const clerkUserId = sub.metadata?.clerk_user_id ?? null;

        if (!clerkUserId) {
          return NextResponse.json(
            {
              error:
                "No clerk_user_id found in subscription metadata (invoice.paid)",
            },
            { status: 400 },
          );
        }

        const stripeCustomerId = getStringId(invoice.customer);

        await updateClerkUserSubscription({
          clerkUserId,
          plan: "premium",
          stripeCustomerId,
          stripeSubscriptionId,
        });

        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;

        const clerkUserId = sub.metadata?.clerk_user_id ?? null;
        if (!clerkUserId) break;

        const stripeCustomerId = getStringId(sub.customer);
        const isActive = ["active", "trialing"].includes(sub.status);

        await updateClerkUserSubscription({
          clerkUserId,
          plan: isActive ? "premium" : null,
          stripeCustomerId,
          stripeSubscriptionId: sub.id,
        });

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const clerkUserId = sub.metadata?.clerk_user_id ?? null;
        if (!clerkUserId) break;

        await updateClerkUserSubscription({
          clerkUserId,
          plan: null,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        });

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
