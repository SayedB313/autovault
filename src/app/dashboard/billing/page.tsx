import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Shield } from "lucide-react";
import { PLANS } from "@/lib/stripe";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const facilities = await prisma.facility.findMany({
    where: { claimedById: session.user.id },
    include: { subscription: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Billing & Plans</h1>
      <p className="text-muted-foreground mb-8">
        Upgrade your facilities to get more visibility and features
      </p>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Free */}
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <p className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Basic listing</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Claim & edit</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Up to 5 photos</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Basic visibility</li>
            </ul>
          </CardContent>
        </Card>

        {/* Verified */}
        <Card className="border-blue-200 ring-1 ring-blue-100">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <Badge className="bg-blue-600">Popular</Badge>
            </div>
            <CardTitle>Verified</CardTitle>
            <p className="text-3xl font-bold">${PLANS.VERIFIED.price / 100}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {PLANS.VERIFIED.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-500" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Premium */}
        <Card className="border-amber-200 ring-1 ring-amber-100">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle>Premium</CardTitle>
            <p className="text-3xl font-bold">${PLANS.PREMIUM.price / 100}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {PLANS.PREMIUM.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-amber-500" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Facilities & Subscriptions */}
      <h2 className="text-xl font-semibold mb-4">Your Facilities</h2>
      {facilities.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No claimed facilities. Search and claim your facility first.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {facilities.map((facility) => (
            <Card key={facility.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{facility.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {facility.city}, {facility.state}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={facility.tier === "PREMIUM" ? "default" : facility.tier === "VERIFIED" ? "secondary" : "outline"}>
                    {facility.tier}
                  </Badge>
                  {facility.tier === "FREE" ? (
                    <Button size="sm">Upgrade</Button>
                  ) : (
                    <Button variant="outline" size="sm">Manage</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
