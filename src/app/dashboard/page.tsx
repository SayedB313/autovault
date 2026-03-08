import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Building2, MessageSquare, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const facilities = await prisma.facility.findMany({
    where: { claimedById: session.user.id },
    include: {
      photos: { take: 1, orderBy: { order: "asc" } },
      _count: { select: { reviews: true, leads: true } },
    },
  });

  const totalLeads = facilities.reduce((sum, f) => sum + f._count.leads, 0);
  const totalReviews = facilities.reduce((sum, f) => sum + f._count.reviews, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage your facilities and track performance
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Facilities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facilities.length > 0
                ? (facilities.reduce((sum, f) => sum + f.avgRating, 0) / facilities.length).toFixed(1)
                : "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Facilities List */}
      {facilities.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No facilities yet</h3>
            <p className="text-muted-foreground mb-4">
              Claim your facility listing to manage it from here.
            </p>
            <Link href="/search">
              <Button>Find Your Facility</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Facilities</h2>
          {facilities.map((facility) => (
            <Card key={facility.id}>
              <CardContent className="flex items-center gap-4 py-4">
                <div
                  className="w-16 h-16 rounded-lg bg-muted bg-cover bg-center flex-shrink-0"
                  style={{
                    backgroundImage: facility.photos[0]
                      ? `url(${facility.photos[0].url})`
                      : undefined,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{facility.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {facility.city}, {facility.state} · {facility.tier} ·{" "}
                    {facility._count.leads} leads · {facility._count.reviews} reviews
                  </p>
                </div>
                <Link href={`/dashboard/facility/${facility.id}`}>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
