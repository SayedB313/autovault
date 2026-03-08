import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { SubscriptionStatus, FacilityTier } from "@/generated/prisma";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const facilityId = subscription.metadata.facilityId;
      const tier = subscription.metadata.tier as "VERIFIED" | "PREMIUM";

      if (!facilityId) break;

      const status = mapStripeStatus(subscription.status);

      await prisma.subscription.upsert({
        where: { stripeSubscriptionId: subscription.id },
        create: {
          userId: subscription.metadata.userId,
          facilityId,
          tier: tier || "VERIFIED",
          stripeSubscriptionId: subscription.id,
          status,
          currentPeriodEnd: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
        },
        update: {
          tier: tier || "VERIFIED",
          status,
          currentPeriodEnd: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000),
        },
      });

      // Update facility tier
      if (status === "ACTIVE" || status === "TRIALING") {
        await prisma.facility.update({
          where: { id: facilityId },
          data: {
            tier: tier === "PREMIUM" ? FacilityTier.PREMIUM : FacilityTier.VERIFIED,
            verifiedAt: new Date(),
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const facilityId = subscription.metadata.facilityId;

      if (!facilityId) break;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: "CANCELED" },
      });

      await prisma.facility.update({
        where: { id: facilityId },
        data: { tier: FacilityTier.FREE },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = (invoice as unknown as { subscription: string | null }).subscription;

      if (subscriptionId) {
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { status: "PAST_DUE" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "trialing":
      return "TRIALING";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "CANCELED";
    default:
      return "ACTIVE";
  }
}
