import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ClaimForm from "./claim-form";

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ facilityId: string }>;
}) {
  const { facilityId } = await params;

  const facility = await prisma.facility.findUnique({
    where: { id: facilityId },
    include: { photos: { take: 1 } },
  });

  if (!facility) notFound();

  const session = await auth();

  if (facility.claimedById) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Already Claimed</h1>
        <p className="text-muted-foreground">
          This facility has already been claimed by its owner.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Claim Your Listing</h1>
      <p className="text-muted-foreground mb-8">
        Verify ownership to manage this facility on AutoVault
      </p>

      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 py-4">
          <div
            className="w-16 h-16 rounded-lg bg-muted bg-cover bg-center flex-shrink-0"
            style={{
              backgroundImage: facility.photos[0]
                ? `url(${facility.photos[0].url})`
                : undefined,
            }}
          />
          <div>
            <h3 className="font-semibold">{facility.name}</h3>
            <p className="text-sm text-muted-foreground">
              {facility.address}, {facility.city}, {facility.state}
            </p>
            <Badge variant="outline" className="mt-1">Unclaimed</Badge>
          </div>
        </CardContent>
      </Card>

      {!session?.user ? (
        <Card>
          <CardHeader>
            <CardTitle>Sign in to claim</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You need to sign in or create an account to claim this facility.
            </p>
            <a
              href={`/auth/signin?callbackUrl=/claim/${facilityId}`}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Sign In to Continue
            </a>
          </CardContent>
        </Card>
      ) : (
        <ClaimForm facilityId={facilityId} facilityName={facility.name} />
      )}
    </div>
  );
}
