import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-10-28.acacia",
});

async function getClerkUserIdFromInvoice(
  invoice: unknown,
  subscriptionId?: string,
): Promise<string | null> {
  if (!invoice || typeof invoice !== "object") {
    return null;
  }

  const inv = invoice as {
    subscription_details?: { metadata?: { clerk_user_id: string } };
    lines?: { data: { metadata?: { clerk_user_id: string } }[] };
    subscription?: string;
  };

  const clerkUserId = inv.subscription_details?.metadata?.clerk_user_id;
  if (clerkUserId) {
    return clerkUserId;
  }

  if (inv.lines?.data?.[0]?.metadata?.clerk_user_id) {
    return inv.lines.data[0].metadata.clerk_user_id;
  }

  if (subscriptionId || inv.subscription) {
    const subId = subscriptionId || inv.subscription;
    if (subId) {
      try {
        const sub = await stripe.subscriptions.retrieve(subId);
        if (sub.metadata?.clerk_user_id) {
          return sub.metadata.clerk_user_id;
        }
      } catch {
        return null;
      }
    }
  }

  return null;
}

async function updateClerkUserSubscription(
  clerkUserId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
): Promise<void> {
  await clerkClient().users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      subscriptionPlan: "premium",
    },
    privateMetadata: {
      stripeCustomerId,
      stripeSubscriptionId,
    },
  });
}

async function removeClerkUserSubscription(clerkUserId: string): Promise<void> {
  await clerkClient().users.updateUserMetadata(clerkUserId, {
    publicMetadata: {
      subscriptionPlan: null,
    },
    privateMetadata: {
      stripeCustomerId: null,
      stripeSubscriptionId: null,
    },
  });
}

export const POST = async (request: Request) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Missing environment variables" },
        { status: 500 },
      );
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe signature" },
        { status: 400 },
      );
    }

    const text = await request.text();
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case "invoice.payment_succeeded":
      case "invoice.paid": {
        const invoiceData = event.data.object as unknown;

        if (!invoiceData || typeof invoiceData !== "object") {
          return NextResponse.json(
            { error: "Invalid invoice data" },
            { status: 400 },
          );
        }

        const invoice = invoiceData as {
          customer?: string;
          subscription?: string;
        };
        const customer = invoice.customer || "";
        const subscription = invoice.subscription || "";

        const clerkUserId = await getClerkUserIdFromInvoice(invoiceData);

        if (!clerkUserId) {
          return NextResponse.json(
            { error: "No clerk_user_id found" },
            { status: 400 },
          );
        }

        await updateClerkUserSubscription(clerkUserId, customer, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = await stripe.subscriptions.retrieve(
          event.data.object.id,
        );
        const clerkUserId = subscription.metadata?.clerk_user_id;

        if (!clerkUserId) {
          return NextResponse.json(
            { error: "No clerk_user_id found" },
            { status: 400 },
          );
        }

        await removeClerkUserSubscription(clerkUserId);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
