import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, Users, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacilityManagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const { id } = await params;

  const facility = await prisma.facility.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { order: "asc" } },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      leads: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      subscription: true,
    },
  });

  if (!facility || facility.claimedById !== session.user.id) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{facility.name}</h1>
          <p className="text-muted-foreground">
            {facility.city}, {facility.state}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/facility/${facility.slug}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" /> View Listing
            </Button>
          </Link>
          {facility.tier === "FREE" && (
            <Link href={`/dashboard/billing?facility=${facility.id}`}>
              <Button size="sm">Upgrade</Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Facility Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Facility Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p>{facility.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p>{facility.phone || "Not set"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Website</label>
                  <p>
                    {facility.website ? (
                      <a href={facility.website} className="text-blue-600 hover:underline flex items-center gap-1">
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      "Not set"
                    )}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Storage Types</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {facility.storageTypes.map((t) => (
                    <Badge key={t} variant="secondary">{t.replace("_", " ")}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Vehicle Types</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {facility.vehicleTypes.map((t) => (
                    <Badge key={t} variant="secondary">{t}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tier</label>
                <div className="mt-1">
                  <Badge variant={facility.tier === "PREMIUM" ? "default" : "outline"}>
                    {facility.tier}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Recent Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              {facility.leads.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center">
                  No leads yet. {facility.tier === "FREE" && "Upgrade to Verified to enable the contact form."}
                </p>
              ) : (
                <div className="space-y-3">
                  {facility.leads.map((lead) => (
                    <div key={lead.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-muted-foreground">{lead.email}</p>
                        </div>
                        <Badge variant={lead.status === "NEW" ? "default" : "secondary"}>
                          {lead.status}
                        </Badge>
                      </div>
                      {lead.message && (
                        <p className="text-sm mt-1 text-muted-foreground">{lead.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Photos ({facility.photos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {facility.photos.slice(0, 6).map((photo) => (
                  <div
                    key={photo.id}
                    className="aspect-square rounded-lg bg-muted bg-cover bg-center"
                    style={{ backgroundImage: `url(${photo.url})` }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Reviews ({facility.reviewCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {facility.reviews.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center">No reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {facility.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-3 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{review.user.name || "Anonymous"}</span>
                        <span className="text-yellow-500">{"★".repeat(review.rating)}</span>
                      </div>
                      {review.body && (
                        <p className="text-sm mt-1 text-muted-foreground">{review.body}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
