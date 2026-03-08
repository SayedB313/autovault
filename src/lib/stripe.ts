import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = {
  VERIFIED: {
    name: "Verified",
    price: 4900, // $49/month in cents
    features: [
      "Verification badge",
      "Priority in search results",
      "Up to 15 photos",
      "Lead contact form",
      "Standard analytics",
      "Respond to reviews",
    ],
  },
  PREMIUM: {
    name: "Premium",
    price: 14900, // $149/month in cents
    features: [
      "Everything in Verified",
      "Featured on city pages",
      "Unlimited photos",
      "Homepage carousel placement",
      "Full analytics dashboard",
      "Top search priority",
    ],
  },
} as const;
