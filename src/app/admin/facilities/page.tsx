import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminFacilitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tier?: string; claimed?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (user?.role !== "ADMIN") redirect("/dashboard");

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const limit = 25;
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (params.tier) where.tier = params.tier;
  if (params.claimed === "true") where.claimedById = { not: null };
  if (params.claimed === "false") where.claimedById = null;

  const [facilities, total] = await Promise.all([
    prisma.facility.findMany({
      where,
      include: {
        claimedBy: { select: { name: true, email: true } },
        _count: { select: { reviews: true, leads: true, photos: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.facility.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Facilities ({total.toLocaleString()})</h1>
          <Link href="/admin" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to Admin
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <Link href="/admin/facilities">
          <Badge variant={!params.tier && !params.claimed ? "default" : "outline"}>All</Badge>
        </Link>
        <Link href="/admin/facilities?tier=FREE">
          <Badge variant={params.tier === "FREE" ? "default" : "outline"}>Free</Badge>
        </Link>
        <Link href="/admin/facilities?tier=VERIFIED">
          <Badge variant={params.tier === "VERIFIED" ? "default" : "outline"}>Verified</Badge>
        </Link>
        <Link href="/admin/facilities?tier=PREMIUM">
          <Badge variant={params.tier === "PREMIUM" ? "default" : "outline"}>Premium</Badge>
        </Link>
        <Link href="/admin/facilities?claimed=true">
          <Badge variant={params.claimed === "true" ? "default" : "outline"}>Claimed</Badge>
        </Link>
        <Link href="/admin/facilities?claimed=false">
          <Badge variant={params.claimed === "false" ? "default" : "outline"}>Unclaimed</Badge>
        </Link>
      </div>

      {/* Facilities Table */}
      <Card>
        <CardHeader>
          <CardTitle>Facilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Tier</th>
                  <th className="pb-2 font-medium">Owner</th>
                  <th className="pb-2 font-medium">Stats</th>
                  <th className="pb-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((f) => (
                  <tr key={f.id} className="border-b last:border-0">
                    <td className="py-3 font-medium max-w-[200px] truncate">{f.name}</td>
                    <td className="py-3 text-muted-foreground">{f.city}, {f.state}</td>
                    <td className="py-3">
                      <Badge variant={f.tier === "PREMIUM" ? "default" : f.tier === "VERIFIED" ? "secondary" : "outline"}>
                        {f.tier}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {f.claimedBy ? (f.claimedBy.name || f.claimedBy.email) : "—"}
                    </td>
                    <td className="py-3 text-muted-foreground text-xs">
                      {f._count.photos}p / {f._count.reviews}r / {f._count.leads}l
                    </td>
                    <td className="py-3">
                      <Link href={`/facility/${f.slug}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Page {page} of {pages}
              </p>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={`/admin/facilities?page=${page - 1}${params.tier ? `&tier=${params.tier}` : ""}${params.claimed ? `&claimed=${params.claimed}` : ""}`}>
                    <Button variant="outline" size="sm">Previous</Button>
                  </Link>
                )}
                {page < pages && (
                  <Link href={`/admin/facilities?page=${page + 1}${params.tier ? `&tier=${params.tier}` : ""}${params.claimed ? `&claimed=${params.claimed}` : ""}`}>
                    <Button variant="outline" size="sm">Next</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
