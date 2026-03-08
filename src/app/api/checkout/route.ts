import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { facilityId, tier } = await request.json();

    if (!facilityId || !tier || !["VERIFIED", "PREMIUM"].includes(tier)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Verify user owns this facility
    const facility = await prisma.facility.findUnique({
      where: { id: facilityId },
    });

    if (!facility || facility.claimedById !== session.user.id) {
      return NextResponse.json({ error: "Not your facility" }, { status: 403 });
    }

    // Check for existing active subscription
    const existing = await prisma.subscription.findUnique({
      where: { facilityId },
    });

    if (existing?.status === "ACTIVE") {
      return NextResponse.json(
        { error: "Facility already has an active subscription" },
        { status: 409 }
      );
    }

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    let customerId = user?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name || undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const plan = tier === "PREMIUM" ? PLANS.PREMIUM : PLANS.VERIFIED;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `AutoVault ${plan.name} - ${facility.name}`,
              description: plan.features.join(", "),
            },
            unit_amount: plan.price,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          facilityId,
          userId: session.user.id,
          tier,
        },
      },
      success_url: `${appUrl}/dashboard/facility/${facilityId}?upgraded=true`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
