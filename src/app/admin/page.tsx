import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, MessageSquare, FileText, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  // Check admin role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (user?.role !== "ADMIN") redirect("/dashboard");

  const [
    facilityCount,
    claimedCount,
    userCount,
    reviewCount,
    leadCount,
    cityCount,
    blogCount,
    recentClaims,
  ] = await Promise.all([
    prisma.facility.count(),
    prisma.facility.count({ where: { claimedById: { not: null } } }),
    prisma.user.count(),
    prisma.review.count(),
    prisma.lead.count(),
    prisma.city.count(),
    prisma.blogPost.count(),
    prisma.facility.findMany({
      where: { claimedById: { not: null } },
      include: {
        claimedBy: { select: { name: true, email: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-8">Platform overview and management</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Facilities</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilityCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{claimedCount} claimed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leads</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cities</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cityCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/admin/facilities">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="py-6 text-center">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold">Manage Facilities</p>
              <p className="text-sm text-muted-foreground">View, edit, and manage all listings</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/users">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="py-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold">Manage Users</p>
              <p className="text-sm text-muted-foreground">View users and manage roles</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/seed">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="py-6 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="font-semibold">Seed Data</p>
              <p className="text-sm text-muted-foreground">Import facilities from Google Places</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Claims */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Claims</CardTitle>
        </CardHeader>
        <CardContent>
          {recentClaims.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No claims yet</p>
          ) : (
            <div className="space-y-3">
              {recentClaims.map((f) => (
                <div key={f.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{f.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {f.city}, {f.state} — claimed by {f.claimedBy?.name || f.claimedBy?.email}
                    </p>
                  </div>
                  <Link
                    href={`/facility/${f.slug}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
